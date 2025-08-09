import TableDataPayments from "./TableDataPayments";

const DonePayments = ({ user_id, pay_account_id, updateStatistic }) => {
    return (
        <>
            <TableDataPayments
                source='pay-payments'
                updateStatistic={updateStatistic}
                filterDefaultValues={{
                    user_id
                }}
                pay_account_id={pay_account_id}
            />
        </>
    );
}

export default DonePayments;