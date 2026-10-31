package com.dainws.games.crm.controller.events;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.UUID;

import com.corundumstudio.socketio.HandshakeData;
import com.corundumstudio.socketio.SocketIOClient;

public class RecordingSocketIOClient implements InvocationHandler {
	private static final String GET_SESSION_ID = "getSessionId";
	private static final String GET_HANDSHAKE_DATA = "getHandshakeData";
	private static final String DISCONNECT = "disconnect";
	private static final String HASH_CODE = "hashCode";
	private static final String EQUALS = "equals";
	private static final String TO_STRING = "toString";

	private UUID sessionId;
	private HandshakeData handshakeData;
	private boolean isDisconnected;

	public RecordingSocketIOClient(UUID sessionId, HandshakeData handshakeData) {
		this.sessionId = sessionId;
		this.handshakeData = handshakeData;
		this.isDisconnected = false;
	}

	public SocketIOClient asClient() {
		ClassLoader classLoader = SocketIOClient.class.getClassLoader();
		Class<?>[] interfaces = { SocketIOClient.class };
		return (SocketIOClient) Proxy.newProxyInstance(classLoader, interfaces, this);
	}

	public boolean isDisconnected() {
		return this.isDisconnected;
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] arguments) {
		switch (method.getName()) {
		case GET_SESSION_ID:
			return this.sessionId;
		case GET_HANDSHAKE_DATA:
			return this.handshakeData;
		case DISCONNECT:
			this.isDisconnected = true;
			return null;
		case HASH_CODE:
			return System.identityHashCode(proxy);
		case EQUALS:
			return proxy == arguments[0];
		case TO_STRING:
			return "RecordingSocketIOClient[" + this.sessionId + "]";
		default:
			throw new UnsupportedOperationException(method.getName());
		}
	}
}
