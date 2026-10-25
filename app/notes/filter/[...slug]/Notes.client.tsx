'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import css from './NotesPage.module.css';

interface NotesClientProps {
  tag?: NoteTag;
}

const NotesClient = ({ tag }: NotesClientProps) => {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search, tag],
    queryFn: () => fetchNotes({ page, perPage: 12, search, tag }),
    placeholderData: keepPreviousData,
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearch = (value: string) => {
    setInputValue(value);
    debouncedSetSearch(value);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination pageCount={data.totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>Something went wrong while loading notes. Please try again.</p>}

      {!isLoading && !isError && data && data.notes.length === 0 && <p>No notes found.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
};

export default NotesClient;
