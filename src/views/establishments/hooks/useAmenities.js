import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../services';


const establishmentSpecialAmenitiesId = 53;

export const useAmenities = () => {

    const configurationsService = getService('configurations');

    const [amenities, setAmenities] = useState([]);
    const [loadingAmenities, setLoadingAmenities] = useState();


    useEffect(() => {
        setLoadingAmenities(true);
        configurationsService.get(establishmentSpecialAmenitiesId)
            .then((data) => {
                setAmenities(JSON.parse(data.value));
                setLoadingAmenities(false);
            })
            .catch((error) => {
                message.error(error.message);
                setLoadingAmenities(false);
            })
    }, [])

    return [
        amenities,
        loadingAmenities
    ];
}