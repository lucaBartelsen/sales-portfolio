// app/reservations/page.tsx
'use client';

import { useState } from 'react';
import { sampleReservations } from '@/lib/sample-data';
import ReservationKanban from '@/components/reservations/reservation-kanban';
import ReservationDetail from '@/components/reservations/reservation-detail';
import { Reservation } from '@/types';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(sampleReservations);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const handleStatusChange = (reservationId: number, newStatus: Reservation['status']) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: newStatus }
          : reservation
      )
    );
    
    // Show success notification (you could use a toast library here)
    console.log(`Reservation ${reservationId} moved to ${newStatus}`);
  };

  return (
    <>
      <div className="animate-fade-in space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">Reservierungspipeline</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Drag & Drop zum Ändern des Status</span>
              </div>
              <span>Gesamt: {reservations.length} Reservierungen</span>
            </div>
          </div>
          
          <ReservationKanban 
            reservations={reservations}
            onReservationClick={setSelectedReservation}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {selectedReservation && (
        <ReservationDetail
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </>
  );
}