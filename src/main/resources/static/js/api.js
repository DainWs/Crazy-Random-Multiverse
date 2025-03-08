
const session = {
	partyCode: ""
}

const login = async () => {
	const response = await fetch("/login", {
		method: "POST",
		body: "test-user"
	});
	
	log(await response.json());
}

const createParty = async () => {
	const response = await fetch("/party", {
		method: "POST",
		body: JSON.stringify({
			gameMode: "CLASSIC",
			maxPlayers: 4
		})
	});

	const dto =	await response.json();
	log(dto);
	session.partyCode = dto.code;
}

const startGame = async () => {
	const response = await fetch(`/party/${session.partyCode}/start`, {
		method: "POST"
	});

	log(response.statusText);
}

function log(message) {
	console.log(message)
	const websocketConsole = document.getElementById('ws-console')
	let div = document.createElement('div')
	div.innerText = JSON.stringify(message)
	websocketConsole.appendChild(div)

	websocketConsole.scrollTop = websocketConsole.scrollHeight - websocketConsole.clientHeight;
}

export { login, createParty, startGame };