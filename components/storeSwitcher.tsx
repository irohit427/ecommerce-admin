'use client';
import React, { useState } from 'react'
import { Store } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';

import { 
  Check, 
  ChevronDown, 
  PlusCircle, 
  Store as StoreIcon 
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useStoreModal } from '@/hooks/useStoreModal';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator 
} from '@/components/ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

type store = {
  label: string;
  value: string;
}

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[]
}

const StoreSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const currentStore = formattedItems.find((item) => item.value === params.storeId);

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: store) => {
    setOpen(false);
    router.push(`/${store.value}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' size='sm' 
          aria-expanded={open} 
          aria-label='Select a Store'
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className='mr-2 h-4 w-4' />
          Current Store
          <ChevronDown className='ml-auto h-4 w-4 opacity-50 shrink-0' />          
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search Store'></CommandInput>
            <CommandEmpty>No Store</CommandEmpty>
            <CommandGroup heading='Stores'>
              {
                formattedItems.map((store) =>(
                  <CommandItem key={store.value}
                    className='text-sm'
                    onSelect={() => onStoreSelect(store)}
                  >
                    <StoreIcon className='mr-2 h-4 w-4' />
                    {store.label}
                    <Check className={cn('ml-auto h-4 w-4', currentStore?.value === store.value ? "opacity-100": "opacity-0")} />
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen()
                }}
              >
                <PlusCircle className='mr-2 h-5 w-5' />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher;