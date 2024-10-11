import { useState } from "react";
import { Product } from "../ProductTable/ProductTable.tsx";
import './UpdateProduct.css';

interface UpdateProductProps {
    product: Product;
    onSave: (updatedProduct: Product) => void;
}

function UpdateProduct({ product, onSave }: UpdateProductProps) {
    const [name, setName] = useState(product.name);
    const [stock, setStock] = useState(product.stock);
    const [price, setPrice] = useState(product.price);

    const handleSave = () => {
        const updatedProduct = { ...product, name, stock, price };
        onSave(updatedProduct);
    };

    return (
        <>
            <td className="table-cell-padding">
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            </td>
            <td className="table-cell-padding">
                <input className="input-field" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
            </td>
            <td className="table-cell-padding">
                <input className="input-field" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </td>
            <td className="table-cell-padding">
                <button className="input-field" onClick={handleSave}>Confirm</button>
            </td>
        </>
    );
}

export default UpdateProduct;