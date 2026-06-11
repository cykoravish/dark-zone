'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Copy, CheckCircle, Clock } from 'lucide-react';

interface PaymentSettings {
  upiId: string;
  qrCodeUrl: string;
  shippingCost: number;
  gstPercentage: number;
  businessName: string;
  contactEmail: string;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('orderNumber');
  const amount = searchParams.get('amount');
  const [copied, setCopied] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    if (!orderNumber || !amount) {
      router.push('/cart');
    }
  }, [orderNumber, amount, router]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentVerification = async () => {
    if (!referenceId.trim()) {
      alert('Please enter UPI reference ID');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          upiReference: referenceId,
        }),
      });

      if (!response.ok) throw new Error('Verification failed');

      router.push(`/order-confirmation?orderNumber=${orderNumber}`);
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderNumber || !amount) {
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

  const numericAmount = parseInt(amount);
  const upiId = settings?.upiId || 'Loading...';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground">Payment</h1>
          </div>
        </section>

        {/* Payment Section */}
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4">
            {/* Order Details */}
            <div className="bg-card rounded-lg border border-border p-8 mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Order Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-border">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-semibold text-foreground">{orderNumber}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-foreground">Amount to Pay:</span>
                  <span className="text-primary">₹{numericAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-card rounded-lg border border-border p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  UPI Payment Instructions
                </h2>
              </div>

              {/* UPI Details */}
              <div className="space-y-6">
                {/* QR Code Section */}
                {!isLoadingSettings && settings?.qrCodeUrl && (
                  <div className="bg-background rounded-lg p-6 border border-primary/20">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Scan QR Code to Pay</h3>
                    <div className="flex justify-center mb-6">
                      <div className="bg-white p-4 rounded-lg border border-border">
                        <img
                          src={settings.qrCodeUrl}
                          alt="UPI QR Code"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Scan this QR code with your UPI app to make payment
                    </p>
                  </div>
                )}

                {/* UPI Manual Payment */}
                <div className="bg-background rounded-lg p-6 border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-4">OR Send Payment Manually</h3>

                  <div className="space-y-4">
                    {/* UPI ID */}
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">UPI ID</label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 px-4 py-3 bg-muted rounded-lg text-foreground font-mono text-center">
                          {upiId}
                        </div>
                        <button
                          onClick={() => copyToClipboard(upiId)}
                          disabled={isLoadingSettings}
                          className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                      {copied && (
                        <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Copied!
                        </p>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Amount</label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 px-4 py-3 bg-muted rounded-lg text-foreground font-mono text-center text-lg font-bold">
                          ₹{numericAmount.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => copyToClipboard(numericAmount.toString())}
                          className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">How to Pay:</h3>
                  <ol className="space-y-3">
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        1
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Open your UPI app</p>
                        <p className="text-sm text-muted-foreground">Google Pay, PhonePe, BHIM, etc.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        2
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Scan the QR code or enter UPI ID</p>
                        <p className="text-sm text-muted-foreground">Use the QR code above or manually enter the UPI ID</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        3
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Enter the amount and complete payment</p>
                        <p className="text-sm text-muted-foreground">Amount: ₹{numericAmount.toLocaleString('en-IN')}</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        4
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Enter the reference ID below</p>
                        <p className="text-sm text-muted-foreground">The transaction reference from your UPI app</p>
                      </div>
                    </li>
                  </ol>
                </div>

                {/* Reference ID Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    UPI Reference ID *
                  </label>
                  <input
                    type="text"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="e.g., 123456789012345678"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the transaction reference ID from your UPI payment confirmation message
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>Note:</strong> Please ensure the UPI reference ID is correct. This will be used to verify and confirm your payment.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/cart"
                    className="flex-1 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors text-center"
                  >
                    Back to Cart
                  </Link>
                  <button
                    onClick={handlePaymentVerification}
                    disabled={isSubmitting || !referenceId.trim()}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Payment'}
                  </button>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Need help with payment?</p>
              <Link
                href="/contact"
                className="text-primary hover:text-primary/80 font-semibold"
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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
