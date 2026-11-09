import 'phaser';
import { describe, expect, it, vi } from 'vitest';
import { GameLoad } from '@/scenes/GameLoad';
import { ApiException } from '@/api/models/ApiException';
import SessionSystem from '@/core/SessionSystem';

vi.mock('@/core/ResourceSystem', () => ({
    default: { registerDynamic: vi.fn() },
    IMAGE_XHR_SETTINGS: {}
}));

type LoadingScene = {
    closed: boolean;
    manifest?: unknown;
    downloadResources: () => Promise<string[]>;
    generateOverlays: () => void;
    finishLoading: () => Promise<void>;
    showFailure: (message: string) => void;
};

describe('GameLoad', () => {
    // UI-10, UI-12
    it('abandons the game with the reason when the server says it does not exist', () => {
        const abandonGame = vi.spyOn(SessionSystem, 'abandonGame').mockImplementation(() => undefined);
        const scene = { showFailure: vi.fn() };

        (GameLoad.prototype as unknown as { onFailure(error: unknown): void }).onFailure.call(scene, new ApiException('exception.game.not_found'));

        expect(abandonGame).toHaveBeenCalledWith('exception.game.not_found');
        expect(scene.showFailure).not.toHaveBeenCalled();
    });

    // LOAD-5
    it('does not confirm /ready when the game is cancelled during the download', async () => {
        const scene: LoadingScene = {
            closed: false,
            downloadResources: async () => {
                scene.closed = true;
                return [];
            },
            generateOverlays: vi.fn(),
            finishLoading: vi.fn(),
            showFailure: vi.fn()
        };

        await (GameLoad.prototype as unknown as { loadGame(manifest: unknown): Promise<void> }).loadGame.call(scene, { dynamic: [] });

        expect(scene.finishLoading).not.toHaveBeenCalled();
    });

    it('confirms /ready when the downloads end and the game was not cancelled', async () => {
        const scene: LoadingScene = {
            closed: false,
            downloadResources: async () => [],
            generateOverlays: vi.fn(),
            finishLoading: vi.fn(),
            showFailure: vi.fn()
        };

        await (GameLoad.prototype as unknown as { loadGame(manifest: unknown): Promise<void> }).loadGame.call(scene, { dynamic: [] });

        expect(scene.finishLoading).toHaveBeenCalledTimes(1);
    });
});
