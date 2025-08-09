import _ from "lodash";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AddCreditCard from "./AddCreditCard";
import CreditCard from "./CreditCard";
import PayBankAccount from "./PayBankAccount";

const USERS_ROLES = {
    admin: 'admin',
    user: 'user',
};

const ListStyed = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 310px));
    gap: 34px;
`;

const ListPaymentMethods = ({
    creditCardsData,setCreditCardsData, 
    onClickAddCreditCard, 
    onFinishRemove, 
    payBankAccountsData,
    onFinishRemovePayBankAccount,
}) => {

    const currentUser = useSelector(({ appReducer }) => appReducer?.user);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    
    return (
        <ListStyed>
            {
                _.map(creditCardsData, (item, index) => (
                    <CreditCard
                        item={item}
                        key={`credit-card-${index}`}
                        allowToDelete={creditCardsData?.length > 1}
                        onFinishRemove={onFinishRemove}
                        updateCreditCardData={(creditCardData) => {
                            const tempData = [...creditCardsData];
                            tempData[index] = { ...creditCardData };
                            setCreditCardsData(tempData);
                        }}
                    />
                ))
            }
            {
                _.map(payBankAccountsData, (item, index) => (
                    <PayBankAccount
                        item={item}
                        key={`pay-bank-account-${index}`}
                        onFinishRemove={onFinishRemovePayBankAccount}
                    />
                ))
            }

            {
                (
                    currentUser?.role === USERS_ROLES.admin
                    || _.find(currentUser?.permissionsv2, ({ role, establishment_id }) => ['superAdmin'].includes(role) && establishment_id === Number(establishmentFilters?.establishment_id))
                ) ? (
                    <AddCreditCard onClick={onClickAddCreditCard} />
                ) : null
            }
        </ListStyed>
    )
}

export default ListPaymentMethods;