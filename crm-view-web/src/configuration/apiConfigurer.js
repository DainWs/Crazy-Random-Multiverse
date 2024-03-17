import { Client } from "@stomp/stompjs";
import StompTopics from "@/api/stomp/stompTopics";
import stompAdapter from "@/api/stomp/stompAdapter";
import stompMessageHandler from "@/api/stomp/stompMessageHandler";
import dataManager from "@/services/DataManager";
import gameController from "@/controllers/GameController";
import settingsService from "@/services/settings/settingsService";

function configureApi() {
    const username = settingsService.getUsername();

    const stompClient =  new Client({
        brokerURL: `ws://${CRM_SERVER_HOST}/ws`,
        connectHeaders: { username },
        reconnectDelay: 5000,
        debug: (message) => console.log(message),
    });

    stompAdapter.setClient(stompClient);
    stompClient.activate();

    configureMessageHandlers();
}

function configureMessageHandlers() {
    stompMessageHandler.subscribe("DataManager", StompTopics.PARTY_INFO, dataManager.setPartyInfo)
    stompMessageHandler.subscribe("DataManager", StompTopics.PARTY_LIST, dataManager.setPartyList)
    stompMessageHandler.subscribe("DataManager", StompTopics.USER_INFO, dataManager.setUserInfo)
    stompMessageHandler.subscribe("GameController", StompTopics.GAME_EVENT, gameController.processGameEvent)
    stompMessageHandler.subscribe("GameController", StompTopics.GAME_ERROR, gameController.processGameError)
}

export { configureApi }