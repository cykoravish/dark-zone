'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import Link from 'next/link';

interface SettingsData {
  upiId: string;
  qrCodeUrl: string;
  shippingCost: string;
  gstPercentage: string;
  businessName: string;
  contactEmail: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsData>({
    upiId: '',
    qrCodeUrl: '',
    shippingCost: '50',
    gstPercentage: '18',
    businessName: 'Dark Zone',
    contactEmail: 'support@darkzone.com',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrPreview, setQrPreview] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings({
        ...data,
        shippingCost: String(data.shippingCost || '50'),
        gstPercentage: String(data.gstPercentage || '18'),
      });
      setQrPreview(data.qrCodeUrl || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setSettings((prev) => ({
        ...prev,
        qrCodeUrl: data.url,
      }));
      setQrPreview(data.url);
    } catch (err) {
      setError('Failed to upload QR code');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (!settings.upiId || !settings.qrCodeUrl) {
        throw new Error('UPI ID and QR Code are required');
      }

      const submitData = {
        ...settings,
        shippingCost: parseFloat(settings.shippingCost) || 50,
        gstPercentage: parseFloat(settings.gstPercentage) || 18,
      };

      const response = await fetch('/api/settings', {
        method: 'PUT',
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

      if (!response.ok) throw new Error('Failed to save settings');

      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeQrCode = () => {
    setSettings((prev) => ({
      ...prev,
      qrCodeUrl: '',
    }));
    setQrPreview('');
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
            Payment & Shipping Settings
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

          {success && (
            <div className="p-4 bg-primary/10 border border-primary rounded-lg">
              <p className="text-primary text-sm">{success}</p>
            </div>
          )}

          {/* QR Code Section */}
          <div className="space-y-4 border-b border-border pb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">QR Code</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* QR Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Upload UPI QR Code *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="qr-upload"
                  />
                  <label
                    htmlFor="qr-upload"
                    className="flex items-center justify-center w-full p-6 border-2 border-dashed border-border rounded-lg bg-background hover:bg-muted/50 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        {isUploading ? 'Uploading...' : 'Click to upload QR code'}
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* QR Preview */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Preview</label>
                {qrPreview ? (
                  <div className="relative w-full bg-background rounded-lg border border-border overflow-hidden">
                    <img
                      src={qrPreview}
                      alt="QR Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeQrCode}
                      className="absolute top-2 right-2 p-1 bg-destructive/90 hover:bg-destructive text-white rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-muted border border-border rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No QR code uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* UPI Section */}
          <div className="space-y-4 border-b border-border pb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">UPI Details</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                UPI ID *
              </label>
              <input
                type="text"
                name="upiId"
                value={settings.upiId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="e.g., darkzone@upi"
              />
              <p className="text-xs text-muted-foreground mt-1">
                UPI address where customers will send payment
              </p>
            </div>
          </div>

          {/* Shipping & Tax Section */}
          <div className="space-y-4 border-b border-border pb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Shipping & Tax</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Shipping Cost (₹) *
                </label>
                <input
                  type="number"
                  name="shippingCost"
                  value={settings.shippingCost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="50"
                />
                <p className="text-xs text-muted-foreground mt-1">Fixed shipping amount</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  GST Percentage (%) *
                </label>
                <input
                  type="number"
                  name="gstPercentage"
                  value={settings.gstPercentage}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="18"
                />
                <p className="text-xs text-muted-foreground mt-1">Tax percentage to apply</p>
              </div>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Business Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Dark Zone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="support@darkzone.com"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}