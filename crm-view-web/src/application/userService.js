import eventObserver from "@/application/events/observer";

const properties = {
    user: { username: undefined }
};

const updateLocalUser = (user) => {
    const oldUser = properties.user;

    if (oldUser.username !== user.username) {
        properties.user = user;

        const event = { code: 'USER_INFO', details: user };
        eventObserver.notify(event.code, event);
    }
}

const getUser = () => {
    return properties.user;
}

export {
    updateLocalUser,
    getUser
}