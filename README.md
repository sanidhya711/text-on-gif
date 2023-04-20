*text-on-gif is a simple package for writing text on animated as well as non-animated gifs*

> **NOTES**
>* SUPPORTS TRANSPARENT GIFS TOO NOW
>* ADDED OPTION TO REGESTER FONTS

## **Basic Usage**
```js
    const TextOnGif = require('text-on-gif');

    (async function(){

        //create a TextOnGif object
        var gif = new TextOnGif({
          file_path: "https://media0.giphy.com/media/Ju7l5y9osyymQ/giphy.gif"
          //path to local file, url or Buffer
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
            get_as_buffer: false, //set to false to save time
            write_path: "gif-with-text.gif"
        });

    })();
```

# Example
![GitHub Logo](https://i.imgur.com/NuO5Tyu.gif)
#

# To Write Text On Gif :
### ***make a new TextOnGif object then call its member function textOnGif***

## Example:  

```js
    var gif = new TextOnGif({
        file_path: "path/to/gif.gif"
    });

    var buffer = await gif.textOnGif({
        text: "Yo this readme sick :D",
    });
```

## TextOnGif Constructor Parameters
Parameter Name                | Type               | Default Value
----------------------------- | ------------------ | -------
[file_path](#file_path)       | String \|\| Buffer | null
[font_size](#font_size)       | String             | "32px"
[font_style](#font_style)     | String             | "calibri"
[font_color](#font_color)     | String             | "white"
[stroke_color](#stroke_color) | String             | "transparent"
[stroke_width](#stroke_width) | Int                | 1
[alignment_x](#alignment)     | String             | "middle"
[alignment_y](#alignment)     | String             | "bottom"
[position_x](#position_x)     | Int                | null
[position_y](#position_y)     | Int                | null
[offset_x](#offset_x)         | Int                | 10
[offset_y](#offset_y)         | Int                | 10
[row_gap](#row_gap)           | Int                | 5
[repeat](#repeat)             | Int                | 0
[transparent](#transparent)   | Boolean            | false

&nbsp;

> NOTE: Even after creating an object you can always change these properties  
(exception: file_path and transparent).

**Example:** 
```js
    var gif = new TextOnGif({
        file_path: "path/to/gif.gif",
        font_color: "orange"
    });

    //gif 1 has orange colored text
    await gif.textOnGif({
        text: "orange colored text",
        write_path: "gif1.gif"
    });

    //CHANGING FONT COLOR AND SIZE
    gif.font_color = "blue";
    gif.font_size = "100px";

    //gif 2 has blue colored text
    await gif.textOnGif({
        text: "blue colored text",
        write_path: "gif2.gif"
    });
```

&nbsp;

### [PARAMETER DETAILS LISTED BELOW ⬇️](#file_path)

&nbsp;

## textOnGif Function Parameters:
Parameter Name                  | Type    | Default Value
------------------------------- | ------- | -------
[text](#text)                   | String  | ""
[get_as_buffer](#get_as_buffer) | Boolean | true
[write_path](#write_path)       | String  | null
[retain](#retain)               | Boolean | false

&nbsp;

### [PARAMETER DETAILS LISTED BELOW ⬇️](#text)

&nbsp;


To use a font file that is not installed as a system font, use registerFont(). This must be done before calling textOnGif()

&nbsp;

# EVENTS:
* ***"extraction complete"***
#### Fired once when frame extraction is complete
&nbsp;

* ***"on frame"***
#### Fired everytime before writing text on a frame (passes the frame index: 1 indexed)
&nbsp;

* ***"progress"***
#### Fired with percentage of gif successfully encoded
&nbsp;

* ***"finished"***
#### Fired when gif has successfully been encoded

&nbsp;
### Example:
```js
    var gif = new TextOnGif({
        file_path: "path/to/gif.gif"
    });
 
    // you dont have to manually handle this but you can if you want to record the time or something
    gif.on("extraction complete",async()=>{
        console.log("frames extracted!");
        gif.textOnGif({
            text: "imma carti fan :D",
            write_path: "path/to/gif.gif"
        });
    });

    //produces alternating white and black colored text on each frame
    gif.on("on frame",(frameIndex)=>{
        //be careful you dont change any breaking properties such as font size as the text might overflow if this is done while the text is being written on a gif
      if(frameIndex % 2 == 0){
        gif.font_color = "white";
      }else{
        gif.font_color = "black";
      }
    });

    //encoding the frames back into a gif
    gif.on("progress",(percentage)=>{
        console.log(percentage+"% encoding done :)");
    });

    gif.on("finished",()=>{
        console.log("gif encoding finished!");
    });
```
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

# get_as_buffer

Whether to return the gif as a buffer or not after printing the message on it. 

_**Set to false if buffer is not needed** to speed up printing of text on gif_

&nbsp;

# write_path

Path of the file where the gif is to be written.

*Example:*
```js
    await gif.textOnGif({
        text: "huihuihui", 
        get_as_buffer: false,// set to false to speed up the process as gif is piped instead 
        write_path: "gif-with-text.gif"
    });
```

**Gif will only be written to file if value of write_path is passed**

&nbsp;

# retain

if set to true, when you call the textOnGif function to write on the gif, the text will be retained on the source and all consecutive textOnGif function calls will return the gif with the cumulative text.

*useful when you have to write text on multiple places on the same gif*


&nbsp;

# file_path
Gif on which the text is to be printed,  
___path to a local gif file / URL___ or ___in-memory buffer___

*gif.file_path is read only and cant be altered after the TextOnGif object is created*

&nbsp;

# font_size
Size of font, any [CSS font-size value](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)

*Invalid values might break [font_style](#font_style) and [font_color](#font_color) too and result inna very ugly output*

&nbsp;

# font_style
Any installed font. Example: (font_style: "Comic Sans MS")

*Invalid values might break [font_size](#font_size) and [font_color](#font_color) too and result inna very ugly output*

&nbsp;

# font_color
Color of the font. Accepts any [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).

*Invalid values might break [font_size](#font_size) and [font_style](#font_style) too and result inna very ugly output*


&nbsp;

# stroke_color
Color of the stroke, leave as "transparent" for no stroke.    
Accepts any [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).

&nbsp;

# stroke_width
Number specifying the line width(Outline) of drawn text,  
in *'coordinate space units'*

&nbsp;

# alignment
### valid values for Hozizontal Alignment (*alignment_x*)
* "left"
* "center"
* "right"
### valid values for Vertical Alignment (*alignment_y*)
* "top"
* "middle"
* "bottom"

&nbsp;

# position_x
Starting position of text on the x axis(in pixels)  
*must be a Number*

&nbsp;

# position_y
Starting position of text on the y axis(in pixels)  
*must be a Number*

&nbsp;

# offset_x
Offset of starting position of text from left or right(in pixels) depending on alignment_x, *must be a Number*  

*not taken into account if position_x is specified* 

&nbsp;

# offset_y
Offset of starting position of text from Top or Bottom(in pixels) depending on alignment_y, *must be a Number*  

*not taken into account if position_y is specified* 

&nbsp;

# row_gap
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

&nbsp;


# Number of frames in Gif, Gif Height And Gif Width
*these properties are unalterable*  
You can access the gif's width and height using "await gif.width" and "await gif.height" respectively where gif is a *TextOnGif object*.

number of frames in the gif can be accessed by using "await gif.noOfFrames" .
&nbsp;
# 
> # Reason for Using Class Structure:

v1 of this library was structed as a single function but in v2 many major breaking changes were made and I shifted it to class structure mainly because if you want to write different text on the same gif multiple times(that was my use case) then you wouldnt have to extract the gif frames everytime and that saves a lot of time and resources(reduces it to half or even more the second time you write on the gif) 

* ***So like if you want to reuse a gif and write on it multiple times then its very fast after the first time(2x or more maybe)***

* ***Another use case would be that you could preload a gif that you know you'll use and write the text on it at a later time therefore save some time***
&nbsp;

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

