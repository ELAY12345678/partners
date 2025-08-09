import { message } from 'antd';
import { useEffect, useState } from 'react';
import { getService } from '../services';

export const useCitiesTmp = () => {
    const citiesService = getService("cities");

    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        setLoadingCities(true);
        citiesService
            .find({ query: { 
                $client: {
                    totalBranchesByCity: true
                }
                //status : 'active' 
            } })
            .then(( data ) => {
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