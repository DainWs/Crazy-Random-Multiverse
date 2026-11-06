/**
 * TEMPORARY: Spanish texts by key (UI-2). Replace this module with a real localization mechanism
 * (language selection and one catalog per language) when translations are built.
 */
const TEXTS: Record<string, string> = {
  'ui.main_menu.title': 'Crazy Random Multiverse',
  'ui.main_menu.create_party': 'Crear party',
  'ui.main_menu.join_party': 'Unirse',
  'ui.main_menu.party_code': 'Código de la party',
  'ui.party.members': 'Miembros',
  'ui.party.owner': 'Owner',
  'ui.party.code': 'Código',
  'ui.party.copy_code': 'Copiar código',
  'ui.party.code_copied': 'Copiado',
  'ui.party.leave': 'Salir',
  'ui.party.start': 'Iniciar partida',
  'ui.game_load.loading': 'Cargando la partida...',
  'ui.game_load.waiting': 'Esperando a los demás jugadores...',
  'ui.game_load.failed': 'No se ha podido cargar la partida',
  'ui.game_load.retry': 'Reintentar',
  'ui.game.hand_size': 'Mano:',
  'exception.unexpected': 'Ha ocurrido un error inesperado',
  'exception.user.not_found': 'Tu sesión ha caducado',
  'exception.party.not_found': 'No existe ninguna party con ese código',
  'exception.party.user_already_in_party': 'Ya estás en una party',
  'exception.party.user_is_not_party_owner': 'Solo el owner puede hacer esto',
  'exception.party.locked': 'La party tiene una partida en curso',
  'exception.party.is_full': 'La party está llena',
  'exception.party.not_enough_players': 'Hacen falta al menos 2 jugadores',
  'exception.request.malformed': 'La petición no es válida'
};

const getText = (key: string): string => TEXTS[key] ?? key;

export { getText };
