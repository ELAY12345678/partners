import { message } from "antd";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { getService } from "../../../api";

export const useInvoicesByYear = ({year}) => {

    const invoicesService = getService('invoices');
    const [invoicesByYear, setInvoicesByYear] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);


    const getInvoicesByyear = () => {
        setIsLoading(true);
        invoicesService.find({
            query: {
                ...establishmentFilters,
                year,
                $client: {
                    accountStatement: establishmentFilters?.establishment_branch_id  ? true : undefined,
                    accountStatementByEstablishment: establishmentFilters?.establishment_branch_id  ? undefined : true,
                }
            }
        }).then((response)=>{
            setInvoicesByYear(response);
            setIsLoading(false);
        }).catch((error)=>{
            message.error(error?.message || "Ha ocurrido un error, intenta nuevamente!");
            setIsLoading(false);
        })
    }

    useEffect(() => {
        if (!_.isEmpty(establishmentFilters) && year) {
            getInvoicesByyear();
        }
    }, [establishmentFilters, year])

    return {
        invoicesByYear,
        isLoading,
    }
}