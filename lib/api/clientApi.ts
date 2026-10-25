import { api } from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

// ---------- Notes ----------

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response = await api.post<Note>('/notes', payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

// ---------- Auth ----------

export interface AuthRequest {
  email: string;
  password: string;
}

export const register = async (data: AuthRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: AuthRequest): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// 200 без тела = пользователь не авторизован, тогда вернём null
export const checkSession = async (): Promise<User | null> => {
  const response = await api.get<User | ''>('/auth/session');
  return response.data || null;
};

// ---------- User ----------

export interface UpdateMePayload {
  username: string;
}

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (payload: UpdateMePayload): Promise<User> => {
  const response = await api.patch<User>('/users/me', payload);
  return response.data;
};
