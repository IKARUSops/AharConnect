
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EventPackage } from '../../lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { useForm, Controller } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface EventPackagesTableProps {
  eventPackages: EventPackage[];
  onAddEventPackage: (newPackage: Omit<EventPackage, 'id'>) => void;
  onUpdateEventPackage: (updatedPackage: EventPackage) => void;
  onDeleteEventPackage: (packageId: string) => void;
}

export default function EventPackagesTable({
  eventPackages,
  onAddEventPackage,
  onUpdateEventPackage,
  onDeleteEventPackage,
}: EventPackagesTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<EventPackage | null>(null);
  
  const form = useForm<Omit<EventPackage, 'id'>>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      maxCapacity: 0,
      amenities: [],
      restaurantId: '1', // Default restaurantId
    }
  });
  
  const handleAddPackage = (data: Omit<EventPackage, 'id'>) => {
    // Convert amenities string to array if needed
    const processedData = {
      ...data,
      amenities: typeof data.amenities === 'string' 
        ? (data.amenities as unknown as string).split(',').map(item => item.trim()) 
        : data.amenities,
    };
    
    onAddEventPackage(processedData);
    toast.success('Event package added successfully!');
    setIsAddDialogOpen(false);
    form.reset();
  };
  
  const handleEditPackage = (packageData: EventPackage) => {
    // Convert amenities array to string for the form
    setEditingPackage(packageData);
    form.reset({
      name: packageData.name,
      description: packageData.description,
      price: packageData.price,
      maxCapacity: packageData.maxCapacity,
      amenities: packageData.amenities,
      restaurantId: packageData.restaurantId,
    });
  };
  
  const handleUpdatePackage = (data: Omit<EventPackage, 'id'>) => {
    if (!editingPackage) return;
    
    // Convert amenities string to array if needed
    const processedData = {
      ...data,
      id: editingPackage.id,
      amenities: typeof data.amenities === 'string' 
        ? (data.amenities as unknown as string).split(',').map(item => item.trim()) 
        : data.amenities,
    };
    
    onUpdateEventPackage(processedData as EventPackage);
    toast.success('Event package updated successfully!');
    setEditingPackage(null);
    form.reset();
  };
  
  const handleCancelEdit = () => {
    setEditingPackage(null);
    form.reset();
  };
  
  const handleDeletePackage = (id: string) => {
    onDeleteEventPackage(id);
    toast.success('Event package deleted successfully!');
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Event Packages</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Event Package</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Event Package</DialogTitle>
              <DialogDescription>
                Add a new event package that customers can book.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddPackage)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Birthday Party Package" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Describe what's included in this package..."
                          rows={3}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Capacity</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="number"
                            min="1"
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities (comma separated)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="Cake, Decorations, Private Room"
                          value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                          onChange={e => field.onChange(e.target.value)}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Package</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {editingPackage && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="font-semibold mb-2">Edit Event Package</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePackage)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Name</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="number"
                          min="1"
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities (comma separated)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                        onChange={e => field.onChange(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                <Button type="submit">Update Package</Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Amenities</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventPackages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No event packages found
                </TableCell>
              </TableRow>
            ) : (
              eventPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{pkg.description}</TableCell>
                  <TableCell>${pkg.price.toFixed(2)}</TableCell>
                  <TableCell>{pkg.maxCapacity}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {pkg.amenities.map((amenity, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditPackage(pkg)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
