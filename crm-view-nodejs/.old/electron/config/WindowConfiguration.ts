
class WindowResolution {
    public readonly width: number
    public readonly height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    public getName() {
        return `${this.width}x${this.height}`;
    }
}

const RESOLUTIONS = {
    '_640x480': new WindowResolution(640, 480),
    '_800x600': new WindowResolution(800, 600),
    '_1280x720': new WindowResolution(1280, 720),
    '_1920x1080': new WindowResolution(1920, 1080),
    '_2560x1440': new WindowResolution(2560, 1440),
    '_3840x2160': new WindowResolution(3840, 2160)
}

export { RESOLUTIONS as Resolutions }

class ScreenMode {
    public readonly name: string
    public readonly isMaximized: boolean
    public readonly isFrameless: boolean

    constructor(name: string, isMaximized: boolean, isFrameless: boolean) {
        this.name = name;
        this.isMaximized = isMaximized;
        this.isFrameless = isFrameless;
    }
}

const SCREEN_MODES = {
    'Windowed': new ScreenMode('Windowed', false, false),
    'Borderless': new ScreenMode('Borderless', true, false),
    'Fullscreen': new ScreenMode('Fullscreen', true, true)
}

export { SCREEN_MODES as ScreenModes }

interface WindowConfiguration {
    resolution: WindowResolution
    screenMode: ScreenMode
    darkTheme: boolean
}

export { WindowConfiguration }