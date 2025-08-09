import { message } from "antd";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { getService } from "../../../services";

export const usePayAccountId = () => {
    const [payAccountId, setPayAccountId] = useState(null);
    const [isLoadingPayAccount, setLoadingPayAccount] = useState(false);

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);


    const payAccountService = getService('pay-accounts');

    const getPayAccountId = () => {
        setLoadingPayAccount(true);
        payAccountService.find({
            query: {
                $limit: 1,
                ...establishmentFilters,
            }
        }).then((response)=> {
            if(response?.data?.[0]?.id){
                setPayAccountId(response?.data?.[0]?.id);
            }
            setLoadingPayAccount(false);
        }).catch((error)=> {
            message.error(error?.message || '');
            setLoadingPayAccount(false);
        })

    }

    useEffect(() => {
        setPayAccountId(null);
        if(establishmentFilters?.establishment_branch_id){
            getPayAccountId();
        }
    }, [establishmentFilters]);
    


    return{
        payAccountId,
        isLoadingPayAccount,
    }
}