import { Entity } from "./Entity";

export const getNextId = <T extends Entity<any>>(entities: T[]) =>
  1 + Math.max(0, ...entities.map((wing) => wing.getIdentity() || 0));
