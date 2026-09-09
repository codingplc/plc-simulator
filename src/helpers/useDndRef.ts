import { useCallback } from 'react';
import type { ConnectDragSource, ConnectDropTarget, ConnectableElement } from 'react-dnd';

/**
 * React 19 lets a ref callback return a cleanup function, so a callback that
 * returns anything else no longer type-checks as a ref. react-dnd's connectors
 * return `ReactElement | null`, which collides with that.
 *
 * react-dnd 16.0.1 is its last release (June 2022) and is not going to be
 * updated, so wrap the connector in a callback that returns void. useCallback
 * keeps the ref identity stable, otherwise React detaches and reattaches the
 * drag source on every render.
 */
export default function useDndRef(connector: ConnectDragSource | ConnectDropTarget) {
  return useCallback(
    (node: HTMLElement | null) => {
      connector(node as ConnectableElement);
    },
    [connector],
  );
}
