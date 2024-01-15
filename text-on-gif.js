// Sanidhya077 (sanidhyajain077@gmail.com)
// last updated[20/4/2023][14:00 UTC]

'use strict';

const gifFrames = require('gif-frames');
const GIFEncoder = require('gif-encoder-2');
const Canvas = require('canvas');
const Events = require('events');
const fs = require('fs');

class TextOnGif extends Events{

    /**
     * @type {string}
     */
    #file_path;

    /**
     * @type {boolean}
     */
    #transparent;

    /**
     * @type {number}
     */
    #width;

    /**
     * @type {number}
     */
    #height;

    /**
     * @type {number}
     */
    #noOfFrames;

    /**
     * @type {boolean}
     */  
    #retained;

    /**
     * @param {object} args
     * @param {string} args.file_path
     * @param {`${number}${string}`} args.font_size
     * @param {string} args.font_style
     * @param {string} args.font_color
     * @param {string} args.stroke_color
     * @param {string} args.stroke_width
     * @param {number} args.alignment_x
     * @param {number} args.alignment_y
     * @param {number} args.offset_x
     * @param {number} args.offset_y
     * @param {number} args.row_gap
     * @param {number} args.repeat
     * @param {boolean} args.transparent
     */
    constructor(
        {
            file_path,
            font_size,
            font_style,
            font_color,
            stroke_color,
            stroke_width, 
            alignment_x,
            alignment_y,
            position_x,
            position_y,
            offset_x,
            offset_y,
            row_gap,
            repeat,
            transparent,
        }
    ){
        super();

        /**
         * @type {string}
         */
        this.font_style = font_style ?? "arial";

        /**
         * @type {string}
         */
        this.font_color = font_color ?? "black";

        /**
         * @type {string}
         */
        this.stroke_color = stroke_color ?? "transparent";

        /**
         * @type {`${number}${string}`}
         */
        this.font_size = font_size ?? "32px";

        /**
         * @type {string | number}
         */
        this.stroke_width = stroke_width ?? 1;

        /**
         * @type {string}
         */
        this.alignment_x = alignment_x ?? "center";

        /**
         * @type {string}
         */
        this.alignment_y = alignment_y ?? "bottom";

        /**
         * @type {number}
         */
        this.position_x = position_x;

        /**
         * @type {number}
         */
        this.position_y = position_y;

        /**
         * @type {number}
         */
        this.offset_x = offset_x ?? 10;

        /**
         * @type {number}
         */
        this.offset_y = offset_y ?? 10;

        /**
         * @type {number}
         */
        this.row_gap = row_gap ?? 5;

        /**
         * @type {number}
         */
        this.repeat = repeat ?? 0;

        /**
         * @type {boolean}
         */
        this.#transparent = transparent ?? false;

        /**
         * @type {string}
         * @private
         */
        this.#file_path = file_path;

        /**
         * @type {Array}
         */
        this.extractedFrames = [];

        /**
         * @type {boolean}
         */
        this.extractionComplete = false;

        this.#extractFrames();
    }
    
    /**
     * Extracts each image frame from a GIF
     * @returns {void}
     */
    async #extractFrames(){
        const frameData = await gifFrames({url: this.#file_path,frames: 'all',outputType: 'png', cumulative: false});

        this.#width = frameData[0].frameInfo.width;
        this.#height = frameData[0].frameInfo.height;
        this.#noOfFrames = frameData.length;
        this.emit('extracted frame info');

        for (let index = 0; index < frameData.length; index++) {

            await new Promise(async (resolve)=>{

                const image = new Canvas.Image();

                image.onload = () => {
                    this.extractedFrames.push({
                        imageData: image,
                        delay: frameData[index].frameInfo.delay * 10,
                        disposal: frameData[index].frameInfo.disposal
                    });

                    fs.unlink('frame-'+index+'.png',()=>{});
                    resolve();
                }

                const writeStream = frameData[index].getImage().pipe(fs.createWriteStream('frame-'+index+'.png'));
                
                writeStream.on('finish',()=>{
                    image.src = 'frame-'+index+'.png';
                });
                
            });
    
        }
        
        this.extractionComplete = true;
        this.emit('extraction complete');
    }

    /**
     * @param {string} text 
     * @param {boolean} get_as_buffer 
     * @param {string} write_path 
     * @param {boolean} retain 
     * @returns 
     */
    async #writeMessage(text,get_as_buffer,write_path,retain){
        if(write_path || get_as_buffer){
            var encoder = new GIFEncoder(this.#width,this.#height,'neuquant',false,this.extractedFrames.length);
            if(this.#transparent){
                encoder.setTransparent(true);
            }
            encoder.setRepeat(this.repeat);
        }

        const canvas = Canvas.createCanvas(this.#width,this.#height);
        const ctx = canvas.getContext('2d');

        ctx.font = this.font_size + ' ' + this.font_style;

        if(write_path && !get_as_buffer){
            const writeStream = fs.createWriteStream(write_path);
            writeStream.on('error',(error)=>{
                return Promise.reject(error);
            });
            encoder.createReadStream().pipe(writeStream);
        }

        if(encoder){
            encoder.start();

            encoder.on('progress', percent => {
                this.emit("progress", percent);
            });
        }

        const words = text.split(' ');

        const approximateLineHeight = ctx.measureText("M").width;
        const spaceWidth = ctx.measureText("M M").width - (ctx.measureText("M").width * 2);

        var rows = [{text: words[0] + " ",width: ctx.measureText(words[0]).width + spaceWidth}];

        for(var i = 1; i < words.length; i++){
            var moveToNextRow = rows[rows.length - 1].width + ctx.measureText(words[i]).width + spaceWidth <= this.#width ? 0 : 1;
            rows[rows.length - 1 + moveToNextRow] = {
                text: (rows[rows.length - 1 + moveToNextRow] != null ? rows[rows.length - 1 + moveToNextRow].text : "") + words[i] + " ",
                width: (rows[rows.length - 1 + moveToNextRow] != null ? rows[rows.length - 1 + moveToNextRow].width : 0) + ctx.measureText(words[i]).width + spaceWidth
            };
        }

        if(this.position_x != null){
            ctx.textAlign = "start";
            var x = this.position_x;
        }else{
            if(this.alignment_x == "right"){
                ctx.textAlign = "right";
                var x = this.#width - this.offset_x;
            }else if(this.alignment_x == "left"){
                ctx.textAlign = "left";
                var x = this.offset_x;
            }else{
                ctx.textAlign = "center";
                var x = this.#width / 2;
            }
        }

        if(this.position_y != null){
            ctx.textBaseline = "top";
            var y = this.position_y;
        }else{
            if(rows.length == 1){
                if(this.alignment_y == "top"){
                    ctx.textBaseline = "hanging";
                    var y = this.offset_y;
                }else if(this.alignment_y == "middle"){
                    ctx.textBaseline = "middle";
                    var y = this.#height/2;
                }else{
                    ctx.textBaseline = "bottom";
                    var y = this.#height - this.offset_y;
                }
            }else{
                if(this.alignment_y == "top"){
                    ctx.textBaseline = "hanging";
                    var y = this.offset_y;
                }else if(this.alignment_y == "middle"){
                    ctx.textBaseline = "top";
                    var y = (this.#height - ((rows.length * approximateLineHeight) + ((rows.length -1) * this.row_gap))) / 2;
                }else{
                    ctx.textBaseline = "bottom";
                    var y = this.#height - (((rows.length - 1) * (approximateLineHeight + this.row_gap)) + this.offset_y);
                }
            }
        }
        
        for(let index = 0; index < this.extractedFrames.length; index++){
            this.emit("on frame", index + 1);

            if(!this.#retained) 
                ctx.drawImage(this.extractedFrames[index].imageData, 0, 0);
            else 
                ctx.putImageData(this.extractedFrames[index].imageData, 0, 0);
        
            ctx.strokeStyle = this.stroke_color;
            ctx.lineWidth = this.stroke_width;
            ctx.font = this.font_size + ' ' + this.font_style;
            ctx.fillStyle = this.font_color;

            if(this.extractedFrames[index].disposal != 2){
                var withoutText = ctx.getImageData(0,0,this.#width,this.#height);
            }
        
            if(rows.length == 1){
                ctx.strokeText(text,x,y);
                ctx.fillText(text,x,y);
            }else{
                for(var rowIndex = 0; rowIndex < rows.length; rowIndex++){
                    ctx.strokeText(rows[rowIndex].text.slice(0, -1), x,(rowIndex * (approximateLineHeight + this.row_gap)) + y);
                    ctx.fillText(rows[rowIndex].text.slice(0,-1), x,(rowIndex * (approximateLineHeight + this.row_gap)) + y);
                }
            }

            if(encoder){
                encoder.setDelay(this.extractedFrames[index].delay);
                encoder.setDispose(this.extractedFrames[index].disposal);
                encoder.addFrame(ctx);
            }

            if(retain) this.extractedFrames[index].imageData = ctx.getImageData(0,0,this.#width,this.#height);

            if(this.extractedFrames[index].disposal == 2){
                ctx.clearRect(0,0,this.#width,this.#height);
            }else{
                ctx.putImageData(withoutText,0,0);
            }
        }

        this.#retained = this.#retained ? true : retain;
        if(encoder) encoder.finish();
        this.emit("finished");

        if(get_as_buffer && write_path){
            await new Promise((resolve,reject)=>{
                fs.writeFile(write_path, encoder.out.getData(), error => {
                    if(error){
                        reject(error);
                    }else{
                        resolve();
                    }
                });
            })
        }
        
        if(get_as_buffer){
            return Promise.resolve(encoder.out.getData());
        }else{
            return null;
        }
    }

    /**
     * @param {object} options
     * @param {string} options.text The text to write on the gif 
     * @param {boolean} options.get_as_buffer
     * @param {string} options.write_path
     * @param {boolean} options.retain
     * @returns {Buffer}
     */
    async textOnGif({text,get_as_buffer,write_path,retain}){
        get_as_buffer = get_as_buffer ?? true;
        retain = retain ?? false;
        var buffer = null;

        if(this.extractionComplete){
            buffer = await this.#writeMessage(text,get_as_buffer,write_path,retain);
        }else{
            await new Promise((resolve,reject)=>{
                this.on('extraction complete',async()=>{
                    buffer = await this.#writeMessage(text,get_as_buffer,write_path,retain);
                    resolve();
                });
            });
        }

        if(buffer){
            return Promise.resolve(buffer);
        }
    }

    /**
     * @param {object} options
     * @param {string} options.path
     * @param {string} options.family
     */
    static registerFont({path,family}){
        Canvas.registerFont(path,{family: family});
    }

    /**
     * @type {number}
     */
    get width(){
        if(this.#width){
            return Promise.resolve(this.#width);
        }else{
            return new Promise((resolve)=>{
                this.on("extracted frame info",()=>{
                    resolve(this.#width);
                });
            });
        }
    }

    /**
     * @type {number}
     */
    get height(){
        if(this.#height){
            return Promise.resolve(this.#height);
        }else{
            return new Promise((resolve,reject)=>{
                this.on("extracted frame info",()=>{
                    resolve(this.#height);
                });
            });
        }
    }

    /**
     * @type {number}
     */
    get noOfFrames(){
        if(this.#noOfFrames){
            return Promise.resolve(this.#noOfFrames);
        }else{
            return new Promise((resolve,reject)=>{
                this.on("extracted frame info",()=>{
                    resolve(this.#noOfFrames);
                });
            });
        }
    }

    /**
     * @type {string}
     */
    get file_path(){
        return this.#file_path;
    }

}

module.exports = TextOnGif;