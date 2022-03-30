import { UserFacingFrameOptions, generateFrame } from '../Frame';
import { defaultImageLikeRenderOptions, ImageLikeRenderOptions } from './options/image';
import { getModuleSize } from './utils';

export const renderContext = (
  options: UserFacingFrameOptions<ImageLikeRenderOptions> | string,
  context: CanvasRenderingContext2D,
  width?: number,
  height?: number
) => {
  const processedOptions: ImageLikeRenderOptions = { 
    ...defaultImageLikeRenderOptions,
    width: width ?? context.canvas.clientWidth,
    height: height ?? context.canvas.clientHeight,
    ...(typeof options === 'string' ? { value: options } : options),
  };
  
  const frame = generateFrame(processedOptions);
  
  const moduleSizeWidth = getModuleSize(frame.width, processedOptions.width);
  const moduleSizeHeight = getModuleSize(frame.width, processedOptions.height);

  for (let i = 0; i < frame.width; i++) {
    for (let j = 0; j < frame.width; j++) {
      if (frame.buffer[(j * frame.width) + i]) {
        context.fillStyle = processedOptions.foregroundColor;
        context.globalAlpha = processedOptions.foregroundAlpha;
        context.fillRect(
          (moduleSizeWidth * i),
          (moduleSizeHeight * j),
          moduleSizeWidth, moduleSizeHeight
        );
      } else {
        context.fillStyle = processedOptions.backgroundColor;
        context.globalAlpha = processedOptions.backgroundAlpha;
        context.fillRect(
          (moduleSizeWidth * i),
          (moduleSizeHeight * j),
          moduleSizeWidth, moduleSizeHeight
        );
      }
    }
  }
};

export const renderCanvas = (options: UserFacingFrameOptions<ImageLikeRenderOptions> | string , canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');

  if (context == null) {
    throw Error('2d Context is null!');
  }

  return renderContext(options, context);
};
