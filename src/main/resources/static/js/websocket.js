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

StompService.client.onConnect = () => {
	StompService.isConnected = true
	StompService.client.subscribe('/topic/party/list', onServerMessage);
	StompService.client.subscribe('/user/topic/user/info', onAccountInfo);
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