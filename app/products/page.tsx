'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const allProducts = [
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
  {
    id: '5',
    name: 'Assault Rifle',
    category: 'weapons',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1584231265495-bd4f9b775ded?w=500&h=500&fit=crop',
  },
  {
    id: '6',
    name: 'Ammunition Box',
    category: 'ammo',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1548167379-ab9c78b27e6a?w=500&h=500&fit=crop',
  },
  {
    id: '7',
    name: 'Combat Boots',
    category: 'gear',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
  },
  {
    id: '8',
    name: 'Tactical Drone',
    category: 'vehicles',
    price: 45999,
    image: 'https://images.unsplash.com/photo-1581092163392-8c6c0d4fd4da?w=500&h=500&fit=crop',
  },
];

const categories = ['all', 'weapons', 'gear', 'ammo', 'accessories', 'vehicles'];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-2">Our Products</h1>
            <p className="text-muted-foreground">Browse our complete collection of tactical equipment</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                {/* Search */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-foreground mb-3">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-foreground mb-3">Category</label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors capitalize ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-foreground hover:border-primary'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-foreground mb-3">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground">
                      ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-foreground mb-3">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} of {allProducts.length} products
                  </p>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
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
                          <p className="text-2xl font-bold text-primary">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No products found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
