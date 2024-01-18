export interface TextOptions {
    fontSize: string;
    fontFamily: string;
    fontColor: string;
    strokeColor: string;
    strokeWidth: number; 
    alignmentX: string;
    alignmentY: string
    positionX: number | null;
    positionY: number | null;
    offsetX: number;
    offsetY: number;
    rowGap: number;
    repeat: number;
    transparent: boolean;
}

export interface GifOptions {
    retain: boolean;
}

export interface FontOptions {
    path: string;
    family: string;
}

export interface ExtractedFrame {

    // Conflicting types when applying Image or ImageData
    imageData: any;

    delay: number;
    disposal: number;
}