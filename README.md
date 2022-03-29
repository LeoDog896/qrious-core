# scannable

A simple scanning generation library.

Check out the demo: https://leodog896.github.io/scannable

## Install
```bash
npm i scannable
```

## QR Generation

```ts
import { renderText, renderTwoTone, renderCanvas } from 'scannable/qr';

renderText('https://example.com'); // Outputs a qr code with regular text

renderText({ value: "https://google.com", foregroundChar: "%" }) // You can also specify optoins

renderCanvas("https://yahoo.net", coolCanvas) // Or render it to a canvas
```