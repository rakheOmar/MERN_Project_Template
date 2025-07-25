import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Trash2,
    Plus,
    Minus,
    Package,
    CreditCard,
    Truck,
    Shield,
} from "lucide-react";

export default function CartPage() {
    const [items, setItems] = useState([
        {
            id: "1",
            name: "Classic Chronograph Watch",
            price: 299.99,
            originalPrice: 399.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            color: "Black",
            size: "Standard",
            stock: 5,
        },
        {
            id: "2",
            name: "Sport Diver Watch",
            price: 199.99,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            color: "Blue",
            size: "Standard",
            stock: 3,
        },
    ]);

    const [shippingMethod, setShippingMethod] = useState("standard");

    const shippingMethods = [
        {
            id: "standard",
            name: "Standard Shipping",
            price: 5.99,
            estimatedDays: "3-5 days",
            description: "Free shipping on orders over $200",
        },
        {
            id: "express",
            name: "Express Shipping",
            price: 12.99,
            estimatedDays: "1-2 days",
            description: "Priority delivery with tracking",
        },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = shippingMethods.find((m) => m.id === shippingMethod)?.price || 0;
    const total = subtotal + shipping;

    const updateQuantity = (id, change) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="mx-auto w-full max-w-7xl p-6 pt-[120px]">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div>
                        <h1 className="text-2xl font-semibold">Shopping Cart</h1>
                        <p className="text-muted-foreground">
                            {items.length} {items.length === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="overflow-hidden p-0">
                                <CardContent className="p-0">
                                    <div className="flex h-full flex-col md:flex-row">
                                        <div className="relative h-auto w-full md:w-32">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover md:w-32"
                                            />
                                        </div>
                                        <div className="flex-1 p-6 pb-3">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        {item.color} • {item.size}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                                    {item.originalPrice && (
                                                        <div className="text-muted-foreground text-sm line-through">
                                                            ${(item.originalPrice * item.quantity).toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>
                                Review your order details and shipping information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Shipping Method</Label>
                                <Select value={shippingMethod} onValueChange={setShippingMethod}>
                                    <SelectTrigger className="w-full max-w-none data-[size=default]:h-auto">
                                        <SelectValue placeholder="Select shipping method" />
                                    </SelectTrigger>
                                    <SelectContent className="!h-auto">
                                        {shippingMethods.map((method) => (
                                            <SelectItem key={method.id} value={method.id} className="!h-auto">
                                                <div className="flex flex-col justify-between text-start">
                                                    <div className="font-medium">{method.name}</div>
                                                    <div className="text-muted-foreground text-sm">{method.estimatedDays}</div>
                                                    <div className="font-medium">${method.price.toFixed(2)}</div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Promo Code</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter promo code" />
                                    <Button variant="outline">Apply</Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="text-primary h-4 w-4" />
                                    <span>Free returns within 30 days</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Shield className="text-primary h-4 w-4" />
                                    <span>Secure payment</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Truck className="text-primary h-4 w-4" />
                                    <span>Fast delivery</span>
                                </div>
                            </div>

                            <Button className="w-full">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
