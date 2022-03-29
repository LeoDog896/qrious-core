<script lang="ts">
  import { renderCanvas, renderText, renderTwoTone } from "../../../src/qr"

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

  type AnyRenderSystem = TextRenderSystem | CanvasRenderSystem

  const renderSystems: AnyRenderSystem[] = [{
    type: "canvas",
    name: "Simple Image",
    render: (value, canvas, options) => {
      clearCanvas(canvas)
      renderCanvas({ 
        value, 
        foregroundColor: options.foregroundColor.value as string,
        backgroundColor: options.backgroundColor.value as string
      }, canvas)
    },
    options: {
      foregroundColor: { type: "color", name: "Foreground Color", value: "#000000", defaultValue: "#000000" },
      backgroundColor: { type: "color", name: "Background Color", value: "#ffffff", defaultValue: "#ffffff" }
    }
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
    render: (value, { foregroundChar, backgroundChar, thickness }) => renderText({ 
      value,
      foregroundChar: (foregroundChar.value as string).repeat(thickness.value as number),
      backgroundChar: (backgroundChar.value as string).repeat(thickness.value as number)
    }).split("\n").map(it => (it + "\n")
      .repeat(thickness.value as number).slice(0, -1)).join("\n"),
    lineSpacing: ".75rem",
    tracking: "0",
    options: { 
      foregroundChar: { type: "text", name: "Foreground Character", value: "#", defaultValue: "#" },
      backgroundChar: { type: "text", name: "Background Character", value: " ", defaultValue: " " },
      thickness: { type: "number", name: "Thickness", value: 1, defaultValue: 1 }
    }
  }]

  function clearCanvas(canvas: HTMLCanvasElement) {
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height)
  }

  $: if (selectedRenderSystem.type == "canvas" && selectedRenderSystem.currentCanvas) 
    selectedRenderSystem.render(value, selectedRenderSystem.currentCanvas, selectedRenderSystem.options)

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
          <label for={option.name}>{option.name}</label>
          {#if option.type == "text"}
            <input id={option.name} class="border-b" bind:value={option.value} placeholder={option.name}/>
          {:else if option.type == "color"}
            <input type="color" bind:value={option.value}>
          {:else if option.type == "number"}
            <input type="number" bind:value={option.value}>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>