
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Filter, Download, Search, Database, Check, X, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

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
  status?: 'pending' | 'approved' | 'rejected';
  updated_at?: string;
}

interface WaitlistTableProps {
  data: WaitlistEntry[];
  isLoading: boolean;
  onRefresh: () => void;
}

// Security helper functions
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"']/g, '').trim();
};

const validateSearchTerm = (searchTerm: string): boolean => {
  // Prevent XSS and injection attempts
  if (searchTerm.length > 100) return false;
  if (/[<>\"'`]/.test(searchTerm)) return false;
  return true;
};

export const WaitlistTable = ({ data, isLoading, onRefresh }: WaitlistTableProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  
  const handleSearchChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    if (validateSearchTerm(sanitized)) {
      setSearchTerm(sanitized);
    } else {
      toast({
        title: 'Invalid Search',
        description: 'Search term contains invalid characters or is too long.',
        variant: 'destructive',
      });
    }
  };
  
  const filteredData = data.filter(entry => {
    // Filter by status first
    if (statusFilter !== 'all' && entry.status !== statusFilter) {
      return false;
    }
    
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
    
    // @ts-ignore - Dynamic field access with validation
    const fieldValue = entry[filterField]?.toLowerCase() || '';
    return fieldValue.includes(searchLower);
  });
  
  const exportToCSV = () => {
    try {
      // Security: Limit export size
      if (filteredData.length > 10000) {
        toast({
          title: 'Export Limit',
          description: 'Cannot export more than 10,000 records at once.',
          variant: 'destructive',
        });
        return;
      }

      // Create CSV content with proper escaping
      const headers = ['Nombre', 'Email', 'Teléfono', 'Rol', 'Ciudad', 'País', 'Sector', 'Fecha'];
      const csvRows = [headers];
      
      filteredData.forEach(entry => {
        const row = [
          (entry.full_name || '').replace(/"/g, '""'),
          (entry.email || '').replace(/"/g, '""'),
          (entry.phone || '').replace(/"/g, '""'),
          (entry.role || '').replace(/"/g, '""'),
          (entry.city || '').replace(/"/g, '""'),
          (entry.country || '').replace(/"/g, '""'),
          (entry.sector || '').replace(/"/g, '""'),
          new Date(entry.created_at).toLocaleDateString()
        ];
        csvRows.push(row);
      });
      
      // Convert to CSV string with proper quoting
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
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Exportación Completada',
        description: `Se exportaron ${filteredData.length} registros a CSV.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Error de Exportación',
        description: 'No se pudo completar la exportación.',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const handleApproveReject = async (waitlistId: string, action: 'approve' | 'reject') => {
    if (processingIds.has(waitlistId)) return;
    
    setProcessingIds(prev => new Set(prev).add(waitlistId));
    
    try {
      const { data, error } = await supabase.functions.invoke('approve-waitlist-user', {
        body: { waitlistId, action }
      });

      if (error) {
        throw error;
      }

      toast({
        title: action === 'approve' ? 'Usuario Aprobado' : 'Usuario Rechazado',
        description: data.message,
      });

      // Refresh the data
      onRefresh();
    } catch (error) {
      console.error('Error processing user:', error);
      toast({
        title: 'Error',
        description: `Error al ${action === 'approve' ? 'aprobar' : 'rechazar'} el usuario`,
        variant: 'destructive',
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(waitlistId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-200 text-xs rounded-full px-2 py-1">
            <Check className="h-3 w-3" />
            Aprobado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-200 text-xs rounded-full px-2 py-1">
            <X className="h-3 w-3" />
            Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full px-2 py-1">
            <Clock className="h-3 w-3" />
            Pendiente
          </span>
        );
    }
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-indigo-900/40 border-indigo-700 w-full"
                maxLength={100}
              />
            </div>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[120px] bg-indigo-900/40 border-indigo-700">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="approved">Aprobados</SelectItem>
                <SelectItem value="rejected">Rechazados</SelectItem>
              </SelectContent>
            </Select>
            
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
                <TableHead className="text-indigo-200 font-medium">Estado</TableHead>
                <TableHead className="text-indigo-200 font-medium">Fecha</TableHead>
                <TableHead className="text-indigo-200 font-medium">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-indigo-300">
                    Cargando datos...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-indigo-300">
                    No se encontraron registros
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((entry) => (
                  <TableRow 
                    key={entry.id} 
                    className="hover:bg-indigo-900/30"
                  >
                    <TableCell className="font-medium text-indigo-100">
                      {entry.full_name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-indigo-200">
                      {entry.email || 'N/A'}
                    </TableCell>
                    <TableCell className="text-indigo-300">
                      {entry.phone || '-'}
                    </TableCell>
                    <TableCell className="text-indigo-300">
                      {entry.role && (
                        <span className="bg-indigo-800/50 text-xs rounded px-2 py-0.5">
                          {entry.role}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-indigo-300">
                      {entry.country || '-'}
                    </TableCell>
                    <TableCell className="text-indigo-300">
                      {getStatusBadge(entry.status)}
                    </TableCell>
                    <TableCell className="text-indigo-300 text-sm">
                      {formatDate(entry.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {entry.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveReject(entry.id, 'approve')}
                              disabled={processingIds.has(entry.id)}
                              className="border-green-700 text-green-200 hover:bg-green-800/50 hover:text-white h-8 px-2"
                            >
                              {processingIds.has(entry.id) ? (
                                <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveReject(entry.id, 'reject')}
                              disabled={processingIds.has(entry.id)}
                              className="border-red-700 text-red-200 hover:bg-red-800/50 hover:text-white h-8 px-2"
                            >
                              {processingIds.has(entry.id) ? (
                                <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
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
