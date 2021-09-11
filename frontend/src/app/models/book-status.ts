export type BookStatus =
  | 'AVAILABLE'
  | 'BORROWED'
  | 'RETURNED'
  | 'DAMAGED'
  | 'PROCESSING';

export const BOOK_STATUSES = [
  'AVAILABLE',
  'BORROWED',
  'RETURNED',
  'DAMAGED',
  'PROCESSING',
];
