'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  upiReference?: string;
  createdAt: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchOrder();
  }, [router, params.id]);

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus);
    }
  }, [order]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('Order not found');

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ orderStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      setOrder((prev) => (prev ? { ...prev, orderStatus } : null));
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update order status');
    } finally {
      setIsSubmitting(false);
    }
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

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Order not found</p>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-500';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-500';
      case 'delivered':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Order #{order.orderNumber}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="text-foreground font-medium">{order.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground font-medium">{order.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="text-foreground font-medium">{order.customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="text-foreground font-medium text-right">
                    {order.customer.address}, {order.customer.city} {order.customer.postalCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between pb-3 border-b border-border last:border-b-0">
                    <div>
                      <p className="text-foreground font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <span className="text-foreground font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.upiReference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UPI Reference:</span>
                    <span className="text-foreground font-mono text-sm">{order.upiReference}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="text-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Update Status</h2>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={isSubmitting || orderStatus === order.orderStatus}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
