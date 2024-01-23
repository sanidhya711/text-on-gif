import type { Image } from "canvas";

type AlignmentXOptions = "left" | "center" | "right";
type AlignmentYOptions = "top" | "middle" | "bottom";

/**
 * Options for styling and configuring the text to be written.
 */
export interface TextOptions {
    /**
     * Sets the size of the font.
     * @default "32px"
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
     */
    fontSize: string;

    /**
     * Specifies the font family for the text.
     * @default "calibri"
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
     */
    fontFamily: string;

    /**
     * Sets the foreground color value of the text.
     * @default "white"
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color
     */
    fontColor: string;

    /**
     * The color of the text stroke if enabled.
     * @default "transparent"
     */
    strokeColor: string;

    /**
     * The width of the text's stroke.
     * @default 1
     */
    strokeWidth: number;

    /**
     * Sets the alignment of the text on the x-axis.
     * @type {AlignmentXOptions}
     * @default "center"
     */
    alignmentX: AlignmentXOptions;

    /**
     * Sets the alignment of the text on the y-axis.
     * @type {AlignmentYOptions}
     * @default "bottom"
     */
    alignmentY: AlignmentYOptions;

    /**
     * Starting position of text on the x-axis.
     * @default null
     */
    positionX: number | null;

    /**
     * Starting position of text on the y-axis.
     * @default null
     */
    positionY: number | null;

    /**
     * Offset of the text based off `TextOptions.alignmentX`.
     * @default 10
     */
    offsetX: number;

    /**
     * Offset of the text based off `TextOptions.alignmentY`.
     * @default 10
     */
    offsetY: number;

    /**
     * The vertical gap between each row of text in pixels.
     * @default 5
     */
    rowGap: number;

    /**
     * Number of times to repeat/loop.
     *
     * If `repeat` is:
     * - -1 = play once
     * - 0 = loop indefinitely
     * - \> 0 = loop `repeat` times
     * @default 0
     */
    repeat: number;

    /**
     * Whether to maintain this text on the image after consecutive `.setText()` calls.
     * @default false
     */
    retain: boolean;

    /**
     * whether the gif should have a transparent background or not (targets black pixels). If set to false then transparent pixels are automatically rendered as black.
     * @default false
     */
    transparent: boolean;
}

/**
 * Options for setting custom fonts.
 */
export interface FontOptions {
    /**
     * The file path of the font face data.
     */
    path: string;

    /**
     * Specifies a font family name that can be used.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace#family
     */
    family: string;
}

/**
 * Represents an extracted frame.
 */
export interface ExtractedFrame {
    /**
     * The frame's image data.
     * @type {Image}
     */
    imageData: any; // Conflicting types when applying Image or ImageData

    /**
     * The amount of time in milliseconds to wait before proceeding to the next frame when encoding.
     */
    delay: number;

    disposal: number;
}
