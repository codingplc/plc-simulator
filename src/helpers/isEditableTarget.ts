/**
 * Returns true when a keyboard event originated inside a text entry control.
 *
 * Delete key handlers are attached to containers (the desktop grid, variable
 * table rows) and receive events that bubbled up from the inputs nested inside
 * them. Without this guard, editing a variable name or value with the Delete
 * key also deletes the selected rung or variable.
 */
export default function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tagName = target.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
}
