import filesystem from 'fs'
import path from 'path';
import { createServer } from 'http'

export const SERVER_SCHEME = "http"
export const SERVER_HOST = "localhost"
export const SERVER_PORT = 13240;

const FIRST_BAR_REGEX = /^\//g
const MIME_TYPES_BY_EXT = new Map()
MIME_TYPES_BY_EXT.set('.ico', 'image/x-icon')
MIME_TYPES_BY_EXT.set('.html', 'text/html')
MIME_TYPES_BY_EXT.set('.js', 'text/javascript')
MIME_TYPES_BY_EXT.set('.json', 'application/json')
MIME_TYPES_BY_EXT.set('.css', 'text/css')
MIME_TYPES_BY_EXT.set('.png', 'image/png')
MIME_TYPES_BY_EXT.set('.jpg', 'image/jpeg')
MIME_TYPES_BY_EXT.set('.wav', 'audio/wav')
MIME_TYPES_BY_EXT.set('.mp3', 'audio/mpeg')
MIME_TYPES_BY_EXT.set('.svg', 'image/svg+xml')
MIME_TYPES_BY_EXT.set('.pdf', 'application/pdf')
MIME_TYPES_BY_EXT.set('.zip', 'application/zip')
MIME_TYPES_BY_EXT.set('.doc', 'application/msword')
MIME_TYPES_BY_EXT.set('.eot', 'application/vnd.ms-fontobject')
MIME_TYPES_BY_EXT.set('.ttf', 'application/x-font-ttf')

function createCustomServer() {
    return createServer(listenRequests).listen(SERVER_PORT)
}

function listenRequests(request: any, response: any) {
    let fileToRead = request.url ? request.url : '';
    console.log(`request on path ${fileToRead}`)

    if (request.url == '' || request.url == '/') {
        fileToRead = 'index.html'
    }

    var resolvedPath = path.resolve(__dirname, 'public', fileToRead.replace(FIRST_BAR_REGEX, ''))
    filesystem.readFile(resolvedPath, (_, data) => {
        let extension: string = path.parse(resolvedPath).ext
        let contentType = MIME_TYPES_BY_EXT.has(extension) ? MIME_TYPES_BY_EXT.get(extension) : 'text/plain'
        response.setHeader('Content-type', contentType)
        response.end(data)
    });
}

export { createCustomServer as createServer }