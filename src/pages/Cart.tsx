import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/services/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [ordering, setOrdering] = useState(false);

  const handleOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    setOrdering(true);
    try {
      await createOrder({
        userId: user!.id,
        userName: user!.name,
        items,
        total,
        address,
      });
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/menu");
    } catch {
      toast.error("Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-3xl">
        <Link to="/menu" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to menu
        </Link>
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Link to="/menu">
              <Button className="mt-4">Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map(({ food, quantity }) => (
                <div key={food.id} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                  <img src={food.image} alt={food.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-card-foreground">{food.name}</h3>
                    <p className="text-sm text-muted-foreground">${food.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(food.id, quantity - 1)}
                        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-6 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(food.id, quantity + 1)}
                        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeItem(food.id)} className="ml-auto text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-bold text-primary">
                    ${(food.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input id="address" placeholder="Enter your delivery address" className="mt-1.5" value={address} onChange={e => setAddress(e.target.value)} />
            </div>

            {/* Summary */}
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-success">Free</span>
              </div>
              <div className="border-t border-border my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={handleOrder} disabled={ordering}>
                {ordering ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
