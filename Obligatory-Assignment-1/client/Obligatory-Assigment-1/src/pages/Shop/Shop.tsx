import {useAtom} from "jotai";
import React, {useEffect, useState} from "react";
import {productAtom, Product} from "../../atoms/ProductAtom.ts";
import {BasketAtom, updateQuantity, loadBasketFromStorage} from "../../atoms/BasketAtoms.ts";
import {Api} from "../../../Api.ts";
import {toast} from "react-hot-toast";
import InputFieldPaperQuantity from "../../components/Orders/InputFieldPaperQuantity.tsx";
import {searchAtom} from "../../atoms/atoms.ts";
import {productPriceFilterAtom, productPropertyFilterAtom} from "../../atoms/ProductFilterAtoms.ts";
import paper_shop_picture1 from "../../assets/Shop_Pictures/paper_shop_picture1.png";
import paper_shop_picture2 from "../../assets/Shop_Pictures/paper_shop_picture2.png";
import paper_shop_picture3 from "../../assets/Shop_Pictures/paper_shop_picture3.png";

export const MyApi = new Api();

interface ShopCardProps {
    product: Product;
    initialQuantity: number;
    onAdd: (productId: number, newQuantity: number, price: number, name: string, selectedProperty: string) => void;
    onRemove: (productId: number, newQuantity: number, price: number, name: string, selectedProperty: string) => void;
    stock?: number;
    imageSrc: string;
}

interface Property {
    id: number;
    propertyName: string;
}

const productImageMap: { [key: string]: string } = {
    "Standard": paper_shop_picture1,
    "Deluxe": paper_shop_picture2,
    "Eco-Friendly": paper_shop_picture3,
};


const ShopCard = React.memo(({ product, initialQuantity, onAdd, onRemove, imageSrc }: ShopCardProps) => {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.propertiesGetAllProperties();
                // @ts-expect-error: Ignore an error if it doesn't exist
                setProperties(response.data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        fetchData().then();
    }, []);

    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const handleAddClick = () => {
        if (quantity < product.stock) {
            setQuantity(prev => prev + 1);
            onAdd(product.id, quantity + 1, product.price, product.name, selectedProperty);
        }
        else {
            toast.dismiss()
            toast.error(`You cannot exceed the available stock of ${product.stock} items.`);
        }
    };

    const handleRemoveClick = () => {
        setQuantity(prev => prev - 1);
        onRemove(product.id, quantity - 1, product.price, product.name, selectedProperty);
    };

    const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProperty(e.target.value);
    };

    return (
        <div className="card card-compact bg-base-100 shadow-xl flex flex-col w-full">
            <figure>
                <img src={imageSrc} alt={product.name} /> {/* Use imageSrc prop */}
            </figure>
            <div className="card-body flex flex-col flex-grow">
                <h2 className="card-title block truncate max-w-full">{product.name}</h2>
                <div className="card-actions justify-between items-center mt-auto">
                    <p className="flex-grow">Price: ${product.price}</p>
                    <p className="font-semibold">In basket: {quantity}</p>
                </div>
                <div className="card-actions justify-between items-center mt-auto">
                    <button onClick={handleAddClick} className="btn bg-green-500 mr-2">+</button>
                    <InputFieldPaperQuantity item={{ quantity, product_id: product.id, price: product.price, name: product.name }} stock={product.stock} />
                    <button onClick={handleRemoveClick} className="btn bg-red-500 ml-2" disabled={quantity === 0}>-</button>
                </div>
                <div className="flex justify-center">
                    <select value={selectedProperty} onChange={handlePropertyChange}>
                        <option value="">White</option> {/* Add a default option */}
                        {properties.map((property) => (
                            <option key={property.id} value={property.propertyName}>
                                {property.propertyName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
});

function Shop() {
    const [products, setProducts] = useAtom(productAtom);
    const [basket, setBasket] = useAtom(BasketAtom);
    const [searchQuery] = useAtom(searchAtom);
    const [sortPrice, setSortPrice] = useState<string>("Normal");
    const [priceFilters] = useAtom(productPriceFilterAtom);
    const [propertyFilter] = useAtom(productPropertyFilterAtom);

    useEffect(() => {
        loadBasketFromStorage(setBasket);
    }, [setBasket]);

    const getProductQuantity = (productId: number) => {
        const productInBasket = basket.find((item) => item.product_id === productId);
        return productInBasket ? productInBasket.quantity : 0;
    };
  
    const handleAdd = (productId: number, newQuantity: number, price: number, name: string, selectedProperty: string) => {
        const existingQuantity = getProductQuantity(productId);
        if (existingQuantity > 0) {
            updateQuantity(basket, productId, newQuantity, price, name, selectedProperty, setBasket);
            toast.success("Product quantity updated", { duration: 1000 });
        } else {
            updateQuantity(basket, productId, newQuantity, price, name, selectedProperty, setBasket);
            toast.success("Product added to basket", { duration: 1000 });
        }
    };

    const handleRemove = (productId: number, newQuantity: number, price: number, name: string, selectedProperty: string) => {
        const existingQuantity = getProductQuantity(productId);
        if (existingQuantity > 1) {
            updateQuantity(basket, productId, newQuantity, price, name, selectedProperty, setBasket);
            toast.error("Product quantity decreased", { duration: 1000 });
        } else {
            updateQuantity(basket, productId, newQuantity, price, name, selectedProperty, setBasket);
            toast.error("Product removed from basket");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers();
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData().then();
    }, [setProducts]);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = sortPrice === "Normal" || sortPrice === "Ascending" || sortPrice === "Descending" || product.price.toString() === sortPrice;
        if (sortPrice === "Ascending" || sortPrice === "Descending" || sortPrice === "Normal") { return matchesSearch; }
        const matchesProperty = !propertyFilter;

        return matchesSearch && matchesPrice && matchesProperty;
    })
        .sort((a, b) => {
            if (sortPrice === "Ascending") return a.price - b.price;
            if (sortPrice === "Descending") return b.price - a.price;
            return 0;
        });

    return (
        <div className="text-black">
            <h1 className="text-2xl sm:text-3xl font-bold bg-center text-center mt-5">Limitless Paper in a Paperless World</h1>
            <div className="mb-4">
                <label htmlFor="sortPrice" className="mr-2 bg-center flex ml-5 sm:mt-0 mt-5">Sort by Price:</label>
                <select
                    id="sortPrice"
                    value={sortPrice}
                    onChange={(e) => setSortPrice(e.target.value)}
                    className="border rounded p-1 flex-grow ml-5"
                >
                    {priceFilters.map((filter) => (
                        <option key={filter} value={filter}>
                            {filter}
                        </option>
                    ))}
                </select>
            </div>
            <div className="card-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mx-2 mt-10">
                {filteredProducts.filter(product => !product.discontinued && product.stock > 0).map((product) => (
                    <ShopCard
                        key={product.id}
                        product={product}
                        initialQuantity={getProductQuantity(product.id)}
                        onAdd={handleAdd}
                        onRemove={handleRemove}
                        stock={product.stock}
                        imageSrc={productImageMap[product.name] || paper_shop_picture1} // Use imageSrc from mapping
                    />
                ))}
            </div>
        </div>
    );
}

export default Shop;