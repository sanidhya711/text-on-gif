const gifFrames = require('gif-frames');
const GIFEncoder = require('gif-encoder-2')
const fs = require('fs');
const Canvas = require('canvas');
const Image = Canvas.Image;
const createCanvas = Canvas.createCanvas;
const EventEmitter = require('events').EventEmitter;

class TextOnGif extends EventEmitter{

    #file_path;
    #width;
    #height;


    constructor(
        {
            file_path,
            font_style,
            font_color,
            stroke_color,
            font_size,
            stroke_width, 
            alignment_x,
            alignment_y,
            offset_x,
            offset_y,
            position_x,
            position_y,
        }
    ){
        super();
        this.#file_path = file_path;
        this.font_style = font_style || "arial";
        this.font_color = font_color || "black";
        this.stroke_color = stroke_color || "transparent";
        this.font_size = font_size || "32px";
        this.stroke_width = stroke_width || 1;
        this.alignment_x = alignment_x || "center";
        this.alignment_y = alignment_y || "bottom";
        this.offset_x = offset_x || 10;
        this.offset_y = offset_y || 10;
        this.position_x = position_x;
        this.position_y = position_y;

        this.#height = null;
        this.#width = null;

        this.extractedFrames = [];
        this.extractionComplete = false;

        this.#extractFrames();
    }

    
    async #extractFrames(){

        var frameData = await gifFrames({url: this.#file_path,frames: 'all',outputType: 'jpg',cumulative: true});

        this.#width = frameData[0].frameInfo.width;
        this.#height = frameData[0].frameInfo.height;

        for (let index = 0; index < frameData.length; index++) {

            await new Promise((resolve,reject)=>{

                const image = new Image();

                image.onload = () => {
                    this.extractedFrames.push({
                        imageData: image,
                        delay: frameData[index].frameInfo.delay * 10,
                        disposal: frameData[index].frameInfo.disposal
                    });
                    resolve();
                }

                image.src = frameData[index].getImage()._obj;
                    
            });
    
        }

        this.extractionComplete = true;
        this.emit('extraction complete');

    }

    async #writeMessage(text,get_as_buffer,write_path){
        const encoder = new GIFEncoder(this.#width,this.#height,'neuquant',false,this.extractedFrames.length);
        encoder.setRepeat(0);

        const canvas = createCanvas(this.#width,this.#height);
        const ctx = canvas.getContext('2d',{alpha: false});

        ctx.fillStyle = this.font_color;
        ctx.strokeStyle = this.stroke_color;
        ctx.font = this.font_size + ' ' + this.font_style;
        ctx.lineWidth = this.stroke_width

        if(write_path && !get_as_buffer){
            const writeStream = fs.createWriteStream(write_path);
            encoder.createReadStream().pipe(writeStream);
        }

        encoder.start();

        encoder.on('progress', percent => {
            this.emit("progress",percent);
        });

        if(this.position_x){
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

        
        if(this.position_y){
            ctx.textBaseline = "alphabetic";
            var y = this.position_y;
        }else{
            if(this.alignment_y == "top"){
                ctx.textBaseline = "hanging";
                var y = this.offset_y;
            }else if(this.alignment_y == "middle"){
                ctx.textBaseline = "middle";
                var y = this.height/2;
            }else{
                ctx.textBaseline = "alphabetic";
                var y = this.#height - this.offset_y
            }
        }
            
        for(let index = 0; index < this.extractedFrames.length; index++) {
            ctx.drawImage(this.extractedFrames[index].imageData, 0, 0);
            ctx.strokeText(text,x,y);
            ctx.fillText(text,x,y);
            encoder.setDelay(this.extractedFrames[index].delay);
            encoder.setDispose(this.extractedFrames[index].disposal);
            encoder.addFrame(ctx);
        }

        encoder.finish();

        this.emit("finished");

        if(get_as_buffer && write_path){
            await new Promise((resolve,reject)=>{
                fs.writeFile(write_path, encoder.out.getData(), error => {
                    resolve();
                });
            })
        }

        if(get_as_buffer){
            return Promise.resolve(encoder.out.getData());
        }else{
            return null;
        }
    }

    async textOnGif({text,get_as_buffer,write_path}){
        if(!write_path && !get_as_buffer){
            get_as_buffer = true;
        }

        var buffer = null;

        if(this.extractionComplete){
            buffer = await this.#writeMessage(text,get_as_buffer,write_path);
        }else{
            await new Promise((resolve,reject)=>{
                this.on('extraction complete',async()=>{
                    buffer = await this.#writeMessage(text,get_as_buffer,write_path);
                    resolve();
                });
            });
        }

        if(buffer){
            return Promise.resolve(buffer);
        }
    }

    get width(){
        return this.#width;
    }

    get height(){
        return this.#height;
    }

    get file_path(){
        return this.#file_path;
    }

}

module.exports = TextOnGif;