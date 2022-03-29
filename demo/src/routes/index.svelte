<script lang="ts">
  import { renderCanvas, renderText, renderTwoTone } from "../../../src/qr"

  interface Option<T> {
    readonly name: string;
    readonly type: string;
    value: T;
    readonly defaultValue: T;
  }

  type TextOption = Option<string>;
  type BooleanOption = Option<boolean>;
  type Options = { [key: string] : TextOption | BooleanOption }
  interface RenderSystem {
    name: string,
    options: Options
  }

  interface CanvasRenderSystem extends RenderSystem {
    type: "canvas";
    render: (value: string, canvas: HTMLCanvasElement) => void;
    currentCanvas?: HTMLCanvasElement;
  }

  interface TextRenderSystem extends RenderSystem {
    type: "text";
    lineSpacing: string;
    tracking: string;
    render: (value: string, options: Options) => string;
  }

  type AnyRenderSystem = TextRenderSystem | CanvasRenderSystem

  const renderSystems: AnyRenderSystem[] = [{
    type: "canvas",
    name: "Simple Image",
    render: (value, canvas) => {
      clearCanvas(canvas)
      renderCanvas({ value }, canvas)
    },
    options: {}
  }, {
    type: "text",
    name: "Unicode",
    render: renderTwoTone,
    lineSpacing: "1.1rem",
    tracking: "-0.05em",
    options: {}
  }, {
    type: "text",
    name: "ASCII",
    render: (value, options) => renderText({ 
      value,
      foregroundChar: options.foregroundChar.value as string,
      backgroundChar: options.backgroundChar.value as string
    }),
    lineSpacing: ".75rem",
    tracking: "0",
    options: { 
      foregroundChar: { type: "text", name: "Foreground Character", value: "#", defaultValue: "#" },
      backgroundChar: { type: "text", name: "Background Character", value: " ", defaultValue: " "}
    }
  }]

  function clearCanvas(canvas: HTMLCanvasElement) {
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height)
  }

  $: if (selectedRenderSystem.type == "canvas" && selectedRenderSystem.currentCanvas) selectedRenderSystem.render(value, selectedRenderSystem.currentCanvas)

  let selectedRenderSystem = renderSystems[0]
  let value = ""

</script>
<div class="flex flex-col w-screen h-screen">
  <div class="flex flex-row flex-grow w-full">
    <div class="h-full flex-grow p-8">
      <textarea tabindex=0
        placeholder="Type URL here (EX: https://example.com)"
        class="flex-grow w-full text-center" bind:value={value}
      />
      {#if selectedRenderSystem.type == "text"}
        <h1 class="font-mono text-center my-10" style="
        line-height: {selectedRenderSystem.lineSpacing};
        letter-spacing: {selectedRenderSystem.tracking}
        ">
          {@html selectedRenderSystem
            .render(value, selectedRenderSystem.options)
            .replaceAll("\n", "<br/>")
            .replaceAll(" ", "&nbsp;")
          }
        </h1>
      {:else if selectedRenderSystem.type == "canvas"}
        <canvas class="m-auto w-[300px] h-[300px]" height=300 width=300 bind:this={selectedRenderSystem.currentCanvas} />
      {/if}
    </div>
    <div class="flex-shrink flex flex-col w-32 ">
      {#each renderSystems as renderSystem}
        <div tabindex=0 class="
          w-full {selectedRenderSystem == renderSystem ? "bg-gray-200" : "bg-gray-100"} hover:bg-gray-300
          hover:cursor-pointer transition-colors p-4
        " on:click={() => {selectedRenderSystem = renderSystem}}>{renderSystem.name}</div>
      {/each}
    </div>
  </div>
  <div class="flex-row">
    <div class="m-4 flex flex-row">
      {#each Object.values(selectedRenderSystem.options) as option}
        <div>
          {#if option.type == "text"}
            <label for={option.name}>{option.name}</label>
            <input id={option.name} class="border-b" bind:value={option.value} placeholder={option.name}/>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>