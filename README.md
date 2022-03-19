*text-on-gif is a simple package for writing and animating text on animated as well as non-animated gifs*
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

> ADDED SOME NEW FEATURES IN THE LATEST UPDATE THAT ARENT LISTED IN THE README YET. WILL UPDATE THE README SOON TOO... **SUPPORTS BASIC TEXT WRAPPING NOW.**

**Basic Usage**
```js
    const TextOnGif = require('text-on-gif');

    (async function(){

        var gif = new TextOnGif({
          file_path: "https://media0.giphy.com/media/kFgzrTt798d2w/giphy.gif"
        });

        //get as buffer
        var buffer = await gif.textOnGif({
            text: "text on gif sucks",
            get_as_buffer: true
        });

        console.log(buffer);

        //write as file
        await gif.textOnGif({
            text: "text on gif sucks",
            get_as_buffer: false,
            write_path: "gif-with-text.gif"
        });

    })();
```
## NOTE
**DOSENT SUPPORT TRANSPERANCY**

writing on gif might take some time(generally 4-5 seconds) so always use await when getting file as buffer

*the amount of time taken to print the message depends on the number of frames in the gif*
# Example
![GitHub Logo](https://i.postimg.cc/gJrq1rjJ/gif-with-text.gif)
#
## All properties
Properties    | Type    | Required   | Default
------------- | ------  | ---------- | -------
file_path     | String  | Yes        | null
text          | String  | Not Really | ""
font_style      | String     | No         | "calibri"
font_color     | String  | No         | "white"
stroke_color    | String | No | "transparent"
font_size      | Int     | No         | 32
stroke_width | Int | No | 1
alignment_x    | String  | No         | "middle"
alignment_y   | String  | No         | "bottom"
write_path    | String  | No         | "/gif-with-custom-text.gif"
get_as_buffer   | Boolean | No         | true
font_path     | String  | No         | null
position_x     | Int     | No         | null
position_y    | Int     | No         | null
#
&nbsp;
&nbsp;  
# file_path
___path to a local gif file___ or ___URL___

&nbsp;
&nbsp;
# text
should contain letters and numbers

*if emojis and other stuff is passed then it will not be printed on the gif*

&nbsp;
# font_style
Any installed font

&nbsp;
# stroke_color
Color of the stroke, leave as "transparent" for no stroke. Accepts any [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).

&nbsp;
# stroke_width
Number specifying the line width of drawn text, in 'coordinate space units'

&nbsp;
# alignment
### valid values for Hozizontal Alignment
* left
* center
* right
### valid values for Vertical Alignment
* top
* middle
* bottom
#
&nbsp;
&nbsp;
# write_path
if value is passed for **write_path** then the gif is written to the root folder of your project with the specified file name
#
&nbsp;
&nbsp;
# get_as_buffer
default value is true 

set to false if you dont want the file to be returned as buffer
#
&nbsp;
&nbsp;
# font_path
path to custom font

**only FNT fonts can be used**
DOSENT WORK WITH VERSION 2 UPDATE INNA FEW DAYS
*you can use https://ttf2fnt for converting ttf fonts to fnt*
#
&nbsp;
&nbsp;
# position_x
position of text on the x axis

must be a int

*now support percentage values*
#
&nbsp;
&nbsp;
# position_y
position of text on the y axis

must be a int

*now supports percentage values*
#
&nbsp;
&nbsp;
# Things which will be fixed in the upcoming versions
* will support transperancy
* multi line text will be aligned properly
* more user friendly 
* make readme better XD
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/ienadlard"><img src="https://avatars.githubusercontent.com/u/64517108?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ienadlard</b></sub></a><br /><a href="https://github.com/sanidhya711/text-on-gif/commits?author=ienadlard" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Cryptizism"><img src="https://avatars.githubusercontent.com/u/60571306?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cryptizism</b></sub></a><br /><a href="https://github.com/sanidhya711/text-on-gif/commits?author=Cryptizism" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!