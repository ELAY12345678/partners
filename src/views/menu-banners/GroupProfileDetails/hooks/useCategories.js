import { message } from "antd";
import { useEffect, useState } from "react";
import { getService } from "../../../../services";

export const useCategories = ({ establishment_id }) => {
    const establishmentsCategoriesServices = getService('establishments-menu-items-categories');

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const getCategoriesDatas = () => {
        setLoadingCategories(true);
        establishmentsCategoriesServices.find({
            query: {
                establishment_id,
                status: 'active',
                $limit: 10000,
                $select: ['id', 'name', 'status']
            }
        })
            .then(({ data }) => {
                setCategoryOptions(data);
                setLoadingCategories(false);
            })
            .catch((err) => {
                message.error(err);
                setLoadingCategories(false);
            });
    };

    useEffect(() => {
        if (establishment_id)
            getCategoriesDatas();
        else
            setCategoryOptions([]);
    }, [establishment_id]);

    return [
        categoryOptions,
        loadingCategories,
    ];
}