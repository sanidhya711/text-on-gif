# Elitezen/text-on-gif

This is an WIP TypeScript rewrite of [/sanidhya711/text-on-gif](https://github.com/sanidhya711/text-on-gif)

## How this library has been improved
- (Will Soon Be) Fully Typed.
- Modernized codebase with up-to-date practices.
- Switched to camelCase notation to fit JavaScript notation.
- Refactored to be easier to use and comprehend

## Example Usage
```js
const { TextOnGif } = require('gift-on-text')

const gifURL = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif';

// -- In async function or top-level await supported namespace --
const gif = await new TextOnGif(gifURL)
    .setText('Hello World', {
        fontColor: 'white',
        alignmentX: 'center'
    })

await gif.writeFile('test.gif');     // Save as file

const buffer = await gif.toBuffer(); // Or get buffer data
```