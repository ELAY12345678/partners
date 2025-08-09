import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useCategories = () => {

    const categoriesService = getService("categories");

    const [categoriesData, setCategoriesData] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        setLoadingCategories(true);
        categoriesService
            .find({
                query: {
                    $sort: { name: 1 },
                    $limit: 50000,
                },
            })
            .then(({ data }) => {
                setCategoriesData(data);
                setLoadingCategories(false);
            })
            .catch((error) => {
                setCategoriesData([]);
                setLoadingCategories(false);
                message.error(error.message)
            })
            ;
    }, [])

    return [
        categoriesData,
        loadingCategories
    ];
}