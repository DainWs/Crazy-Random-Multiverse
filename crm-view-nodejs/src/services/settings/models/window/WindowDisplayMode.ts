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

const WINDOWED_DISPLAY_MODE = defineDisplayMode('Windowed', false)
export { WINDOWED_DISPLAY_MODE as defaultDisplayMode }

const DISPLAY_MODES: Map<string, DisplayMode> = new Map<string, DisplayMode>()
DISPLAY_MODES.set('Windowed', WINDOWED_DISPLAY_MODE)
DISPLAY_MODES.set('Fullscreen', defineDisplayMode('Fullscreen', true))
export { DISPLAY_MODES as DisplayModes }
