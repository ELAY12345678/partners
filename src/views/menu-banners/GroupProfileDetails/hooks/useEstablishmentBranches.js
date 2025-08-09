import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../../services';

export const useEstablishmentBranches = ({ establishment_id }) => {

    const establishmentBranchesService = getService('establishments-branchs');
    const [establishmentBranches, setEstablishmentBranches] = useState([]);
    const [loadingEstablishmentBranches, setLoadingEstablishmentBranches] = useState(false);

    useEffect(() => {
        if (establishment_id) {
            setLoadingEstablishmentBranches(true);
            establishmentBranchesService.find({
                query: {
                    establishment_id,
                    apparta_menu_status: 'active',
                    $limit: 1000,
                    $sort: {
                        address: 1
                    },
                    $select: ['address', 'id']
                }
            }).then(({ data }) => {
                setEstablishmentBranches(data);
                setLoadingEstablishmentBranches(false);
            }).catch((error) => {
                message.error(error.message);
                setLoadingEstablishmentBranches(false);
            })
        }
        else
            setEstablishmentBranches([]);
    }, [establishment_id])

    return [
        establishmentBranches,
        loadingEstablishmentBranches
    ];
}