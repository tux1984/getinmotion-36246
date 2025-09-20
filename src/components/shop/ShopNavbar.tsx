import React from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShopNavbarProps {
  shopName: string;
  cartItemCount?: number;
}

export const ShopNavbar: React.FC<ShopNavbarProps> = ({ 
  shopName, 
  cartItemCount = 0 
}) => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {shopName}
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Buscar productos..." 
                className="pl-10 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search - Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>

            {/* User */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};