/* eslint-disable max-params */

// Bitwise notes:
// f(x) = x ^ 1
//  f(0) = 1
//  f(1) = 0
// f(x) = x >> 1
//  aka f(x) = Math.floor(x / 2)
// f(x) = x << 1
//  aka f(x) = x * 2
// f(x) = x & 1
//  aka x === 1

import * as Alignment from './constants/alignment';
import * as ErrorCorrection from './constants/errorCorrection';
import * as Galois from './constants/galois';
import * as Version from './constants/version';

/**
 * The options used by {@link Frame}.
 */
export interface FrameOptions {
  /** The value to be encoded. */
  readonly value: string;
  /** The ECC level to be used. Default is L */
  readonly level: ErrorCorrection.Level;
}

/** Utility to make value required for users inputting in a value. */
export type UserFacingFrameOptions<T = FrameOptions> = Partial<T> & { readonly value: string }

export type RenderOptionsDefaults<T = FrameOptions> = Omit<T, 'value'> & { readonly value?: string };

/**
 * A type of a {@link Uint8Array} that ensures that any value in it
 * is either 0 or 1
 */
export type BinaryUint8Array = Uint8Array & { 
  [key: number]: 0 | 1
};

/**
 * A type of {@link BinaryUint8Array} that is read only.
 */
export type ReadOnlyBinaryUint8Array = Omit<BinaryUint8Array, 'copyWithin' | 'fill' | 'reverse' | 'set' | 'sort'> & { readonly [key: number]: 0 | 1 };

export const defaultFrameOptions: RenderOptionsDefaults<FrameOptions> = Object.freeze({ level: 'L' });

// *Badness* coefficients.
const N1 = 3;

const N2 = 3;

const N3 = 40;

const N4 = 10;

function getMaskBit(x: number, y: number): number {
  if (x > y) {
    return getMaskBit(y, x);
  }

  let bit = y;
  bit += y * y;
  bit >>= 1;
  bit += x;

  return bit;
}

/**
 * Using the modulus function, attempts to return an unsigned byte.
 * 
 * This does **not** check negative numbers
 * 
 * @param x - The number to turn into a ubyte
 * 
 * @example 
 * modN(256) // 1
 * modN(100) // 100
 * 
 * @return a ubyte if the number isn't negative
 */
function modN(x: number): number {
  return x % 255;
}

function getBadness(length: number, badness: readonly number[]) {
  let badRuns = 0;

  for (let i = 0; i <= length; i++) {
    if (badness[i] >= 5) {
      badRuns += N1 + badness[i] - 5;
    }
  }

  // FBFFFBF as in finder.
  for (let i = 3; i < length - 1; i += 2) {
    if (badness[i - 2] === badness[i + 2] &&
      badness[i + 2] === badness[i - 1] &&
      badness[i - 1] === badness[i + 1] &&
      badness[i - 1] * 3 === badness[i] &&
      // Background around the foreground pattern? Not part of the specs.
      (badness[i - 3] === 0 || i + 3 > length ||
      badness[i - 3] * 3 >= badness[i] * 4 ||
      badness[i + 3] * 3 >= badness[i] * 4)) {
      badRuns += N3;
    }
  }

  return badRuns;
}

function setMask(x: number, y: number, mask: BinaryUint8Array) {
  mask[getMaskBit(x, y)] = 1;
}

function setMaskIndex(i: number, width: number, mask: BinaryUint8Array) {
  mask[getMaskBit(i % width, ~~(i / width))] = 1
}

/**
 * Syncs the mask with the buffer.
 * This loops over each position in the buffer and sets it
 * at the appropiate value at the mask.
 * 
 * @param width - The width of the QR code
 * @param mask - The mask to sync
 * @param buffer - The buffer to read from
 */
function syncMask(width: number, mask: BinaryUint8Array, buffer: ReadOnlyBinaryUint8Array) {
  for (let z = 0; z < buffer.length; z++) {
    if (buffer[z] & 1) {
      setMaskIndex(z, width, mask);
    }
  }
}

/**
 * Check if the mask at the x and y position is masked (=== 1)
 * 
 * @param x The x position in the mask
 * @param y The y position in the mask
 * @param mask The mask to check against
 * @returns If the mask at those two positions is masked (=== 1)
 */
function isMasked(x: number, y: number, mask: ReadOnlyBinaryUint8Array): number {
  const bit = getMaskBit(x, y);

  return mask[bit] & 1;
}

/**
 * Check if the mask at the index position is masked (=== 1)
 * 
 * @param i The index in the buffer
 * @param width The QR code width
 * @param mask The mask to check against
 * @returns If the mask at the index is masked (=== 1)
 */
function isMaskedIndex(i: number, width: number, mask: ReadOnlyBinaryUint8Array): number {
  const bit = getMaskBit(i % width, ~~(i / width));

  return mask[bit] & 1;
}

function generateVersionsAndBlocks(length: number, level: number): {
  readonly version: number,
  readonly neccBlock1: number,
  readonly neccBlock2: number,
  readonly dataBlock: number,
  readonly eccBlock: number
} {

  for (let version = 0; version <= 40; version++) {
    const index = ((level - 1) * 4) + ((version - 1) * 16);
    
    const neccBlock1 = ErrorCorrection.BLOCKS[index];
    const neccBlock2 = ErrorCorrection.BLOCKS[index + 1];
    const dataBlock = ErrorCorrection.BLOCKS[index + 2];
    const eccBlock = ErrorCorrection.BLOCKS[index + 3];
    
    if (length <= (dataBlock * (neccBlock1 + neccBlock2)) + neccBlock2 - 3 + +(version <= 9) || version == 40) {
      return { version, neccBlock1, neccBlock2, dataBlock, eccBlock };
    }
  }

  throw Error("Unreachable!");
}

function addAlignment(x: number, y: number, buffer: BinaryUint8Array, mask: BinaryUint8Array, width: number) {
  buffer[x + (width * y)] = 1;

  for (let i = -2; i < 2; i++) {
    buffer[x + i + (width * (y - 2))] = 1;
    buffer[x - 2 + (width * (y + i + 1))] = 1;
    buffer[x + 2 + (width * (y + i))] = 1;
    buffer[x + i + 1 + (width * (y + 2))] = 1;
  }

  for (let i = 0; i < 2; i++) {
    setMask(x - 1, y + i, mask);
    setMask(x + 1, y - i, mask);
    setMask(x - i, y - 1, mask);
    setMask(x + i, y + 1, mask);
  }
}

function appendData(data: number, dataLength: number, ecc: number, eccLength: number, polynomial: Uint8Array, stringBuffer: Uint8Array) {
  let bit;

  for (let i = 0; i < eccLength; i++) {
    stringBuffer[ecc + i] = 0;
  }

  for (let i = 0; i < dataLength; i++) {
    bit = Galois.LOG[stringBuffer[data + i] ^ stringBuffer[ecc]];

    if (bit !== 255) {
      for (let j = 1; j < eccLength; j++) {
        stringBuffer[ecc + j - 1] = stringBuffer[ecc + j] ^
          Galois.EXPONENT[modN(bit + polynomial[eccLength - j])];
      }
    } else {
      for (let j = ecc; j < ecc + eccLength; j++) {
        stringBuffer[j] = stringBuffer[j + 1];
      }
    }

    stringBuffer[ecc + eccLength - 1] = bit === 255 ? 0 : Galois.EXPONENT[modN(bit + polynomial[0])];
  }
}

function calculateMaxLength(dataBlock: number, neccBlock1: number, neccBlock2: number): number {
  return (dataBlock * (neccBlock1 + neccBlock2)) + neccBlock2;
}

function appendEccToData(dataBlock: number, neccBlock1: number, neccBlock2: number, eccBlock: number, polynomial: Uint8Array, stringBuffer: Uint8Array) {
  let data = 0;
  let ecc = calculateMaxLength(dataBlock, neccBlock1, neccBlock2);

  for (let i = 0; i < neccBlock1; i++) {
    appendData(data, dataBlock, ecc, eccBlock, polynomial, stringBuffer);

    data += dataBlock;
    ecc += eccBlock;
  }

  for (let i = 0; i < neccBlock2; i++) {
    appendData(data, dataBlock + 1, ecc, eccBlock, polynomial, stringBuffer);

    data += dataBlock + 1;
    ecc += eccBlock;
  }
}

/** 
 * Applies a mask to the buffer
 */
function applyMask(width: number, buffer: BinaryUint8Array, mask: number, currentMask: BinaryUint8Array) {
  switch (mask) {
  case 0:
    /* This mask goes as:
    * 10101010101
    * 01010101010
    * and so on 
    */ 
    for (let i = 0; i < width * width; i++) {
      if (!(i % 2) && isMaskedIndex(i, width, currentMask) ^ 1) {
        buffer[i] ^= 1;
      }
    }

    break;
  case 1:
    // Alternating straight lines. The first line is 1, the second is 0, and so forth
    for (let y = 0; y < width; y++) {
      if (y % 2) { // every other line
        for (let x = 0; x < width; x++) {
          if (isMasked(x, y, currentMask) ^ 1) {
            buffer[x + (y * width)] ^= 1;
          }
        }
      }
    }

    break;
  case 2:
    // Vertical straight lines, with the pattern: 1001001
    for (let x = 0; x < width; x++) {
      if (!(x % 3)) { // only does it every 3 lines (gap 2)
        for (let y = 0; y < width; y++) {
          if (isMasked(x, y, currentMask) ^ 1) {
            buffer[x + (y * width)] ^= 1
          }
        }
      }
    }

    break;
  case 3:
    // Diagonal lines, as so:
    // 01001
    // 10010
    // 00100
    // 01001
    // 10010
    for (let r3y = 0, y = 0; y < width; y++, r3y++) {
      if (r3y === 3) {
        r3y = 0;
      }

      for (let r3x = r3y, x = 0; x < width; x++, r3x++) {
        if (r3x === 3) {
          r3x = 0;
        }

        if (!r3x && isMasked(x, y, currentMask) ^ 1) {
          buffer[x + (y * width)] ^= 1;
        }
      }
    }

    break;
  case 4:
    for (let y = 0; y < width; y++) {
      for (let r3x = 0, r3y = (y >> 1) & 1, x = 0; x < width; x++, r3x++) {
        if (r3x === 3) {
          r3x = 0;
          r3y = +!r3y;
        }

        if (!r3y && isMasked(x, y, currentMask) ^ 1) {
          buffer[x + (y * width)] ^= 1;
        }
      }
    }

    break;
  case 5:
    for (let r3y = 0, y = 0; y < width; y++, r3y++) {
      if (r3y === 3) {
        r3y = 0;
      }

      for (let r3x = 0, x = 0; x < width; x++, r3x++) {
        if (r3x === 3) {
          r3x = 0;
        }

        if (!((x & y & 1) + (r3x ^ 1 | r3y ^ 1) ^ 1) && isMasked(x, y, currentMask) ^ 1) {
          buffer[x + (y * width)] ^= 1;
        }
      }
    }

    break;
  case 6:
    for (let r3y = 0, y = 0; y < width; y++, r3y++) {
      if (r3y === 3) {
        r3y = 0;
      }

      for (let r3x = 0, x = 0; x < width; x++, r3x++) {
        if (r3x === 3) {
          r3x = 0;
        }

        if (((x & y & 1) + +(r3x && r3x === r3y) & 1) ^ 1 && isMasked(x, y, currentMask) ^ 1) {
          buffer[x + (y * width)] ^= 1;
        }
      }
    }

    break;
  case 7:
    // Eternal hell
    for (let r3y = 0, y = 0; y < width; y++, r3y++) {
      if (r3y === 3) {
        r3y = 0;
      }

      for (let r3x = 0, x = 0; x < width; x++, r3x++) {
        if (r3x === 3) {
          r3x = 0;
        }

        if ((+(r3x && r3x === r3y) + (x + y & 1) & 1) ^ 1 && isMasked(x, y, currentMask) ^ 1) {
          buffer[x + (y * width)] ^= 1;
        }
      }
    }

    break;
  }
}

function calculatePolynomial(eccBlock: number): Uint8Array {

  const polynomial = new Uint8Array(eccBlock).fill(1);

  for (let i = 1; i < eccBlock; i++) {
    for (let j = i; j > 0; j--) {
      polynomial[j] = polynomial[j] ? polynomial[j - 1] ^
        Galois.EXPONENT[modN(Galois.LOG[polynomial[j]] + i)] : polynomial[j - 1];
    }

    polynomial[0] = Galois.EXPONENT[modN(Galois.LOG[polynomial[0]] + i)];
  }

  // Use logs for generator polynomial to save calculation step.
  for (let i = 0; i <= eccBlock; i++) {
    polynomial[i] = Galois.LOG[polynomial[i]];
  }

  return polynomial;
}

function checkBadness(badness: number[], buffer: ReadOnlyBinaryUint8Array, width: number) {
  let b1, h;
  let bad = 0;

  // Blocks of same colour.
  for (let y = 0; y < width - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      // All foreground colour.
      if ((buffer[x + (width * y)] &
        buffer[x + 1 + (width * y)] &
        buffer[x + (width * (y + 1))] &
        buffer[x + 1 + (width * (y + 1))]) |
        // All background colour.
        (buffer[x + (width * y)] |
        buffer[x + 1 + (width * y)] |
        buffer[x + (width * (y + 1))] |
        buffer[x + 1 + (width * (y + 1))]) ^ 1) {
        bad += N2;
      }
    }
  }

  let bw = 0;

  // X runs.
  for (let y = 0; y < width; y++) {
    h = 0;

    badness[0] = 0;

    for (let b = 0, x = 0; x < width; x++) {
      b1 = buffer[x + (width * y)];

      if (b === b1) {
        badness[h]++;
      } else {
        badness[++h] = 1;
      }

      b = b1;
      bw += b ? 1 : -1;
    }

    bad += getBadness(h, badness);
  }

  if (bw < 0) {
    bw = -bw;
  }

  let count = 0;
  let big = bw;
  big += big << 2;
  big <<= 1;

  while (big > width * width) {
    big -= width * width;
    count++;
  }

  bad += count * N4;

  // Y runs.
  for (let x = 0; x < width; x++) {
    h = 0;

    badness[0] = 0;

    for (let b = 0, y = 0; y < width; y++) {
      b1 = buffer[x + (width * y)];

      if (b === b1) {
        badness[h]++;
      } else {
        badness[++h] = 1;
      }

      b = b1;
    }

    bad += getBadness(h, badness);
  }

  return bad;
}

function convertBitStream(version: number, value: string, ecc: Uint8Array, dataBlock: number, neccBlock1: number, neccBlock2: number): Uint8Array {
  let bit;
  let length = value.length;

  // Convert string to bit stream. 8-bit data to QR-coded 8-bit data (numeric, alphanumeric, or kanji not supported).
  for (let i = 0; i < length; i++) {
    ecc[i] = value.charCodeAt(i);
  }

  const maxLength = calculateMaxLength(dataBlock, neccBlock1, neccBlock2);

  if (length >= maxLength - 2) {
    length = maxLength - 2;

    if (version > 9) {
      length--;
    }
  }

  // Shift and re-pack to insert length prefix.
  let index = length;

  if (version > 9) {
    ecc[index + 2] = 0;
    ecc[index + 3] = 0;

    while (index--) {
      bit = ecc[index];

      ecc[index + 3] |= 255 & (bit << 4);
      ecc[index + 2] = bit >> 4;
    }

    ecc[2] |= 255 & (length << 4);
    ecc[1] = length >> 4;
    ecc[0] = 0x40 | (length >> 12);
  } else {
    ecc[index + 1] = 0;
    ecc[index + 2] = 0;

    while (index--) {
      bit = ecc[index];

      ecc[index + 2] |= 255 & (bit << 4);
      ecc[index + 1] = bit >> 4;
    }

    ecc[1] |= 255 & (length << 4);
    ecc[0] = 0x40 | (length >> 4);
  }

  // Fill to end with pad pattern.
  index = length + 3 - +(version < 10);

  while (index < maxLength) {
    ecc[index++] = 0xec;
    ecc[index++] = 0x11;
  }

  return ecc;
}

function finish(level: number, badness: number[], buffer: BinaryUint8Array, width: number, oldCurrentMask: BinaryUint8Array): BinaryUint8Array {
  // Save pre-mask copy of frame.
  const tempBuffer = new Uint8Array(buffer) as BinaryUint8Array;

  let currentMask, i;
  let bit = 0;
  let mask = 30000;

  /*
    * Using for instead of while since in original Arduino code if an early mask was "good enough" it wouldn't try for
    * a better one since they get more complex and take longer.
    * 
    * There are 7 different mask patterns, and this for loop checks each of them.
    */
  for (i = 0; i < 8; i++) {
    // Returns foreground-background imbalance.
    applyMask(width, buffer, i, oldCurrentMask);

    currentMask = checkBadness(badness, buffer, width);

    // Is current mask better than previous best?
    if (currentMask < mask) {
      mask = currentMask;
      bit = i;
    }

    // Don't increment "i" to a void redoing mask.
    if (bit === 7) {
      break;
    }

    // Reset for next pass.
    buffer = new Uint8Array(tempBuffer) as BinaryUint8Array;
  }

  // Redo best mask as none were "good enough" (i.e. last wasn't bit).
  if (bit !== i) {
    applyMask(width, buffer, bit, oldCurrentMask);
  }

  // Add in final mask/ECC level bytes.
  mask = ErrorCorrection.FINAL_FORMAT[bit + (level - 1 << 3)];

  // Low byte.
  for (i = 0; i < 8; i++, mask >>= 1) {
    if (mask & 1) {
      buffer[width - 1 - i + (width * 8)] = 1;

      if (i < 6) {
        buffer[8 + (width * i)] = 1;
      } else {
        buffer[8 + (width * (i + 1))] = 1;
      }
    }
  }

  // High byte.
  for (i = 0; i < 7; i++, mask >>= 1) {
    if (mask & 1) {
      buffer[8 + (width * (width - 7 + i))] = 1;

      if (i) {
        buffer[6 - i + (width * 8)] = 1;
      } else {
        buffer[7 + (width * 8)] = 1;
      }
    }
  }

  return buffer;
}

function interleaveBlocks(ecc: Uint8Array, eccBlock: number, dataBlock: number, neccBlock1: number, neccBlock2: number, stringBuffer: Uint8Array): Uint8Array {
  let i;
  let k = 0;
  const maxLength = calculateMaxLength(dataBlock, neccBlock1, neccBlock2);

  for (i = 0; i < dataBlock; i++) {
    for (let j = 0; j < neccBlock1; j++) {
      ecc[k++] = stringBuffer[i + (j * dataBlock)];
    }

    for (let j = 0; j < neccBlock2; j++) {
      ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
    }
  }

  for (let j = 0; j < neccBlock2; j++) {
    ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
  }

  for (i = 0; i < eccBlock; i++) {
    for (let j = 0; j < neccBlock1 + neccBlock2; j++) {
      ecc[k++] = stringBuffer[maxLength + i + (j * eccBlock)];
    }
  }

  return ecc;
}

function insertAlignments(version: number, width: number, buffer: BinaryUint8Array, mask: BinaryUint8Array) {
  if (version > 1) {
    const i = Alignment.BLOCK[version];
    let y = width - 7;

    for (;;) {
      let x = width - 7;

      while (x > i - 3) {
        addAlignment(x, y, buffer, mask, width);

        if (x < i) {
          break;
        }

        x -= i;
      }

      if (y <= i + 9) {
        break;
      }

      y -= i;

      addAlignment(6, y, buffer, mask, width);
      addAlignment(y, 6, buffer, mask, width);
    }
  }
}

/**
 * Insert a finder on a qr code
 * 
 * Finder format:
 * #######
 * #     #
 * # ### #
 * # ### #
 * # ### #
 * #     #
 * #######
 * 
 * @param mask - TODO ???
 * @param buffer - The buffer the finders are written to
 * @param width - The width of the qr code
 * @param x - The left side of the finder
 * @param y - The top side of the finder
 */
function insertFinder(mask: BinaryUint8Array, buffer: BinaryUint8Array, width: number, x = 0, y = 0) {
  buffer[y + 3 + (width * (x + 3))] = 1;

  for (let i = 0; i < 6; i++) {
    buffer[y + i + (width * x)] = 1;
    buffer[y + (width * (x + i + 1))] = 1;
    buffer[y + 6 + (width * (x + i))] = 1;
    buffer[y + i + 1 + (width * (x + 6))] = 1;
  }

  for (let i = 1; i < 5; i++) {
    setMask(y + i, x + 1, mask);
    setMask(y + 1, x + i + 1, mask);
    setMask(y + 5, x + i, mask);
    setMask(y + i + 1, x + 5, mask);
  }

  for (let i = 2; i < 4; i++) {
    buffer[y + i + (width * (x + 2))] = 1;
    buffer[y + 2 + (width * (x + i + 1))] = 1;
    buffer[y + 4 + (width * (x + i))] = 1;
    buffer[y + i + 1 + (width * (x + 4))] = 1;
  }
}

/**
 * Inserts all three finders on a QR code
 * @param mask - TODO
 * @param buffer - The buffer to write the finders on
 * @param width - The width of the QR code -- used to get the starting coordinates of the finders.
 */
 function insertFinders(mask: BinaryUint8Array, buffer: BinaryUint8Array, width: number) {
  for (let i = 0; i < 3; i++) {
    insertFinder(
      mask, buffer, width,
      // on the first iteration (i === 0) position at the top left
      i === 1 ? width - 7 : 0, // on the second iteration, position at the top right
      i === 2 ? width - 7 : 0 // on the third iteration positin at the bottom left
    );
  }
}

function insertTimingGap(width: number, mask: BinaryUint8Array) {
  for (let y = 0; y < 7; y++) {
    setMask(7, y, mask);
    setMask(width - 8, y, mask);
    setMask(7, y + width - 7, mask);
  }

  for (let x = 0; x < 8; x++) {
    setMask(x, 7, mask);
    setMask(x + width - 8, 7, mask);
    setMask(x, width - 8, mask);
  }
}

function insertTimingRowAndColumn(buffer: BinaryUint8Array, mask: BinaryUint8Array, width: number) {
  for (let x = 0; x < width - 14; x++) {
    if (x & 1) {
      setMask(8 + x, 6, mask);
      setMask(6, 8 + x, mask);
    } else {
      buffer[8 + x + (width * 6)] = 1;
      buffer[6 + (width * (8 + x))] = 1;
    }
  }
}

function insertVersion(buffer: BinaryUint8Array, width: number, version: number, mask: BinaryUint8Array) {

  if (version <= 6) {
    return;
  }

  const i = Version.BLOCK[version - 7];
  let j = 17;

  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 3; y++, j--) {
      if (1 & (j > 11 ? version >> j - 12 : i >> j)) {
        buffer[5 - x + (width * (2 - y + width - 11))] = 1;
        buffer[2 - y + width - 11 + (width * (5 - x))] = 1;
      } else {
        setMask(5 - x, 2 - y + width - 11, mask);
        setMask(2 - y + width - 11, 5 - x, mask);
      }
    }
  }
  
}

function pack(width: number, dataBlock: number, eccBlock: number, neccBlock1: number, neccBlock2: number, mask: BinaryUint8Array, buffer: BinaryUint8Array, stringBuffer: Uint8Array) {
  let bit: number;
  let k = 1;
  let v = 1;
  let x = width - 1;
  let y = width - 1;

  // Interleaved data and ECC codes.
  const length = ((dataBlock + eccBlock) * (neccBlock1 + neccBlock2)) + neccBlock2;

  for (let i = 0; i < length; i++) {
    bit = stringBuffer[i];

    for (let j = 0; j < 8; j++, bit <<= 1) {
      if (0x80 & bit) {
        buffer[x + (width * y)] = 1;
      }

      // Find next fill position.
      do {
        if (v) {
          x--;
        } else {
          x++;

          if (k) {
            if (y !== 0) {
              y--;
            } else {
              x -= 2;
              k ^= 1;

              if (x === 6) {
                x--;
                y = 9;
              }
            }
          } else if (y !== width - 1) {
            y++;
          } else {
            x -= 2;
            k ^= 1;

            if (x === 6) {
              x--;
              y -= 8;
            }
          }
        }

        v ^= 1;
      } while (isMasked(x, y, mask));
    }
  }
}

function reverseMask(mask: BinaryUint8Array, width: number) {
  for (let x = 0; x < 9; x++) {
    setMask(x, 8, mask);
  }

  for (let x = 0; x < 8; x++) {
    setMask(x + width - 8, 8, mask);
    setMask(8, x, mask);
  }

  for (let y = 0; y < 7; y++) {
    setMask(8, y + width - 7, mask);
  }
}

export interface FrameResults {
  readonly buffer: Uint8Array;
  readonly width: number;
  readonly version: number;
}

/**
 * Generates information for a QR code frame based on a specific value to be encoded.
 *
 * @param options - the options to be used
 */
export function generateFrame(options: UserFacingFrameOptions): FrameResults {
  const processedOptions: Required<FrameOptions> = { ...defaultFrameOptions, ...options };

  const level = ErrorCorrection.LEVELS[processedOptions.level];
  const value = options.value;

  const { 
    version, neccBlock1, neccBlock2,
    dataBlock, eccBlock 
  } = generateVersionsAndBlocks(options.value.length, level);

  const badness: number[] = [];

  // FIXME: Ensure that it fits instead of being truncated.
  const width = 17 + (4 * version);

  let buffer = new Uint8Array(width * width) as BinaryUint8Array;

  const ecc = new Uint8Array(dataBlock + ((dataBlock + eccBlock) * (neccBlock1 + neccBlock2)) + neccBlock2);
  const mask = new Uint8Array(((width * (width + 1)) + 1) >> 1) as BinaryUint8Array;

  insertFinders(mask, buffer, width);
  insertAlignments(version, width, buffer, mask);

  // Insert single foreground cell.
  buffer[8 + (width * (width - 8))] = 1;

  insertTimingGap(width, mask);
  reverseMask(mask, width);
  insertTimingRowAndColumn(buffer, mask, width);
  insertVersion(buffer, width, version, mask);
  syncMask(width, mask, buffer);

  const stringBuffer = convertBitStream(version, value, ecc, dataBlock, neccBlock1, neccBlock2);
  const polynomial = calculatePolynomial(eccBlock);
  appendEccToData(dataBlock, neccBlock1, neccBlock2, eccBlock, polynomial, stringBuffer);
  const newStringBuffer = interleaveBlocks(ecc, eccBlock, dataBlock, neccBlock1, neccBlock2, stringBuffer.slice());
  pack(width, dataBlock, eccBlock, neccBlock1, neccBlock2, mask, buffer, newStringBuffer);
  buffer = finish(level, badness, buffer, width, mask);

  return {
    width,
    buffer,
    version
  };
}