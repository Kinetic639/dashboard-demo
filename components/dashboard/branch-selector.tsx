'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useBranchStore } from '@/lib/stores/branch-store';
import { useHasHydrated } from '@/hooks/use-hydrated-value';

export function BranchSelector() {
  const [open, setOpen] = React.useState(false);
  const { activeBranchId, branches, setActiveBranch, getActiveBranch } = useBranchStore();
const hydrated = useHasHydrated();
if (!hydrated) {
    return (
      <Button
        variant="outline"
        className="w-[280px] justify-between bg-muted/50 border-0 focus-visible:ring-1"
        disabled
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">Ładowanie...</span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  const activeBranch = getActiveBranch();

  const handleBranchSelect = (branchId: string) => {
    setActiveBranch(branchId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between bg-muted/50 border-0 focus-visible:ring-1"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">
              {activeBranch ? activeBranch.name : 'Wybierz oddział...'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Szukaj oddziału..." />
          <CommandList>
            <CommandEmpty>Nie znaleziono oddziału.</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={branch.name}
                  onSelect={() => handleBranchSelect(branch.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Building2 className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{branch.name}</span>
                      {branch.slug && (
                        <span className="text-xs text-muted-foreground">
                          {branch.slug}
                        </span>
                      )}
                    </div>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      activeBranchId === branch.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}