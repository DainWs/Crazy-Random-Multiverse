import 'phaser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Preloader } from '@/scenes/Preloader';

describe('Preloader', () => {
    describe('create', () => {
        let stop: ReturnType<typeof vi.fn>;
        let fakeScene: Preloader;

        beforeEach(() => {
            stop = vi.fn();
            fakeScene = { game: { events: { emit: vi.fn() } }, scene: { stop } } as unknown as Preloader;
        });

        it('stops the scene after loading', () => {
            Preloader.prototype.create.call(fakeScene);

            expect(stop).toHaveBeenCalledOnce();
        });
    });
});
