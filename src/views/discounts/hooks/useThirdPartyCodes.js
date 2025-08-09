import { message } from 'antd';
import { useEffect, useState } from 'react';
import { getService } from '../../../services';

export const useThirdPartyCodes = ({ establishment_id }) => {

    const [thirdPartyCodeList, setThirdPartyCodeList] = useState([]);

    const serviceThirdPartyCodesList = getService("third-party-codes-list");

    useEffect(() => {
        if (establishment_id)
            serviceThirdPartyCodesList
                .find({
                    query: {
                        establishment_id,
                        $limit: 10000,
                    },
                })
                .then(({ data }) => {
                    setThirdPartyCodeList(data || []);
                })
                .catch((error) => {
                    message.error(error.message);
                    setThirdPartyCodeList();
                });
    }, [establishment_id])

    return [
        thirdPartyCodeList
    ]
}