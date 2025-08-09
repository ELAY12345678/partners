import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getService } from "../../../../../services";

const payBanksService = getService('pay-banks');

export const usePayBanckAccounts = () => {

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    const [payBankAccount, setPayBankAccout] = useState([]);

    const getPayBankAccounts = () => {
        if (!_.isEmpty(establishmentFilters)) {
            payBanksService.find({
                query: {
                    ...establishmentFilters,
                    transaction_type: 'receive',
                    $limit: 1000,
                }
            })
                .then((response) => {
                    setPayBankAccout(response?.data || [])
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    };

    useEffect(() => {
        setPayBankAccout([]);
        if (!_.isEmpty(establishmentFilters)) {
            getPayBankAccounts();
        }
    }, [establishmentFilters])

    return {
        payBankAccount,
        getPayBankAccounts,
    }

}