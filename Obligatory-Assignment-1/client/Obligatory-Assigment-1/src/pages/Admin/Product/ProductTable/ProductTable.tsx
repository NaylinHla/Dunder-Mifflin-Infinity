import { Api } from "../../../../../Api.ts";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import DiscontinueProduct from "../DiscontinueProduct/DiscontinueProduct.tsx";
import UpdateProduct from "../UpdateProduct/UpdateProduct.tsx";
import './ProductTable.css';
import getAPIA from "../../../../components/Utils/getAPIA.ts";

interface Product {
    id: string;
    name: string;
    stock: number;
    price: number;
    discontinued: boolean;
}

export const MyApi = new Api();

export const productsAtom = atom<Product[]>([]);

function ProductTable() {
    const [products, setProducts] = useAtom(productsAtom);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers(); // Fetch data
                // @ts-expect-error: Ignore an error there don't exist
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData().then();
    }, [setProducts]);

    const handleEdit = (productId: string) => {
        setIsEditing(productId);
    };

    const handleSave = async (updatedProduct: Product) => {
        try {
            await MyApi.api.paperUpdatePaper(updatedProduct.id, updatedProduct, getAPIA());
            setProducts(products.map(product =>
                product.id === updatedProduct.id ? updatedProduct : product
            ));
            setIsEditing(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <table className="text-black text-4xl text-left">
            <thead>
            <tr>
                <th className="table-cell-padding">Name</th>
                <th className="table-cell-padding">Stock</th>
                <th className="table-cell-padding">Price</th>
                <th className="table-cell-padding"></th>
            </tr>
            </thead>
            <tbody>
            {products.map((product, index) => (
                <tr key={index}>
                    {isEditing === product.id ? (
                        <UpdateProduct product={product} onSave={handleSave} />
                    ) : (
                        <>
                            <td className="table-cell-padding">{product.name}</td>
                            <td className="table-cell-padding">{product.stock}</td>
                            <td className="table-cell-padding">{product.price}</td>
                            <td className="table-cell-padding">
                                <button className="btn btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 mr-4" onClick={() => handleEdit(product.id)}>Edit</button>
                                <DiscontinueProduct productId={product.id} discontinued={product.discontinued} />
                            </td>
                        </>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default ProductTable;