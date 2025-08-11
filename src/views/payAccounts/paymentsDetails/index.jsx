import { Col, Divider, Layout, Row, Statistic, Tabs, Breadcrumb, message, Tag } from "antd";
import { Box, TabsStyled } from "../../../components/Styles";
import { useTotalPaymentsByAccountId } from "../hooks";
import DonePayments from "./DonePayments";
import { useLocation, useNavigate } from "react-router-dom";
import IncomePayments from "./IncomePayments";
import OutputPayments from "./OutputPayments";
import BankAccounts from "./BankAccounts";
import AsyncButton from "../../../components/asyncButton";
import { getService } from "../../../services";
import { usePayAccountStatus } from "../hooks/usePayAccountStatus";
import _ from "lodash";
import AsyncSelect from "../../../components/asyncSelect";
import PayAccountStatusForm from "./PayAccountStatusForm";
import { useState } from "react";

const STATUS = [
    {
        id: 'active',
        name: 'Active',
        color: 'success'
    },
    {
        id: 'inactive',
        name: 'Inactive',
        color: 'error'
    },
    {
        id: 'disabled',
        name: 'Disabled',
        color: 'red'
    },
];

const PaymentsDetails = () => {
    const location = useLocation();
 
    const navigate = useNavigate();
    const {
        pay_account_id,
        user_id,
        account_name,
        establishment_id,
        establishment_branch_id
    } = location?.state;

    const serviceReportIncomeExpenses = getService("report-income-expenses");
    const serviceEstablishmentCommissions = getService("establishments-commissions");

    const [isAppartapayStatusModalFormVisible, setAppartapayStatusModalFormVisible] = useState(false);

    const [totalPaymentsByAccountId, loadingTotalPaymentsByAccountId, getTotalPaymentsByAccountId] = useTotalPaymentsByAccountId({ pay_account_id });
    const { payAccountStatus, updatePayAccountStatus , getPayAccountStatus} = usePayAccountStatus({ payAccountId: pay_account_id });

    const AppartaPayStatusTag = ({ payAccountStatus }) => {
        const status = _.find(STATUS, ({ id }) => id === payAccountStatus) || ''
        return <Tag color={status?.color} >
            {status?.name || status}
        </Tag>
    }


    const updateStatistic = () => {
        getTotalPaymentsByAccountId();
    };

    const generateReportIncomeExpenses = async () => {
        await serviceReportIncomeExpenses.find({
            query: {
                establishment_branch_id,
            },
        }).then((response) => {
            window.open(response.path, '_blank');
        }).catch((error) => {
            message.error(error.message);
        });
    };

    const generateExportReportCommission = async (query) => {
        await serviceEstablishmentCommissions.find({
            query: {
                ...query
            },
        }).then((response) => {
            window.open(response.path, '_blank');
        }).catch((error) => {
            message.error(error.message);
        });
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <PayAccountStatusForm 
                visible={isAppartapayStatusModalFormVisible}
                payAccountId={pay_account_id} 
                onCancel={()=>{
                    setAppartapayStatusModalFormVisible(false);
                }}
                onSubmit={()=>{
                    getPayAccountStatus({payAccountId: pay_account_id});
                }}
            />
            <Breadcrumb>
                <Breadcrumb.Item
                    onClick={() => navigate('/dashboard/management/pay-accounts',
                        {
                            state: {
                                defaultSelectedTab: user_id ? '2' : '1'
                            }
                        }
                    )}
                    style={{ cursor: 'pointer' }}>
                    Cuentas AppartaPay
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {account_name}
                    {` `}
                    <AppartaPayStatusTag payAccountStatus={payAccountStatus} />
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Pagos realizados (COP)"
                                value={totalPaymentsByAccountId?.payments_done}
                                precision={2}
                                loading={loadingTotalPaymentsByAccountId}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={6}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Ingreso wallet (COP)"
                                value={totalPaymentsByAccountId?.wallet_in}
                                precision={2}
                                loading={loadingTotalPaymentsByAccountId}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={6}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Egreso wallet (COP)"
                                value={totalPaymentsByAccountId?.wallet_out}
                                precision={2}
                                loading={loadingTotalPaymentsByAccountId}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={6}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Balance total wallet (COP)"
                                value={totalPaymentsByAccountId?.balance}
                                precision={2}
                                loading={loadingTotalPaymentsByAccountId}
                            />
                        </Col>
                    </Box>
                </Col>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Row gutter={[16, 16]} justify='space-between'>
                <Row align="middle" gutter={16}>
                    {/* <Col>
                        Estado AppartaPay
                    </Col>
                    <Col style={{ backgroundColor: 'white', borderRadius: '0.5rem' }}>
                        <AsyncSelect
                            options={STATUS}
                            value={payAccountStatus}
                            onChange={async (value) => await updatePayAccountStatus({ newStatus: value, payAccountId: pay_account_id })}
                        />
                    </Col> */}
                    <Col>
                        <AsyncButton
                            type='primary'
                            style={{ borderRadius: '0.5rem' }}
                            onClick={() => {
                                setAppartapayStatusModalFormVisible(true);
                            }}
                        >
                            Estado AppartaPay
                        </AsyncButton>
                    </Col>

                </Row>
                <Row gutter={16}>
                    {
                        establishment_branch_id &&
                        <Col>
                            <AsyncButton
                                type='primary'
                                style={{ borderRadius: '0.5rem' }}
                                onClick={generateReportIncomeExpenses}
                            >
                                Ingresos/Egresos
                            </AsyncButton>
                        </Col>
                    }
                    {/* {
                        establishment_id &&
                        <Col>
                            <AsyncButton
                                type='primary'
                                style={{ borderRadius: '0.5rem' }}
                                onClick={() => generateExportReportCommission({ establishment_id })}
                            >
                                Comisiones por establecimiento
                            </AsyncButton>
                        </Col>
                    } */}
                    {/* {
                        establishment_branch_id &&
                        <Col>
                            <AsyncButton
                                type='primary'
                                style={{ borderRadius: '0.5rem' }}
                                onClick={() => generateExportReportCommission({ establishment_branch_id })}
                            >
                                Comisiones por sucursal
                            </AsyncButton>
                        </Col>
                    } */}
                </Row>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <TabsStyled defaultActiveKey="1">
                {
                    user_id &&
                    <Tabs.TabPane tab="Pagos realizados" key="1">
                        <DonePayments
                            pay_account_id={pay_account_id}
                            user_id={user_id}
                            updateStatistic={updateStatistic}
                        />
                    </Tabs.TabPane>
                }
                <Tabs.TabPane tab="Ingreso wallet" key="2">
                    <IncomePayments pay_account_id={pay_account_id} updateStatistic={updateStatistic} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Egreso wallet" key="3">
                    <OutputPayments pay_account_id={pay_account_id} establishment_branch_id={establishment_branch_id}  updateStatistic={updateStatistic} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cuentas bancarias" key="4">
                    <BankAccounts pay_account_id={pay_account_id} establishment_branch_id={establishment_branch_id} updateStatistic={updateStatistic} />
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default PaymentsDetails;