---
id: IDEA-006
title: Health after the hit
status: accepted
date: 2026-11-21
rules: []
phase: null
---

# IDEA-006 — Health after the hit

## Problem or opportunity

Before attacking, the player cannot see what the attack would take from the target.

## Proposal

Proposal 49 of the 50 of 2026-11-21. With an attacker selected (`VIEW-4`) and the pointer over a valid target, the part of the target's bar (`IDEA-002`) that the attack would take is drawn striped in red. It follows the rules of combat: the attack takes armor or health, never both (`COMBAT-2` to `COMBAT-4`), so with armor of the type of the damage only the armor changes and the bar is not striped. The client computes it from the values it has, without changing the state (`UI-6`).

## Open questions

- **[OPEN]** Whether the keyboard (`UI-32`, `VIEW-42`) shows it too when it puts the focus on a target.

## Decision

Chosen by the product owner on 2026-11-21. It depends on `IDEA-002`.
