import html2canvas from "html2canvas";

const useAction = () => {
  async function grab(event: DragEvent) {
    console.log("captured");

    const dragCopy = (event.target as any).cloneNode(true);
    dragCopy.style.position = "absolute";
    dragCopy.style.top = "-9999px"; // Coloca fuera de la vista
    document.body.appendChild(dragCopy);

    console.log(event.dataTransfer)
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setDragImage(dragCopy, 0, 0);
    }
  }

  function drag(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  return {
    grab,
    drag,
    drop
  };
}

export { useAction };