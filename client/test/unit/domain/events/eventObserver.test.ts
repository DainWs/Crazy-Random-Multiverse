import userFactory from '@test/domain/userFactory';

import UserEvent from '@/domain/events/UserEvent';
import EventObserver from '@/domain/events/EventObserver';

describe('EventObserver - Unit tests', () =>{
  const eventObserver = new EventObserver<UserEvent>();

  test('Should notify subscriber if it is the event they have subscribed to', (done) => {
    const subcriberId = generateSubscriberId();
    eventObserver.subscribe(subcriberId, () => done());

    const userEvent: UserEvent = new UserEvent('USER_UPDATE', userFactory.createUser());
    eventObserver.notify(userEvent);
  }, 1000);

  test('Should not notify subscriber if it is not the event they have subscribed to', (done) => {
    const subcriberId = generateSubscriberId();
    const eventObserverTwo = new EventObserver();
    eventObserverTwo.subscribe(subcriberId, () => done.fail());
    eventObserver.subscribe(subcriberId, () => setTimeout(done, 200));

    const userEvent: UserEvent = new UserEvent('USER_UPDATE', userFactory.createUser());
    eventObserver.notify(userEvent);
  }, 2000);

  test('Should notify correct data to subscriber', (done) => {
    const username = 'frodo';
    const subcriberId = generateSubscriberId();
    eventObserver.subscribe(subcriberId, (data) => {
      if (data.getDetails().username == username) done();
      else done.fail();
    });

    const userEvent: UserEvent = new UserEvent('USER_UPDATE', userFactory.createUser(username));
    eventObserver.notify(userEvent);
  }, 1000);
})

function generateSubscriberId(): string {
  return `subscriber-${Math.floor(Math.random() * 1000000)}`;
}