import { ApiException, EXCEPTION_KEYS, socketService, userApi } from '@/api';
import StoreSystem from '@/core/StoreSystem';

const loadOrRegisterUser = async () => {
  try {
    return await userApi.getAccount();
  } catch (error) {
    if (error instanceof ApiException && error.key === EXCEPTION_KEYS.USER_NOT_FOUND) {
      return await userApi.register();
    }

    throw error;
  }
}

const start = async (): Promise<void> => {
  const user = await loadOrRegisterUser();
  StoreSystem.setUser(user);

  socketService.connect();
}

const SessionSystem = {
  start
}

export default SessionSystem;
