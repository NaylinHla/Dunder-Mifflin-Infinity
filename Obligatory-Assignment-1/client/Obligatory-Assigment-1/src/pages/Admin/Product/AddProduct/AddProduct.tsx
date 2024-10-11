import { useState } from 'react';
import { Api } from "../../../../../Api.ts";
import { useAtom } from 'jotai';
import { productsAtom } from '../ProductTable/ProductTable.tsx';
import './AddProduct.css';
import getAPIA from "../../../../components/Utils/getAPIA.ts";

export const MyApi = new Api();

async function createPaper(name: string, stock: number, price: number) {
    const response = await MyApi.api.paperCreatePaper({
        name: name,
        stock: stock,
        price: price
    ,},getAPIA());
    return response.data;
}

function AddProduct({ closeModal }: { closeModal: () => void }) {
    const [name, setName] = useState('');
    const [stock, setStock] = useState(0);
    const [price, setPrice] = useState(0);
    const [products, setProducts] = useAtom(productsAtom);

    const handleCreatePaper = async () => {
        const newProduct = await createPaper(name, stock, price);
        // @ts-ignore
        setProducts([...products, newProduct]);
        setName('');
        setStock(0);
        setPrice(0);
        closeModal();
    };

    return (
        <div className="flex flex-col justify-center">
            <div>
                <h1 className="text-black text-6xl">Add Product</h1>
            </div>

            <div className="text-black text-3xl mt-10 flex items-center">
                <p className="w-32">Name</p>
                <input
                    className="flex-grow input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="text-black text-3xl mt-10 flex items-center">
                <p className="w-32">Stock</p>
                <input
                    className="flex-grow input-field"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                />
            </div>

            <div className="text-black text-3xl mt-10 flex items-center">
                <p className="w-32">Price</p>
                <input
                    className="flex-grow input-field"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
            </div>

            <div>
                <button
                    className="btn btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 mt-10"
                    onClick={handleCreatePaper}
                >
                    Add Product
                </button>
            </div>
        </div>
    );
}

export default AddProduct;