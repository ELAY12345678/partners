import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useBranches = (branchesId) => {

    const establishmentBranchesService = getService('establishments-branchs');

    const [branches, setBranches] = useState([]);

    useEffect(() => {
        if (branchesId)
            establishmentBranchesService.find({
                query: {
                    $limit: 100,
                    establishment_branch_id: {
                        $in: branchesId
                    },
                    $client: {
                        fullName: true
                    }
                }
            }).then(({ data }) => {
                setBranches(data)
            })

    }, [branchesId])

    return [
        branches
    ];
}