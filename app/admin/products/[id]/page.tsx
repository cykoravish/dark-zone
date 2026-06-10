'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Trash2, Save, Upload, X } from 'lucide-react';
import Link from 'next/link';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  customCategory: string;
  price: string;
  stock: string;
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
    customCategory: '',
    price: '',
    stock: '',
    image: '',
    specifications: {},
  });

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (!isNew) {
      fetchProduct();
    } else {
      setIsLoading(false);
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

      if (!response.ok) throw new Error('Failed to load product');
      
      const data = await response.json();
      setFormData({
        ...data,
        price: String(data.price || ''),
        stock: String(data.stock || ''),
        customCategory: '',
      });
      setImagePreview(data.image || '');
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));
      setImagePreview(data.url);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
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
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.description || !formData.image) {
        throw new Error('Please fill in all required fields');
      }

      const submitData = {
        ...formData,
        category: formData.category === 'custom' ? formData.customCategory : formData.category,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
      };

      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/products' : `/api/products/${params.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(submitData),
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

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));
    setImagePreview('');
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
      <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-4 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-3">
              <p className="text-destructive text-sm flex-1">{error}</p>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Image Section */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Product Image</h2>

            {/* Image Mode Tabs */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  imageMode === 'upload'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  imageMode === 'url'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                Image URL
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Upload or URL Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {imageMode === 'upload' ? 'Upload Product Image *' : 'Paste Image URL *'}
                </label>
                
                {imageMode === 'upload' ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full p-6 border-2 border-dashed border-border rounded-lg bg-background hover:bg-muted/50 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          {isUploading ? 'Uploading...' : 'Click to upload image'}
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={(e) => {
                      handleChange(e);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              </div>

              {/* Image Preview */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Preview</label>
                {imagePreview ? (
                  <div className="relative w-full bg-background rounded-lg border border-border overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={() => setImagePreview('')}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-destructive/90 hover:bg-destructive text-white rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-muted border border-border rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No image selected yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4 border-t border-border pt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="e.g., Tactical Vest Pro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                placeholder="Describe your product features, specifications, and benefits..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="weapons">Weapons</option>
                  <option value="gear">Gear & Equipment</option>
                  <option value="ammo">Ammunition</option>
                  <option value="accessories">Accessories</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="custom">Custom Category</option>
                </select>
              </div>

              {formData.category === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Custom Category Name *
                  </label>
                  <input
                    type="text"
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleChange}
                    required={formData.category === 'custom'}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="e.g., Tactical Gear"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4 border-t border-border pt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Pricing & Inventory</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          {Object.keys(formData.specifications).length > 0 && (
            <div className="space-y-4 border-t border-border pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Specifications</h2>

              <div className="space-y-3">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={key}
                        disabled
                        className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        name={`spec_${key}`}
                        value={value}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>

            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 sm:py-3 border border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/10 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
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
