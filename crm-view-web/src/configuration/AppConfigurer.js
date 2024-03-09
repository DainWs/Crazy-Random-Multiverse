import { Client } from "@stomp/stompjs";
import StompService from "@/services/stomp/StompService";
import SettingsService from "@/services/settings/SettingsService";
import SettingsApiProxy from "@/services/settings/SettingsApiProxy";
import LocalStorageSettingsApi from "@/services/settings/LocalStorageSettingsApi";
import DataManager from "@/services/DataManager";

function configureEnviroment() {
    global.env = {
        plataform: process.env.VUE_APP_PLATAFORM 
    }
}

function configureSettings() {
    SettingsApiProxy.setRealSettingsApi(LocalStorageSettingsApi)
}

async function configureWebsocket() {
    let username = await SettingsService.getUsername()
    DataManager.getUserInfo().value.username = username

    const serverPort = (process.env.NODE_ENV === 'development') ? '8080' : window.location.port
    const StompClient =  new Client({
        brokerURL: `ws://${window.location.hostname}:${serverPort}/ws`,
        connectHeaders: { username },
        reconnectDelay: 5000,
        debug: (message) => console.log(message),
    })
    
    StompService.setClient(StompClient)
    StompClient.activate()
}

function configureApp() {
    configureEnviroment()
    configureSettings()
    configureWebsocket()
}

export {
    configureApp
}