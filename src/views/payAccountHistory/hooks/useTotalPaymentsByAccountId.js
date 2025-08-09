import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useTotalPaymentsByAccountId = ({ pay_account_id }) => {

    const rawQueryService = getService('raw-queries');

    const [totalPaymentsByAccountId, SetTotalPaymentsByAccountId] = useState();
    const [loadingTotalPaymentsByAccountId, SetLoadingTotalPaymentsByAccountId] = useState(false);

    const getTotalPaymentsByAccountId = () => {
        if (pay_account_id)
            SetLoadingTotalPaymentsByAccountId(true);
        rawQueryService.find({
            query: {
                $client: {
                    totalPaymentsUserIdByPayAccountId: pay_account_id
                }
            }
        }).then((response) => {
            SetTotalPaymentsByAccountId(response);
            SetLoadingTotalPaymentsByAccountId(false);
        }).catch((error) => {
            message.error(error.message);
            SetLoadingTotalPaymentsByAccountId(false);
        })
    }

    useEffect(() => {
        getTotalPaymentsByAccountId();
    }, [pay_account_id])

    return [
        totalPaymentsByAccountId,
        loadingTotalPaymentsByAccountId,
        getTotalPaymentsByAccountId
    ]
}