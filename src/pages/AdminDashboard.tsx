import { useState, useEffect } from "react";
import { Package, Clock, ChefHat, CheckCircle2 } from "lucide-react";
import { fetchOrders, updateOrderStatus } from "@/services/api";
import type { Order } from "@/types";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUS_CONFIG = {
  PENDING: { label: "Pending", icon: Clock, color: "bg-secondary text-secondary-foreground" },
  CONFIRMED: { label: "Confirmed", icon: Package, color: "bg-accent text-accent-foreground" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "bg-primary/10 text-primary" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "bg-success/10 text-success" },
};

const NEXT_STATUS: Record<string, Order["status"] | null> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "DELIVERED",
  DELIVERED: null,
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order ${orderId} updated to ${status.toLowerCase()}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  const filtered = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    preparing: orders.filter(o => o.status === "PREPARING").length,
    delivered: orders.filter(o => o.status === "DELIVERED").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Order Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage and track all orders</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: stats.total, icon: Package },
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Preparing", value: stats.preparing, icon: ChefHat },
            { label: "Delivered", value: stats.delivered, icon: CheckCircle2 },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-lg bg-card border border-border animate-fade-in">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <s.icon className="h-4 w-4" />
                <span className="text-sm">{s.label}</span>
              </div>
              <p className="text-2xl font-display font-bold text-card-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["ALL", "PENDING", "CONFIRMED", "PREPARING", "DELIVERED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}>
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status];
            const StatusIcon = cfg.icon;
            const nextStatus = NEXT_STATUS[order.status];

            return (
              <div key={order.id} className="p-6 rounded-lg bg-card border border-border animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-card-foreground">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.userName} · {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" /> {cfg.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.food.id} className="flex justify-between text-sm">
                      <span>{item.food.name} × {item.quantity}</span>
                      <span className="text-muted-foreground">${(item.food.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">📍 {order.address}</p>
                    <p className="text-lg font-bold text-primary mt-1">Total: ${order.total.toFixed(2)}</p>
                  </div>
                  {nextStatus && (
                    <Button size="sm" onClick={() => handleUpdateStatus(order.id, nextStatus)}>
                      Mark as {nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No orders found</p>
          </div>
        )}
      </main>
    </div>
  );
}
