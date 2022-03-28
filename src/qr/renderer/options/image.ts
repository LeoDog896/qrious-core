import { FrameOptions, RenderOptionsDefaults, defaultFrameOptions } from '../../Frame';

export interface ImageLikeRenderOptions extends FrameOptions {
  readonly backgroundColor: string;
  readonly backgroundAlpha: number;
  readonly foregroundColor: string;
  readonly foregroundAlpha: number;
  readonly size: number;
}

export const defaultImageLikeRenderOptions: RenderOptionsDefaults<ImageLikeRenderOptions> = Object.freeze({
  backgroundColor: 'white',
  backgroundAlpha: 1,
  foregroundColor: 'black',
  foregroundAlpha: 1,
  size: 100,
  ...defaultFrameOptions
});
