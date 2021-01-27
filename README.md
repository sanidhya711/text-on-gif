*text-on-gif is a simple package for writing and animating text on animated as well as non-animated gifs*

**Basic Usage**

    const textOnGif = require("text-on-gif");

    (async function(){

        //get gif as buffer
        var gifBuffer = await textOnGif({
                file_path:"/path/file.gif",
                textMessage:"custom message"
            });
        console.log(gifBuffer)

        //write gif as file
        await textOnGif({
            file_path:"/path/file.gif",
            textMessage:"custom message",
            write_as_file:true,
            getAsBuffer:false,
            write_path:"path/gif-with-text.gif"
        });

    })();
## NOTE
writing on gif might take some time(generally 3-4 seconds) so always use await when getting file as buffer

*the amount of time taken to print the message depends on the number of frames in the gif*
# Example
![GitHub Logo](https://i.imgur.com/1djICGN.gif)
#
&nbsp;
&nbsp;
## writeOnEffect
![GitHub Logo](https://i.imgur.com/HOd5Xk1.gif)
#
&nbsp;
&nbsp;
## flash
![GitHub Logo](https://i.imgur.com/QUtnvBm.gif)
#
&nbsp;
&nbsp;
## invertColors
![GitHub Logo](https://i.imgur.com/pggHaLb.gif)
#
&nbsp;
&nbsp;
## All properties
Properties    | Type    | Required   | Default
------------- | ------  | ---------- | -------
file_path     | String  | Yes        | null
textMessage   | String  | Not Really | ""
font_color    | String  | No         | "white"
font_size     | Int     | No         | 32
alignmentX    | String  | No         | "middle"
alignmentY    | String  | No         | "bottom"
write_as_file | Boolean | No         | false
writeOnEffect | Boolean | No         | false
invertColors  | Boolean | No         | false
flash         | Boolean | No         | false
textFlash     | Boolean | No         | false
write_path    | String  | No         | "/gif-with-custom-text.gif"
getAsBuffer   | Boolean | No         | true
font_path     | String  | No         | null
animate       | Boolean | No         | false
startX        | Int     | No         | null
endX          | Int     | No         | null
startY        | Int     | No         | null
endY          | Int     | No         | null
positionX     | Int     | No         | null
positionY     | Int     | No         | null
#
&nbsp;
&nbsp;  
# file_path
__path to a local gif file.__

*URLs are not supported right now but will be added in a later version*
#
&nbsp;
&nbsp;
# textMessage
should contain letters and numbers

*if emojis and other stuff is passed then it will not be printed on the gif*
#
&nbsp;
&nbsp;  
# fonts
### fonts available in white color
* _**size:**_ 8
* _**size:**_ 16
* _**size:**_ 32
* _**size:**_ 64
* _**size:**_ 128
### fonts available in black color
* _**size:**_ 8
* _**size:**_ 10
* _**size:**_ 12
* _**size:**_ 14
* _**size:**_ 16
* _**size:**_ 32
* _**size:**_ 64
* _**size:**_ 128
#
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
# write_as_file 
set as true to write the edited gif to a local folder as a gif file

if no value for **write_path** is passed and **write_as_file** is set to true then it is automatically written ot the root folder of your project with the file name "gif-with-custom-tex.gif"

Writing as file overwrites previously written gifs with the same name
#
&nbsp;
&nbsp;
# write_path
used when write_as_file is set to true 

if no value is passed for **write_path** and **write_as_file** is set to true then the gif is written to the root folder of your project with the file name *"gif-with-custom-text.gif"*
#
&nbsp;
&nbsp;
# getAsBuffer
default value is true 

set to false if you dont want the file to be returned as buffer
#
&nbsp;
&nbsp;
# font_path
path to custom font

**only FNT fonts can be used**

*you can use https://ttf2fnt for converting ttf fonts to fnt*
#
&nbsp;
&nbsp;
# animate
set to true to enable text animation on gif 

if set to true the values for 
* startX
* endX
* startY
* endY

must be passed
#
&nbsp;
&nbsp;
# positionX
position of text on the x axis

must be a int

*will support percentage values in later versions*
#
&nbsp;
&nbsp;
# positionY
position of text on the y axis

must be a int

*will support percentage values in later versions*
#