import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useEstablishmentCategories = ({ id }) => {

    const establishmentsCategoriesService = getService("establishments-categories");
    const [establishmentCategories, setEstablishmentCategories] = useState([]);
    const [loadingEstablishmentCategories, setLoadingEstablishmentCategories] = useState(false);

    const getEstablishmentCategories = () => {
        setLoadingEstablishmentCategories(true);
        establishmentsCategoriesService.find({
            query: {
                establishment_id: Number(id),
                $limit: 50000,
            },
        })
            .then(({ data }) => {
                setEstablishmentCategories(data);
                setLoadingEstablishmentCategories(false);
            })
            .catch((error) => {
                setEstablishmentCategories([]);
                setLoadingEstablishmentCategories(false);
                message.error(error.message)
            });
    }

    useEffect(() => {
        getEstablishmentCategories();
    }, [id]);

    return [
        establishmentCategories,
        getEstablishmentCategories,
        loadingEstablishmentCategories
    ];
}