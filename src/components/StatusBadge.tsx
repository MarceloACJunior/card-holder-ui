interface Props {
  value: string | boolean;
}

const styles: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-600',
  true: 'bg-green-100 text-green-800',
  false: 'bg-red-100 text-red-800',
};

const labels: Record<string, string> = {
  ACTIVE: 'ATIVO',
  INACTIVE: 'INATIVO',
  true: 'APROVADO',
  false: 'REPROVADO',
};

export default function StatusBadge({ value }: Props) {
  const key = String(value);
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${styles[key] ?? 'bg-gray-100 text-gray-700'}`}>
      {labels[key] ?? key}
    </span>
  );
}
