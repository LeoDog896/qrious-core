<script lang="ts">
  import type { RenderSystem } from "./rendererTypes"

  export let value: string
  export let selectedRenderSystem: RenderSystem<any>

  let size = 300 + selectedRenderSystem.options.padding.value

  $: if (selectedRenderSystem.type == "canvas" && selectedRenderSystem.currentCanvas) 
    selectedRenderSystem.render(value, selectedRenderSystem.currentCanvas, selectedRenderSystem.options)
</script>

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
  <canvas class="m-auto" height={size} width={size} bind:this={selectedRenderSystem.currentCanvas} />
{/if}