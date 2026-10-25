'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

const NotePreviewClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading, please wait...</p>}

      {!isLoading && error && <p>Something went wrong.</p>}

      {!isLoading && !error && !note && <p>Note not found.</p>}

      {note && (
        <div className={css.container}>
          <button type="button" className={css.backBtn} onClick={handleClose}>
            Back
          </button>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.updatedAt ?? note.createdAt}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default NotePreviewClient;
