import ActionTarget from '@/domain/actions/ActionTarget';
import ActionSource from '@/domain/actions/ActionSource';

type ActionParts = {
  source: ActionSource;
  target: ActionTarget;
};

export default ActionParts;
