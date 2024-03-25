const configureEnviroment = () => {
    global.CRM_PLATAFORM = process.env.VUE_APP_PLATAFORM ?? 'browser';;
    global.CRM_PLATAFORM = process.env.VUE_APP_PLATAFORM ?? 'browser';;
    global.CRM_SERVER_HOSTNAME = process.env.VUE_SERVER_HOSTNAME ?? getServerHostnameFromPlataform();;
    global.CRM_SERVER_PORT = process.env.VUE_SERVER_PORT ?? getServerPortFromPlataform();;
    global.CRM_SERVER_HOST = process.env.VUE_SERVER_HOST ?? `${CRM_SERVER_HOSTNAME}:${CRM_SERVER_PORT}`;
}

function getServerHostnameFromPlataform() {
    if (process.env.NODE_ENV == 'development') {
        return '127.0.0.1';
    }

    if (CRM_PLATAFORM === 'browser') {
        return window.location.hostname;
    }

    return '127.0.0.1';
}

function getServerPortFromPlataform() {
    if (process.env.NODE_ENV == 'development') {
        return 8080;
    }

    if (CRM_PLATAFORM === 'browser') {
        return window.location.port;
    }

    return 8080;
}

export { configureEnviroment }