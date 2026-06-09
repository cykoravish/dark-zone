'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  adminReply?: string;
  createdAt: string;
}

export default function MessageDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchMessage();
  }, [router, params.id]);

  const fetchMessage = async () => {
    try {
      const response = await fetch(`/api/contact/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('Message not found');

      const data = await response.json();
      setMessage(data);
      setReply(data.adminReply || '');
    } catch (error) {
      console.error('Failed to fetch message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!message || !reply.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/contact/${message._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ adminReply: reply }),
      });

      if (!response.ok) throw new Error('Failed to send reply');

      setMessage((prev) => (prev ? { ...prev, status: 'replied', adminReply: reply } : null));
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
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

  if (!message) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Message not found</p>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-500/10 text-red-500';
      case 'read':
        return 'bg-blue-500/10 text-blue-500';
      case 'replied':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/messages"
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{message.subject}</h1>
            <p className="text-muted-foreground mt-1">
              From: <span className="font-medium text-foreground">{message.name}</span>
            </p>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(message.status)}`}>
            {message.status}
          </span>
        </div>

        {/* Sender Information */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Sender Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="text-foreground font-medium">{message.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <a href={`mailto:${message.email}`} className="text-primary hover:text-primary/80">
                {message.email}
              </a>
            </div>
            {message.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <a href={`tel:${message.phone}`} className="text-primary hover:text-primary/80">
                  {message.phone}
                </a>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="text-foreground">{new Date(message.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Message</h2>
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">{message.message}</p>
        </div>

        {/* Reply Section */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Reply to Customer</h2>

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Type your reply here..."
          ></textarea>

          <button
            onClick={handleReplySubmit}
            disabled={isSubmitting || !reply.trim()}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? 'Sending...' : 'Send Reply'}
          </button>

          {message.status === 'replied' && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-500 font-medium text-sm">Reply has been sent to the customer</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
