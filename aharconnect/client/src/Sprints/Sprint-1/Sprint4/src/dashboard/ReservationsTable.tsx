
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Reservation } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface ReservationsTableProps {
  reservations: Reservation[];
  onStatusChange?: (reservationId: string, newStatus: Reservation['status']) => void;
}

export default function ReservationsTable({ reservations, onStatusChange }: ReservationsTableProps) {
  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendConfirmation = (reservation: Reservation) => {
    // In a real app, this would trigger an email/SMS API
    toast.success(`Confirmation sent to ${reservation.customerName} via email and SMS!`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Party Size</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Special Requests</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No reservations found
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">
                  <div>
                    {reservation.customerName}
                    <div className="text-xs text-gray-500">{reservation.customerEmail}</div>
                    <div className="text-xs text-gray-500">{reservation.customerPhone}</div>
                  </div>
                </TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{reservation.partySize}</TableCell>
                <TableCell>{reservation.tableNumber ?? 'Not assigned'}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {reservation.specialRequests ?? 'None'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(reservation.status)} variant="outline">
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {onStatusChange ? (
                    <div className="flex flex-col gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                            onClick={() => onStatusChange(reservation.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                            onClick={() => onStatusChange(reservation.id, 'canceled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                            onClick={() => handleSendConfirmation(reservation)}
                          >
                            Resend Confirmation
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                            onClick={() => onStatusChange(reservation.id, 'canceled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
