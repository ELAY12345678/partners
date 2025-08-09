import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useEstablishmentCampaigns = ({ campaign_id, page, source, filters }) => {

    const establishmentBranchesCampaignsService = getService(source);

    const [establishmentCampaigns, setEstablishmentCampaigns] = useState({});
    const [loadingEstablishmentCampaigns, setLoadingEstablishmentCampaigns] = useState(false);

    const getEstablishmentCampaigns = () => {
        setLoadingEstablishmentCampaigns(true);
        establishmentBranchesCampaignsService.find({
            query: {
                ...filters,
                $limit: 9,
                $skip: (page - 1) * 9,
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
        if (campaign_id)
            getEstablishmentCampaigns();
    }, [campaign_id, page])

    return [
        establishmentCampaigns,
        getEstablishmentCampaigns,
        loadingEstablishmentCampaigns
    ]
}