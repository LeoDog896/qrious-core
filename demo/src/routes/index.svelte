<script lang="ts">
  import { renderText, renderTwoTone } from "../../../src/qr"
  interface RenderSystem {
    name: string,
    render: (value: string) => string,
    lineSpacing: string,
    tracking: string
  }

  interface Option {
    
  }

  const renderSystems: RenderSystem[] = [{
    name: "Unicode",
    render: renderTwoTone,
    lineSpacing: "1.1rem",
    tracking: "-0.05em"
  }, {
    name: "ASCII",
    render: renderText,
    lineSpacing: ".75rem",
    tracking: "0"
  }]


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
      <h1 class="font-mono text-center my-10" style="
      line-height: {selectedRenderSystem.lineSpacing};
      letter-spacing: {selectedRenderSystem.tracking}
      ">
        {@html selectedRenderSystem
          .render(value)
          .replaceAll("\n", "<br/>")
          .replaceAll(" ", "&nbsp;")
        }
      </h1>
    </div>
    <div class="flex-shrink flex flex-col w-32 border-l-4 border-gray-300">
      {#each renderSystems as renderSystem, i}
        <div tabindex=0 class="
          w-full {selectedRenderSystem == renderSystem ? "bg-gray-200" : "bg-gray-100"} hover:bg-gray-300
          hover:cursor-pointer transition-colors p-4
        " on:click={() => {selectedRenderSystem = renderSystem}}>{renderSystem.name}</div>
      {/each}
    </div>
  </div>
  <div class="flex-row">
  </div>
</div>