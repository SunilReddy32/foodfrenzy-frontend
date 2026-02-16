import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { fetchFoodItems } from "@/services/api";
import type { FoodItem } from "@/types";
import FoodCard from "@/components/FoodCard";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["All", "Pizza", "Burgers", "Salads", "Sushi", "Pasta", "Wraps", "BBQ"];

export default function Menu() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchFoodItems().then(setFoods);
  }, []);

  const filtered = foods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "All" || f.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Explore Menu</h1>
          <p className="text-muted-foreground mt-1">Find your next favourite dish</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search dishes..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(food => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No dishes found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
