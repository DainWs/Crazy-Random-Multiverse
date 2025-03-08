
const SERVER_HOST = getServerHost();
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_BROWSER = process.env.PLATAFORM === 'browser';

function getServerHost() {
  if (process.env.SERVER_HOST) {
    //return process.env.SERVER_HOST;
  }

  console.log("testing")
  const isBrowserPlatform = (process.env.PLATAFORM == 'browser');
  if (process.env.NODE_ENV === 'development' && isBrowserPlatform) {
    console.log("inside")
    return 'http://localhost:8080'
  }

  if (isBrowserPlatform) {
    return window.location.host;
  }

  throw new Error('SERVER_HOST enviroment variable not defined');
}

export { SERVER_HOST, IS_DEVELOPMENT, IS_BROWSER };