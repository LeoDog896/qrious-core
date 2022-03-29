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
```