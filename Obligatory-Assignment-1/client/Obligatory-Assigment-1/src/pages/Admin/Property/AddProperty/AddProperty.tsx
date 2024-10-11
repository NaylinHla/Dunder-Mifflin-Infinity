import { useState } from 'react';
import { useAtom } from 'jotai';
import { propertiesAtom } from '../../../../atoms/propertiesAtom.ts';
import {Api} from "../../../../../Api.ts";
import getAPIA from "../../../../components/Utils/getAPIA.ts";

export const MyApi = new Api();

async function createProperty(name: string) {
    const response = await MyApi.api.propertiesCreateProperty({
        PropertyName: name
    }, getAPIA());
    return response.data;
}

function AddProperty({ closeModal }: { closeModal: () => void }) {
    const [name, setName] = useState('');
    const [properties, setProperties] = useAtom(propertiesAtom);

    const handleCreateProperty = async () => {
        const newProperty = await createProperty(name);
        setProperties([...properties, newProperty]);
        setName('');
        closeModal();
        window.location.reload();
    };

    return (
        <div className="flex flex-col justify-center">
            <div>
                <h1 className="text-black text-6xl">Add Property</h1>
            </div>

            <div className="text-black text-3xl mt-10 flex items-center">
                <p className="w-32">Name</p>
                <input
                    className="flex-grow input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <button
                    className="btn btn-md lg:btn-lg bg-green-600 text-white hover:bg-green-700 transition duration-200 mt-10"
                    onClick={handleCreateProperty}
                >
                    Add Property
                </button>
            </div>
        </div>
    );
}

export default AddProperty;