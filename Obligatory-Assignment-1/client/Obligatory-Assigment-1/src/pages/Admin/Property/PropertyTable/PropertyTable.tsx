import DeleteProperty from '../DeleteProperty/DeleteProperty';
import {useAtom} from "jotai";
import {propertiesAtom} from "../../../../atoms/propertiesAtom.ts";
import {useEffect} from "react";
import {Api, Property} from "../../../../../Api.ts";

export const MyApi = new Api();

function PropertyTable() {
    const [properties, setProperties] = useAtom(propertiesAtom);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.propertiesGetAllProperties();
                const propertiesData = response.data.map((item: any) => ({
                    id: item.id,
                    name: item.propertyName // Map propertyName to name
                })) as Property[];
                setProperties(propertiesData);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        fetchData();
    }, [setProperties]);

    return (
        <table className="text-black text-4xl text-left">
            <thead>
            <tr>
                <th className="table-cell-padding">Name</th>
                <th className="table-cell-padding"></th>
            </tr>
            </thead>
            <tbody>
            {properties.map((property, index) => (
                <tr key={index}>
                    <td className="table-cell-padding">{property.name}</td>
                    <td className="table-cell-padding">
                        <DeleteProperty propertyId={property.id} />
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default PropertyTable;