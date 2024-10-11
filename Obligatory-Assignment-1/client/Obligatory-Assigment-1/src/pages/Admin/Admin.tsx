import { useState } from 'react';
import AddProduct from './Product/AddProduct/AddProduct';
import ProductTable from './Product/ProductTable/ProductTable';
import Modal from './Modal/Modal';
import AddProperty from './Property/AddProperty/AddProperty';
import PropertyTable from './Property/PropertyTable/PropertyTable';

function Admin() {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

    const openProductModal = () => setIsProductModalOpen(true);
    const closeProductModal = () => setIsProductModalOpen(false);

    const openPropertyModal = () => setIsPropertyModalOpen(true);
    const closePropertyModal = () => setIsPropertyModalOpen(false);

    return (
        <div className="flex flex-col items-center">
            <div>
                <h1 className="text-black text-6xl mt-16">Admin Page</h1>
            </div>
            <div className="flex flex-row w-full justify-around mt-10">
                <ProductTable />
                <PropertyTable />
            </div>
            <div className="flex flex-row space-x-4 mt-10">
                <button
                    className="btn btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                    onClick={openProductModal}
                >
                    Add Product
                </button>
                <button
                    className="btn btn-md lg:btn-lg bg-green-600 text-white hover:bg-green-700 transition duration-200"
                    onClick={openPropertyModal}
                >
                    Add Property
                </button>
            </div>
            <Modal isOpen={isProductModalOpen} onClose={closeProductModal}>
                <AddProduct closeModal={closeProductModal} />
            </Modal>
            <Modal isOpen={isPropertyModalOpen} onClose={closePropertyModal}>
                <AddProperty closeModal={closePropertyModal} />
            </Modal>
        </div>
    );
}

export default Admin;