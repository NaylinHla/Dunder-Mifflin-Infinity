import { Api } from "../../../../../Api.ts";
import { useAtom } from "jotai";
import { productsAtom } from "../ProductTable/ProductTable.tsx";
import './ContinueProduct.css';
import getAPIA from "../../../../components/Utils/getAPIA.ts";

export const MyApi = new Api();

async function continueProductById(id: string) {
    await MyApi.api.paperUpdateContinue(id, getAPIA());
}

function ContinueProduct({ productId }: { productId: string }) {
    const [products, setProducts] = useAtom(productsAtom);

    const handleContinue = async () => {
        await continueProductById(productId);
        setProducts(products.map(product =>
            product.id === productId ? { ...product, discontinued: false } : product
        ));
    };

    return (
        <button className="btn btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 mt-10" onClick={handleContinue}>
            Continue
        </button>
    );
}

export default ContinueProduct;