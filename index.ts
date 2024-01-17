import TextOnGif from "./src/textOnGif";

export {
    TextOnGif
}

(async() => {
    const gif = await new TextOnGif('https://media0.giphy.com/media/Ju7l5y9osyymQ/giphy.gif')
        .setText('Hello World!')

    const buffer = await gif.toBuffer() // Get buffer

    await gif.writeFile('test.gif')     //  OR Create File
})();