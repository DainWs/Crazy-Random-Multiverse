import ActionDto from '@api/dto/ActionDto';
import UserDto from '@api/dto/UserDto';

import Action from '@/domain/actions/Action';
import User from '@/domain/models/User';

const mapUserToDto = (user: User): UserDto => {
  return new UserDto(user.username);
};

const mapActionToDto = (action: Action): ActionDto => {
  const actionDto = new ActionDto(action.game, action.type);
  actionDto.sourceCard = action.sourceCard;
  actionDto.sourcePlayer = action.sourcePlayer;
  actionDto.sourcePosition = action.sourcePosition;
  actionDto.targetCard = action.targetCard;
  actionDto.targetPlayer = action.targetPlayer;
  actionDto.targetPosition = action.targetPosition;
  return actionDto;
};

export default {
  mapUserToDto,
  mapActionToDto
};
