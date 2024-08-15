import { ref } from "vue";


function useCardDrag() {
  let isDragging = false;
  let offset = { x: 0, y: 0 };
  let position = ref({ x: 0, y: 0 })
  let draggedElement: HTMLElement | undefined;

  function startDrag(event: DragEvent) {
    console.log("aaaaaaaaaaaa");
    event.stopPropagation();
    event.preventDefault();

    isDragging = true;

    draggedElement = (event.target as HTMLElement);
    draggedElement.style.cursor = "grabbing";
    draggedElement.style.pointerEvents = "none";
    draggedElement.parentElement?.removeChild(draggedElement);
    document.body.appendChild(draggedElement);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);

    offset.x = event.clientX - position.value.x;
    offset.y = event.clientY - position.value.y;
  }

  function onDrag(event: MouseEvent) {
    if (isDragging) {
      position.value.x = event.clientX - offset.x;
      position.value.y = event.clientY - offset.y;
    }

    if (draggedElement) {
      draggedElement.style.left = `${position.value.x}px`;
      draggedElement.style.top = `${position.value.y}px`;
    }
  }

  function stopDrag(event: MouseEvent) {
    if (isDragging) {
      isDragging = false;

      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    }
  }

  function onDrop(event: MouseEvent) {
    console.log(draggedElement)
    if (isDragging && draggedElement) {

      const dropZone = (event.target as HTMLElement);
      dropZone.appendChild(draggedElement);

      draggedElement.style.cursor = "grab";
      draggedElement.style.position = "relative";
      draggedElement.style.left = "0px";
      draggedElement.style.top = "0px";
    }
  }

  function getReactivePosition() {
    return position;
  }

  return {
    startDrag,
    onDrop,
    getReactivePosition
  }
}

export { useCardDrag }