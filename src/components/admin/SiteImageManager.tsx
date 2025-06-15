
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Loader2, CheckCircle } from 'lucide-react';

interface SiteImage {
  id: string;
  context: string;
  key: string;
  image_url: string;
  alt_text: string | null;
}

interface StorageImage {
  name: string;
  url: string;
}

export const SiteImageManager: React.FC = () => {
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [storageImages, setStorageImages] = useState<StorageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSiteImages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('site_images').select('*').order('context').order('key');
    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar las imágenes del sitio.', variant: 'destructive' });
      console.error(error);
    } else {
      setSiteImages(data);
    }
    setIsLoading(false);
  };

  const fetchStorageImages = async () => {
    const { data, error } = await supabase.storage.from('images').list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar las imágenes de la galería.', variant: 'destructive' });
    } else {
      const urls = data
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => {
          const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(file.name);
          return { name: file.name, url: publicUrlData.publicUrl };
        });
      setStorageImages(urls);
    }
  };

  useEffect(() => {
    fetchSiteImages();
    fetchStorageImages();
  }, []);

  const handleImageUpdate = async (imageId: string, newImageUrl: string) => {
    setIsUpdating(imageId);
    const { error } = await supabase.from('site_images').update({ image_url: newImageUrl, updated_at: new Date().toISOString() }).eq('id', imageId);
    if (error) {
      toast({ title: 'Error', description: 'Error al actualizar la imagen.', variant: 'destructive' });
      console.error(error);
    } else {
      toast({ title: 'Éxito', description: 'Imagen actualizada correctamente.' });
      await fetchSiteImages(); // Refresh the list
    }
    setIsUpdating(null);
  };

  const imagesByContext = useMemo(() => siteImages.reduce((acc, image) => {
    if (!acc[image.context]) {
      acc[image.context] = [];
    }
    acc[image.context].push(image);
    return acc;
  }, {} as Record<string, SiteImage[]>), [siteImages]);

  if (isLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-pink-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-indigo-900/40 border-indigo-800/30">
        <CardHeader>
          <CardTitle className="text-white">Administrar Imágenes del Sitio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.entries(imagesByContext).map(([context, images]) => (
              <div key={context}>
                <h3 className="text-xl font-semibold text-pink-400 mb-4 capitalize">{context}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map(image => (
                    <Card key={image.id} className="bg-indigo-800/30 border-indigo-700/50 flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-white text-base capitalize">{image.key.replace(/([A-Z])/g, ' $1')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow flex flex-col">
                        <div className="aspect-video bg-indigo-950/50 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={image.image_url} alt={image.alt_text || ''} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm text-indigo-300 truncate flex-grow" title={image.alt_text || ''}>{image.alt_text || 'Sin texto alternativo'}</p>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full text-indigo-200 border-indigo-600 hover:bg-indigo-800/50 mt-auto">
                              {isUpdating === image.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Cambiar Imagen"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-indigo-950 text-white border-indigo-800 max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Selecciona una nueva imagen para: <span className="text-pink-400">{context} - {image.key}</span></DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto p-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {storageImages.map(storageImage => (
                                <DialogClose asChild key={storageImage.name}>
                                    <div 
                                    className="relative group border-2 border-transparent rounded-lg overflow-hidden cursor-pointer hover:border-pink-500 transition-all duration-200"
                                    onClick={() => handleImageUpdate(image.id, storageImage.url)}
                                    >
                                        <img src={storageImage.url} alt={storageImage.name} className="w-full h-32 object-cover" />
                                        {image.image_url === storageImage.url && (
                                            <div className="absolute inset-0 bg-green-900/70 flex items-center justify-center">
                                                <CheckCircle className="w-8 h-8 text-white"/>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                                            <p className="text-xs text-white truncate">{storageImage.name}</p>
                                        </div>
                                    </div>
                                </DialogClose>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

