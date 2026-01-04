import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const columns = [
  {
    accessorKey: 'image',
    header: 'Preview',
    cell: ({ row }) => (
      <div className="w-20 h-12 rounded-md overflow-hidden">
        <img 
          src={row.original.image} 
          alt={row.original.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.title}</span>
        <span className="text-sm text-gray-500 line-clamp-1">
          {row.original.description}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'outline'}>
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'order',
    header: 'Order',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {format(new Date(row.original.createdAt), 'MMM d, yyyy')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => row.original.actions,
  },
];
