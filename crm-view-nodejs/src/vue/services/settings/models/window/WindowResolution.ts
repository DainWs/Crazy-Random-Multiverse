export interface WindowResolution {
    readonly name: string
    readonly width: number
    readonly height: number
}

function defineResolution(width: number, height: number): WindowResolution {
    return {
        name: `${width}x${height}`,
        width: width,
        height: height
    }
}

const RESOLUTIONS = {
    '_640x480': defineResolution(640, 480),
    '_800x600': defineResolution(800, 600),
    '_1280x720': defineResolution(1280, 720),
    '_1920x1080': defineResolution(1920, 1080),
    '_2560x1440': defineResolution(2560, 1440),
    '_3840x2160': defineResolution(3840, 2160)
}

export { RESOLUTIONS as Resolutions }