<script setup lang="ts">
import type { LegendMark } from '@/game/hud/HelpLegendLayout';
import { onMounted, onUnmounted } from 'vue';
import EffectSettings from '@/core/EffectSettings';
import SettingsSystem from '@/core/SettingsSystem';
import { getText } from '@/core/Texts';
import { LEGEND_MARKS, sampleFrame, sampleShapes, svgPoints } from '@/game/hud/HelpLegendLayout';
import { createFocusTrapRef } from '@/views/FocusTrap';

const CLOSE_KEY = 'Escape';

const LEGEND_TEXT_KEYS = new Map<LegendMark, string>([
    ['OWN_ZONE', 'ui.help.mark.own_zone'],
    ['READY', 'ui.help.mark.ready'],
    ['TURN', 'ui.help.mark.turn'],
    ['VALID_SLOT', 'ui.help.mark.valid_slot'],
    ['SOURCE', 'ui.help.mark.source'],
    ['VALID_TARGET', 'ui.help.mark.valid_target'],
    ['INVALID_TARGET', 'ui.help.mark.invalid_target'],
    ['ELIMINATED', 'ui.help.mark.eliminated']
]);

/** The paragraphs of the rules, in their order (UI-35). */
const RULE_TEXT_KEYS: readonly string[] = [
    'ui.help.rules.goal',
    'ui.help.rules.turn',
    'ui.help.rules.placing',
    'ui.help.rules.attacking',
    'ui.help.rules.protection',
    'ui.help.rules.elimination'
];

const helpOpen = SettingsSystem.helpOpen;
const trapFocus = createFocusTrapRef();
const frame = sampleFrame();
const signalsShown = EffectSettings.extraMarksAreOn();
const rows = LEGEND_MARKS.map((mark) => ({ mark, textKey: LEGEND_TEXT_KEYS.get(mark)!, shapes: sampleShapes(mark) }));

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === CLOSE_KEY && helpOpen.value) {
        SettingsSystem.closeHelp();
    }
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown);
    SettingsSystem.closeHelp();
});
</script>

<template>
    <div v-if="helpOpen" class="help-veil" @click.self="SettingsSystem.closeHelp()">
        <section :ref="trapFocus" class="help-panel" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <h2 id="help-title">{{ getText('ui.help.title') }}</h2>
            <div class="help-panel__sections">
                <section aria-labelledby="help-marks">
                    <h3 id="help-marks">{{ getText('ui.help.marks') }}</h3>
                    <ul class="help-legend">
                        <li v-for="row in rows" :key="row.mark" class="help-legend__row">
                            <svg :viewBox="frame.viewBox" :width="frame.width" :height="frame.height" aria-hidden="true">
                                <template v-for="(shape, index) in row.shapes" :key="index">
                                    <polygon
                                        v-if="shape.kind === 'POLYGON'"
                                        :points="svgPoints(shape.points)"
                                        :fill="shape.fill"
                                        :fill-opacity="shape.fillOpacity"
                                        :stroke="shape.stroke"
                                        :stroke-opacity="shape.strokeOpacity"
                                        :stroke-width="shape.strokeWidth"
                                    />
                                    <template v-else-if="shape.kind === 'LINES'">
                                        <polyline
                                            v-for="(path, pathIndex) in shape.paths"
                                            :key="pathIndex"
                                            :points="svgPoints(path)"
                                            fill="none"
                                            :stroke="shape.stroke"
                                            :stroke-width="shape.strokeWidth"
                                        />
                                    </template>
                                    <circle
                                        v-else
                                        :cx="shape.center.x"
                                        :cy="shape.center.y"
                                        :r="shape.radius"
                                        :fill="shape.fill"
                                        :stroke="shape.stroke"
                                        :stroke-width="shape.strokeWidth"
                                    />
                                </template>
                            </svg>
                            <div class="help-legend__texts">
                                <p class="help-legend__name">{{ getText(`${row.textKey}.name`) }}</p>
                                <p>{{ getText('ui.help.color') }} {{ getText(`${row.textKey}.color`) }}</p>
                                <p v-if="signalsShown">{{ getText('ui.help.signal') }} {{ getText(`${row.textKey}.signal`) }}</p>
                                <p>{{ getText(`${row.textKey}.meaning`) }}</p>
                            </div>
                        </li>
                    </ul>
                </section>
                <section aria-labelledby="help-rules">
                    <h3 id="help-rules">{{ getText('ui.help.rules') }}</h3>
                    <p v-for="ruleKey in RULE_TEXT_KEYS" :key="ruleKey" class="help-rules__paragraph">
                        <strong>{{ getText(`${ruleKey}.title`) }}</strong> {{ getText(`${ruleKey}.text`) }}
                    </p>
                </section>
            </div>
            <button type="button" class="help-panel__close" @click="SettingsSystem.closeHelp()">
                {{ getText('ui.help.close') }}
            </button>
        </section>
    </div>
</template>

<style scoped>
.help-veil {
    position: fixed;
    inset: 0;
    z-index: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--veil-background);
    color: var(--text-color);
}

.help-panel {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 720px;
    max-height: 90vh;
    padding: 24px 32px;
    border: 2px solid var(--panel-border);
    border-radius: 8px;
    background: var(--panel-background);
    font-family: var(--ui-font);
    font-size: 18px;
    outline: none;
}

.help-panel h2,
.help-panel h3 {
    margin: 0 0 16px;
    font-size: 24px;
    font-weight: bold;
}

.help-panel__sections {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
}

.help-legend {
    margin: 0 0 24px;
    padding: 0;
    list-style: none;
}

.help-legend__row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
}

.help-legend__row svg {
    flex: none;
}

.help-legend__texts p {
    margin: 0;
}

.help-rules__paragraph {
    margin: 0 0 12px;
}

.help-legend__name {
    font-weight: bold;
}

.help-panel__close {
    align-self: flex-end;
    margin-top: 16px;
    padding: 6px 12px;
    border: none;
    background: var(--button-background);
    color: var(--text-color);
    font-family: var(--ui-font);
    font-size: 24px;
    cursor: pointer;
}

.help-panel__close:hover {
    background: var(--button-hover-background);
}
</style>
