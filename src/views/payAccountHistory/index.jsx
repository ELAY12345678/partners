import { Col, Divider, Layout, Row, Statistic, Tabs, Breadcrumb, message, Typography } from "antd";
import { Box, TabsStyled } from "../../components/Styles";
import { useTotalPaymentsByAccountId } from "./hooks";
import DonePayments from "./DonePayments";
import IncomePayments from "./IncomePayments";
import OutputPayments from "./OutputPayments";
import BankAccounts from "./BankAccounts";
import AsyncButton from "../../components/asyncButton";
import { getService } from "../../services";
import { useSelector } from "react-redux";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import _ from "lodash";

const PaymentsDetails = () => {

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    const currentUser = useSelector(({ appReducer }) => appReducer?.user);

    const [pay_account_id, setPayAccountId] = useState();
    const [userEstablishment, setUserEstablishment] = useState();
    const [totalPaymentsByAccountId, loadingTotalPaymentsByAccountId, getTotalPaymentsByAccountId] = useTotalPaymentsByAccountId({ pay_account_id });

    const serviceReportIncomeExpenses = getService("report-income-expenses");
    const serviceEstablishmentCommissions = getService("establishments-commissions");
    const payAccountService = getService("pay-accounts");

    const updateStatistic = () => {
        // getTotalPaymentsByAccountId();
    };

    const generateReportIncomeExpenses = async () => {
        await serviceReportIncomeExpenses.find({
            query: {
                ...establishmentFilters
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

    const getPayAccount = async (establishmentFilters) => {

        await payAccountService.find({
            query: {
                // $select: ['id'],
                $limit: 1,
                ...establishmentFilters
            }
        })
            .then((response) => {
                if (response?.data?.length > 0) {
                    setPayAccountId(response?.data[0]?.id);
                }
            })
            .catch(() => { })
    };

    useEffect(() => {
        if (establishmentFilters?.establishment_branch_id && userEstablishment) {
            getPayAccount(establishmentFilters);
        }
    }, [establishmentFilters?.establishment_branch_id, userEstablishment])

    useEffect(() => {
        if (establishmentFilters?.establishment_id && currentUser?.role === 'user') {
            const user_establishment_branch = _.find(currentUser?.permissionsv2, ({ role, establishment_id }) => ['superAdmin', 'kam'].includes(role) && establishment_id === Number(establishmentFilters?.establishment_id))
            setUserEstablishment(user_establishment_branch);
        } else if (establishmentFilters?.establishment_id && currentUser?.role === 'admin') {
            setUserEstablishment(true);
        }
    }, [establishmentFilters?.establishment_id])

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Row>
                <Row
                    align='middle'
                    style={{
                        color: "var(--purple)",
                    }}
                    gutter={[16, 16]}
                >
                    <Col>
                        <AiOutlineDollarCircle size={30} />
                    </Col>
                    <Col>
                        <Typography.Title level={3} style={{ margin: 0 }}>
                            Histórico AppartaPay
                        </Typography.Title>
                    </Col>
                </Row>
                <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            </Row>
            <Row style={{ marginBottom: '1rem' }} gutter={16}>
                <Col span={24}>
                    {
                        !(establishmentFilters.establishment_branch_id) ? (
                            <Box>
                                *Seleccione una dirección para ver los registros*
                            </Box>
                        ) : userEstablishment ?
                            (
                                <>
                                    <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
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
                                        <Col span={8}>
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
                                        <Col span={8}>
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
                                    <Row gutter={8} justify='end'>
                                        {
                                            establishmentFilters?.establishment_branch_id &&
                                            <Col>
                                                <AsyncButton
                                                    type='primary'
                                                    style={{ borderRadius: '0.5rem' }}
                                                    onClick={generateReportIncomeExpenses}
                                                >
                                                    <RiFileExcel2Fill size={20} />
                                                    Ingresos/Egresos
                                                </AsyncButton>
                                            </Col>
                                        }
                                        {/* {
                                            establishmentFilters?.establishment_id &&
                                            <Col>
                                                <AsyncButton
                                                    type='primary'
                                                    style={{ borderRadius: '0.5rem' }}
                                                    onClick={() => generateExportReportCommission({ establishment_id: establishmentFilters?.establishment_id })}
                                                >
                                                    <RiFileExcel2Fill size={20} />
                                                    Comisiones por establecimiento
                                                </AsyncButton>
                                            </Col>
                                        }
                                        {
                                            establishmentFilters?.establishment_branch_id &&
                                            <Col>
                                                <AsyncButton
                                                    type='primary'
                                                    style={{ borderRadius: '0.5rem' }}
                                                    onClick={() => generateExportReportCommission({ establishment_branch_id: establishmentFilters?.establishment_branch_id })}
                                                >
                                                    <RiFileExcel2Fill size={20} />
                                                    Comisiones por sucursal
                                                </AsyncButton>
                                            </Col>
                                        } */}
                                    </Row>
                                    <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
                                    <TabsStyled defaultActiveKey="1">
                                        <Tabs.TabPane tab="Ingreso wallet" key="2">
                                            <IncomePayments pay_account_id={pay_account_id} updateStatistic={updateStatistic} />
                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab="Egreso wallet" key="3">
                                            <OutputPayments pay_account_id={pay_account_id} updateStatistic={updateStatistic} />
                                        </Tabs.TabPane>
                                    </TabsStyled>
                                </>
                            ) :
                            (
                                <Box>
                                    *No tiene permisos para ver estos registros*
                                </Box>
                            )
                    }
                </Col>
            </Row>
        </Layout.Content>
    );
}

export default PaymentsDetails;