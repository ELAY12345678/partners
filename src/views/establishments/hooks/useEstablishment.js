import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useEstablishment = ({ id }) => {

    const establishmentService = getService('establishments');
    const [establishmentData, setEstablishmentData] = useState();

    useEffect(() => {
        if (!id) return;
        establishmentService.get(id)
            .then((data) => setEstablishmentData(data))
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