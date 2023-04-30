function defineScreenMode(name, isMaximized, isFrameless) {
    return {
        name: name,
        isMaximized: isMaximized,
        isFrameless: isFrameless
    };
}
const SCREEN_MODES = {
    'Windowed': defineScreenMode('Windowed', false, false),
    'Borderless': defineScreenMode('Borderless', true, false),
    'Fullscreen': defineScreenMode('Fullscreen', true, true)
};
export { SCREEN_MODES as ScreenModes };
//# sourceMappingURL=WindowScreenMode.js.map