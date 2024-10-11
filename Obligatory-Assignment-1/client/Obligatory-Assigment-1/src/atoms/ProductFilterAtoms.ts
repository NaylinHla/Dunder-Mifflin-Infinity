import { atom } from "jotai";

// Define different product price filters
export const productPriceFilterAtom = atom([
    "Normal",
    "Ascending",
    "Descending",
]);

// Atom used to store the properties from db to use for filtering sop
export const productPropertiesFilterAtom = atom([
    
]);
// Atom used to store the current filter used in the store
export const productPropertyFilterAtom = atom();