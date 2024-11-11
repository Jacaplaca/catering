export const beatScale = () => {
    const style: React.CSSProperties & { '--fa-beat-scale'?: string } = {
        animationDuration: ".37s",
        animationIterationCount: 1,
        '--fa-beat-scale': "2.0",
    };
    return style;
}

export const opacityDelay = `@keyframes opacityDelay {
    0% { opacity: 0; }
    30% { opacity: 0; }
    100% { opacity: 1; }
}`;