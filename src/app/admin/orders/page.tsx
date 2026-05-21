"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader } from "@/components/ui";
import { Eye, X, ChevronDown } from "lucide-react";
import Image from "next/image";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: { name: string; image_url: string | null };
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  user_id: string;
  customer_email?: string;
  customer_name?: string;
  shipping_address?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
  } | null;
}

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setIsLoading(false);
  }

  async function openOrder(order: Order) {
    setSelectedOrder(order);
    setLoadingItems(true);
    setTimeout(() => setModalVisible(true), 10);
    const { data } = await supabase
      .from("order_items")
      .select("*, products(name, image_url)")
      .eq("order_id", order.id);
    setOrderItems(data || []);
    setLoadingItems(false);
  }

  function closeModal() {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedOrder(null);
      setOrderItems([]);
    }, 250);
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdatingStatus(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
    setUpdatingStatus(null);
  }

  function getCustomerName(order: Order) {
    if (order.customer_name) return order.customer_name;
    const s = order.shipping_address;
    if (s?.firstName || s?.lastName) return `${s.firstName || ''} ${s.lastName || ''}`.trim();
    return '—';
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader className="h-8 w-8" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 mt-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
        <span className="text-sm text-gray-500">{orders.length} total</span>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-250 ${modalVisible ? "bg-black/50" : "bg-black/0"}`}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className={`bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col transition-all duration-250 ${modalVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          >
            {/* Modal header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold">Order {selectedOrder.order_number}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(selectedOrder.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 shrink-0">Status:</span>
                <div className="relative">
                  <select
                    value={selectedOrder.status}
                    onChange={e => updateStatus(selectedOrder.id, e.target.value)}
                    disabled={updatingStatus === selectedOrder.id}
                    className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {updatingStatus === selectedOrder.id && <Loader className="h-4 w-4" />}
              </div>

              {/* Customer info */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                <p className="font-medium text-gray-900">{getCustomerName(selectedOrder)}</p>
                {selectedOrder.customer_email && <p className="text-gray-500">{selectedOrder.customer_email}</p>}
                {selectedOrder.shipping_address?.phone && <p className="text-gray-500">{selectedOrder.shipping_address.phone}</p>}
                {selectedOrder.shipping_address?.address && (
                  <p className="text-gray-500">
                    {selectedOrder.shipping_address.address}, {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}
                  </p>
                )}
              </div>

              {/* Total */}
              <p className="font-semibold text-gray-900">Total: ₦{selectedOrder.total_amount.toLocaleString()}</p>

              {/* Items */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Items</h3>
                {loadingItems ? (
                  <div className="flex justify-center py-4"><Loader className="h-5 w-5" /></div>
                ) : orderItems.length === 0 ? (
                  <p className="text-sm text-gray-500">No items found.</p>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.products?.image_url ? (
                          <div className="relative h-10 w-10 rounded overflow-hidden shrink-0">
                            <Image src={item.products.image_url} alt={item.products.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs shrink-0">No img</div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.products?.name || 'Unknown product'}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₦{item.unit_price.toLocaleString()}</p>
                        </div>
                        <p className="text-sm font-medium shrink-0">₦{(item.quantity * item.unit_price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pb-5 pt-4 border-t border-gray-100 shrink-0">
              <button
                onClick={closeModal}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Cards */}
      <div className="sm:hidden space-y-3">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No orders yet.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{order.order_number}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{getCustomerName(order)}</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">₦{order.total_amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <button
                    onClick={() => openOrder(order)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No orders yet.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.order_number}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{getCustomerName(order)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {updatingStatus === order.id && <Loader className="h-3 w-3" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">₦{order.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View order details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
