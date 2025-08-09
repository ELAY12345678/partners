import { message } from 'antd';
import { useEffect, useState } from 'react';
import { getService } from '../../../services';

export const useBanners = ({location}) => {
    const bannersService = getService("pop-ups");
    const {
        establishment_id,
        establishment_branch_id
    } = location.state;
    const [banners, setBanners] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(false);

    const getBanners = () => {
        setLoadingBanners(true);
        bannersService
            .find({
                query: {
                    establishment_id: establishment_id,
                    establishment_branch_id: establishment_branch_id,
                    type: 'menu',
                    $limit: 1000,
                    $client: {
                        showPopUpsSchedules: true,
                    },
                    // status: "active",
                    // $limit: 100000,
                    // $client:{
                    //     showTablesPartners: true
                    // },
                    // $select: ["id", "name","meta_tables_partners"]
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