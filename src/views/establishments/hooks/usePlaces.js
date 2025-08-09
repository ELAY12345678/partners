import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const usePlaces = ({ city_id }) => {

    const placesService = getService('places');

    const [places, setPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    useEffect(() => {
        setLoadingPlaces(true);
        placesService.find({
            query: {
                city_id,
                status: 'active',
                $limit: 5000,
                $sort: {
                    name: 1
                },
                // $select: ['name', 'id']
            }
        }).then(({ data }) => {
            setPlaces(data);
            setLoadingPlaces(false);
        }).catch((error) => {
            message.error(error.message);
            setLoadingPlaces(false);
        })
    }, [city_id])

    return [
        places,
        loadingPlaces
    ];
}