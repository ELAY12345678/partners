import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getService } from '../../../services';

export const useRawQueries = ({ city_id, position }) => {

    const serviceEstablishmentPositions = getService("raw-queries");
    const [loadingRawQueries, setLoadingRawQueries] = useState(false);
    const [dataRawQueries, setDataRawQueries] = useState();

    const getData = useCallback(
        async function () {
            setLoadingRawQueries(true);
            try {
                const response = await serviceEstablishmentPositions.find({
                    query: {
                        $limit: 10000,
                        city_id: city_id,
                        $client: {
                            masonryHome: "true",
                            defined_position: position || "position"
                        },
                    },
                });
                setTimeout(() => {
                    setDataRawQueries(response);
                    setLoadingRawQueries(false);
                }, 700);
            } catch (e) {
                setLoadingRawQueries(false);
                setDataRawQueries();
                message.error(e.message);
            }
        },
        [serviceEstablishmentPositions, city_id, position]
    );

    useEffect(() => {
        if (city_id)
            getData();
    }, [city_id, position])

    return [
        dataRawQueries,
        loadingRawQueries,
        getData
    ];
}
