"use strict";

const Jimp = require("jimp");
const { GifUtil,GifFrame,BitmapImage,GifCodec} = require('gifwrap');
const request = require('request').defaults({ encoding: null });

async function textOnGif({file_path,textMessage,font_color,font_size,alignmentX,alignmentY,write_as_file,write_path,getAsBuffer,font_path,animate,startX,endX,startY,endY,positionX,positionY,writeOnEffect,invertColors,flash,textFlash}){  
    if(getAsBuffer==null || getAsBuffer==true || write_as_file==true){
        if(textMessage==null){
            textMessage="";
        }
        var font;
        if(font_path==null){
            if(font_color==null && font_size == null){
                font = Jimp.FONT_SANS_32_WHITE;
            }else{
                if(font_size){
                    if(font_color=="white" || font_color==null){
                        switch(font_size){
                            case 8:  font = Jimp.FONT_SANS_8_WHITE;
                            break;
                            case 16: font = Jimp.FONT_SANS_16_WHITE;
                            break;
                            case 32: font = Jimp.FONT_SANS_32_WHITE;
                            break;
                            case 64: font = Jimp.FONT_SANS_64_WHITE;
                            break;
                            case 128:font = Jimp.FONT_SANS_128_WHITE;
                            break;
                            default:console.log("font does not exist; switched to font size 32 to prevent app from crashing"); font = Jimp.FONT_SANS_32_WHITE;
                            break;
                        }
                    }else if(font_color=="black"){
                        switch(font_size){
                            case 8:  font = Jimp.FONT_SANS_8_BLACK;
                            break;
                            case 10:  font = Jimp.FONT_SANS_10_BLACK;
                            break;
                            case 12:  font = Jimp.FONT_SANS_12_BLACK;
                            break;
                            case 14:  font = Jimp.FONT_SANS_14_BLACK;
                            break;
                            case 16: font = Jimp.FONT_SANS_16_BLACK;
                            break;
                            case 32: font = Jimp.FONT_SANS_32_BLACK;
                            break;
                            case 64: font = Jimp.FONT_SANS_64_BLACK;
                            break;
                            case 128: font = Jimp.FONT_SANS_128_BLACK;
                            break;
                            default:console.log("font does not exist; switched to font size 32 to prevent app from crashing"); font = Jimp.FONT_SANS_32_BLACK;
                            break;
                        }
                    }
                }else if(font_color){  
                    if(font_color=="white"){
                        font = Jimp.FONT_SANS_32_WHITE
                    }else if(font_color=="black"){
                        font = Jimp.FONT_SANS_32_BLACK;
                    }
                }
            }
        }else{
            if(font_path.substr(font_path-4)==".fnt"){
                font = __dirname+"/../../"+font_path;
            }else{
                throw("fonts can only be loaded from .fnt files (https://ttf2fnt.com/ can be used to convert ttf fonts to fnt fonts)");
            }
        }
    
        if(alignmentX){
            switch (alignmentX){
                case "left": alignmentX = Jimp.HORIZONTAL_ALIGN_LEFT;
                break;
                case "middle": alignmentX = Jimp.HORIZONTAL_ALIGN_CENTER;
                break;
                case "right": alignmentX = Jimp.HORIZONTAL_ALIGN_RIGHT;
                break;
            }
        }else{
            alignmentX = Jimp.HORIZONTAL_ALIGN_CENTER;
        }
    
        if(alignmentY){
            switch (alignmentY){
                case "top": alignmentY = Jimp.VERTICAL_ALIGN_TOP;
                break;
                case "middle": alignmentY = Jimp.VERTICAL_ALIGN_MIDDLE;
                break;
                case "bottom": alignmentY = Jimp.VERTICAL_ALIGN_BOTTOM;
                break;
            }
        }else{
            alignmentY = Jimp.VERTICAL_ALIGN_BOTTOM;
        }
        if(textFlash){
            if(font_size){
                switch(font_size){
                    case 8: var font1 = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);var font2 = await Jimp.loadFont(Jimp.FONT_SANS_8_WHITE);
                    break;
                    case 16: var font1 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);var font2 = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
                    break;
                    case 32: var font1 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);var font2 = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                    break;
                    case 64: var font1 = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);var font2 = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
                    break;
                    case 128: var font1 = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);var font2 = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
                    break;
                    default: console.log("switched to font size 32 because the font size provided in the constructor is not available for both colors"); var font1 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);var font2 = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                    break;
                }
            }else{
                var font1 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
                var font2 = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            }
        }else{
            font = await Jimp.loadFont(font);
        }
        var frames = [];
        var frameNo = 0;
        var gif;

        function doRequest(url){
            return new Promise(function (resolve, reject) {
              request.get(url,function(error, res, body){
                resolve(body);
              });
            });
        }

        if(file_path.substr(0,4)=="http"){
            file_path = await doRequest(file_path);
        }else{
            file_path = __dirname+"/../../"+file_path;
        }

        await GifUtil.read(file_path).then(inputGif => {
            var noOfFrames = inputGif.frames.length-1;
            var incrementX = Math.round((endX-startX)/noOfFrames);
            var incrementY = Math.round((endY-startY)/noOfFrames);
            startX = startX-incrementX;
            startY = startY-incrementY;
            var letterPerFrame = textMessage.length/(noOfFrames-1);
            if(letterPerFrame<1){
                letterPerFrame = 1;
            }
            var NoOflettersWritten = letterPerFrame*-1;
            var originalMessage = textMessage;
            var hitLastFrame = 0;
            while(hitLastFrame < inputGif.frames.length){
                var frame = inputGif.frames[hitLastFrame];
                hitLastFrame++;
                var jimpCopied = GifUtil.copyAsJimp(Jimp, frame);
                if(writeOnEffect){
                    NoOflettersWritten = NoOflettersWritten+letterPerFrame;
                    textMessage = originalMessage.slice(0,NoOflettersWritten);
                }
                if(invertColors){
                    jimpCopied.invert();
                }
                frameNo++;
                if(flash && frameNo%2 == 0){
                    jimpCopied.invert();
                }

                if(textFlash){
                    if(frameNo%2 == 0){
                        font = font2;
                    }else{
                        font = font1;
                    }
                }

                if(animate){
                    startX = startX+incrementX;
                    startY = startY+incrementY;
                    jimpCopied.print(font,startX,startY,{text: textMessage},jimpCopied.bitmap.width,jimpCopied.bitmap.height-5);
                }
                else{
                    if(positionX && !positionY){
                        if(typeof positionX == "string" && positionX.includes("%")){
                            positionX = positionX.replace("%","");
                            positionX = parseInt(positionX);
                            positionX = (jimpCopied.bitmap.width / 100) * positionX;
                        }
                        jimpCopied.print(font,positionX,0,{text: textMessage,alignmentY:alignmentY},jimpCopied.bitmap.width-5,jimpCopied.bitmap.height-5);
                    }else if(positionY && !positionX){
                        if(typeof positionY == "string" && positionY.includes("%")){
                            positionY = positionY.replace("%","");
                            positionY = parseInt(positionY);
                            positionY = (jimpCopied.bitmap.height / 100) * positionY;
                        }
                        jimpCopied.print(font,0,positionY,{text: textMessage,alignmentX:alignmentX},jimpCopied.bitmap.width-5,jimpCopied.bitmap.height-5);
                    }else if(positionX && positionY){
                        jimpCopied.print(font,0,0,{text: textMessage},jimpCopied.bitmap.width,jimpCopied.bitmap.height-5);
                    }else{
                        jimpCopied.print(font,0,0,{text: textMessage,alignmentX:alignmentX,alignmentY:alignmentY},jimpCopied.bitmap.width-5,jimpCopied.bitmap.height-5);
                    }
                }
                const GifCopied = new GifFrame(new BitmapImage(jimpCopied.bitmap,{
                    disposalMethod: frame.disposalMethod,
                    delayCentisecs: frame.delayCentisecs,
                }));
                GifUtil.quantizeSorokin(GifCopied);
                frames.push(GifCopied);   
            }
        });        
        if(write_as_file){
            if(!write_path){
                write_path = __dirname+"/../../gif-with-custom-text.gif";
            }else{
                if(write_path.substr(write_path.length-4)!=".gif"){
                    write_path= write_path +".gif";
                }
            }
            GifUtil.write(write_path, frames, { loops: 0 }).then(gif => {
                console.log("written as file to "+write_path);
            });
        }

        if(getAsBuffer==null || getAsBuffer!=false){
            if(write_as_file==true && getAsBuffer != true){
                gif = "set 'getAsBuffer:true' to get gif as buffer. By defualt getAsBuffer is set to true but when write_as_file is set to true, the file wont be returned as buffer unless setAsBuffer is explicitly set to true"
            }else{ 
                const codec = new GifCodec();
                await codec.encodeGif(frames, { loops: 0 }).then(encodedGIF => {
                    gif = encodedGIF.buffer;
                });
            }
        }else{
            gif = "set 'getAsBuffer:true' to get gif as buffer";
        }
        return Promise.resolve(gif);
    }else{
        console.log("function has no output; set 'getAsBuffer:true' to get gif as buffer or set 'write_as_file:true' to save gif as file");
    }
}

module.exports = textOnGif;