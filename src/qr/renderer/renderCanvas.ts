import { UserFacingFrameOptions, generateFrame } from '../Frame';
import { defaultImageLikeRenderOptions, ImageLikeRenderOptions } from './options/image';
import { getModuleSize } from './utils';

export const renderContext = (
  options: UserFacingFrameOptions<ImageLikeRenderOptions> | string,
  context: CanvasRenderingContext2D,
  width?: number
) => {
  const processedOptions: ImageLikeRenderOptions = { 
    ...defaultImageLikeRenderOptions,
    ...(typeof options === 'string' ? { value: options } : options) 
  };

  const moduleSize = getModuleSize(width ?? context.canvas.width, processedOptions.size);
  
  const frame = generateFrame(processedOptions);
  
  context.fillStyle = processedOptions.foregroundColor;
  context.globalAlpha = processedOptions.foregroundAlpha;

  for (let i = 0; i < frame.width; i++) {
    for (let j = 0; j < frame.width; j++) {
      if (frame.buffer[(j * frame.width) + i]) {
        context.fillRect(
          (moduleSize * i),
          (moduleSize * j),
          moduleSize, moduleSize
        );
      }
    }
  }
}

export const renderCanvas = (options: UserFacingFrameOptions<ImageLikeRenderOptions> | string , canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');

  if (context == null) {
    throw Error('2d Context is null!');
  }

  return renderContext(options, context);
};
