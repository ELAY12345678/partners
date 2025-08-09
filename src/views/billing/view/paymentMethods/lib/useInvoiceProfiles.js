import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { getService } from '../../../../../services';

export const useInvoiceProfile = () => {

    const establishment_id = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters?.establishment_id);


    const invoiceProfileService = getService('invoice-profiles');

    const [invoiceProfiles, setInvoiceProfiles] = useState([]);
    const [loadingInvoiceProfiles, setLoadingInvoiceProfiles] = useState(true);

    const getInvoiceProfiles = () => {
        setLoadingInvoiceProfiles(true);
        invoiceProfileService.find({
            query: {
                establishment_id,
                $limit: 10000,
                $sort: {
                    legal_name: 1
                }
            }
        }).then(({ data }) => {
            setInvoiceProfiles(data);
            setLoadingInvoiceProfiles(false);
        }).catch((err) => {
            message.error(err.message);
            setLoadingInvoiceProfiles(false);
        })
    }

    useEffect(() => {
        if(establishment_id){
            getInvoiceProfiles();
        }
    }, [establishment_id])

    return {
        invoiceProfiles,
        loadingInvoiceProfiles,
        getInvoiceProfiles
    };
}