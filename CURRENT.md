# Resumen de Cambios Recientes (Cámara e Interfaz)

Se han implementado mejoras significativas en el sistema de cámara y en la disposición de la mano del jugador para mejorar la experiencia de juego.

## 1. Sistema de Cámara (Estilo LoL/MOBA)
- **Zoom**: Controlado por la rueda del ratón.
  - Constantes añadidas: `CAMERA_MIN_ZOOM` (0.2), `CAMERA_MAX_ZOOM` (1.5), `CAMERA_ZOOM_STEP` (0.15).
- **Arrastre Manual (Drag-to-pan)**:
  - Se puede mover la cámara manteniendo presionado el **Botón Central (Rueda)** o el **Botón Derecho**.
  - Se ha desactivado el menú contextual del navegador dentro del juego para facilitar el uso del clic derecho.
- **Edge Panning (Opcional)**: Se implementó inicialmente el movimiento al acercar el ratón a los bordes, pero se eliminó por petición del usuario para evitar interferencias.

## 2. Interfaz de la Mano (HandView)
- **Fijación a la Cámara**: La mano del jugador ahora permanece siempre visible en la pantalla, ignorando el movimiento y el zoom de la cámara.
  - Implementado mediante `setScrollFactor(0)` en el contenedor de la mano y en las cartas individuales.
  - Al jugar una carta (sacarla de la mano), su `scrollFactor` vuelve a `1` para integrarse en el tablero.
- **Posicionamiento**:
  - La mano se sitúa exactamente en la **esquina inferior izquierda** de la pantalla.
  - Se utiliza `HandLayoutHelper` para calcular posiciones basadas en las dimensiones de la cámara (`viewport`), asegurando que la primera carta toque el borde izquierdo y el fondo toque el borde inferior.

## Archivos Modificados
- `frontend/src/core/Constants.ts`: Definición de límites y velocidades de cámara.
- `frontend/src/core/CameraSystem.ts`: Lógica de zoom y arrastre.
- `frontend/src/scenes/Game.ts`: Integración de la actualización de cámara.
- `frontend/src/game/hand/HandView.ts`: Gestión del `scrollFactor` y ciclo de vida de las cartas en mano.
- `frontend/src/game/hand/HandLayoutHelper.ts`: Cálculo de coordenadas de pantalla para la mano.
