import { useEffect, useState } from 'react';
import { getService } from '../../../services';
import _ from 'lodash';
import { message } from 'antd';

export const useEstablishmentRatingDetails = ({ establishment_id, establishment_branch_id }) => {

    const [ratingDetails, setRatingDetails] = useState();

    useEffect(() => {
        if (establishment_id) {
            const reportsService = getService(`raw-queries/partners/establishments/ranting/details`);
            reportsService.find({
                query: {
                    establishment_id,
                    establishment_branch_id,
                    $client: { detailsWithTypes: true }
                }
            })
                .then((response) => {
                    setRatingDetails(response)
                })
                .catch((err) => {
                    message.error(err.message);
                    setRatingDetails();
                })
        } else
            setRatingDetails();
    }, [establishment_id, establishment_branch_id]);

    return [
        ratingDetails
    ];
}