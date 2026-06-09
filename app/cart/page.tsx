'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setIsLoading(false);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 10000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading cart...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">{cart.length} item(s) in your cart</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            {cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-card rounded-lg border border-border p-6 flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-3">
                        <Link
                          href={`/products/${item.id}`}
                          className="text-lg font-semibold text-foreground hover:text-primary transition-colors block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-2xl font-bold text-primary">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border rounded-lg w-fit">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                            >
                              −
                            </button>
                            <span className="px-4 py-2 text-foreground border-l border-r border-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive/80 transition-colors flex items-center gap-2 ml-auto"
                          >
                            <Trash2 className="w-5 h-5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>

                    <div className="space-y-3 border-t border-border pt-4">
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

                    <div className="border-t border-border pt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-3xl font-bold text-primary">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {subtotal > 10000 && (
                      <p className="text-sm text-green-500 bg-green-500/10 rounded-lg p-3 text-center">
                        Free shipping on orders over ₹10,000!
                      </p>
                    )}

                    <Link
                      href="/checkout"
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                      href="/products"
                      className="w-full py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors text-center"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">Your Cart is Empty</h2>
                <p className="text-muted-foreground mb-8">
                  Explore our collection and add some items to get started.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
