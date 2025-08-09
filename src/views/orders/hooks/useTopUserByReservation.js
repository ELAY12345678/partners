import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getService } from '../../../services';
import _ from 'lodash';

export const useTopUserByReservation = () => {

    const [data, setData] = useState([]);

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    const reservationsService = getService(`raw-queries/partners/establishments/user-top-reservations`);

    const getTopUserByReservations = ({establishmentFilters}) => {
        reservationsService.find({
            query: {
                ...establishmentFilters,
                range_of_dates: 'lastMonth',
                $limit:10,
            }
        })
            .then((res) => {
                setData(res);
            })
            .catch((err) => {

            });
    }

    const exportTopUserByReservations = async({establishmentFilters}) => {
        if (!establishmentFilters?.establishment_id) {
            return;
        }
        await reservationsService.find({
            query: {
                ...establishmentFilters,
                range_of_dates: 'lastMonth',
                $limit:10,
                $client: {
                    exportExcelUserTop: true
                },
            }
        })
            .then((res) => {
                if(res?.path){
                    window.open(res?.path,'_blank')
                }
            })
            .catch((err) => {

            });
    }

    useEffect(() => {
        if (establishmentFilters?.establishment_id) {
            getTopUserByReservations({establishmentFilters})
        } else {
            setData([]);
        }
    }, [establishmentFilters]);

    return{
        topUserByReservations:data,
        exportTopUserByReservations,
    };
}