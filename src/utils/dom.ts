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
