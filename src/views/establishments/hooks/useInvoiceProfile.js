import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getService } from '../../../services';

export const useInvoiceProfile = ({ establishment_id }) => {

    const invoiceProfileService = getService('invoice-profiles');

    const [invoiceProfiles, setInvoiceProfiles] = useState([]);
    const [loadingInvoiceProfiles, setLoadingInvoiceProfiles] = useState(true);

    const getInvoiceProfiles = () => {
        if (!establishment_id) return;
        setLoadingInvoiceProfiles(true);
        invoiceProfileService.find({
            query: {
                establishment_id,
                $limit: 5000,
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
        getInvoiceProfiles();
    }, [establishment_id])

    return [
        invoiceProfiles,
        loadingInvoiceProfiles,
        getInvoiceProfiles
    ];
}