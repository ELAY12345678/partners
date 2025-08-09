import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useEstablishmentBranches = ({ establishment_id }) => {

    const establishmentBranchesService = getService('establishments-branchs');
    const [establishmentBranches, setEstablishmentBranches] = useState([]);
    const [loadingEstablishmentBranches, setLoadingEstablishmentBranches] = useState(false);

    useEffect(() => {
        setLoadingEstablishmentBranches(true);
        establishmentBranchesService.find({
            query: {
                establishment_id,
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
    }, [establishment_id])

    return [
        establishmentBranches,
        loadingEstablishmentBranches
    ];
}