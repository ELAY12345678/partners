import { message } from "antd";
import { useEffect, useState } from "react"
import { getService } from '../../../../../services';


export const useEstablishmentBranchInvoiceProfice = (branchId) => {

    const establishmentBranchService = getService('establishments-branchs');

    const [establishmentBranchInvoiceProfile, setEstablishmentBranchInvoiceProfile] = useState();

    const getEstablishmentBranchInvoiceProfice = (branchId) => {
        establishmentBranchService.get(branchId, {
            query: {
                $client: {
                    skipJoins: true
                }
            }
        }).then((response) => {
            setEstablishmentBranchInvoiceProfile(response?.invoice_profile_id);
        }).catch((error) => {
            message.error(error?.message || '¡Ups! Hubo un error. Inténtalo nuevamente.')
        })
    }

    useEffect(() => {
        if (branchId) {
            getEstablishmentBranchInvoiceProfice(branchId);
        }
    }, [branchId])


    return {
        establishmentBranchInvoiceProfile
    }
}