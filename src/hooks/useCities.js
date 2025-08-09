import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getService } from '../services';

export const useCities = () => {
    const citiesService = getService("cities");

    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        setLoadingCities(true);
        citiesService
            .find({
                query: {
                    $limit: 100000,
                    $sort: {
                        name: 1,
                    },
                }
            })
            .then(({ data }) => {
                setCities(data);
                setLoadingCities(false);
            })
            .catch((err) => {
                message.error(err.message);
                setCities([]);
                setLoadingCities(false);
            });
    }, []);


    return [
        cities,
        loadingCities
    ];
}