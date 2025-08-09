import { message } from 'antd';
import { useEffect, useState } from 'react';
import { getService } from '../../../services';

export const useDeals = ({ establishment_id }) => {

    const [deals, setDeals] = useState([]);

    const serviceDeals = getService("deals");

    useEffect(() => {
        if (establishment_id)
            serviceDeals
                .find({
                    query: {
                        establishment_id,
                        $limit: 10000,
                    },
                })
                .then(({ data }) => {
                    setDeals(data || []);
                })
                .catch((error) => message.error(error.message));
    }, [establishment_id])

    return [
        deals
    ]
}