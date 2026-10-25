import type { Metadata } from 'next';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const isAll = slug[0] === 'all';
  const title = `Notes - ${isAll ? 'All Tags' : slug[0]}`;
  const description = `Browse notes tagged with ${
    isAll ? 'all tags' : slug[0]
  }. NoteHub allows you to filter and view notes based on specific tags for better organization.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${slug.join('/')}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${title} | NoteHub`,
        },
      ],
    },
  };
}

const Notes = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : (slug[0] as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default Notes;
