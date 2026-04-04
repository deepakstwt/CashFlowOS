interface RoleBadgeProps {
  role: string;
}

const roleConfig: Record<string, { bg: string; text: string; dot: string }> = {
  admin:    { bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-400' },
  analyst:  { bg: 'bg-violet-50', text: 'text-violet-600', dot: 'bg-violet-400' },
  viewer:   { bg: 'bg-gray-100',  text: 'text-gray-500',   dot: 'bg-gray-400' },
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role?.toLowerCase()] ?? roleConfig.viewer;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {role}
    </span>
  );
}
