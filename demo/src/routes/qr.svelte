<script lang="ts">
  import { renderCanvas, renderText, renderTwoTone } from "../../../src/qr"
  import RenderSystemDisplay from "$lib/qr/RenderSystem.svelte";
  import { createRenderSystems } from "$lib/qr/rendererTypes";

  const renderSystems = createRenderSystems([{
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
    render: (value, { foregroundChar, backgroundChar, thickness, inverse, padding }) => renderText({ 
      value, // NOTE: foreground = 0, background = 1
      foregroundChar: "0".repeat(thickness.value),
      backgroundChar: "1".repeat(thickness.value)
    }).split("\n")
      .map(it => "1".repeat(padding.value) + it + "1".repeat(padding.value)) // padding
      .map(it => (it + "\n").repeat(thickness.value).slice(0, -1)) // thickness
      .join("\n")
      .replaceAll("0", inverse.value ? backgroundChar.value : foregroundChar.value)
      .replaceAll("1", inverse.value ? foregroundChar.value : backgroundChar.value),
    lineSpacing: ".75rem",
    tracking: "0",
    options: { 
      foregroundChar: { type: "text", name: "Foreground Character", value: "%", defaultValue: "%" },
      backgroundChar: { type: "text", name: "Background Character", value: " ", defaultValue: " " },
      thickness: { type: "number", name: "Thickness", value: 1, defaultValue: 1 },
      padding: { type: "number", name: "Padding", value: 0, defaultValue: 0 },
      inverse: { type: "boolean", name: "Inverse", value: false, defaultValue: false }
    }
  }])

  function clearCanvas(canvas: HTMLCanvasElement) {
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height)
  }

  let selectedRenderSystem = renderSystems[0]
  let value = ""

</script>
<div class="flex flex-row w-screen h-screen">
  <div class="flex flex-row flex-grow w-full">
    <div class="h-full flex-grow p-8">
      <textarea tabindex=0
        placeholder="Type URL here (EX: https://example.com)"
        class="flex-grow w-full text-center mb-8" bind:value={value}
      />
      <RenderSystemDisplay {selectedRenderSystem} {value} />
    </div>
    <div class="flex-shrink flex flex-col w-32 h-full bg-gray-100">
      {#each renderSystems as renderSystem}
        <div tabindex=0 class="
          w-full {selectedRenderSystem == renderSystem ? "bg-gray-200" : "bg-gray-100"} hover:bg-gray-300
          hover:cursor-pointer transition-colors p-4
        " on:click={() => {selectedRenderSystem = renderSystem}}>{renderSystem.name}</div>
      {/each}
    </div>
  </div>
  <div class="flex-row w-1/5 place-content-between hidden sm:block">
    {#if selectedRenderSystem.options}
      <div class="m-4 flex flex-wrap flex-col">
        {#each Object.values(selectedRenderSystem.options) as option}
          <div class="border-b mb-4 border-gray-400">
            <label for={option.name}>{option.name}:</label>
            {#if option.type == "text"}
              <input id={option.name} class="transition-all border-b outline-none focus:border-sky-500 focus:border-b-2" bind:value={option.value} placeholder={option.name}/>
            {:else if option.type == "color"}
              <input type="color" bind:value={option.value}>
            {:else if option.type == "number"}
              <input type="number" bind:value={option.value}>
            {:else if option.type == "boolean"}
              <input type="checkbox" bind:checked={option.value}>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>