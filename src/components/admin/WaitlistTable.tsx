
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Filter, Download, Search, Database } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WaitlistEntry {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role?: string;
  city?: string;
  country?: string;
  sector?: string;
  created_at: string;
  language?: string;
}

interface WaitlistTableProps {
  data: WaitlistEntry[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const WaitlistTable = ({ data, isLoading, onRefresh }: WaitlistTableProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState<string>('all');
  
  const filteredData = data.filter(entry => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    if (filterField === 'all') {
      return (
        entry.full_name?.toLowerCase().includes(searchLower) ||
        entry.email?.toLowerCase().includes(searchLower) ||
        entry.country?.toLowerCase().includes(searchLower) ||
        entry.city?.toLowerCase().includes(searchLower) ||
        entry.role?.toLowerCase().includes(searchLower) ||
        entry.sector?.toLowerCase().includes(searchLower)
      );
    }
    
    // @ts-ignore - Dynamic field access
    const fieldValue = entry[filterField]?.toLowerCase() || '';
    return fieldValue.includes(searchLower);
  });
  
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Nombre', 'Email', 'Teléfono', 'Rol', 'Ciudad', 'País', 'Sector', 'Fecha'];
    const csvRows = [headers];
    
    filteredData.forEach(entry => {
      const row = [
        entry.full_name || '',
        entry.email || '',
        entry.phone || '',
        entry.role || '',
        entry.city || '',
        entry.country || '',
        entry.sector || '',
        new Date(entry.created_at).toLocaleDateString()
      ];
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Exportación Completada',
      description: `Se exportaron ${filteredData.length} registros a CSV.`,
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-pink-400" />
          <h2 className="text-xl font-semibold">Lista de Espera</h2>
          <span className="bg-pink-500/20 text-pink-200 text-xs rounded-full px-2 py-1">
            {data.length} registros
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-indigo-300" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-indigo-900/40 border-indigo-700 w-full"
              />
            </div>
            
            <Select 
              value={filterField} 
              onValueChange={setFilterField}
            >
              <SelectTrigger className="w-[140px] bg-indigo-900/40 border-indigo-700">
                <Filter className="h-4 w-4 mr-2 text-indigo-300" />
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los campos</SelectItem>
                <SelectItem value="full_name">Nombre</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="country">País</SelectItem>
                <SelectItem value="city">Ciudad</SelectItem>
                <SelectItem value="role">Rol</SelectItem>
                <SelectItem value="sector">Sector</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onRefresh}
              className="border-indigo-700 text-indigo-200 hover:bg-indigo-800/50 hover:text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Actualizar'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              className="border-pink-700 text-pink-200 hover:bg-pink-800/50 hover:text-white"
              disabled={filteredData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-950/70 rounded-lg border border-indigo-800/30 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-indigo-900/30">
                <TableHead className="text-indigo-200 font-medium">Nombre</TableHead>
                <TableHead className="text-indigo-200 font-medium">Email</TableHead>
                <TableHead className="text-indigo-200 font-medium">Teléfono</TableHead>
                <TableHead className="text-indigo-200 font-medium">Rol</TableHead>
                <TableHead className="text-indigo-200 font-medium">País</TableHead>
                <TableHead className="text-indigo-200 font-medium">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-indigo-300">
                    Cargando datos...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-indigo-300">
                    No se encontraron registros
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((entry) => (
                  <TableRow 
                    key={entry.id} 
                    className="hover:bg-indigo-900/30 cursor-pointer"
                    onClick={() => {
                      // Could implement a modal to show full details here
                      console.log('Entry details:', entry);
                    }}
                  >
                    <TableCell className="font-medium text-indigo-100">{entry.full_name}</TableCell>
                    <TableCell className="text-indigo-200">{entry.email}</TableCell>
                    <TableCell className="text-indigo-300">{entry.phone || '-'}</TableCell>
                    <TableCell className="text-indigo-300">
                      {entry.role && (
                        <span className="bg-indigo-800/50 text-xs rounded px-2 py-0.5">
                          {entry.role}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-indigo-300">{entry.country || '-'}</TableCell>
                    <TableCell className="text-indigo-300 text-sm">
                      {formatDate(entry.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
