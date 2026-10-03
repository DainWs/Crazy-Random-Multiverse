type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'reconnect_failed'
  | 'error';

export type { ConnectionStatus };