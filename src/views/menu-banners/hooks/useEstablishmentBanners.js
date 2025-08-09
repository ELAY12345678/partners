import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useEstablishmentBanners = ({ menu_banner_id, page }) => {

    const establishmentBranchesCampaignsService = getService('menu-banner-establishments');

    const [establishmentCampaigns, setEstablishmentCampaigns] = useState({});
    const [loadingEstablishmentCampaigns, setLoadingEstablishmentCampaigns] = useState(false);

    const getEstablishmentCampaigns = () => {
        setLoadingEstablishmentCampaigns(true);
        establishmentBranchesCampaignsService.find({
            query: {
                menu_banner_id,
                // $select: [],
                $limit: 9,
                $skip: (page - 1) * 9,
                $sort: {
                    establishment_id: 1
                }
            }
        }).then(({ data, total }) => {
            setEstablishmentCampaigns({ data, total });
            setLoadingEstablishmentCampaigns(false);
        }).catch(() => {
            setEstablishmentCampaigns([]);
            setLoadingEstablishmentCampaigns(false);
        });
    }

    useEffect(() => {
        if (menu_banner_id)
            getEstablishmentCampaigns();
    }, [menu_banner_id, page])

    return [
        establishmentCampaigns,
        getEstablishmentCampaigns,
        loadingEstablishmentCampaigns
    ]
}