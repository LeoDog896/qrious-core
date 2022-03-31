<script>
  import { renderText, generateFrame } from '../../../src/qr';
  import { onMount } from "svelte"

  onMount(() => {
    window["renderText"] = renderText
    globalThis.generateFrame = generateFrame

    console.log("Welcome to scannable! The renderText and generateFrame functions are now available as a global variable. Feel free to play around with it!")
  })

	import '../app.css';
</script>

<slot />
