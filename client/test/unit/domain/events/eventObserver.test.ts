import userFactory from '@test/domain/userFactory';

import UserEvent from '@/domain/events/UserEvent';
import eventObserver from '@/domain/events/oldeventObserver';

describe('EventObserver - Unit tests', () =>{

  test('Should notify subscriber if it is the event they have subscribed to', (done) => {
    const subcriberId = generateSubscriberId();
    eventObserver.subscribeToUserEvent(subcriberId, () => done());

    const userEvent: UserEvent = new UserEvent('USER_UPDATE', userFactory.createUser());
    eventObserver.notifyUserEvent(userEvent);
  }, 1000);

  test('Should not notify subscriber if it is not the event they have subscribed to', (done) => {
    const subcriberId = generateSubscriberId();
    eventObserver.subscribeToGameEvent(subcriberId, () => done.fail());
    eventObserver.subscribeToUserEvent(subcriberId, () => setTimeout(done, 200));

    const userEvent: UserEvent = new UserEvent('USER_UPDATE', userFactory.createUser());
    eventObserver.notifyUserEvent(userEvent);
  }, 2000);

  test('Should notify correct data to subscriber', (done) => {
    const username = 'frodo';
    const subcriberId = generateSubscriberId();
    eventObserver.subscribeToUserEvent(subcriberId, (data) => {
      if (data.getDetails().username == username) done();
      else done.fail();
    });

    const userEvent: UserEvent = new UserEvent('USER_UPDATE', userFactory.createUser(username));
    eventObserver.notifyUserEvent(userEvent);
  }, 1000);
})

function generateSubscriberId(): string {
  return `subscriber-${Math.floor(Math.random() * 1000000)}`;
}