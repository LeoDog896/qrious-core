# scannable

A simple scanning library.

## Install
```bash
npm i scannable
```

## QR

```ts
import { renderText, renderTwoTone, renderCanvas } from 'scannable/qr';

renderText('https://example.com'); // Outputs a qr code with regular text

renderText({ value: "https://google.com", foregroundChar: "%" }) // You can also specify optoins

renderCanvas("https://yahoo.net", coolCanvas) // Or render it to a canvas
```