import { useEffect, useState } from 'react';
import { getService } from '../../../services';
import _ from 'lodash';

export const useEstablishmentRating = ({ establishment_id }) => {

    const [rating, setRating] = useState('0.0');

    useEffect(() => {
        if (establishment_id) {
            const reportsService = getService(`raw-queries/partners/establishments-ranting`);
            reportsService.find({
                query: {
                    establishment_id,
                    $client: { skipJoins: true }
                }
            })
                .then((res) => {
                    setRating(res.average_rating)
                })
                .catch((err) => setRating('0.0'))
        } else
            setRating('0.0')
    }, [establishment_id]);

    return [
        rating
    ];
}