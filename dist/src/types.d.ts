export interface GifOptions {
    filePath: string;
    fontSize: string;
    fontStyle: string;
    fontColor: string;
    strokeColor: string;
    strokeWidth: number;
    alignmentX: string;
    alignmentY: string;
    positionX: number;
    positionY: number;
    offsetX: number;
    offsetY: number;
    rowGap: number;
    repeat: number;
    transparent: boolean;
}
export interface WriteOptions {
    text: string;
    getAsBuffer: boolean;
    writePath: string;
    retain: boolean;
}
export interface FontOptions {
    path: string;
    family: string;
}
