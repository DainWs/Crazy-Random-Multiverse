# 🚀 Roadmap MVP (Mínimo Producto Viable) - CRM Game

Este documento se centra exclusivamente en las funcionalidades críticas para tener una versión jugable y funcional del juego.

## 🎯 Objetivo del MVP
Lograr un bucle de juego completo: **Reparto -> Posicionamiento -> Combate -> Victoria/Derrota.**

---

## 1. ⚔️ Interacción de Combate y Feedback
*El frontend debe permitir emitir órdenes y reaccionar a los resultados del servidor.*

- [ ] **Emisión de Ataque**: Implementar la capacidad de seleccionar una carta propia y marcar un objetivo enemigo.
    - [ ] UI de "Targeting": Flecha visual o resaltado de objetivo al arrastrar.
    - [ ] Envío del evento de ataque al backend (ActionSystem).
- [ ] **Procesamiento de Resultados**:
    - [ ] Actualizar dinámicamente Vida/Armadura cuando el servidor envíe el evento de daño.
    - [ ] Mostrar animaciones de "Hit" basadas en la respuesta del backend.
- [ ] **Gestión de Estados de Partida**:
    - [ ] Escuchar el evento de "Victoria/Derrota" del servidor para mostrar la pantalla de Game Over.

## 2. 📡 Comunicación en Tiempo Real (WebSockets/STOMP)
*El frontend es una ventana al estado del servidor.*

- [ ] **Sincronización de Acciones Oponentes**: 
    - [ ] Implementar la escucha de movimientos de cartas del rival y animarlos en el tablero local.
    - [ ] Reflejar el cambio de turno cuando el servidor lo indique.
- [ ] **Recepción de Mano/Ronda**:
    - [ ] Actualizar la vista de la mano (`HandView`) basándose exclusivamente en los datos de cartas enviados por el servidor al inicio de ronda.

## 3. 🖼️ UI/UX Crítica (Feedback Visual)
*El jugador debe entender qué está pasando.*

- [ ] **Indicadores de Estado**: 
    - [ ] Mostrar claramente de quién es el turno.
    - [ ] Actualización inmediata de los números de Vida/Armadura en las cartas al recibir daño.
- [ ] **Feedback de Ataque**: Una animación simple (sacudida o destello rojo) para indicar que una carta ha sido golpeada.
- [ ] **Corrección de Zonas**: Arreglar el bug de `hasLeaderInBoard` para que las reglas de protección funcionen correctamente desde el día 1.

## 4. 📦 Activos y Estabilidad
- [ ] **Set de Cartas Base**: Tener al menos 1 Líder y 3 tipos de Guerreros funcionalmente distintos (Pop, Common, Rare) con sus texturas.
- [ ] **Estabilidad de Cámara**: Asegurar que el zoom/pan no rompa la interacción con las cartas (prioridad técnica).

---

## 📅 Fuera del MVP (Post-MVP)
*Estas funciones se desarrollarán una vez el núcleo sea sólido:*
- Hechizos y Equipamiento complejo.
- Estadísticas Infinitas y Daño Verdadero.
- Sistema de IA avanzado.
- Log de combate y localización dinámica.
- Animaciones premium (partículas, efectos especiales).

---
*Última actualización: 10 de Mayo de 2026*
