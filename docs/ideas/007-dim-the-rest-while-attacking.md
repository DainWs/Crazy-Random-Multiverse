---
id: IDEA-007
title: Dim the rest while attacking
status: accepted
date: 2026-11-22
rules: [VIEW-4, UI-33]
phase: Pending tasks
---

# IDEA-007 — Dim the rest while attacking

## Problem or opportunity

The card selected to attack has to stand out more from the board than its lift alone (`VIEW-4`).

## Proposal

An option "Atenuar el resto al atacar" in the settings screen (`UI-33`), off by default. While a card is selected, every card of the board that is not the selected one nor a valid target (`UI-5`) is drawn at 40% opacity.

## Open questions

None. The product owner sees the 40% opacity before the pending task is closed.

## Decision

Chosen by the product owner on 2026-11-22, and specified in `docs/specs/ui/effects/combat-attack.md` (`VIEW-4`). Rejected the same day for the selected card: a steady halo, a breathing halo and a float.
