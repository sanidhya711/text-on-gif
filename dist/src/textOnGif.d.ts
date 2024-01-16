/// <reference types="node" />
import * as Events from 'events';
import { FontOptions, GifOptions, WriteOptions } from '../src/types';
export default class TextOnGif extends Events {
    #private;
    private filePath;
    private numberOfFrames;
    private retained;
    private extractedFrames;
    private extractionComplete;
    fontStyle: string;
    fontColor: string;
    strokeColor: string;
    fontSize: string;
    strokeWidth: number;
    alignmentX: string;
    alignmentY: string;
    offsetX: number;
    offsetY: number;
    positionX: number;
    positionY: number;
    rowGap: number;
    repeat: number;
    width: number;
    height: number;
    transparent: boolean;
    constructor(options: GifOptions);
    textOnGif(options: WriteOptions): Promise<any>;
    static registerFont(options: FontOptions): void;
    getWidth(): Promise<unknown>;
    getHeight(): Promise<unknown>;
    get noOfFrames(): Promise<unknown>;
}
