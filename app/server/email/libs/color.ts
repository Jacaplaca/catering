export type Theme = {
    brandColor?: string
    buttonText?: string
}

const getColors = (theme?: Theme) => {
    const brandColor = theme?.brandColor ?? "#346df1"
    const color = {
        background: "#f9f9f9",
        text: "#444",
        mainBackground: "#fff",
        buttonBackground: brandColor,
        buttonBorder: brandColor,
        buttonText: theme?.buttonText ?? "#fff",
    }
    return color
}

export default getColors