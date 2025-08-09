import _ from 'lodash';
import { useEffect, useState } from 'react';
import { getService } from '../../../services';

export const useRatingPercent = ({ establishment_id, establishment_branch_id }) => {

    const initialRatingPercent = {
        '1.00': {
            key: '1',
            value: 0
        },
        '2.00': {
            key: '2',
            value: 0
        },
        '3.00': {
            key: '3',
            value: 0
        },
        '4.00': {
            key: '4',
            value: 0
        },
        '5.00': {
            key: '5',
            value: 0
        },
    };
    const [ratingPercentData, setRatingPercentData] = useState({ ...initialRatingPercent });

    const rawQueryService = getService('raw-queries/partners/establishments/ranting/details');

    useEffect(() => {
        if (establishment_id)
            rawQueryService.find({
                query: {
                    establishment_id,
                    establishment_branch_id
                }
            })
                .then((res) => {
                    let total = 0;
                    let tempRating = { ...initialRatingPercent };
                    _.forEach(res, ({ rating_score }) => { tempRating[rating_score].value = 0 })
                    _.forEach(res, ({ quantity }) => { total = total + quantity })
                    _.forEach(res, ({ rating_score, quantity }) => { tempRating[rating_score].value = (100 * quantity) / total })
                    setRatingPercentData(tempRating);
                })
                .catch((err) => setRatingPercentData({ ...initialRatingPercent }))
        else
            setRatingPercentData({ ...initialRatingPercent })

    }, [establishment_branch_id, establishment_id])

    return [
        ratingPercentData,
    ];
}