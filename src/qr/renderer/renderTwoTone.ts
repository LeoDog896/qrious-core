import { FrameOptions, UserFacingFrameOptions, defaultFrameOptions, generateFrame } from '../Frame';

interface TwoToneRenderOptions extends FrameOptions {
  readonly solidCharacter: string;
  readonly solidTopCharacter: string;
  readonly solidBottomCharacter: string;
  readonly emptyCharacter: string;
}

export const renderTwoTone = (options: Readonly<UserFacingFrameOptions<TwoToneRenderOptions>> | string): string => {
  const processedOptions: Required<TwoToneRenderOptions> = {
    ...defaultFrameOptions,
    solidCharacter: '█',
    solidTopCharacter: '▀',
    solidBottomCharacter: '▄',
    emptyCharacter: ' ',
    ...(typeof options === 'string' ? { value: options } : options)
  };

  const frame = generateFrame(processedOptions);

  let str = '';

  for (let i = 0; i < frame.width; i += 2) {
    for (let j = 0; j < frame.width; j++) {
      const topExists = frame.buffer[(i * frame.width) + j]
      const bottomExists = frame.buffer[((i + 1) * frame.width) + j]

      if (topExists && bottomExists) {
        str += processedOptions.solidCharacter;
      } else if (!topExists && bottomExists) {
        str += processedOptions.solidBottomCharacter;
      } else if (topExists && !bottomExists) {
        str += processedOptions.solidTopCharacter;
      } else {
        str += processedOptions.emptyCharacter;
      }
    }
    if (i !== frame.width - 1) {
      str += '\n';
    }
  }

  return str;
};