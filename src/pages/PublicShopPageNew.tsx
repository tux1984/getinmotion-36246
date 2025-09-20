import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { ShopNavbar } from '@/components/shop/ShopNavbar';
import { HeroSection } from '@/components/shop/HeroSection';
import { CategoriesSection } from '@/components/shop/CategoriesSection';
import { DescriptiveSection } from '@/components/shop/DescriptiveSection';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ShopFooter } from '@/components/shop/ShopFooter';

export default function PublicShopPageNew() {
  const { shopSlug } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        console.log('🚀 FETCHING SHOP DATA:', shopSlug);
        
        // Fetch shop data
        const { data: shopData, error: shopError } = await supabase
          .from('artisan_shops')
          .select('*')
          .eq('shop_slug', shopSlug)
          .single();

        if (shopError) {
          console.error('❌ Shop error:', shopError);
          return;
        }

        console.log('✅ SHOP DATA:', shopData);
        setShop(shopData);

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id);

        if (productsError) {
          console.error('❌ Products error:', productsError);
          return;
        }

        console.log('✅ PRODUCTS DATA:', productsData);
        setProducts(productsData || []);
      } catch (error) {
        console.error('❌ FETCH ERROR:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shopSlug) {
      fetchShopData();
    }
  }, [shopSlug]);

  // Get categories from products
  const getCategories = () => {
    const categoryMap = new Map();
    
    products.forEach(product => {
      const categoryName = product.category || 'General';
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          id: categoryName,
          name: categoryName,
          image: product.images?.[0] || '/placeholder.svg',
          productCount: 0
        });
      }
      categoryMap.get(categoryName).productCount++;
    });

    return Array.from(categoryMap.values()).slice(0, 3);
  };

  const handleProductClick = (product: any) => {
    navigate(`/tienda/${shop.shop_slug}/producto/${product.id}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    // TODO: Implement category filtering
    console.log('Category clicked:', categoryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">Cargando...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">Tienda no encontrada</div>
      </div>
    );
  }

  const categories = getCategories();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{shop.shop_name} - Tienda Artesanal</title>
        <meta name="description" content={shop.description} />
      </Helmet>

      {/* NAVBAR */}
      <ShopNavbar shopName={shop.shop_name} cartItemCount={0} />

      {/* HERO SECTION */}
      <HeroSection
        title={shop.shop_name}
        subtitle={`ESPECIALISTAS EN ${shop.craft_type?.toUpperCase() || 'ARTESANÍAS'} HECHO 100% EN COLOMBIA`}
        backgroundImage={shop.logo_url || '/placeholder.svg'}
      />

      {/* CATEGORIES SECTION */}
      {categories.length > 0 && (
        <CategoriesSection
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* DESCRIPTIVE SECTION */}
      <DescriptiveSection
        title={`ESPECIALISTAS EN ${shop.craft_type?.toUpperCase() || 'ARTESANÍAS'} HECHO 100% EN COLOMBIA`}
        subtitle={shop.description || 'Descubre nuestra colección de productos únicos, elaborados con la más alta calidad y atención al detalle.'}
      />

      {/* PRODUCTS GRID */}
      <ProductGrid
        products={products}
        onProductClick={handleProductClick}
      />

      {/* SHOP STORY SECTION */}
      {shop.story && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 tracking-wide">
              Nuestra Historia
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {shop.story}
            </p>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <ShopFooter
        shopName={shop.shop_name}
        contactEmail={shop.contact_email}
        contactPhone={shop.contact_phone}
        address={shop.address}
        socialLinks={{
          instagram: shop.instagram_url,
          facebook: shop.facebook_url,
          twitter: shop.twitter_url
        }}
      />
    </div>
  );
}