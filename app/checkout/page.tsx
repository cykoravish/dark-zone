'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(savedCart);
    setIsLoading(false);
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, '')))
      newErrors.phone = 'Valid 10-digit phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim() || !/^\d{6}$/.test(formData.postalCode))
      newErrors.postalCode = 'Valid 6-digit postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = subtotal > 10000 ? 0 : 500;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + shipping + tax;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          totalAmount: total,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const { orderNumber } = await response.json();
      localStorage.removeItem('cart');
      router.push(`/payment?orderNumber=${orderNumber}&amount=${total}`);
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 10000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Personal Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.name ? 'border-destructive' : 'border-border'
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.email ? 'border-destructive' : 'border-border'
                            }`}
                            placeholder="john@example.com"
                          />
                          {errors.email && (
                            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.phone ? 'border-destructive' : 'border-border'
                            }`}
                            placeholder="9876543210"
                          />
                          {errors.phone && (
                            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.address ? 'border-destructive' : 'border-border'
                          }`}
                          placeholder="123 Main Street, Apt 4B"
                        />
                        {errors.address && (
                          <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.city ? 'border-destructive' : 'border-border'
                            }`}
                            placeholder="New York"
                          />
                          {errors.city && (
                            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> {errors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Postal Code *</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.postalCode ? 'border-destructive' : 'border-border'
                            }`}
                            placeholder="100001"
                          />
                          {errors.postalCode && (
                            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> {errors.postalCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/cart"
                      className="flex-1 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors text-center"
                    >
                      Back to Cart
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>

                  <div className="space-y-3 max-h-64 overflow-y-auto border-b border-border pb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="text-foreground font-medium">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-b border-border pb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-500">FREE</span>
                        ) : (
                          `₹${shipping.toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (18%)</span>
                      <span className="text-foreground font-medium">
                        ₹{tax.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-3xl font-bold text-primary">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
