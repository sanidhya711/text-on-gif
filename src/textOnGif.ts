// Untyped library
// @ts-ignore
import * as gifFrames from 'gif-frames';

// Untyped Library
// @ts-ignore
import * as GIFEncoder from 'gif-encoder-2';

import * as Events from 'events';
import { Image, createCanvas, registerFont } from 'canvas';
import { createWriteStream, unlink, writeFile } from 'fs';

import type { FontOptions, GifOptions, WriteOptions } from '../src/types';

export default class TextOnGif extends Events {

    private filePath: string;
    private numberOfFrames: number = 0;
    private retained: boolean = false;
    private extractedFrames: any[] = [];
    private extractionComplete:boolean = false;
    
    public fontStyle: string;
    public fontColor: string;
    public strokeColor: string;
    public fontSize: string;
    public strokeWidth: number;
    public alignmentX: string;
    public alignmentY: string;
    public offsetX: number;
    public offsetY: number;
    public positionX: number;
    public positionY: number;
    public rowGap: number;
    public repeat: number;
    public width: number = 0;
    public height: number = 0;

    public transparent: boolean;

    constructor(options:GifOptions){
        super();

        this.filePath = options.filePath;
        this.transparent = options.transparent;

        this.fontStyle = options.fontStyle ?? "arial";
        this.fontColor = options.fontColor ?? "black";
        this.strokeColor = options.strokeColor ?? "transparent";
        this.fontSize = options.fontSize ?? "32px";
        this.strokeWidth = options.strokeWidth ?? 1;
        this.alignmentX = options.alignmentX ?? "center";
        this.alignmentY = options.alignmentY ?? "bottom";
        this.offsetX = options.offsetX ?? 10;
        this.offsetY = options.offsetY ?? 10;
        this.positionX = options.positionX;
        this.positionY = options.positionY;
        this.rowGap = options.rowGap ?? 5;
        this.repeat = options.repeat ?? 0;

        this.filePath = options.filePath;
        this.transparent = options.transparent ?? false;

        this.extractedFrames = [];
        this.extractionComplete = false;

        this.#extractFrames();
    }
    
    async #extractFrames(): Promise<void> {
        const frameData = await gifFrames({url: this.filePath ,frames: 'all',outputType: 'png', cumulative: false});

        this.width = frameData[0].frameInfo.width;
        this.height = frameData[0].frameInfo.height;
        this.numberOfFrames = frameData.length;
        this.emit('extracted frame info');

        for (let index = 0; index < frameData.length; index++) {

            await new Promise(async (resolve)=>{

                const image = new Image();

                image.onload = () => {
                    this.extractedFrames.push({
                        imageData: image,
                        delay: frameData[index].frameInfo.delay * 10,
                        disposal: frameData[index].frameInfo.disposal
                    });

                    unlink('frame-'+index+'.png',()=>{});
                    resolve(0);
                }

                const writeStream = frameData[index].getImage().pipe(createWriteStream('frame-'+index+'.png'));
                
                writeStream.on('finish',()=>{
                    image.src = 'frame-'+index+'.png';
                });
                
            });
    
        }
        
        this.extractionComplete = true;
        this.emit('extraction complete');
    }

    async #writeMessage(options:WriteOptions){
        if(options.writePath || options.getAsBuffer){
            var encoder = new GIFEncoder(this.width,this.height,'neuquant',false,this.extractedFrames.length);
            if(this.transparent){
                encoder.setTransparent(true);
            }
            encoder.setRepeat(this.repeat);
        }

        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        ctx.font = this.fontSize + ' ' + this.fontStyle;

        if(options.writePath && !options.getAsBuffer){
            const writeStream = createWriteStream(options.writePath);
            writeStream.on('error',(error)=>{
                return Promise.reject(error);
            });
            encoder.createReadStream().pipe(writeStream);
        }

        if(encoder){
            encoder.start();

            encoder.on('progress', (percent:number) => {
                this.emit("progress", percent);
            });
        }

        const words = options.text.split(' ');

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

        if(this.positionX != null){
            ctx.textAlign = "start";
            var x = this.positionX;
        }else{
            if(this.alignmentX == "right"){
                ctx.textAlign = "right";
                var x = this.width - this.offsetX;
            }else if(this.alignmentX == "left"){
                ctx.textAlign = "left";
                var x = this.offsetX;
            }else{
                ctx.textAlign = "center";
                var x = this.width / 2;
            }
        }

        if(this.positionY != null){
            ctx.textBaseline = "top";
            var y = this.positionY;
        }else{
            if(rows.length == 1){
                if(this.alignmentY == "top"){
                    ctx.textBaseline = "hanging";
                    var y = this.offsetY;
                }else if(this.alignmentY == "middle"){
                    ctx.textBaseline = "middle";
                    var y = this.height/2;
                }else{
                    ctx.textBaseline = "bottom";
                    var y = this.height - this.offsetY;
                }
            }else{
                if(this.alignmentY == "top"){
                    ctx.textBaseline = "hanging";
                    var y = this.offsetY;
                }else if(this.alignmentY == "middle"){
                    ctx.textBaseline = "top";
                    var y = (this.height - ((rows.length * approximateLineHeight) + ((rows.length -1) * this.rowGap))) / 2;
                }else{
                    ctx.textBaseline = "bottom";
                    var y = this.height - (((rows.length - 1) * (approximateLineHeight + this.rowGap)) + this.offsetY);
                }
            }
        }
        
        for(let index = 0; index < this.extractedFrames.length; index++){
            this.emit("on frame", index + 1);

            if(!this.retained) 
                ctx.drawImage(this.extractedFrames[index].imageData, 0, 0);
            else 
                ctx.putImageData(this.extractedFrames[index].imageData, 0, 0);
        
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.font = this.fontSize + ' ' + this.fontStyle;
            ctx.fillStyle = this.fontColor;

            let withoutText: object;
            if(this.extractedFrames[index].disposal != 2){
                withoutText = ctx.getImageData(0,0,this.width,this.height);
            }
        
            if(rows.length == 1){
                ctx.strokeText(options.text,x,y);
                ctx.fillText(options.text,x,y);
            }else{
                for(var rowIndex = 0; rowIndex < rows.length; rowIndex++){
                    ctx.strokeText(rows[rowIndex].text.slice(0, -1), x,(rowIndex * (approximateLineHeight + this.rowGap)) + y);
                    ctx.fillText(rows[rowIndex].text.slice(0,-1), x,(rowIndex * (approximateLineHeight + this.rowGap)) + y);
                }
            }

            if(encoder){
                encoder.setDelay(this.extractedFrames[index].delay);
                encoder.setDispose(this.extractedFrames[index].disposal);
                encoder.addFrame(ctx);
            }

            if(options.retain) this.extractedFrames[index].imageData = ctx.getImageData(0,0,this.width,this.height);

            if(this.extractedFrames[index].disposal == 2){
                ctx.clearRect(0,0,this.width,this.height);
            }else{
                ctx.putImageData(withoutText! as ImageData,0,0);
            }
        }

        this.retained = this.retained ? true : options.retain;
        if(encoder) encoder.finish();
        this.emit("finished");

        if(options.getAsBuffer && options.writePath){
            await new Promise((resolve,reject)=>{
                writeFile(options.writePath, encoder.out.getData(), error => {
                    if(error){
                        reject(error);
                    }else{
                        resolve(0);
                    }
                });
            })
        }
        
        if(options.getAsBuffer){
            return Promise.resolve(encoder.out.getData());
        }else{
            return null;
        }
    }

    async textOnGif(options:WriteOptions){
        options.getAsBuffer = options.getAsBuffer ?? true;
        options.retain = options.retain ?? false;
        let buffer = null;

        if(this.extractionComplete){
            buffer = await this.#writeMessage(options);
        }else{
            await new Promise((resolve,reject)=>{
                this.on('extraction complete',async()=>{
                    buffer = await this.#writeMessage(options);
                    resolve(0);
                });
            });
        }

        if(buffer){
            return Promise.resolve(buffer);
        }
    }

    static registerFont(options:FontOptions){
        registerFont(options.path, {family: options.family})
    }

    async getWidth() {
        if(this.width) return Promise.resolve(this.width);

        return new Promise(resolve => {
            this.on("extracted frame info",()=>{
                resolve(this.width);
            });
        });
    }
     
    async getHeight() {
        if (this.height) return this.height;

        return new Promise(resolve=>{
            this.on("extracted frame info",()=>{
                resolve(this.height);
            });
        });
    }

    get noOfFrames(){
        if(this.numberOfFrames){
            return Promise.resolve(this.numberOfFrames);
        }else{
            return new Promise((resolve,reject)=>{
                this.on("extracted frame info",()=>{
                    resolve(this.numberOfFrames);
                });
            });
        }
    }
}