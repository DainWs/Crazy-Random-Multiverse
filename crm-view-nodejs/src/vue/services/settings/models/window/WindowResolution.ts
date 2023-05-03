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

const RESOLUTION_1280x720 = defineResolution(1280, 720)
export { RESOLUTION_1280x720 as defaultResolution }

const RESOLUTIONS: Map<string, WindowResolution> = new Map<string, WindowResolution>();
RESOLUTIONS.set('640x480', defineResolution(640, 480))
RESOLUTIONS.set('800x600', defineResolution(800, 600))
RESOLUTIONS.set('1280x720', RESOLUTION_1280x720)
RESOLUTIONS.set('1920x1080', defineResolution(1920, 1080))
RESOLUTIONS.set('2560x1440', defineResolution(2560, 1440))
RESOLUTIONS.set('3840x2160', defineResolution(3840, 2160))
export { RESOLUTIONS as Resolutions }
