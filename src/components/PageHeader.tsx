import { Link } from 'react-router-dom';

interface Props {
  title: string;
  action?: { label: string; to: string };
  backTo?: { label: string; to: string };
}

export default function PageHeader({ title, action, backTo }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {backTo && (
          <Link to={backTo.to} className="text-sm text-indigo-600 hover:underline mb-1 block">
            ← {backTo.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      {action && (
        <Link
          to={action.to}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
