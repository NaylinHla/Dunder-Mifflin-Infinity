import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-hot-toast';
import { BasketAtom, updateQuantity } from '../../atoms/BasketAtoms';

type InputFieldPaperQuantityProps = {
    item: {
        quantity: number;
        product_id: number;
        price: number;
        name: string;
        selectedProperty?: string;
    };
    stock: number;
};

function InputFieldPaperQuantity({ item, stock}: InputFieldPaperQuantityProps) {
    const [inputValue, setInputValue] = useState<string>(item.quantity.toString());
    const [basket, setBasket] = useAtom(BasketAtom); // Access the basket state

    useEffect(() => {
        // Set the input value when item.quantity changes
        setInputValue(item.quantity.toString());
    }, [item.quantity]);

    const handleFocus = () => {
        document.body.classList.add('overflow-hidden');
    }
    
    const handleBlur = () => {
        document.body.classList.remove('overflow-hidden');
        
        if (inputValue === '' || parseInt(inputValue, 10) > stock) {
            const validQuantity = Math.min(stock, parseInt(inputValue) || 0 );
            setInputValue(validQuantity.toString());
            handleQuantityChange(validQuantity.toString());
            if (inputValue !== ''){
                toast.error(`Only ${stock} items are available in stock.`);
            }
        }
    }
    
    const handleQuantityChange = (newQuantity: string) => {
        // Immediately update the input value
        setInputValue(newQuantity);

        // Exit early if the input is empty
        if (newQuantity === '') return;


        // Parse the new quantity
        const quantity = parseInt(newQuantity, 10) || 0;
        const productId = item.product_id;

        // Update the basket based on the new quantity
        if (quantity === 0) {
            updateQuantity(basket, productId, 0, item.price, item.name, "N/A", setBasket, );
            // Remove product if quantity is 0
            setBasket(basket.filter(item => item.product_id !== productId));
            toast.success("Product removed from basket");
        } else if (quantity <= stock) {
            const selectedProperty = item.selectedProperty || "N/A";
            updateQuantity(basket, productId, quantity, item.price, item.name, selectedProperty, setBasket);
        }
    };

    return (
        <input
            type="number"
            className="w-16 text-center border rounded"
            value={inputValue}
            onChange={(e) => {
                const { value } = e.target;

                // Check if the input value is not empty
                if (value === '') {
                    handleQuantityChange("");
                    return;
                }

                if (!isNaN(Number(value)) && Number(value) >= 0) {
                    const limitedValue = Math.min(Number(value), stock);
                    if (Number(value) <= stock){
                        handleQuantityChange(limitedValue.toString())
                    } else {
                        setInputValue(limitedValue.toString());
                        handleQuantityChange(limitedValue.toString())
                        toast.dismiss();
                        toast.error(`You cannot exceed the available stock of ${stock} items.`);
                    }
                } else if (value === '') {
                    setInputValue('');
                    handleQuantityChange('')
                }
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min={0}
            max={stock}
        />
    );
}

export default InputFieldPaperQuantity;
