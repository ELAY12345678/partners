import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getService } from '../../../services';
import _ from 'lodash';

export const useReports = ({ type, range_of_dates }) => {

    const [data, setData] = useState();
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    useEffect(() => {
        if (!_.isEmpty(establishmentFilters)) {
            const reportsService = getService(`raw-queries/partners/${type}`);
            reportsService.find({
                query: {
                    ...establishmentFilters,
                    range_of_dates
                }
            })
                .then((res) => {
                    setData(res)
                })
                .catch((err) => setData(0))
        } else
            setData(0)
    }, [establishmentFilters]);

    return [
        data
    ];
}