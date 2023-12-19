const parseToObject = function(stringObject) {
    const object = JSON.parse(stringObject)
    return {
        username: object?.username ?? `user_${new Date().getTime()}`,
    }
}

const parseToJson = function(appSettings) {
    const minimalSettings = {
        username: appSettings.username,
    }

    return JSON.stringify(minimalSettings);
}

export default {
    parseToObject,
    parseToJson
}