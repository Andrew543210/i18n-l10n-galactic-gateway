'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    destId: string;
    destName: string;
    passengers: number;
    cabinClass: string;
    totalPrice: number;
    discount: number;
}

export interface Ticket extends CartItem {
    purchaseDate: string;
}

interface Destination {
    id: string;
    name: string;
    ticketsLeft: number;
    days: number;
    launchDate: string;
    basePrice: number;
}

interface SpaceContextType {
    destinations: Destination[];
    cart: CartItem[];
    myTickets: Ticket[];
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    removeFromCart: (id: string) => void;
    processPayment: () => Promise<void>;
}

const INITIAL_DESTINATIONS: Destination[] = [
    { id: 'mars', name: 'Mars Colony Alpha', ticketsLeft: 12, days: 210, launchDate: '2026-11-15', basePrice: 250000 },
    { id: 'moon', name: 'Artemis Moon Base', ticketsLeft: 1, days: 3, launchDate: '2026-06-01', basePrice: 45000 },
    { id: 'titan', name: 'Titan Orbital Station', ticketsLeft: 5, days: 1460, launchDate: '2027-01-20', basePrice: 890000 },
];

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export function SpaceProvider({ children }: { children: React.ReactNode }) {
    const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [myTickets, setMyTickets] = useState<Ticket[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('space_cart');
            const savedTickets = localStorage.getItem('space_tickets');
            const savedDestinations = localStorage.getItem('space_destinations');

            if (savedCart) setCart(JSON.parse(savedCart));
            if (savedTickets) setMyTickets(JSON.parse(savedTickets));
            if (savedDestinations) setDestinations(JSON.parse(savedDestinations));
        } catch (e) {
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('space_cart', JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('space_tickets', JSON.stringify(myTickets));
        }
    }, [myTickets, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('space_destinations', JSON.stringify(destinations));
        }
    }, [destinations, isLoaded]);

    const addToCart = (item: Omit<CartItem, 'id'>) => {
        const newItem = { ...item, id: Math.random().toString(36).substring(2, 9) };
        setCart((prev) => [...prev, newItem]);
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    const processPayment = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newTickets: Ticket[] = cart.map((item) => ({
            ...item,
            purchaseDate: new Date().toLocaleDateString(),
        }));

        setMyTickets((prev) => [...prev, ...newTickets]);

        setDestinations((prev) =>
            prev.map((dest) => {
                const cartItem = cart.find((item) => item.destId === dest.id);
                if (cartItem) {
                    return { ...dest, ticketsLeft: Math.max(0, dest.ticketsLeft - cartItem.passengers) };
                }
                return dest;
            })
        );

        setCart([]);
    };

    return (
        <SpaceContext.Provider value={{ destinations, cart, myTickets, addToCart, removeFromCart, processPayment }}>
            {children}
        </SpaceContext.Provider>
    );
}

export function useSpace() {
    const context = useContext(SpaceContext);
    if (!context) {
        throw new Error('useSpace must be used within a SpaceProvider');
    }
    return context;
}