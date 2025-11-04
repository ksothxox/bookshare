import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { supabase } from '../lib/supabase';

type Row = { id: string; title: string; authors: string[] | null; cover_url: string | null; isbn: string; username: string; display_name: string | null };

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const username = ctx.params?.username as string;
  const { data, error } = await supabase.from('public_books_view').select('*').eq('username', username);
  if (error) return { notFound: true };
  return { props: { username, rows: data || [] } };
};

export default function Page({ username, rows }: { username: string; rows: Row[] }) {
  const display = rows[0]?.display_name || username;
  return (
    <>
      <Head><title>{display}'s Library</title></Head>
      <main style={{ maxWidth: 1040, margin: '24px auto', padding: 16 }}>
        <h1 style={{ marginBottom: 16 }}>{display}'s Library</h1>
        {rows.length === 0 ? <p>No public books yet.</p> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
            {rows.map(b => (
              <div key={b.id} style={{ border:'1px solid #e5e7eb', borderRadius: 12, overflow:'hidden' }}>
                {b.cover_url ? <img src={b.cover_url} style={{ width:'100%', aspectRatio:'2/3', objectFit:'cover' }} /> : <div style={{ width:'100%', aspectRatio:'2/3', display:'grid', placeItems:'center' }}>No Cover</div>}
                <div style={{ padding: 8 }}>
                  <div style={{ fontWeight:700 }}>{b.title}</div>
                  {b.authors?.length ? <div style={{ color:'#6b7280', fontSize:12 }}>{b.authors.join(', ')}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
