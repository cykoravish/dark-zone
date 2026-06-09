'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Package, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product._id}
                href={`/admin/products/${product._id}`}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <Package className="w-8 h-8 text-primary group-hover:text-primary/80" />
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded capitalize">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-muted-foreground mt-1">Stock: {product.stock}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">No products yet</p>
              <Link
                href="/admin/products/new"
                className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Create First Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
