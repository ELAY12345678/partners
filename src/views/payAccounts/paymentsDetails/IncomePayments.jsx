import TableDataPayments from "./TableDataPayments";

const IncomePayments = ({ pay_account_id, updateStatistic }) => {
    return (
        <>
            <TableDataPayments
                source='pay-payments'
                updateStatistic={updateStatistic}
                filterDefaultValues={{
                    pay_account_id
                }}
                pay_account_id={pay_account_id}
            />
        </>
    );
}

export default IncomePayments;