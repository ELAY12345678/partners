import { message } from 'antd';
import { useEffect, useState } from 'react';
import { getService } from '../../../services';

export const useEstablishment = ({ id }) => {

    const establishmentService = getService('establishments');
    const [establishmentData, setEstablishmentData] = useState();

    useEffect(() => {
        if (!id) return;
        establishmentService.find({ query: {
            id,
            $client: {
                getEstablishmentsBlockedByWallet:true
            }
        }})
            .then(({data}) => setEstablishmentData(data[0]))
            .catch((error) => {
                setEstablishmentData();
                message.error(error.message);
            });
    }, [id]);

    return [
        establishmentData,
        setEstablishmentData
    ];
}