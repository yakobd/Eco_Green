'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchUser();
    fetchOrders();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Admin: Confirm or Decline Order
  const updateOrderStatus = async (orderId: string, status: string) => {
    const action = status === 'APPROVED' ? 'confirm' : 'decline';
    if (!confirm(`Are you sure you want to ${action} this order?`)) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update order');

      toast.success(`Order ${action}d successfully`);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // User: Upload Payment Proof
  const handlePaymentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setPaymentProof(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitPayment = async () => {
    if (!selectedOrder || !paymentProof) {
      toast.error('Please upload payment proof');
      return;
    }

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentProof }),
      });

      if (!res.ok) throw new Error('Failed to upload payment');

      toast.success('Payment proof uploaded successfully!');
      setShowPaymentModal(false);
      setPaymentProof('');
      setImagePreview('');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Admin: Verify or Reject Payment
  const verifyPayment = async (orderId: string, action: 'approve' | 'reject') => {
    const actionText = action === 'approve' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${actionText} this payment?`)) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error('Failed to verify payment');

      toast.success(`Payment ${actionText}ed successfully!`);
      setShowPaymentProofModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Admin: Mark as Delivered
  const markDelivered = async (orderId: string) => {
    if (!confirm('Mark this order as delivered?')) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/mark-delivered`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to mark as delivered');

      toast.success('Order marked as delivered!');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    const badges: any = {
      NOT_SHIPPED: 'badge-rejected',
      PENDING_PAYMENT: 'badge-pending',
      PAYMENT_REJECTED: 'badge-rejected',
      DELIVERY_IN_PROGRESS: 'badge-approved',
      DELIVERED: 'badge-delivered',
    };
    return badges[status] || 'badge-pending';
  };

  const getDeliveryStatusText = (status: string) => {
    const texts: any = {
      NOT_SHIPPED: 'Not Shipped',
      PENDING_PAYMENT: 'Pending Payment',
      PAYMENT_REJECTED: 'Payment Rejected',
      DELIVERY_IN_PROGRESS: 'Delivery in Progress',
      DELIVERED: 'Delivered',
    };
    return texts[status] || status;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        📦 Orders
      </h1>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Product
                </th>
                {user?.role !== 'USER' && (
                  <th className="text-left py-3 px-4 text-sm font-medium">
                    Customer
                  </th>
                )}
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Qty
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Delivery Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 text-sm font-mono">
                    #{order.id.slice(-6)}
                  </td>
                  <td className="py-3 px-4 text-sm">{order.product.name}</td>
                  {user?.role !== 'USER' && (
                    <td className="py-3 px-4 text-sm">{order.user.name}</td>
                  )}
                  <td className="py-3 px-4 text-sm">{order.quantity}</td>
                  <td className="py-3 px-4 text-sm font-semibold">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge badge-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getDeliveryStatusBadge(order.deliveryStatus)}`}>
                      {getDeliveryStatusText(order.deliveryStatus)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-2">
                      {/* USER: Finish Order (Upload Payment) */}
                      {user?.role === 'USER' && 
                       order.status === 'APPROVED' && 
                       !order.paymentProof && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowPaymentModal(true);
                          }}
                          className="btn btn-primary text-xs whitespace-nowrap"
                        >
                          💳 Finish Order
                        </button>
                      )}

                      {/* USER: Payment Uploaded Status */}
                      {user?.role === 'USER' && order.paymentProof && !order.paymentVerified && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Payment under review
                        </span>
                      )}

                      {/* ADMIN: Confirm/Decline Order */}
                      {user?.role !== 'USER' && order.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'APPROVED')}
                            className="text-xs btn btn-primary"
                          >
                            ✓ Confirm
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'REJECTED')}
                            className="text-xs btn btn-danger"
                          >
                            ✗ Decline
                          </button>
                        </div>
                      )}

                      {/* ADMIN: View & Verify Payment */}
                      {user?.role !== 'USER' && 
                       order.paymentProof && 
                       !order.paymentVerified && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowPaymentProofModal(true);
                          }}
                          className="text-xs btn btn-primary"
                        >
                          🔍 Verify Payment
                        </button>
                      )}

                      {/* ADMIN: Mark Delivered */}
                      {user?.role !== 'USER' && 
                       order.deliveryStatus === 'DELIVERY_IN_PROGRESS' && (
                        <button
                          onClick={() => markDelivered(order.id)}
                          className="text-xs btn btn-primary"
                        >
                          ✓ Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Upload Modal (USER) */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              💳 Complete Payment
            </h2>
            
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Order:</strong> #{selectedOrder.id.slice(-6)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Product:</strong> {selectedOrder.product.name}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                <strong>Amount:</strong> {formatCurrency(selectedOrder.totalPrice)}
              </p>
            </div>

            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500">
              <h3 className="font-bold text-green-900 dark:text-green-300 mb-3">
                🏦 Company Bank Account
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-900 dark:text-white">
                  <strong>Bank:</strong> Commercial Bank of Ethiopia (CBE)
                </p>
                <p className="text-gray-900 dark:text-white">
                  <strong>Account Number:</strong> 
                  <span className="font-mono ml-2 text-lg">1000420841632</span>
                </p>
                <p className="text-gray-900 dark:text-white">
                  <strong>Account Name:</strong> Yakob Dereje Negash
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Payment Screenshot/Receipt
              </label>
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={handlePaymentUpload}
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Payment proof"
                    className="w-full h-48 object-contain rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={submitPayment}
                disabled={!paymentProof}
                className="flex-1 btn btn-primary"
              >
                Submit Payment
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentProof('');
                  setImagePreview('');
                  setSelectedOrder(null);
                }}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Verification Modal (ADMIN) */}
      {showPaymentProofModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              🔍 Verify Payment
            </h2>
            
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm mb-1">
                <strong>Order:</strong> #{selectedOrder.id.slice(-6)}
              </p>
              <p className="text-sm mb-1">
                <strong>Customer:</strong> {selectedOrder.user.name}
              </p>
              <p className="text-sm mb-1">
                <strong>Product:</strong> {selectedOrder.product.name}
              </p>
              <p className="text-lg font-bold">
                <strong>Amount:</strong> {formatCurrency(selectedOrder.totalPrice)}
              </p>
            </div>

            {selectedOrder.paymentProof && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Payment Proof:</h3>
                <img
                  src={selectedOrder.paymentProof}
                  alt="Payment proof"
                  className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-300 dark:border-gray-600"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => verifyPayment(selectedOrder.id, 'approve')}
                className="flex-1 btn btn-primary"
              >
                ✓ Approve Payment
              </button>
              <button
                onClick={() => verifyPayment(selectedOrder.id, 'reject')}
                className="flex-1 btn btn-danger"
              >
                ✗ Reject Payment
              </button>
              <button
                onClick={() => {
                  setShowPaymentProofModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
