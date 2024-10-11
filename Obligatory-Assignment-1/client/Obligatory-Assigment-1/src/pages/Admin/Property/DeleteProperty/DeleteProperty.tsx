import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { propertiesAtom } from '../../../../atoms/propertiesAtom.ts';
import { Api } from '../../../../../Api.ts';
import getAPIA from "../../../../components/Utils/getAPIA.ts";

export const MyApi = new Api();

interface DeletePropertyProps {
    propertyId: string;
}

function DeleteProperty({ propertyId }: DeletePropertyProps) {
    const [properties, setProperties] = useAtom(propertiesAtom);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const checkIfPropertyIsUsed = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers();
                const usedPropertyIds = response.data.flatMap((paper: any) => paper.properties.map((prop: any) => prop.id));
                setIsDisabled(usedPropertyIds.includes(propertyId));
            } catch (error) {
                console.error("Error checking property usage:", error);
            }
        };
        checkIfPropertyIsUsed();
    }, [propertyId]);

    const handleDelete = async () => {
        if (isDisabled) return;
        try {
            await MyApi.api.propertiesDeleteProperty(propertyId, getAPIA());
            setProperties(properties.filter(property => property.id !== propertyId));
        } catch (error) {
            console.error("Error deleting property:", error);
        }
    };

    return (
        <button
            className={`btn btn-md lg:btn-lg ${isDisabled ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white`}
            onClick={handleDelete}
            disabled={isDisabled}
        >
            Delete
        </button>
    );
}

export default DeleteProperty;