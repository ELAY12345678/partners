import { message } from 'antd';
import { useEffect, useState } from 'react';
import { getService } from '../../../services';

export const useBanners = () => {
    const bannersService = getService("tables-partners-groups");

    const [banners, setBanners] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(false);

    const getBanners = () => {
        setLoadingBanners(true);
        bannersService
            .find({
                query: {
                    status: "active",
                    $limit: 100000,
                    $client:{
                        showTablesPartners: true
                    },
                    $select: ["id", "name","meta_tables_partners"]
                }
            })
            .then(({ data }) => {
                setBanners(data);
                setLoadingBanners(false);
            })
            .catch((err) => {
                message.error(err.message);
                setBanners([]);
                setLoadingBanners(false);
            });
    };

    useEffect(() => {
        getBanners();
    }, []);


    return [
        banners,
        loadingBanners,
        getBanners
    ];
}