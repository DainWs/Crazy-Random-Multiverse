import type { Page, Route, WebSocketRoute } from '@playwright/test';
import type { ActionDto } from '@/api/dtos/ActionDto';
import type { CardDto } from '@/api/dtos/CardDto';
import type { EventDetailsDto, EventDto } from '@/api/dtos/EventDto';
import type { ResourceDto, ResourceManifestDto } from '@/api/dtos/ResourceManifestDto';
import type { GameEventCode } from '@/api/models/GameEventCode';
import type { PreparedGame } from '@/support/preparedGame';
import { fileURLToPath } from 'node:url';
import { cardImageKey } from '@/domain/ResourceKeys';
import { LOCAL_USER } from '@/support/preparedGame';

const SOCKET_URL = /\/socket\.io\//;
const ACTION_URL = /\/game\/[^/]+\/action$/;
const MANIFEST_URL = /\/game\/[^/]+\/resources$/;
const TEXTURE_URL = '**/resources/e2e/*';
const BACKEND_PATH = /^\/(game|party|register|user|resources|socket\.io)(\/|$)/;

const ENGINE_OPEN = `0${JSON.stringify({ sid: 'e2e-engine', upgrades: [], pingInterval: 25000, pingTimeout: 20000, maxPayload: 1000000 })}`;
const SOCKET_CONNECT = '40';
const SOCKET_CONNECTED = `40${JSON.stringify({ sid: 'e2e-socket' })}`;
const SOCKET_EVENT = '42';
const GAME_EVENT_CHANNEL = 'game:event';
const USER_SYNCED_CHANNEL = 'user:synced';
const GAME_SYNC_SEQUENCE = 10;

const NO_SESSION = { status: 400, json: { key: 'exception.user.not_found' } };
const TEXTURES_URL_PREFIX = '/resources/e2e/';
const TEXTURE_FILE_BY_KEY_PREFIX: Record<string, string> = { frame: 'frame.png', icon: 'icon.png', slot: 'slot.png' };
const ART_TEXTURE_FILE = 'art.png';

const FIXED_KEYS = [
    'icon.damage.physical',
    'icon.damage.magic',
    'icon.damage.true',
    'icon.armor.physical',
    'icon.armor.magic',
    'icon.health',
    'frame.common',
    'frame.uncommon',
    'frame.rare',
    'frame.epic',
    'frame.legendary',
    'frame.mythic',
    'frame.leader',
    'frame.equipment',
    'slot.warrior',
    'slot.leader',
    'card.unknown'
];

/** Plays the backend at the network boundary, so the application under test is the real one. */
class BackendDouble {
    public readonly actions: ActionDto[] = [];
    public readonly unexpectedRequests: string[] = [];

    private readonly page: Page;
    private socket?: WebSocketRoute;
    private prepared?: PreparedGame;
    private sequence = GAME_SYNC_SEQUENCE;

    public constructor(page: Page) {
        this.page = page;
    }

    /** Later routes take precedence in Playwright, so the catch-all goes first. */
    public async install(): Promise<void> {
        await this.page.route('**/*', (route) => this.handleUnknownRequest(route));
        await this.page.route('**/user', (route) => this.handleFindUser(route));
        await this.page.route('**/register', (route) => route.fulfill({ json: LOCAL_USER }));
        await this.page.route(MANIFEST_URL, (route) => route.fulfill({ json: this.createManifest() }));
        await this.page.route(ACTION_URL, (route) => this.handleAction(route));
        await this.page.route(TEXTURE_URL, (route) => this.handleTexture(route));
        await this.page.routeWebSocket(SOCKET_URL, (socket) => this.handleSocket(socket));
    }

    /** With a prepared game the client finds a session and enters the game in progress (CON-23, LOAD-6). */
    public prepare(prepared: PreparedGame): void {
        this.prepared = prepared;
    }

    public emitGameEvent(code: GameEventCode, details: EventDetailsDto): void {
        this.sequence += 1;
        this.emitEvent({ code, sequence: this.sequence, details });
    }

    private handleUnknownRequest(route: Route) {
        const url = new URL(route.request().url());
        if (url.hostname === 'localhost' && !BACKEND_PATH.test(url.pathname)) {
            return route.continue();
        }

        this.unexpectedRequests.push(`${route.request().method()} ${url.pathname}`);
        return route.abort();
    }

    private handleFindUser(route: Route) {
        return this.prepared ? route.fulfill({ json: this.prepared.user }) : route.fulfill(NO_SESSION);
    }

    private handleAction(route: Route) {
        this.actions.push(route.request().postDataJSON() as ActionDto);
        return route.fulfill({ status: 200 });
    }

    private handleTexture(route: Route) {
        const key = new URL(route.request().url()).pathname.replace(TEXTURES_URL_PREFIX, '');
        const file = TEXTURE_FILE_BY_KEY_PREFIX[key.split('.')[0]] ?? ART_TEXTURE_FILE;

        return route.fulfill({ path: fileURLToPath(new URL(`../fixtures/textures/${file}`, import.meta.url)) });
    }

    private createManifest(): ResourceManifestDto {
        const cards = this.collectCards();
        const dynamicKeys = cards.map((card) => cardImageKey(card.type, card.catalogCode.code, card.rarity));

        return { fixed: FIXED_KEYS.map(createResource), dynamic: [...new Set(dynamicKeys)].map(createResource) };
    }

    private collectCards(): CardDto[] {
        const { game, hand } = this.prepared!;
        const slots = game.zones.flatMap((zone) => zone.combatants.flat());
        const combatants = slots.flatMap((slot) => (slot.combatant ? [slot.combatant] : []));

        return [...combatants, ...hand];
    }

    private handleSocket(socket: WebSocketRoute) {
        this.socket = socket;
        socket.onMessage((message) => this.handleSocketMessage(String(message)));
        socket.send(ENGINE_OPEN);
    }

    private handleSocketMessage(message: string) {
        if (message.startsWith(SOCKET_CONNECT)) {
            this.socket!.send(SOCKET_CONNECTED);
            this.sendConnectionState();
        }
    }

    private sendConnectionState() {
        if (this.prepared) {
            const { game, hand } = this.prepared;
            this.emitEvent({ code: 'GAME_SYNC', sequence: GAME_SYNC_SEQUENCE, details: { game, hand } });
        }

        this.socket!.send(`${SOCKET_EVENT}${JSON.stringify([USER_SYNCED_CHANNEL])}`);
    }

    private emitEvent(event: EventDto) {
        this.socket!.send(`${SOCKET_EVENT}${JSON.stringify([GAME_EVENT_CHANNEL, event])}`);
    }
}

function createResource(key: string): ResourceDto {
    return { key, type: 'IMAGE', url: `${TEXTURES_URL_PREFIX}${key}` };
}

export default BackendDouble;
