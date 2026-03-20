'use client';

import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

export function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
        <div className="text-right hidden sm:block space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16 ml-auto" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
      <div className="text-right hidden sm:block">
        <p className="text-xs font-bold text-slate-900 leading-none">{user.firstName} {user.lastName}</p>
        <p className="text-[10px] text-slate-500 font-medium capitalize">{user.role}</p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-slate-200 shadow-sm p-0">
            <Avatar className="h-full w-full">
              <AvatarImage 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa9BLuaU__h8ejRBr0dq6k53SqR4oh7lsq3_4UJcdHUWthErnsr6nbqMPrrIo_lTr6JL-z3eQR106srfPsn--SyTejgfdtMs_575xf1iqeJDrtfpoFI6MK7CwzxprnkJp458CWqOzTmEMoMvKQ_1t8sSxX8WYzBubfCDhYR0KRvpjr8_o0v_QINFahshpoZ7E0O-FBdGCI8-H6RsbM-bK00vaXqRGCuZjVlZOLKEi3cOskJ5NgZds-Sh_iTmch1Oq6kJ2MlIFqgCE" 
                alt="User Profile" 
              />
              <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
              <p className="text-xs leading-none text-slate-500">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile Configuration</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
