export type BookMeta = {
  isbn: string;
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedYear?: string;
  pageCount?: number;
  coverUrl?: string;
};

export async function fetchBookByISBN(isbn: string): Promise<BookMeta | null> {
  const clean = isbn.replace(/[^0-9Xx]/g, '');
  try {
    const res = await fetch(`https://openlibrary.org/isbn/${clean}.json`);
    if (res.ok) {
      const data = await res.json();
      const coverUrl = `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`;
      const title = data.title;
      let authors: string[] | undefined = undefined;
      if (Array.isArray(data.authors)) {
        authors = await Promise.all(
          data.authors.map(async (a: any) => {
            try {
              const ar = await fetch(`https://openlibrary.org${a.key}.json`);
              return ar.ok ? (await ar.json()).name : undefined;
            } catch { return undefined; }
          })
        );
        authors = authors.filter(Boolean) as string[];
      }
      return { isbn: clean, title, authors, coverUrl };
    }
  } catch {}
  try {
    const r2 = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${clean}`);
    if (r2.ok) {
      const j = await r2.json();
      const v = j.items?.[0]?.volumeInfo;
      if (v) {
        return {
          isbn: clean,
          title: v.title,
          authors: v.authors,
          publisher: v.publisher,
          publishedYear: v.publishedDate?.slice(0, 4),
          pageCount: v.pageCount,
          coverUrl: v.imageLinks?.thumbnail?.replace('http://', 'https://'),
        };
      }
    }
  } catch {}
  return null;
}
