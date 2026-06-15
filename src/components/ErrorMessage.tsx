import axios from 'axios';

interface Props {
  error: unknown;
}

export default function ErrorMessage({ error }: Props) {
  let message = 'Ocorreu um erro inesperado.';
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail ?? error.response?.data?.message;
    message = detail ?? error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
      {message}
    </div>
  );
}
