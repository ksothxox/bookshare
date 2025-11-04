export type Shelf = { id: string; name: string; is_private?: boolean; user_id: string; created_at: string };
export type Book = {
  id: string; user_id: string; isbn: string; title: string; authors: string[] | null;
  cover_url: string | null; shelf_id: string | null; position?: number | null; created_at: string; notes: string | null;
};
export type Friend = { id: string; user_id: string; friend_user_id: string; status: 'pending'|'accepted'|'blocked'; created_at: string };
export type BorrowRequest = { id: string; owner_id: string; borrower_id: string; book_id: string; status: 'pending'|'approved'|'declined'|'returned'; created_at: string };
