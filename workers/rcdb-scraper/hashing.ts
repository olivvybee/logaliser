import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { Entity } from './urls';

export interface Hashable {
  id: number;
}

type Hashes = Record<number, string>;

export const findChangedItems = <T extends Hashable>(
  items: T[],
  entity: Entity
) => {
  const existingHashes = loadHashes(entity);

  const newHashes: Hashes = items.reduce(
    (processed, item) => ({
      ...processed,
      [item.id]: calculateHash(item),
    }),
    {}
  );

  const hashes = {
    ...existingHashes,
    ...newHashes,
  };

  const changedIds = Object.keys(newHashes)
    .map((id) => parseInt(id))
    .filter((id) => existingHashes[id] !== newHashes[id]);

  return { changedIds, hashes };
};

const getExportPath = (entity: Entity) =>
  path.resolve('.', `hashes-${entity}.json`);

const calculateHash = <T extends Hashable>(item: T) => {
  const { id, ...dataWithoutId } = item;
  const dataAsString = JSON.stringify(dataWithoutId);
  return crypto.createHash('md5').update(dataAsString).digest('hex');
};

const loadHashes = (entity: Entity): Hashes => {
  const exportPath = getExportPath(entity);
  if (fs.existsSync(exportPath)) {
    const contents = fs.readFileSync(exportPath, 'utf-8');
    return JSON.parse(contents);
  }
  return {};
};

export const exportHashes = (hashes: Hashes, entity: Entity) => {
  const exportPath = getExportPath(entity);
  fs.writeFileSync(exportPath, JSON.stringify(hashes, null, 2));
};
