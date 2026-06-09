'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle, Package, Truck } from 'lucide-react';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('orderNumber');

  useEffect(() => {
    if (!orderNumber) {
      router.push('/');
    }
  }, [orderNumber, router]);

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Redirecting...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4">
            {/* Success Message */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20 p-12 text-center mb-8">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your order. Your payment has been verified successfully.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-card rounded-lg border border-border p-8 space-y-6 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">Order Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-border">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-semibold text-foreground font-mono text-lg">{orderNumber}</span>
                </div>

                <div className="flex justify-between pb-4 border-b border-border">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="text-foreground">{new Date().toLocaleDateString('en-IN')}</span>
                </div>

                <div className="flex justify-between pb-4 border-b border-border">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-semibold">
                    Confirmed
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email Confirmation:</span>
                  <span className="text-foreground">Sent to your email</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-card rounded-lg border border-border p-8 space-y-6 mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">What&apos;s Next?</h2>

              <div className="space-y-4">
                <div className="flex gap-4 pb-4 border-b border-border">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Processing Your Order</h3>
                    <p className="text-muted-foreground">
                      Your order is being prepared for shipment. We will notify you once it&apos;s ready.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pb-4 border-b border-border">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground">
                      <Truck className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Shipping</h3>
                    <p className="text-muted-foreground">
                      You will receive a tracking number via email when your order ships.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Delivery</h3>
                    <p className="text-muted-foreground">
                      Your order will be delivered to the address you provided. Typical delivery time is 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3 mb-8">
              <h3 className="font-semibold text-foreground">Important Notes:</h3>
              <ul className="space-y-2 text-sm text-foreground list-disc list-inside">
                <li>Check your email for order confirmation and tracking information</li>
                <li>Keep your order number ({orderNumber}) for reference</li>
                <li>Contact our support team if you have any questions</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link
                href="/products"
                className="flex-1 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href="/contact"
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
