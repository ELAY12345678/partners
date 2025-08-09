import { message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getService } from "../../../services";

export const usePayAccountStatus = ({ payAccountId }) => {

    const payAccountsService = getService('pay-accounts');

    const [payAccountStatus, setPayAccountSatatus] = useState(undefined);
    const [isLoadingPayAccountStatus, setLoadingPayAccountStatus] = useState(true);

    const getPayAccountStatus = useCallback(
        ({ payAccountId }) => {
            setLoadingPayAccountStatus(true);
            payAccountsService.get(payAccountId, {
                query: {
                    $client: {
                        skipJoins: true
                    },
                }
            })
                .then((response) => {
                    setPayAccountSatatus(response?.status);
                }).catch((error) => {
                    message.error(error?.message || "Ha ocurrido un error, intenta nuevamente!");
                }).finally(() => {
                    setLoadingPayAccountStatus(false);
                })
        },
        [payAccountId],
    );

    const updatePayAccountStatus = async ({ payAccountId, newStatus }) => {
        await payAccountsService.patch(payAccountId, { status: newStatus })
            .then((response) => {
                message.success("Estado de la cuenta actualizado correctamente!");
                setPayAccountSatatus(response?.status);
            }).catch((error) => {
                message.error(error?.message || 'No se pudo actualizar, intenta nuevamente!');
            }).finally(() => {
                setLoadingPayAccountStatus(false);
            })
    }

    useEffect(() => {
        getPayAccountStatus({ payAccountId });
    }, [payAccountId])


    return {
        payAccountStatus,
        isLoadingPayAccountStatus,
        getPayAccountStatus,
        updatePayAccountStatus
    }
}