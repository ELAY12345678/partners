import { Row, Typography } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '../../../../components';
import { usePayAccountId } from '../../lib/usePayAccountId';
import ListPaymentMethods from './components/ListPaymentMethods';
import NoPaymentMethod from './components/NoPaymentMethod';
import PaymentMethodsModalForm from './components/PaymentMethodsModalForm';
import { useCreditCard } from './lib/useCreditCard';
import { usePayBanckAccounts } from './lib/usePayBanckAccounts';


const PaymentMethods = () => {

    const establishment_branch_id = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters?.establishment_branch_id);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    const [isVisibleModalForm, setVisibleModalForm] = useState(false);

    const { creditCardsData,  getCreditcardsData, setCreditCardsData} = useCreditCard();
    const { payAccountId } = usePayAccountId();
    const { payBankAccount, getPayBankAccounts } = usePayBanckAccounts(); 

    const handleChangeModalFormVisibility = () => {
        setVisibleModalForm(lastValue => !lastValue);
    }

    if (establishmentFilters?.establishment_id) {
        return (
            <>
                <PaymentMethodsModalForm 
                    open={isVisibleModalForm} 
                    onClose={handleChangeModalFormVisibility} 
                    onFinish={()=>{
                        getCreditcardsData(establishmentFilters);
                    }} 
                    selectAsDefault={creditCardsData?.length < 1}
                    payAccountId={payAccountId}
                    onFinishPayBankAccount={()=>{
                      
                            getPayBankAccounts()
                       
                    }}
                />
                {
                    (creditCardsData?.length || payBankAccount?.length)? (
                        <>
                            <Row>
                                <Typography.Title level={4} >
                                    Métodos de pago
                                </Typography.Title>
                            </Row>
                            <ListPaymentMethods 
                                creditCardsData={creditCardsData} 
                                setCreditCardsData={setCreditCardsData}
                                payBankAccountsData={payBankAccount}
                                onClickAddCreditCard={handleChangeModalFormVisibility} 
                                onFinishRemove={()=>{
                                    getCreditcardsData(establishmentFilters);
                                }}
                                onFinishRemovePayBankAccount={()=>{
                                        getPayBankAccounts();    
                                }}
                            />
                        </>
                    ) : (
                        <NoPaymentMethod onClick={handleChangeModalFormVisibility} />
                    )
                }


            </>

        )
    } else {
        return (
            <Box>
                *Selecciona un restaurante para ver los registros*
            </Box>
        )
    }
}

export default PaymentMethods;