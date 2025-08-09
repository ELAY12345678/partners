import _ from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getService } from '../../../services';

export const useDataCharts = ({ type, range_of_dates, branch }) => {
    const [data, setData] = useState([]);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    useEffect(() => {
        if ((!_.isEmpty(establishmentFilters) && !branch) || (branch && establishmentFilters.establishment_branch_id)) {
            const reportsService = getService(`raw-queries/partners/reservations/${type}`);
            reportsService.find({
                query: {
                    ...establishmentFilters,
                    range_of_dates,
                }
            })
                .then((res) => {
                    setData(res)
                })
                .catch(() => setData([]))
        } else
            setData([])
    }, [establishmentFilters, range_of_dates]);


    return [
        data
    ];
}