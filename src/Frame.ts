import * as Alignment from './constants/alignment';
import * as ErrorCorrection from './constants/errorCorrection';
import * as Galois from './constants/galois';
import * as Version from './constants/version';
import type { WithRequired } from './utils';

/* All Mask types with visible descriptions. */
export enum MaskType {
  ALTERNATING_TILES = 0,
  ALTERNATING_HORIZONTAL_LINES = 1,
  ALTERNATING_VERTICAL_LINES_TWO_GAP = 2,
  DIAGONAL = 3,
  FOUR_BY_TWO_RECTANGLE_ALTERNATING = 4,
  FLOWER_IN_SQAURE = 5,
  DIAGONAL_SQUARE = 6,
  ALTERNATING_PUZZLE_PIECE = 7
}

/**
 * The options used by {@link Frame}.
 */
export interface FrameOptions {
  /** The value to be encoded. */
  readonly value: string;
  /** The ECC level to be used. Default is L */
  readonly level: ErrorCorrection.Level;
  /** The mask type. IF none is specified, one will be automatically chosen based on badness. */
  readonly maskType?: MaskType
}

/** Utility to make value required for users inputting in a value. */
export type UserFacingFrameOptions<T = FrameOptions> = Partial<T> & { readonly value: string }

/** Make every option required except for value -- the opposite of UserFacingFrameOptions */
export type RenderOptionsDefaults<T = FrameOptions> = Omit<T, 'value'> & { readonly value?: string };

/**
 * A {@link Uint8Array} with only 0 or 1.
 */
export type BinaryUint8Array = Uint8Array & { 
  [key: number]: 0 | 1
};

/**
 * Read-only like {@link Uint8Array}
 */
type ReadOnlyUint8ArrayLike<T extends Uint8Array, N = number> = Omit<T, 'copyWithin' | 'fill' | 'reverse' | 'set' | 'sort'> & { readonly [key: number]: N };

/**
 * Read-only {@link BinaryUint8Array}.
 */
export type ReadOnlyBinaryUint8Array = ReadOnlyUint8ArrayLike<BinaryUint8Array, 0 | 1>

/**
 * Read-only {@link Uint8Array}.
 */
export type ReadOnlyUint8Array = ReadOnlyUint8ArrayLike<Uint8Array, number>

export const defaultFrameOptions: RenderOptionsDefaults<FrameOptions> = Object.freeze({
  level: 'L'
});

// *Badness* coefficients.
const [N1, N2, N3, N4] = [3, 3, 40, 10];

/**
 * Gets a mask bit at an index.
 * @param x - The x position to get
 * @param y - The y position to get
 * 
 * @returns The mask bit at that location
 */
function getMaskBit(x: number, y: number): number {
  if (x > y) {
    return getMaskBit(y, x);
  }

  return ((y + (y * y)) >> 1) + x;
}

/**
 * Gets the badness of a QR code.
 * @param length - The length of the data in the QR code
 * @param badness - The QR code to check against
 * @returns How bad the QR code is. 0 is the lowest.
 */
function getBadness(length: number, badness: ReadOnlyUint8Array) {
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

/**
 * Sets the mask to 1 at a specific postion in the buffer
 * @param x - The x position to set
 * @param y - The y position to set
 * @param mask - The mask to set
 */
function setMask(x: number, y: number, mask: BinaryUint8Array) {
  mask[getMaskBit(x, y)] = 1;
}

/**
 * Sets the mask to 1 at a specific index in the buffer
 * @param i - The index in the buffer
 * @param width - The QR code (buffer) width
 * @param mask - The mask to set
 */
function setMaskIndex(i: number, width: number, mask: BinaryUint8Array) {
  mask[getMaskBit(i % width, ~~(i / width))] = 1;
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
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] & 1) { // odd numbers that aren't 0
      setMaskIndex(i, width, mask);
    }
  }
}

/**
 * Check if the mask at the x and y position is masked (=== 1)
 * 
 * @param x - The x position in the mask
 * @param y - The y position in the mask
 * @param mask - The mask to check against
 * @returns If the mask at those two positions is masked (=== 1)
 */
function isMasked(x: number, y: number, mask: ReadOnlyBinaryUint8Array): number {
  const bit = getMaskBit(x, y);

  return mask[bit] & 1;
}

/**
 * Generates all versions and block values.
 *
 * @param length - The length of the text the QR code is holding
 * @param level - The error correction level of the QR code.
 */
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
          Galois.EXPONENT[(bit + polynomial[eccLength - j]) % 255];
      }
    } else {
      for (let j = ecc; j < ecc + eccLength; j++) {
        stringBuffer[j] = stringBuffer[j + 1];
      }
    }

    stringBuffer[ecc + eccLength - 1] = bit === 255 ? 0 : Galois.EXPONENT[(bit + polynomial[0]) % 255];
  }
}

/**
 * Calculates the max length a QR code with the following properties can hold
 * @param dataBlock - The dataBlock number of the QR code
 * @param neccBlock1 - The neccBlock1 number of the QR code
 * @param neccBlock2 - The neccBlock2 number of the QR code
 * @returns The max length the QR code can hold.
 */
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
export function applyMask(width: number, buffer: BinaryUint8Array, mask: MaskType, currentMask: BinaryUint8Array) {
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const invert = mask == MaskType.ALTERNATING_TILES ? (x + y) % 2 == 0 :
        mask == MaskType.ALTERNATING_HORIZONTAL_LINES ? (y % 2) == 0 :
        mask == MaskType.ALTERNATING_VERTICAL_LINES_TWO_GAP ? (x % 3) == 0 :
        mask == MaskType.DIAGONAL ? (x + y) % 3 == 0 :
        mask == MaskType.FOUR_BY_TWO_RECTANGLE_ALTERNATING ? (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0 :
        mask == MaskType.FLOWER_IN_SQAURE ? x * y % 2 + x * y % 3 == 0 :
				mask == MaskType.DIAGONAL_SQUARE ? (x * y % 2 + x * y % 3) % 2 == 0 :
				mask == MaskType.ALTERNATING_PUZZLE_PIECE ? ((x + y) % 2 + x * y % 3) % 2 == 0 : null;
    
      if (invert && !isMasked(x, y, currentMask)) {
        buffer[x + (y * width)] ^= 1;
      }
    }
  }
}

/**
 * Creates a polynomial array.
 * 
 * @param eccBlock - The eccBlock to base the polynomial off of.
 * Necessary to index the Galios arrays.
 * 
 * @returns A new polynomial array.
 */
export function calculatePolynomial(eccBlock: number): Uint8Array {

  const polynomial = new Uint8Array(eccBlock).fill(1);

  for (let i = 1; i < eccBlock; i++) {
    for (let j = i; j > 0; j--) {
      polynomial[j] = polynomial[j] ? polynomial[j - 1] ^
        Galois.EXPONENT[(Galois.LOG[polynomial[j]] + i) % 255] : polynomial[j - 1];
    }

    polynomial[0] = Galois.EXPONENT[(Galois.LOG[polynomial[0]] + i) % 255];
  }

  // Use logs for generator polynomial to save calculation step.
  for (let i = 0; i <= eccBlock; i++) {
    polynomial[i] = Galois.LOG[polynomial[i]];
  }

  return polynomial;
}

/**
 * Check how bad a QR code is for reading
 * @param buffer - The QR code buffer
 * @param width - The width of the QR code
 * @returns How bad the QR is for readability
 */
function checkBadness(buffer: ReadOnlyBinaryUint8Array, width: number): number {

  const badness = new Uint8Array(width);

  let bad = 0;

  // Blocks of same colour. (2x2)
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

  let b1;
  let bw = 0;

  // X runs.
  for (let y = 0; y < width; y++) {
    let h = 0;

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
    let h = 0;

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

/**
 * 
 * @param version - The QR code version
 * @param value - The text to be encoded into the QR code
 * @param ecc - The current ECC block
 * @param dataBlock - The data block (for versions)
 * @param neccBlock1 - The first necc block (for versions)
 * @param neccBlock2 - The second necc block (for versions)
 * @returns A new ecc block
 */
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

/**
 * Apply one of the seven masks and perform other forms of cleanup on the QR code.
 * 
 @param level - The error correction level of the QR code.
 @param buffer - The buffer containing the current state of the QR code.
 @param width - The width of the QR code.
 @param oldCurrentMask - The mask array of the QR code.
 */
function finish(level: number, chosenMask: MaskType | null | undefined, buffer: BinaryUint8Array, width: number, oldCurrentMask: BinaryUint8Array): BinaryUint8Array {
  // Save pre-mask copy of frame.
  const tempBuffer = new Uint8Array(buffer) as BinaryUint8Array;
  let bit: MaskType = chosenMask ?? 0;
  let bestMaskBadness = 30000;

  if (chosenMask === undefined || chosenMask === null || Number.isNaN(chosenMask)) {
    let i = 0;

    /*
      * Using for instead of while since in original Arduino code if an early mask was "good enough" it wouldn't try for
      * a better one since they get more complex and take longer.
      * 
      * There are 7 different mask patterns, and this for loop checks each of them.
      * 
      * MaskType
      */
    for (i = 0; i < 8; i++) {
      // Returns foreground-background imbalance.
      applyMask(width, buffer, i, oldCurrentMask);

      const currentMaskBadness = checkBadness(buffer, width);

      // Is current mask better than previous best?
      if (currentMaskBadness < bestMaskBadness) {
        bestMaskBadness = currentMaskBadness;
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

  } else {
    applyMask(width, buffer, bit, oldCurrentMask);
  }

  // Add in final mask/ECC level bytes.
  bestMaskBadness = ErrorCorrection.FINAL_FORMAT[bit + (level - 1 << 3)];

  // Low byte.
  for (let i = 0; i < 8; i++, bestMaskBadness >>= 1) {
    if (bestMaskBadness & 1) {
      buffer[width - 1 - i + (width * 8)] = 1;

      if (i < 6) {
        buffer[8 + (width * i)] = 1;
      } else {
        buffer[8 + (width * (i + 1))] = 1;
      }
    }
  }

  // High byte.
  for (let i = 0; i < 7; i++, bestMaskBadness >>= 1) {
    if (bestMaskBadness & 1) {
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

/**
 * Inserts all alignments to the QR code
 * 
 * @param version - The version of the QR code
 * @param width - The width of the QR code
 * @param buffer - The buffer containing the QR code
 * @param mask - The mask on the QR code
 */
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

/**
 * Inserts the timing gap into the mask to avoid overriding
 * @param width - The width of the QR code
 * @param mask - The mask to write to
 */
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

/**
 * Inserts the timing row and column into the QR code
 * @param buffer - The buffer containing the QR code
 * @param mask - The mask to write against
 * @param width - The width of the QR code
 */
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

/**
 * Inserts the version data into the QR code. Adjacent to two finders.
 */
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
  const processedOptions: WithRequired<FrameOptions, "value"> = { ...defaultFrameOptions, ...options };

  const level = ErrorCorrection.LEVELS[processedOptions.level];
  const value = options.value;

  const { 
    version, neccBlock1, neccBlock2,
    dataBlock, eccBlock 
  } = generateVersionsAndBlocks(options.value.length, level);

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
  buffer = finish(level, processedOptions.maskType, buffer, width, mask);

  return {
    width,
    buffer,
    version
  };
}