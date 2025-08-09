import { message } from 'antd';
import { useEffect, useState } from 'react';
import { getService } from '../../../services';
export const useEstablishmentCampaigns = ({ tables_partners_groups_id, page, source, filters }) => {

    const establishmentBranchesCampaignsService = getService(source);

    const [establishmentCampaigns, setEstablishmentCampaigns] = useState({});
    const [loadingEstablishmentCampaigns, setLoadingEstablishmentCampaigns] = useState(false);

    const getEstablishmentCampaigns = () => {
        setLoadingEstablishmentCampaigns(true);
        try {
            if(filters?.tables_partners_groups_id ==null){
                setEstablishmentCampaigns([])
                setLoadingEstablishmentCampaigns(false);
                return 
            }
            establishmentBranchesCampaignsService.find({
                query: {
                    ...filters,
                    $limit: 9,
                    $skip: (page - 1) * 9,
                }
            }).then(({ data, total }) => {
                const updatedData = data.map(entry => ({
                    ...entry,
                    partners: entry.partners.map(partner => {
                        // Buscar el ID en data donde coincidan los valores
                        const matchingEntry = data.find(d => 
                            d.establishment_id === partner.tables_partners_establishment_id &&
                            d.establishment_branch_id === partner.tables_partners_establishment_branch_id
                        );
                        return {
                            ...partner,
                            id: matchingEntry ? matchingEntry.id : null // Agregar ID si coincide
                        };
                    })
                }));
                
                setEstablishmentCampaigns({ data: updatedData?.[0]?.partners || [], total });
                setLoadingEstablishmentCampaigns(false);
            }).catch(() => {
                setEstablishmentCampaigns([]);
                setLoadingEstablishmentCampaigns(false);
            });
        } catch (error){
            message.error(error.message)
            setEstablishmentCampaigns([]);
            setLoadingEstablishmentCampaigns(false);
        }
       
    }

    useEffect(() => {
        if (tables_partners_groups_id)
            getEstablishmentCampaigns();
    }, [tables_partners_groups_id, page])

    return [
        establishmentCampaigns,
        getEstablishmentCampaigns,
        loadingEstablishmentCampaigns
    ]
}