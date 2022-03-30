<script>
  import { renderText } from '../../../src/qr';

  globalThis["renderText"] = renderText

  console.log("Welcome to scannable! The renderText function is now available as a global variable. Feel free to play around with it!")

	import '../app.css';
</script>

<slot />
