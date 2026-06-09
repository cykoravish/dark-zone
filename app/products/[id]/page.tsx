'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';

const products: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Tactical Vest',
    category: 'gear',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1578790143862-d1d19c6e3c0e?w=500&h=500&fit=crop',
    description:
      'Professional-grade tactical vest with modular design and maximum protection. Features reinforced panels and multiple attachment points for customization.',
    specifications: {
      Material: 'High-density polyester with protective padding',
      'Weight Capacity': '25kg',
      'Number of Pockets': '12',
      'Color Options': 'Black, Tan, Green',
    },
    stock: 15,
    rating: 4.8,
    reviews: 124,
  },
  '2': {
    id: '2',
    name: 'Combat Rifle',
    category: 'weapons',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1584231265495-bd4f9b775ded?w=500&h=500&fit=crop',
    description:
      'Military-grade combat rifle with superior accuracy and reliability. Engineered for professionals requiring consistent performance.',
    specifications: {
      'Caliber': '5.56 NATO',
      'Barrel Length': '16.5 inches',
      'Magazine Capacity': '30 rounds',
      'Effective Range': '500+ meters',
    },
    stock: 8,
    rating: 4.9,
    reviews: 89,
  },
  '3': {
    id: '3',
    name: 'Night Vision Goggles',
    category: 'accessories',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1578790143862-d1d19c6e3c0e?w=500&h=500&fit=crop',
    description:
      'Advanced night vision technology for low-light operations. Crystal-clear imaging with wide field of view.',
    specifications: {
      'Generation': '3+',
      'Resolution': '1024 x 768',
      'Battery Life': '40+ hours',
      'Weight': '650g',
    },
    stock: 12,
    rating: 4.7,
    reviews: 56,
  },
};

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = products[params.id];
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <Link href="/products" className="text-primary hover:text-primary/80">
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Link href="/products" className="flex items-center gap-2 text-primary hover:text-primary/80">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Product Image */}
              <div>
                <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-lg overflow-hidden h-96 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-primary text-sm uppercase font-semibold mb-2">{product.category}</p>
                  <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-semibold">{product.rating}</span>
                      <span className="text-yellow-500">★★★★★</span>
                    </div>
                    <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-b border-border pb-6">
                  <p className="text-5xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {product.stock > 0 ? (
                      <span className="text-green-500 font-semibold">In Stock</span>
                    ) : (
                      <span className="text-destructive font-semibold">Out of Stock</span>
                    )}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border">
                        <span className="text-foreground font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-semibold">Quantity:</label>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center bg-background text-foreground border-l border-r border-border outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                      addedToCart
                        ? 'bg-green-600 text-white'
                        : product.stock === 0
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : product.stock === 0 ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
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
