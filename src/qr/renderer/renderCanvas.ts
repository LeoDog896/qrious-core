import { UserFacingFrameOptions, generateFrame } from '../Frame';
import { defaultImageLikeRenderOptions, ImageLikeRenderOptions } from './options/image';
import { getModuleSize } from './utils';

/**
 * Renders a QR code onto a canvas context
 * 
 * @param options - the options to use for the frame.
 * @param context - The canvas context to use
 * @param width - The width of the QR code, **not the canvas**
 * @param height - The height of the QR code, **not the canvas**
 */
export const renderContext = (
  options: UserFacingFrameOptions<ImageLikeRenderOptions> | string,
  context: CanvasRenderingContext2D,
  width?: number,
  height?: number
) => {
  
  const jsonOptions = typeof options === 'string' ? { value: options } : options;

  const processedOptions: ImageLikeRenderOptions = { 
    ...defaultImageLikeRenderOptions,
    width: width ?? (context.canvas.clientWidth - ((jsonOptions.x ?? 0) * 2)),
    height: height ?? (context.canvas.clientHeight - ((jsonOptions.y ?? 0) * 2)),
    ...jsonOptions,
  };
  
  const frame = generateFrame(processedOptions);
  
  const rawModuleSizeWidth = getModuleSize(frame.width, processedOptions.width);
  const rawModuleSizeHeight = getModuleSize(frame.width, processedOptions.height);

  const moduleSizeWidth = Math.round(rawModuleSizeWidth);
  const moduleSizeHeight = Math.round(rawModuleSizeHeight);

  for (let i = 0; i < frame.width; i++) {
    for (let j = 0; j < frame.width; j++) {
      if (frame.buffer[(j * frame.width) + i]) {
        context.fillStyle = processedOptions.foregroundColor;
        context.globalAlpha = processedOptions.foregroundAlpha;

        context.fillRect(
          (moduleSizeWidth * i) + processedOptions.x,
          (moduleSizeHeight * j) + processedOptions.y,
          moduleSizeWidth, moduleSizeHeight
        );
      } else {
        context.fillStyle = processedOptions.backgroundColor;
        context.globalAlpha = processedOptions.backgroundAlpha;

        context.fillRect(
          (moduleSizeWidth * i) + processedOptions.x,
          (moduleSizeHeight * j) + processedOptions.y,
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
