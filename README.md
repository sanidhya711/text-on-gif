*text-on-gif is a simple package for writing text on gifs*

> **NOTES**

## **Basic Usage**
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

# Result
![Gif with text example](https://imgur.com/cYJki4x.gif)

# Writing Text on a GIF:

Create a new `TextOnGif` instance, then call and await `.setText()`

## Example:  

```js
const gif = await new TextOnGif(gifURL)
    .setText(text, options)
```

## TextOnGif.setText() Parameters

### text

 Type               | Default Value
 ------------------ | -------
 string             | ' '

### options (Object)

Parameter Name                | Type                 | Default Value
----------------------------- | -------------------- | -------
[fontSize](#fontSize)         | String               | "32px"
[fontStyle](#fontStyle)       | String               | "calibri"
[fontColor](#fontColor)       | String               | "white"
[strokeColor](#strokeColor)   | String               | "transparent"
[strokeWidth](#strokeWidth)   | Number               | 1
[alignmentX](#alignmentX)     | String               | "middle"
[alignmentY](#alignmentX)     | String               | "bottom"
[positionX](#positionX)       | Number               | null
[positionY](#positionY)       | Number               | null
[offsetX](#offsetX)           | Number               | 10
[offsetY](#offsetY)           | Number               | 10
[rowGap](#rowGap)             | Number               | 5
[repeat](#repeat)             | Number               | 0
[retain](#retain)             | Boolean              | false
[transparent](#transparent)   | Boolean              | false

To use a font file that is not installed as a system font, use registerFont(). This must be done before calling textOnGif()

# Saving gif as a File

call `gif.toFile(path)` to save as a file.

```js
await gif.toFile('output/myGif.gif')
```

# Getting the gif Buffer

```js
const buffer = await gif.toBuffer();
```

# EVENTS:
* ***""extractionComplete""*** 

    type: `() => void`

#### Fired once when frame extraction is complete
&nbsp;

* ***"frameIndexUpdate"***

    type: `(index:number) => void`

#### Fired everytime before writing text on a frame (passes the frame index: 1 indexed)
&nbsp;

* ***"progress"***

    type: `(percent:number) => void`

#### Fired with percentage of gif successfully encoded
&nbsp;

* ***"finished"***

    type: `() => void`

#### Fired when gif has successfully been encoded

&nbsp;

> # **PARAMETER DETAILS ⬇️**
All the parameter details are listed below

* Pull requests to improve this ugly readme are more than welcome :D

* Or if you have any suggestions or request for new features feel free to open an issue.

&nbsp;

# text

Text to be printed on the gif

**Can be a String, Number or Boolean.**

&nbsp;


# retain

if set to true, when you call the textOnGif function to write on the gif, the text will be retained on the source and all consecutive textOnGif function calls will return the gif with the cumulative text.

*useful when you have to write text on multiple places on the same gif*


&nbsp;

# filePath
Gif on which the text is to be printed,  
___path to a local gif file / URL___ or ___in-memory buffer___

*gif.filePath is read only and cant be altered after the TextOnGif object is created*

&nbsp;

# fontSize
Size of font, any [CSS font-size value](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)

*Invalid values might break [fontStyle](#fontStyle) and [fontColor](#fontColor) too and result inna very ugly output*

&nbsp;

# fontStyle
Any installed font. Example: (fontStyle: "Comic Sans MS")

*Invalid values might break [fontSize](#fontSize) and [fontColor](#fontColor) too and result inna very ugly output*

&nbsp;

# fontColor
Color of the font. Accepts any [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).

*Invalid values might break [fontSize](#fontSize) and [fontStyle](#fontStyle) too and result inna very ugly output*


&nbsp;

# strokeColor
Color of the stroke, leave as "transparent" for no stroke.    
Accepts any [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).

&nbsp;

# strokeWidth
Number specifying the line width(Outline) of drawn text,  
in *'coordinate space units'*

&nbsp;

# alignment
### valid values for Hozizontal Alignment (*alignmentX*)
* "left"
* "center"
* "right"
### valid values for Vertical Alignment (*alignmentY*)
* "top"
* "middle"
* "bottom"

&nbsp;

# positionX
Starting position of text on the x axis(in pixels)  
*must be a Number*

&nbsp;

# positionY
Starting position of text on the y axis(in pixels)  
*must be a Number*

&nbsp;

# offsetX
Offset of starting position of text from left or right(in pixels) depending on alignmentX, *must be a Number*  

*not taken into account if positionX is specified* 

&nbsp;

# offsetY
Offset of starting position of text from Top or Bottom(in pixels) depending on alignmentY, *must be a Number*  

*not taken into account if positionY is specified* 

&nbsp;

# rowGap
Vertical gap between rows of text(in pixels)

*taken into account when text to be printed is too long for one row and is wrapped to the next row* 

&nbsp;

# repeat
Number of times to repeat the GIF, *n Number*
* If n is -1, play once.  
* If n is 0, loop indefinitely. 
* If n is a positive number, loop n times.

&nbsp;


# transparent
whether the gif should have a transparent background or not
* If set to true then all ***black pixels are rendered as transparent*** 
* If set to false then transparent pixels are automatically rendered as black


# Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/ienadlard"><img src="https://avatars.githubusercontent.com/u/64517108?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ienadlard</b></sub></a><br /><a href="https://github.com/sanidhya711/text-on-gif/commits?author=ienadlard" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Cryptizism"><img src="https://avatars.githubusercontent.com/u/60571306?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cryptizism</b></sub></a><br /><a href="https://github.com/sanidhya711/text-on-gif/commits?author=Cryptizism" title="Documentation">📖</a></td>
    <td align="center"><a href="https://ian.wij.ma"><img src="https://avatars.githubusercontent.com/u/17692119?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ian Wijma</b></sub></a><br /><a href="https://github.com/sanidhya711/text-on-gif/issues?q=author%3Aianwijma" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/hydradev00"><img src="https://avatars.githubusercontent.com/u/66910478?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Asrın Tekelioğlu</b></sub></a><br /><a href="https://github.com/sanidhya711/text-on-gif/issues?q=author%3Ahydradev00" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

