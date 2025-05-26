// app/reservations/page.tsx
'use client';

import { useState } from 'react';
import { sampleReservations } from '@/lib/sample-data';
import ReservationKanban from '@/components/reservations/reservation-kanban';
import ReservationDetail from '@/components/reservations/reservation-detail';
import { Reservation } from '@/types';

export default function ReservationsPage() {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  return (
    <>
      <div className="animate-fade-in space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">Reservierungspipeline</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Gesamt: {sampleReservations.length} Reservierungen</span>
            </div>
          </div>
          
          <ReservationKanban 
            reservations={sampleReservations}
            onReservationClick={setSelectedReservation}
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