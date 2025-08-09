import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useCoupons = (couponsId) => {

    const couponsService = getService('coupons');

    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        if (couponsId)
            couponsService.find({
                query: {
                    $limit: 100,
                    id: {
                        $in: couponsId
                    },
                    $select: ['name', 'id']
                }
            }).then(({ data }) => {
                setCoupons(data)
            })

    }, [couponsId])

    return [
        coupons
    ];
}