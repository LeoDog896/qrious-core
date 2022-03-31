# scannable
[![npm](https://img.shields.io/npm/v/scannable)](https://npmjs.com/package/scannable)
[![GitHub](https://img.shields.io/github/license/LeoDog896/scannable?label=license)](https://github.com/LeoDog896/scannable/blob/master/LICENSE)
[![demo](https://img.shields.io/badge/demo-live-brightgreen)](https://leodog896.github.io/scannable/qr)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/scannable)
![npm](https://img.shields.io/npm/dt/scannable)


A simple scanning generation library.

Website: https://leodog896.github.io/scannable

## Install
```bash
npm i scannable
```

## QR Generation

```ts
import { renderText, renderTwoTone, renderCanvas } from 'scannable/qr';

// Outputs a qr code with regular text
renderText('https://example.com');

// You can also specify optoins
renderText({ value: "https://google.com", foregroundChar: "%" })

// Or render it to a canvas
renderCanvas("https://yahoo.net", coolCanvas)
```

## Development

There are two projects here -- the root folder, for scannable, and the demo folder, for the demo page.

The demo page is running on SvelteKit.

First, install dependencies: `npm i && cd demo && npm i` (installs deps on the root and demo folder)

To test the scannable library, run `npm run test` or `npm run test:watch` to listen to changes

To run the demo, run `cd demo && npm run dev`. It will guide you on opening the website. **Make sure to go to the /scannable folder**.
For example, localhost:3000/scannable