import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Award } from 'lucide-react';

const featuredProducts = [
  {
    id: '1',
    name: 'Tactical Vest',
    category: 'gear',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1578790143862-d1d19c6e3c0e?w=500&h=500&fit=crop',
  },
  {
    id: '2',
    name: 'Combat Rifle',
    category: 'weapons',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1584231265495-bd4f9b775ded?w=500&h=500&fit=crop',
  },
  {
    id: '3',
    name: 'Night Vision Goggles',
    category: 'accessories',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1578790143862-d1d19c6e3c0e?w=500&h=500&fit=crop',
  },
  {
    id: '4',
    name: 'Tactical Backpack',
    category: 'gear',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-card to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    Elite Equipment
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Dominate Every Mission
                </h1>
                <p className="text-lg text-muted-foreground">
                  Premium tactical equipment designed for professionals who demand excellence. From weapons to accessories, we have everything you need for superior performance.
                </p>
                <div className="flex gap-4 pt-4">
                  <Link
                    href="/products"
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                  >
                    Get Support
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative h-96 md:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-32 h-32 text-primary mx-auto opacity-50" />
                    <p className="text-primary text-lg font-semibold mt-4">Dark Zone Elite</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-lg border border-border">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Only the highest quality tactical equipment sourced from trusted manufacturers worldwide.
                </p>
              </div>
              <div className="p-8 bg-card rounded-lg border border-border">
                <Zap className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Swift shipping directly to your door with real-time tracking and updates.
                </p>
              </div>
              <div className="p-8 bg-card rounded-lg border border-border">
                <Award className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team of professionals is ready to assist with product selection and advice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Products</h2>
              <Link
                href="/products"
                className="text-primary hover:text-primary/80 transition-colors font-semibold flex items-center gap-2"
              >
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
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
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Upgrade Your Arsenal?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our complete collection of tactical equipment and find exactly what you need.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
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
