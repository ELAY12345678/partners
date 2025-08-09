import { message } from 'antd';
import { useState, useEffect } from 'react';
import { getService } from '../../../services';

export const useZones = ({ city_id }) => {

    const zonesService = getService('zones');

    const [zones, setZones] = useState([]);
    const [loadingZones, setLoadingZones] = useState(false);

    useEffect(() => {
        setLoadingZones(true);
        zonesService.find({
            query: {
                city_id,
                status: 'active',
                $limit: 5000,
                $sort: {
                    name: 1
                },
                $select: ['name', 'id', 'status']
            }
        }).then(({ data }) => {
            setZones(data);
            setLoadingZones(false);
        }).catch(err => {
            message.error(err.message);
            setLoadingZones(false);
        })
    }, [city_id])

    return [
        zones,
        loadingZones
    ];
}