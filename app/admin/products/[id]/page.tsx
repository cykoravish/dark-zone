'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import Link from 'next/link';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  specifications: Record<string, string>;
}

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: 'gear',
    price: 0,
    stock: 0,
    image: 'https://via.placeholder.com/500x500',
    specifications: {},
  });

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (!isNew) {
      fetchProduct();
    }
  }, [router, isNew, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('spec_')) {
      const specKey = name.replace('spec_', '');
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/products' : `/api/products/${params.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to save product');

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete product');

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {isNew ? 'Add Product' : 'Edit Product'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-8 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Tactical Vest"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Product description..."
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="weapons">Weapons</option>
                  <option value="gear">Gear</option>
                  <option value="ammo">Ammunition</option>
                  <option value="accessories">Accessories</option>
                  <option value="vehicles">Vehicles</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Pricing & Stock</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Specifications</h2>

            <div className="space-y-3">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <input
                    type="text"
                    value={key}
                    disabled
                    className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-foreground"
                  />
                  <input
                    type="text"
                    name={`spec_${key}`}
                    value={value}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>

            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-6 py-2 border border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/10 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
