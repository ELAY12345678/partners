import { useState, useEffect } from 'react';
import { getService } from '../../../services';
import { message } from 'antd';

export const useTotalAmounts = (totalAmount = 'totalAmountsByEstablishment') => {

    const payAccountsService = getService('pay-accounts');
    const [establishmentsTotalAmounts, setEstablishmentsTotalAmounts] = useState();
    const [loadingEstablishmentsTotalAmounts, setLoadingEstablishmentsTotalAmounts] = useState(false);

    useEffect(() => {
        setLoadingEstablishmentsTotalAmounts(true);
        payAccountsService.find({
            query: {
                $client: { [totalAmount]: true }
            }
        }).then((response) => {
            setEstablishmentsTotalAmounts(response);
            setLoadingEstablishmentsTotalAmounts(false);
        }).catch((error) => {
            message.error(error.message);
            setLoadingEstablishmentsTotalAmounts(false);
        })
    }, [])

    return [
        establishmentsTotalAmounts,
        loadingEstablishmentsTotalAmounts
    ]
}