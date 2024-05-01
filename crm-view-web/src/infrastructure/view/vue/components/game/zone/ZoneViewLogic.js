/**
 * @typedef {import('@/domain/actions/Action').ActionParts} ActionParts
 */

const onGrabCardFromSlot = event => {
  /** @type {ActionParts} */
  const parts = {
    source: {
      sourceTrigger: {
        action: 'Grab',
        element: 'ZoneSlot'
      },
      sourcePlayer: event.player.code,
      sourceCard: event.card.code,
      sourcePosition: event.slot
    }
  };

  injectActionParts(event, parts);
  return event;
};

const onDropCardOnSlot = event => {
  const parts = extractActionParts(event);
  parts.target = {
    targetTrigger: {
      action: 'Drop',
      element: 'ZoneSlot'
    },
    targetPlayer: event.player.code,
    targetCard: event.card.code,
    targetPosition: event.slot
  };

  injectActionParts(event, parts);
  return event;
};

const injectActionParts = (event, parts) => {
  event.originalEvent.dataTransfer.setData('action', JSON.stringify(parts));
};

/**
 * @returns {ActionParts}
 */
const extractActionParts = event => {
  return JSON.parse(event.originalEvent.dataTransfer.getData('action'));
};

export {
  onGrabCardFromSlot,
  onDropCardOnSlot,
  injectActionParts,
  extractActionParts
};
