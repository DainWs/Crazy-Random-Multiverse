export interface DisplayMode {
    readonly name: string
    readonly isFullScreen: boolean
}

function defineDisplayMode(name: string, isFullScreen: boolean) {
    return {
        name: name,
        isFullScreen: isFullScreen
    }
}

const DISPLAY_MODES = {
    Windowed: defineDisplayMode('Windowed', false),
    Fullscreen: defineDisplayMode('Fullscreen', true),
};

const VALUES: Map<string, DisplayMode> = new Map<string, DisplayMode>()
VALUES.set('Windowed', DISPLAY_MODES.Windowed)
VALUES.set('Fullscreen', DISPLAY_MODES.Fullscreen)

export function findByName(name: string): DisplayMode {
    return VALUES.get(name) ?? DISPLAY_MODES.Windowed;
}

export function values(): Map<string, DisplayMode> {
    return VALUES;
}

export default DISPLAY_MODES