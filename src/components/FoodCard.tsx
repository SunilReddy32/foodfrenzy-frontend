import { Plus, Star, Leaf } from "lucide-react";
import type { FoodItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FoodCardProps {
  food: FoodItem;
}

export default function FoodCard({ food }: FoodCardProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(food);
    toast.success(`${food.name} added to cart`);
  };

  return (
    <div className="group rounded-lg overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {food.isVeg && (
          <span className="absolute top-3 left-3 bg-success text-success-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
            <Leaf className="h-3 w-3" /> Veg
          </span>
        )}
        <span className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
          <Star className="h-3 w-3 fill-secondary text-secondary" /> {food.rating}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-card-foreground">{food.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{food.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${food.price.toFixed(2)}</span>
          <Button size="sm" onClick={handleAdd} className="gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
