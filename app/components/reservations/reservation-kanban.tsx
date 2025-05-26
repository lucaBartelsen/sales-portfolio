// app/components/reservations/reservation-kanban.tsx
'use client';

import { useState } from 'react';
import { Reservation } from '@/types';

interface ReservationKanbanProps {
  reservations: Reservation[];
  onReservationClick: (reservation: Reservation) => void;
  onStatusChange?: (reservationId: number, newStatus: Reservation['status']) => void;
}

const statusColumns = [
  { key: 'Angefragt', label: 'Angefragt', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  { key: 'Reserviert', label: 'Reserviert', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { key: 'Notarvorbereitung', label: 'Notarvorbereitung', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' },
  { key: 'Notartermin', label: 'Notartermin', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
  { key: 'Verkauft', label: 'Verkauft', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { key: 'Abgebrochen', label: 'Abgebrochen', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
];

export default function ReservationKanban({ reservations, onReservationClick, onStatusChange }: ReservationKanbanProps) {
  const [draggedItem, setDraggedItem] = useState<Reservation | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, reservation: Reservation) => {
    setDraggedItem(reservation);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.dataTransfer.setDragImage(e.currentTarget as Element, 0, 0);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear drag over state if we're leaving the column entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem && draggedItem.status !== columnKey && onStatusChange) {
      onStatusChange(draggedItem.id, columnKey as Reservation['status']);
    }
    
    setDraggedItem(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {statusColumns.map(column => {
        const columnReservations = reservations.filter(r => r.status === column.key);
        const isDragOver = dragOverColumn === column.key;
        const canDrop = draggedItem && draggedItem.status !== column.key;
        
        return (
          <div 
            key={column.key} 
            className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[400px] transition-colors ${
              isDragOver && canDrop ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300 dark:ring-blue-600' : ''
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.key)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">{column.label}</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                columnReservations.length > 0 
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {columnReservations.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {columnReservations.map(reservation => (
                <div 
                  key={reservation.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, reservation)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-move select-none ${
                    draggedItem?.id === reservation.id ? 'opacity-50 transform rotate-2' : 'hover:transform hover:-translate-y-1'
                  }`}
                  onClick={() => onReservationClick(reservation)}
                >
                  {/* Drag Handle */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-400">#{reservation.id}</span>
                  </div>
                  
                  <p className="font-medium text-sm dark:text-white mb-1 truncate" title={reservation.property}>
                    {reservation.property}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate" title={reservation.buyer}>
                    {reservation.buyer}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${column.color}`}>
                      {reservation.status}
                    </span>
                    <p className="text-xs text-gray-400">
                      {new Date(reservation.date).toLocaleDateString('de-DE', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  {reservation.notar_date && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                        Notar: {new Date(reservation.notar_date).toLocaleDateString('de-DE', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}

                  {/* Priority Indicator */}
                  {reservation.status === 'Notartermin' && (
                    <div className="mt-2 flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">Priorität</span>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Drop Zone Placeholder */}
              {isDragOver && canDrop && (
                <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Hier ablegen um Status zu ändern
                  </p>
                </div>
              )}

              {/* Empty State */}
              {columnReservations.length === 0 && !isDragOver && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-xl">📋</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Keine {column.label.toLowerCase()} Reservierungen
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}