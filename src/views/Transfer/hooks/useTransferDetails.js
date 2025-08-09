import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getService } from '../../../services';

const serviceTransfers = getService("pay-bank-transfer-detail");


export const useTransferDetails = ({ id }) => {

    const [dataDetails, setDataDetails] = useState({});

    const getTransfersDetail = async ({ id }) => {
        try {
            const response = await serviceTransfers.get(id);
            setDataDetails(response || {});
        } catch (e) {
            message.error(e.message);
        }
    }

    useEffect(() => {
        if (id) {
            getTransfersDetail({ id });
        }
    }, [id])


    return [
        dataDetails,
    ]
};