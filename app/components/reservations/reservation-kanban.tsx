// app/components/reservations/reservation-kanban.tsx
import { Reservation } from '@/types';

interface ReservationKanbanProps {
  reservations: Reservation[];
  onReservationClick: (reservation: Reservation) => void;
}

const statusColumns = [
  { key: 'Angefragt', label: 'Angefragt', color: 'bg-blue-100 text-blue-800' },
  { key: 'Reserviert', label: 'Reserviert', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'Notarvorbereitung', label: 'Notarvorbereitung', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'Notartermin', label: 'Notartermin', color: 'bg-purple-100 text-purple-800' },
  { key: 'Verkauft', label: 'Verkauft', color: 'bg-green-100 text-green-800' },
  { key: 'Abgebrochen', label: 'Abgebrochen', color: 'bg-red-100 text-red-800' }
];

export default function ReservationKanban({ reservations, onReservationClick }: ReservationKanbanProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {statusColumns.map(column => {
        const columnReservations = reservations.filter(r => r.status === column.key);
        
        return (
          <div key={column.key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">{column.label}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{columnReservations.length}</span>
            </div>
            
            <div className="space-y-3">
              {columnReservations.map(reservation => (
                <div 
                  key={reservation.id} 
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onReservationClick(reservation)}
                >
                  <p className="font-medium text-sm dark:text-white mb-1">{reservation.property}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{reservation.buyer}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${column.color}`}>
                      {reservation.status}
                    </span>
                    <p className="text-xs text-gray-400">{new Date(reservation.date).toLocaleDateString('de-DE')}</p>
                  </div>
                  {reservation.notar_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Notar: {new Date(reservation.notar_date).toLocaleDateString('de-DE')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}