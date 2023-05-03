export interface ScreenMode {
    readonly name: string
    readonly isMaximized: boolean
    readonly isFrameless: boolean
}

function defineScreenMode(name: string, isMaximized: boolean, isFrameless: boolean) {
    return {
        name: name,
        isMaximized: isMaximized,
        isFrameless: isFrameless
    }
}

const WINDOWED_SCREEN_MODE = defineScreenMode('Windowed', false, false)
export { WINDOWED_SCREEN_MODE as defaultScreenMode }

const SCREEN_MODES: Map<string, ScreenMode> = new Map<string, ScreenMode>()
SCREEN_MODES.set('Windowed', WINDOWED_SCREEN_MODE)
SCREEN_MODES.set('Borderless', defineScreenMode('Borderless', true, false))
SCREEN_MODES.set('Fullscreen', defineScreenMode('Fullscreen', true, true))
export { SCREEN_MODES as ScreenModes }
