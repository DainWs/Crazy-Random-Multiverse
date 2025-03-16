import { EmitFn } from "vue";
import mouseClickDispatcher from "@/services/dom/MouseClickDispatcher";

function useClickEventWrapper(elementId: string, emit: EmitFn) {
  
  async function handleMouseEvent(event: MouseEvent) {
    const mouseClickType = await mouseClickDispatcher.dispatch(event);
    const currentTarget = document.getElementById(elementId);
    if (mouseClickType == 'Grab') emit('grab', { ...event, currentTarget });
    if (mouseClickType == 'SimpleClick') emit('simpleClick', { ...event, currentTarget });
    if (mouseClickType == 'DoubleClick') emit('doubleClick', { ...event, currentTarget });
  }

  return { handleMouseEvent };
}

export default useClickEventWrapper;