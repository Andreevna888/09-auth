import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';

const getCookieHeaders = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: await getCookieHeaders(),
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: await getCookieHeaders(),
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me', {
    headers: await getCookieHeaders(),
  });
  return response.data;
};

// возвращаем полный ответ: proxy будет читать из него set-cookie
export const checkSession = async () => {
  return api.get('/auth/session', {
    headers: await getCookieHeaders(),
  });
};
