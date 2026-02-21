const variants = {
  success: 'bg-green-50 text-green-700 ring-green-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  neutral: 'bg-gray-50 text-gray-700 ring-gray-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
}

export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
