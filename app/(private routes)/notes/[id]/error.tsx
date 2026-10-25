'use client';

// app/notes/[id]/error.tsx

type Props = {
  error: Error;
  reset: () => void;
};

const NoteError = ({ error, reset }: Props) => {
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

export default NoteError;
