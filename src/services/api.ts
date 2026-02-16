import type { FoodItem, LoginRequest, Order, RegisterRequest, User } from "@/types";

// Change this to your Spring Boot backend URL
const API_BASE = "http://localhost:8080/api";

// --- Mock data for demo (remove when backend is ready) ---
const MOCK_FOODS: FoodItem[] = [
  { id: "1", name: "Margherita Pizza", description: "Classic cheese pizza with fresh basil and tomato sauce", price: 12.99, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", category: "Pizza", rating: 4.5, isVeg: true },
  { id: "2", name: "Chicken Burger", description: "Juicy grilled chicken patty with lettuce and special sauce", price: 9.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", category: "Burgers", rating: 4.3, isVeg: false },
  { id: "3", name: "Caesar Salad", description: "Crispy romaine lettuce with parmesan and croutons", price: 8.49, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", category: "Salads", rating: 4.1, isVeg: true },
  { id: "4", name: "Sushi Platter", description: "Assorted fresh sushi rolls with soy sauce and wasabi", price: 18.99, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400", category: "Sushi", rating: 4.7, isVeg: false },
  { id: "5", name: "Pasta Carbonara", description: "Creamy pasta with bacon, egg, and parmesan cheese", price: 13.49, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", category: "Pasta", rating: 4.4, isVeg: false },
  { id: "6", name: "Veggie Wrap", description: "Fresh vegetables wrapped in a soft tortilla with hummus", price: 7.99, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400", category: "Wraps", rating: 4.0, isVeg: true },
  { id: "7", name: "BBQ Ribs", description: "Slow-cooked ribs glazed with smoky BBQ sauce", price: 16.99, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", category: "BBQ", rating: 4.6, isVeg: false },
  { id: "8", name: "Mushroom Risotto", description: "Creamy arborio rice with wild mushrooms and truffle oil", price: 14.49, image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400", category: "Pasta", rating: 4.2, isVeg: true },
];

const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", userId: "1", userName: "John Doe", items: [{ food: MOCK_FOODS[0], quantity: 2 }, { food: MOCK_FOODS[1], quantity: 1 }], total: 35.97, status: "PENDING", createdAt: new Date().toISOString(), address: "123 Main St, City" },
  { id: "ORD-002", userId: "2", userName: "Jane Smith", items: [{ food: MOCK_FOODS[3], quantity: 1 }], total: 18.99, status: "PREPARING", createdAt: new Date(Date.now() - 3600000).toISOString(), address: "456 Oak Ave, Town" },
  { id: "ORD-003", userId: "3", userName: "Bob Wilson", items: [{ food: MOCK_FOODS[4], quantity: 2 }, { food: MOCK_FOODS[6], quantity: 1 }], total: 43.97, status: "DELIVERED", createdAt: new Date(Date.now() - 86400000).toISOString(), address: "789 Pine Rd, Village" },
];

let USE_MOCK = true; // Set to false when backend is connected

// --- Auth ---
export async function loginUser(data: LoginRequest): Promise<User> {
  if (USE_MOCK) {
    // Demo login: any email works, admin@foodfrenzy.com for admin
    return {
      id: "1",
      name: data.email === "admin@foodfrenzy.com" ? "Admin" : "User",
      email: data.email,
      role: data.email === "admin@foodfrenzy.com" ? "ADMIN" : "USER",
    };
  }
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function registerUser(data: RegisterRequest): Promise<User> {
  if (USE_MOCK) {
    return { id: "new-1", name: data.name, email: data.email, role: data.role };
  }
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

// --- Food ---
export async function fetchFoodItems(): Promise<FoodItem[]> {
  if (USE_MOCK) return MOCK_FOODS;
  const res = await fetch(`${API_BASE}/foods`);
  return res.json();
}

// --- Orders ---
export async function createOrder(order: Omit<Order, "id" | "status" | "createdAt">): Promise<Order> {
  if (USE_MOCK) {
    return { ...order, id: `ORD-${Date.now()}`, status: "PENDING", createdAt: new Date().toISOString() };
  }
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return res.json();
}

export async function fetchOrders(): Promise<Order[]> {
  if (USE_MOCK) return MOCK_ORDERS;
  const res = await fetch(`${API_BASE}/orders`);
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
  if (USE_MOCK) {
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    if (order) order.status = status;
    return order!;
  }
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}
