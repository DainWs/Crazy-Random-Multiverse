import ViewAction from '@/domain/actions/ViewAction';
import ViewElement from '@/domain/actions/ViewElements';

type ActionTrigger = {
  element: ViewElement;
  action: ViewAction;
};

export default ActionTrigger;
