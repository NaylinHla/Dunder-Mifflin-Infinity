import { atom } from 'jotai';

interface Property {
    id: string;
    name: string;
}

export const propertiesAtom = atom<Property[]>([]);