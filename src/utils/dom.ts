export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirmOverlay";

    const modal = document.createElement("div");
    modal.className = "confirmModal";

    const text = document.createElement("div");
    text.textContent = message;

    const actions = document.createElement("div");
    actions.className = "confirmActions";

    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";

    const ok = document.createElement("button");
    ok.textContent = "Delete";

    cancel.onclick = () => {
      overlay.remove();
      resolve(false);
    };

    ok.onclick = () => {
      overlay.remove();
      resolve(true);
    };

    actions.append(ok, cancel);
    modal.append(text, actions);
    overlay.append(modal);

    document.body.append(overlay);
  });
}

export function enableDragScroll(container: HTMLElement) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const isInteractiveTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;

    return Boolean(
        target.closest(
            ".task, button, input, textarea, [contenteditable='true'], .draggableZone",
        ),
    );
  };

  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    if (isInteractiveTarget(e.target)) return;

    isDown = true;
    container.classList.add("grab-scrolling");

    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;

    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown) return;

    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;

    container.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => {
    isDown = false;
    container.classList.remove("grab-scrolling");
  };

  container.addEventListener("mousedown", onMouseDown);
  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseleave", stopDragging);
  container.addEventListener("mouseup", stopDragging);
}
