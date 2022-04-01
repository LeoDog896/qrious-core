import { FrameOptions, RenderOptionsDefaults, defaultFrameOptions } from '../../Frame';

export interface ImageLikeRenderOptions extends FrameOptions {
  readonly backgroundColor: string;
  readonly backgroundAlpha: number;
  readonly foregroundColor: string;
  readonly foregroundAlpha: number;
  readonly width: number;
  readonly height: number;
  readonly x: number;
  readonly y: number;
  readonly moduleSizeWidth: number;
  readonly moduleSizeHeight: number;
}

export const defaultImageLikeRenderOptions: RenderOptionsDefaults<ImageLikeRenderOptions> = Object.freeze({
  backgroundColor: 'white',
  backgroundAlpha: 1,
  foregroundColor: 'black',
  foregroundAlpha: 1,
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  moduleSizeWidth: 0,
  moduleSizeHeight: 0,
  ...defaultFrameOptions
});
