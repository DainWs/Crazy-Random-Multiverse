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

const SCREEN_MODES = {
    'Windowed': defineScreenMode('Windowed', false, false),
    'Borderless': defineScreenMode('Borderless', true, false),
    'Fullscreen': defineScreenMode('Fullscreen', true, true)
}

export { SCREEN_MODES as ScreenModes }