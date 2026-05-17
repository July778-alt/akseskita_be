/**
 * Simple pagination helper for calculating limit and offset
 */

export const ADMIN_PAGE_LIMIT = 10;
export const PUBLIC_PAGE_LIMIT = 12;

export function getPagination(page = 1, limit = ADMIN_PAGE_LIMIT) {
  const p = page > 0 ? page : 1;
  const l = limit > 0 ? limit : ADMIN_PAGE_LIMIT;
  const offset = (p - 1) * l;
  return { limit: l, offset };
}

export function getPaginationUsersList(page = 1, limit = PUBLIC_PAGE_LIMIT) {
  const p = page > 0 ? page : 1;
  const l = limit > 0 ? limit : PUBLIC_PAGE_LIMIT;
  const offset = (p - 1) * l;
  return { limit: l, offset };
}