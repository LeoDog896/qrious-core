# scannable

[![npm](https://img.shields.io/npm/v/scannable)](https://npmjs.com/package/scannable)
[![GitHub](https://img.shields.io/badge/license-GPL%203.0--or--later-green)](https://github.com/LeoDog896/scannable/blob/master/LICENSE)
[![demo](https://img.shields.io/badge/demo-live-brightgreen)](https://leodog896.github.io/scannable/qr)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/scannable)
![npm](https://img.shields.io/npm/dt/scannable)


A simple scanning generation library.

Demo: https://leodog896.github.io/scannable
TIP: If you want to try out the methods, open inspect element.

## Install
```bash
npm i scannable
```

## QR Generation

```ts
import { renderText, renderTwoTone, renderCanvas } from 'scannable';

// Render it to a canvas
renderCanvas("https://yahoo.net", coolCanvas)

// Outputs a qr code with ASCII text
renderText('https://example.com');

// You can also specify optoins
renderText({ value: "https://google.com", foregroundChar: "%" })

// You can even use unicode characters to squish text
renderTwoTone('https://leodog896.github.io/scannable')
```

## Development

There are two projects here -- the root folder, for scannable, and the demo folder, for the demo page.

The demo page is running on SvelteKit.

First, install dependencies: `npm i && cd demo && npm i` (installs deps on the root and demo folder)

To test the scannable library, run `npm run test` or `npm run test:watch` to listen to changes

To run the demo, run `cd demo && npm run dev`. It will guide you on opening the website. **Make sure to go to the /scannable folder**.
For example, localhost:3000/scannable
