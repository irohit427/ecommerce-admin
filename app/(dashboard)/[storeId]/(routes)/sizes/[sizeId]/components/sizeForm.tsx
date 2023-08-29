'use client';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"
import Heading from '@/components/ui/heading';
import { Size } from '@prisma/client';
import { Trash } from 'lucide-react';
import React, { useState } from 'react'
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alertModal';
import { useOrigin } from '@/hooks/useOrigin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SizeFormProps {
  initialData: Size | null;
};

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>

const CategoryForm:React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter(); 
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const origin = useOrigin();

  const title = initialData ? 'Edit size' : 'Create size';
  const description = initialData ? 'Edit a size.' : 'Add a new size';
  const toastMessage = initialData ? 'Size updated.' : 'Size created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
    }
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (err) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.categoryId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success('Size Deleted Successfully.');
    } catch (err) {
      toast.error('Make sure you removed all products using this category first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal 
        title='Are you sure you want to delete the size?'
        description="This action cannot be undone."
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading 
          title={title}
          description={description}
        />
        {initialData && (
          <Button variant='destructive'
            disabled={loading}
            size='sm'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4'/>
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>          
          <div className='md:grid md:grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-x-4'>
            <Button disabled={loading} className='ml-auto' variant='outline' type='button' onClick={() => {
              router.push(`/${params.storeId}/sizes`);
            }}>
              Cancel
            </Button>
            <Button disabled={loading} className='ml-auto' type="submit">
              {action}
            </Button>
          </div>
        </form>
      </Form>
      
      <Separator />
      
    </>
    
  )
}

export default CategoryForm