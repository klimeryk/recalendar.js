import { arrayMove } from '@dnd-kit/sortable';

import { byId, wrapWithId } from '~/lib/id-utils';

export function addItem(items, item) {
  return [...items, wrapWithId(item)];
}

export function updateItem(items, id, changes) {
  const index = items.findIndex(byId(id));
  if (index === -1) {
    return items;
  }

  return items.with(index, { ...items[index], ...changes });
}

export function removeItem(items, id) {
  const index = items.findIndex(byId(id));
  if (index === -1) {
    return items;
  }

  return items.toSpliced(index, 1);
}

export function moveItem(items, oldId, newId) {
  const oldIndex = items.findIndex(byId(oldId));
  const newIndex = items.findIndex(byId(newId));
  if (oldIndex === -1 || newIndex === -1) {
    return items;
  }

  return arrayMove(items, oldIndex, newIndex);
}

export function cloneItems(items) {
  return items.map(({ id, ...item }) => wrapWithId(item));
}
