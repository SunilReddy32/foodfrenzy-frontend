import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroFood from "@/assets/hero-food.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const user = await loginUser({ email, password });
      login(user);
      toast.success("Welcome back!");
      navigate(user.role === "ADMIN" ? "/admin" : "/menu");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={heroFood} alt="Delicious food" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <h1 className="text-5xl font-display font-bold text-primary-foreground leading-tight">
            Delicious food,<br />delivered to you.
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-md">
            Browse hundreds of dishes from your favourite restaurants. Order in seconds.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-2 mb-8">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold">
              Food<span className="text-primary">Frenzy</span>
            </span>
          </div>

          <h2 className="text-3xl font-display font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground mt-1 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
              {loading ? "Signing in..." : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>

          <div className="mt-8 p-4 rounded-lg bg-accent text-accent-foreground text-sm">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>User: any email & password</p>
            <p>Admin: admin@foodfrenzy.com & any password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
