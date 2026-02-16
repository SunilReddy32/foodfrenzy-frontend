import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, UtensilsCrossed, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to={isAdmin ? "/admin" : "/menu"} className="flex items-center gap-2">
          <UtensilsCrossed className="h-7 w-7 text-primary" />
          <span className="text-xl font-display font-bold text-foreground">
            Food<span className="text-primary">Frenzy</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/menu">
                <Button variant="ghost" size="sm">Menu</Button>
              </Link>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </>
          )}
          <span className="text-sm text-muted-foreground hidden sm:block">
            Hi, {user?.name}
          </span>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
