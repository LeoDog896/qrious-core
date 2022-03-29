interface Option<T, R> {
  readonly name: string;
  readonly type: R;
  value: T;
  readonly defaultValue: T;
}

type TextOption = Option<string, "text">;
type BooleanOption = Option<boolean, "boolean">;
type ColorOption = Option<string, "color">
type NumberOption = Option<number, "number">
type Options = { readonly [key: string] : TextOption | BooleanOption | ColorOption | NumberOption }

interface RenderSystem {
  name: string,
  options: Options
}

interface CanvasRenderSystem extends RenderSystem {
  type: "canvas";
  render: (value: string, canvas: HTMLCanvasElement, options: Options) => void;
  currentCanvas?: HTMLCanvasElement;
}

interface TextRenderSystem extends RenderSystem {
  type: "text";
  lineSpacing: string;
  tracking: string;
  render: (value: string, options: Options) => string;
}

export type AnyRenderSystem = TextRenderSystem | CanvasRenderSystem