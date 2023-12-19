import { Client } from "@stomp/stompjs";
import StompService from "@/services/stomp/StompService";
import SettingsService from "@/services/settings/SettingsService";
import SettingsApiProxy from "@/services/settings/SettingsApiProxy";
import LocalStorageSettingsApi from "@/services/settings/LocalStorageSettingsApi";

function configureEnviroment() {
    process.env.plataform = 'browser'
    console.log(process.env)
}

function configureSettings() {
    SettingsApiProxy.setRealSettingsApi(LocalStorageSettingsApi)
}

async function configureWebsocket() {
    let username = await SettingsService.getUsername()

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

function configure() {
    configureEnviroment()
    configureSettings()
    configureWebsocket()
}

export default {
    configure
}