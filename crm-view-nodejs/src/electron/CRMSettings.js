

exports.CRMSettings = class CRMSettings {
    loadWindowConfiguration() {
        return crmStorage.loadWindowConfiguration()
    }

    saveWindowConfiguration(config) {
        return crmStorage.saveWindowConfiguration(config)
    }
}