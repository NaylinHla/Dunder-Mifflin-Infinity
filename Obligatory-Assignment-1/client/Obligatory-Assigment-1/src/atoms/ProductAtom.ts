import { atom } from 'jotai';

// Define Product interface
export interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    properties: string[];
    discontinued: boolean;
}

// Atom to hold product data
export const productAtom = atom<Product[]>([]); // Initialize as an empty array of Product objects
