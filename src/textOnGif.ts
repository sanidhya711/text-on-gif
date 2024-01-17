// Untyped library
// @ts-ignore
import * as gifFrames from 'gif-frames';

// Untyped Library
// @ts-ignore
import * as GIFEncoder from 'gif-encoder-2';

import * as Events from 'events';
import { Image, ImageData, createCanvas, registerFont } from 'canvas';
import { createWriteStream } from 'fs';
import { writeFile, unlink } from 'fs/promises'

import type { ExtractedFrame, FontOptions, GifOptions, TextOptions } from '../src/types';
import type { Stream } from 'stream';

declare interface TextOnGif {
    on(event: "frameDataExtreacted", listener: () => void): this;
    on(event: "extractionComplete", listener: () => void): this;
    on(event: "progress", listener: (percent:number) => void): this;
    on(event: "frameIndexUpdate", listener: () => void): this;
    on(event: "finished", listener: () => void): this;
}

class TextOnGif extends Events implements TextOnGif {
    private filePath: string;
    private numberOfFrames: number = 0;
    private retained: boolean = false;
    private extractedFrames: ExtractedFrame[] = [];
    
    public width: number = 0;
    public height: number = 0;
    public text: string = 'Hello World!';
    public gifOptions: GifOptions = {
        retain: true
    }

    public textOptions: TextOptions = {
        fontFamily: "arial",
        fontColor: "black",
        strokeColor: "transparent",
        fontSize: "32px",
        strokeWidth: 1,
        alignmentX: "center",
        alignmentY: "bottom",
        offsetX: 10,
        offsetY: 10,
        positionX: 0,
        positionY: 0,
        rowGap: 5,
        repeat: 0,
        transparent: false
    }

    public transparent: boolean = false;
    private buffer: Buffer | null = null;

    constructor(path:string){
        super();

        this.filePath = path;
        this.extractedFrames = [];
    }

    async writeStreamToFile(data:Stream, outputPath:string) {
        await new Promise((res) =>
            data
                .pipe(
                    createWriteStream(
                        outputPath
                    )
                )
                .on("close", res)
        );

      return true;
    }
    
    async #extractFrames(): Promise<void> {
        const frameData = await gifFrames({ url: this.filePath, frames: 'all', outputType: 'png', cumulative: false });

        this.width = frameData[0].frameInfo.width;
        this.height = frameData[0].frameInfo.height;
        this.numberOfFrames = frameData.length;
        this.emit("frameDataExtreacted");

        let i = 0;
        for await (const frame of frameData) {
            const imgPath = `frame-${i}.png`;

            try {
                await this.writeStreamToFile(frame.getImage(), imgPath);

                const img = new Image();
                img.src = imgPath;

                this.extractedFrames.push({
                    imageData: img,
                    delay: frame.frameInfo.delay * 10,
                    disposal: frame.frameInfo.disposal
                });

                unlink(imgPath).catch(() => null);
            } catch (err) {
                console.error(err);
            }
            
            ++i;
        }
        
        this.emit('extractionComplete');
    }

    async setText(text:string, options?:TextOptions) {
        if (options) this.textOptions = Object.assign(this.textOptions, options);

        this.text = text;
        await this.#extractFrames();
 
        return this;
    }

    async writeFile(filePath:string) {
        await this.#renderGIF(this.text, this.gifOptions);

        if (this.buffer) {
            await writeFile(filePath, this.buffer);
            return true;
        } else {
            throw new Error('Result GIF buffer returned empty')
        }
        
    }

    async toBuffer() {
        await this.#renderGIF(this.text, this.gifOptions);

        return this.buffer;
    }

    async #renderGIF(text:string, options?:GifOptions) {
        var encoder = new GIFEncoder(this.width, this.height, 'neuquant', false, this.extractedFrames.length);
        if(this.transparent){
            encoder.setTransparent(true);
        }
        encoder.setRepeat(this.textOptions.repeat);

        const canvas = createCanvas(this.width,this.height);
        const ctx = canvas.getContext('2d');

        ctx.font = this.textOptions.fontSize + ' ' + this.textOptions.fontFamily;

        encoder.start();

        encoder.on('progress', (percent:number) => {
            this.emit("progress", percent);
        });

        const words = text.split(' ');

        const approximateLineHeight = ctx.measureText("M").width;
        const spaceWidth = ctx.measureText("M M").width - (ctx.measureText("M").width * 2);

        var rows = [{text: words[0] + " ",width: ctx.measureText(words[0]).width + spaceWidth}];

        for(var i = 1; i < words.length; i++){
            var moveToNextRow = rows[rows.length - 1].width + ctx.measureText(words[i]).width + spaceWidth <= this.width ? 0 : 1;
            rows[rows.length - 1 + moveToNextRow] = {
                text: (rows[rows.length - 1 + moveToNextRow] != null ? rows[rows.length - 1 + moveToNextRow].text : "") + words[i] + " ",
                width: (rows[rows.length - 1 + moveToNextRow] != null ? rows[rows.length - 1 + moveToNextRow].width : 0) + ctx.measureText(words[i]).width + spaceWidth
            };
        }

        if(this.textOptions.positionX != null){
            ctx.textAlign = "start";
            var x = this.textOptions.positionX;
        }else{
            if(this.textOptions.alignmentX == "right"){
                ctx.textAlign = "right";
                var x = this.width - this.textOptions.offsetX;
            }else if(this.textOptions.alignmentX == "left"){
                ctx.textAlign = "left";
                var x = this.textOptions.offsetX;
            }else{
                ctx.textAlign = "center";
                var x = this.width / 2;
            }
        }

        if(this.textOptions.positionY != null){
            ctx.textBaseline = "top";
            var y = this.textOptions.positionY;
        }else{
            if(rows.length == 1){
                if(this.textOptions.alignmentY == "top"){
                    ctx.textBaseline = "hanging";
                    var y = this.textOptions.offsetY;
                }else if(this.textOptions.alignmentY == "middle"){
                    ctx.textBaseline = "middle";
                    var y = this.height/2;
                }else{
                    ctx.textBaseline = "bottom";
                    var y = this.height - this.textOptions.offsetY;
                }
            }else{
                if(this.textOptions.alignmentY == "top"){
                    ctx.textBaseline = "hanging";
                    var y = this.textOptions.offsetY;
                }else if(this.textOptions.alignmentY == "middle"){
                    ctx.textBaseline = "top";
                    var y = (this.height - ((rows.length * approximateLineHeight) + ((rows.length -1) * this.textOptions.rowGap))) / 2;
                }else{
                    ctx.textBaseline = "bottom";
                    var y = this.height - (((rows.length - 1) * (approximateLineHeight + this.textOptions.rowGap)) + this.textOptions.offsetY);
                }
            }
        }
        
        for(let index = 0; index < this.extractedFrames.length; index++){
            this.emit("frameIndexUpdate", index);

            try {
                if(!this.retained) 
                    ctx.drawImage(this.extractedFrames[index].imageData, 0, 0);
                else 
                    ctx.putImageData(this.extractedFrames[index].imageData, 0, 0);
            } catch (err) {}
        
            ctx.strokeStyle = this.textOptions.strokeColor;
            ctx.lineWidth = this.textOptions.strokeWidth;
            ctx.font = this.textOptions.fontSize + ' ' + this.textOptions.fontFamily;
            ctx.fillStyle = this.textOptions.fontColor;

            let withoutText: ImageData;
            if(this.extractedFrames[index].disposal != 2){
                withoutText = ctx.getImageData(0,0,this.width,this.height);
            }
        
            if(rows.length == 1){
                ctx.strokeText(text,x,y);
                ctx.fillText(text,x,y);
            }else{
                for(var rowIndex = 0; rowIndex < rows.length; rowIndex++){
                    ctx.strokeText(rows[rowIndex].text.slice(0, -1), x,(rowIndex * (approximateLineHeight + this.textOptions.rowGap)) + y);
                    ctx.fillText(rows[rowIndex].text.slice(0,-1), x,(rowIndex * (approximateLineHeight + this.textOptions.rowGap)) + y);
                }
            }

            encoder.setDelay(this.extractedFrames[index].delay);
            encoder.setDispose(this.extractedFrames[index].disposal);
            encoder.addFrame(ctx);

            if(options?.retain) this.extractedFrames[index].imageData = ctx.getImageData(0,0,this.width,this.height);

            if(this.extractedFrames[index].disposal == 2){
                ctx.clearRect(0,0,this.width,this.height);
            }else{
                ctx.putImageData(withoutText!,0,0);
            }
        }

        encoder.finish();
        
        this.buffer = await encoder.out.getData();
        this.emit("finished");
    }

    static registerFont(options:FontOptions){
        registerFont(options.path, {family: options.family})
    }

    async getWidth() {
        if(this.width) return Promise.resolve(this.width);

        return new Promise(resolve => {
            this.on('frameDataExtreacted',()=>{
                resolve(this.width);
            });
        });
    }
     
    async getHeight() {
        if (this.height) return this.height;

        return new Promise(resolve=>{
            this.on('frameDataExtreacted',()=>{
                resolve(this.height);
            });
        });
    }

    get noOfFrames(){
        if(this.numberOfFrames){
            return Promise.resolve(this.numberOfFrames);
        }else{
            return new Promise(resolve=>{
                this.on('frameDataExtreacted',()=>{
                    resolve(this.numberOfFrames);
                });
            });
        }
    }
}

export default TextOnGif;