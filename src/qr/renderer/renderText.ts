import { FrameOptions, UserFacingFrameOptions, defaultFrameOptions, generateFrame } from '../Frame';

/**
 * The options for the renderText function.
 */
interface TextRenderOptions extends FrameOptions {
  /** The activated characters (black on a regular QR code.) */
  readonly foregroundChar: string;
  /** The non-activated characters (white on a regular QR code) */
  readonly backgroundChar: string;
}

/**
 * Render a QR code in text format.
 * 
 * @param options - The options you want the QR code to have.
 * If you don't have any specific preferences, pass a regular string.
 * 
 * @returns The QR code in text format
 */
export const renderText = (options: Readonly<UserFacingFrameOptions<TextRenderOptions>> | string): string => {
  const processedOptions: Required<TextRenderOptions> = {
    ...defaultFrameOptions,
    foregroundChar: '#',
    backgroundChar: ' ',
    ...(typeof options === 'string' ? { value: options } : options)
  };

  const frame = generateFrame(processedOptions);

  let str = '';

  for (let i = 0; i < frame.width; i++) {
    for (let j = 0; j < frame.width; j++) {
      if (frame.buffer[(j * frame.width) + i]) {
        str += processedOptions.foregroundChar;
      } else {
        str += processedOptions.backgroundChar;
      }
    }
    if (i !== frame.width - 1) {
      str += '\n';
    }
  }

  return str;
};
