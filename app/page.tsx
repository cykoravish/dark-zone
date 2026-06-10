'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        // Show first 4 products as featured
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error('[v0] Failed to fetch featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-card to-background py-16 md:py-32">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    Elite Equipment
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Dominate Every Mission
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  Premium tactical equipment designed for professionals who demand excellence. From weapons to accessories, we have everything you need for superior performance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/products"
                    className="px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center sm:justify-start gap-2"
                  >
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 sm:px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors text-center"
                  >
                    Get Support
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-24 md:w-32 h-24 md:h-32 text-primary mx-auto opacity-50" />
                    <p className="text-primary text-base md:text-lg font-semibold mt-4">Dark Zone Elite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Why Choose Dark Zone
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="p-6 md:p-8 bg-card rounded-lg border border-border">
                <Shield className="w-10 md:w-12 h-10 md:h-12 text-primary mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Premium Quality</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Only the highest quality tactical equipment sourced from trusted manufacturers worldwide.
                </p>
              </div>
              <div className="p-6 md:p-8 bg-card rounded-lg border border-border">
                <Zap className="w-10 md:w-12 h-10 md:h-12 text-primary mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Fast Delivery</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Swift shipping directly to your door with real-time tracking and updates.
                </p>
              </div>
              <div className="p-6 md:p-8 bg-card rounded-lg border border-border">
                <Award className="w-10 md:w-12 h-10 md:h-12 text-primary mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Expert Support</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Our team of professionals is ready to assist with product selection and advice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Products</h2>
              <Link
                href="/products"
                className="text-primary hover:text-primary/80 transition-colors font-semibold flex items-center gap-2 w-fit"
              >
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">No products available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="group bg-background rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-primary uppercase font-semibold mb-1">{product.category}</p>
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xl md:text-2xl font-bold text-primary">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Upgrade Your Arsenal?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our complete collection of tactical equipment and find exactly what you need.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
