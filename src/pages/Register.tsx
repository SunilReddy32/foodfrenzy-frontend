import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const user = await registerUser({ name, email, password, role });
      login(user);
      toast.success("Account created!");
      navigate(user.role === "ADMIN" ? "/admin" : "/menu");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-2 mb-8">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          <span className="text-2xl font-display font-bold">
            Food<span className="text-primary">Frenzy</span>
          </span>
        </div>

        <h2 className="text-3xl font-display font-bold text-foreground">Create account</h2>
        <p className="text-muted-foreground mt-1 mb-8">Join FoodFrenzy and start ordering</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="relative mt-1.5">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="name" placeholder="John Doe" className="pl-10" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="reg-email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="reg-email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="reg-password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Role</Label>
            <div className="flex gap-3 mt-1.5">
              <button type="button" onClick={() => setRole("USER")}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${role === "USER" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground border-border hover:border-primary/50"}`}>
                Customer
              </button>
              <button type="button" onClick={() => setRole("ADMIN")}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${role === "ADMIN" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground border-border hover:border-primary/50"}`}>
                Admin
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
            {loading ? "Creating..." : <>Create Account <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
