import { Client } from '@stomp/stompjs';

const wsServerUrl = `ws://${window.location.hostname}:${window.location.port}/ws`;

 // TODO Probar juego
 
const StompService = {
	isConnected: false,
	connect: function() {
		this.client.activate()
	},
	disconnect: function() {
		this.client.deactivate()
	},
	sendMessage: function(destination, body) {
		this.client.publish({ destination, body })
	}
}

StompService.client = new Client({
	brokerURL: wsServerUrl,
	debug: log,
	reconnectDelay: 5000,
})

StompService.client.onConnect = (frame) => {
	log(frame)
	StompService.isConnected = true
	StompService.client.subscribe('/topic/party/list', onServerMessage);
	StompService.client.subscribe('/topic/party/info', onPartyInfo);
	StompService.client.subscribe('/topic/event', onEvent);
	StompService.client.subscribe('/user/topic/user/info', onAccountInfo);
	StompService.client.subscribe('/user/topic/party/info', onPartyInfo);
	StompService.client.subscribe('/user/topic/event', onEvent);
	StompService.client.subscribe('/application/topic/user/info', onAccountInfo);
	StompService.client.subscribe('/application/topic/party/info', onPartyInfo);
	StompService.client.subscribe('/application/topic/event', onEvent);
	log('Connected')
}

StompService.client.onDisconnect = () => {
	StompService.isConnected = false

	log('Disconnected')
}

StompService.client.onStompError = () => {
	log('------------------------------------------------')
	log('WS: Broker reported error: ' + frame.headers['message'])
	log('WS: Additional details: ' + frame.body)
	log('------------------------------------------------')
}

function onAccountInfo(message) {
	onServerMessage(message)
}

function onPartyInfo(message) {
	onServerMessage(message)
}

function onEvent(message) {
	onServerMessage(message)
}

function onServerMessage(message) {
	console.log(message)
	log(message.body)
}

function log(message) {
	console.log(message)
	const websocketConsole = document.getElementById('ws-console')
	let div = document.createElement('div')
	div.innerText = message
	websocketConsole.appendChild(div)

	websocketConsole.scrollTop = websocketConsole.scrollHeight - websocketConsole.clientHeight;
}

export { StompService }