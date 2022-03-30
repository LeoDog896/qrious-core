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

## Development

There are two projects here -- the root folder, for scannable, and the demo folder, for the demo page.

The demo page is running on SvelteKit.

First, install dependencies: `npm i && cd demo && npm i` (installs deps on the root and demo folder)

To test the scannable library, run `npm run test` or `npm run test:watch` to listen to changes

To run the demo, run `cd demo && npm run dev`. It will guide you on opening the website. **Make sure to go to the /scannable folder**.
For example, localhost:3000/scannable