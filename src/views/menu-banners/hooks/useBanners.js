import { useEffect, useState } from 'react';
import { getService } from '../../../services';
import { message } from 'antd';

export const useBanners = () => {
    const bannersService = getService("menu-banners");

    const [banners, setBanners] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(false);

    const getBanners = () => {
        setLoadingBanners(true);
        bannersService
            .find({
                query: {
                    status: "active",
                    $limit: 100000,
                    $select: ["id", "name"]
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