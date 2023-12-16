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
    '640x480': defineResolution(640, 480),
    '800x600': defineResolution(800, 600),
    '1280x720': defineResolution(1280, 720),
    '1920x1080': defineResolution(1920, 1080),
    '2560x1440': defineResolution(2560, 1440),
    '3840x2160': defineResolution(3840, 2160),
}

const VALUES: Map<string, WindowResolution> = new Map<string, WindowResolution>();
VALUES.set('640x480', RESOLUTIONS["640x480"])
VALUES.set('800x600', RESOLUTIONS["800x600"])
VALUES.set('1280x720',  RESOLUTIONS["1280x720"])
VALUES.set('1920x1080', RESOLUTIONS["1920x1080"])
VALUES.set('2560x1440', RESOLUTIONS["2560x1440"])
VALUES.set('3840x2160', RESOLUTIONS["3840x2160"])

export function findByName(name: string): WindowResolution {
    return VALUES.get(name) ?? RESOLUTIONS["1280x720"];
}

export function values(): Map<string, WindowResolution> {
    return VALUES;
}

export default RESOLUTIONS;