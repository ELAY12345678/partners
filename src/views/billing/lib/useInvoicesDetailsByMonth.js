import { message } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { getService } from "../../../api";

export const useInvoicesDetailsByMonth = ({expanded, year, month}) => {


    const invoicesService = getService('invoices');
    const [invoicesDetailsByMonth, setInvoicesDetailsByMonth] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);


    const getInvoicesDetailsByMonth = () => {
        setIsLoading(true);
        invoicesService.find({
            query: {
                ...establishmentFilters,
                month,
                year,
                $client: {
                    accountStatusDetails: establishmentFilters?.establishment_branch_id ?  true : undefined,
                    accountStatusDetailsByEstablishment: establishmentFilters?.establishment_branch_id ?  undefined : true,
                }
            }
        }).then((response)=>{
            const details = [
                ...(response?.reservations || []),
                {
                    week_range_name:'Comisión Pagos AppartaPay',
                    total_commission_tax: response?.pay_payments?.total_pay_payments_commission_total_amount_tax_amount,
                    total_commission_tax_excl: response?.pay_payments?.total_pay_payments_commission_total_amount_tax_excl,
                    total_commission_tax_incl: response?.pay_payments?.total_pay_payments_commission_total_amount_tax_incl,
                },
                {
                    week_range_name:'Plataforma TMP',
                    total_commission_tax_excl:response?.tmp?.total_commission_tax_incl,
                    total_commission_tax_incl: response?.tmp?.total_commission_tax_incl,
                },
            ];
            setInvoicesDetailsByMonth(details);
            setIsLoading(false);
        }).catch((error)=>{
            message.error(error?.message || "Ha ocurrido un error, intenta nuevamente!");
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (!_.isEmpty(establishmentFilters) && expanded && _.isEmpty(invoicesDetailsByMonth)) {
            getInvoicesDetailsByMonth();
        }
    }, [establishmentFilters, expanded])

    return {
        isLoading,
        invoicesDetailsByMonth,
    }
}
