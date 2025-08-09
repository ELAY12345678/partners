import { useNavigate } from "react-router-dom";

import { Breadcrumb, Divider, InputNumber, Layout, Tabs, Tag } from "antd";
import _ from "lodash";
import { Grid } from "../../../components/com";
import { TabsStyled } from "../../../components/Styles";
import moment from "moment";
import numeral from "numeral";

import PayBenefitEstablishmentBranches from './PayBenefitEstablishmentBranches';
import PayBenefitUserSegments from "./PayBenefitUserSegments";

const STATUS = [
    {
        id: 'claimed',
        name: 'claimed',
        color: 'success'
    },
    {
        id: 'expired',
        name: 'expired',
        color: 'magenta'
    },
    {
        id: 'canceled',
        name: 'canceled',
        color: 'error'
    },
    {
        id: 'acquired',
        name: 'acquired',
        color: 'processing'
    },
];

const columns = [
    {
        key: "meta_user_id",
        dataIndex: "meta_user_id",
        title: "Usuario Id",
        sorter: true,
    },
    {
        key: "meta_establishment_id",
        dataIndex: "meta_establishment_id",
        title: "Id - Establecimiento",
        sorter: true,
        render: (value, record) => `${value || ""} - ${record?.meta_establishment || ""}`
    },
    {
        key: "meta_establishment_branch_id",
        dataIndex: "meta_establishment_branch_id",
        title: "Id - Sucursal",
        sorter: true,
        render: (value, record) => `${value || ""} - ${record?.meta_establishment_branch_address || ""}`
    },
    {
        key: "amount",
        dataIndex: "amount",
        title: "Monto",
        sorter: true,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`
    },
    {
        key: "expire_day",
        dataIndex: "expire_day",
        title: "Día expiración",
        sorter: true,
        render: (value) => moment(value).format("YYYY-MM-DD h:mm:ss a")
    },
    {
        key: "status",
        dataIndex: "status",
        title: "Estado",
        sorter: true,
        render: (value) => {
            const status = _.find(STATUS, ({ id }) => id === value) || value
            return <Tag color={status?.color} >
                {status?.name || status}
            </Tag>
        }
    },
];

const PayBenefitUsers = ({ location }) => {
    const navigate = useNavigate();
    const { pay_benefit_id, benefit_name, isSpecific, city_id } = location.state;

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Breadcrumb>
                <Breadcrumb.Item
                    onClick={() => navigate('/dashboard/management/pay-accounts',
                        {
                            state: {
                                defaultSelectedTab: '4'
                            }
                        }
                    )}
                    style={{ cursor: 'pointer' }}
                >
                    Beneficio
                </Breadcrumb.Item>
                <Breadcrumb.Item>{benefit_name}</Breadcrumb.Item>
            </Breadcrumb>
            {/* <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Pagos realizados (COP)"
                                value={0.1}
                                precision={2}
                            // loading={loadingTotalPaymentsByAccountId}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={6}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Ingreso wallet (COP)"
                                value={2}
                                precision={2}
                            // loading={loadingTotalPaymentsByAccountId}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={6}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Egreso wallet (COP)"
                                value={5}
                                precision={2}
                            // loading={loadingTotalPaymentsByAccountId}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={6}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Balance total wallet (COP)"
                                value={5}
                                precision={2}
                            // loading={loadingTotalPaymentsByAccountId}
                            />
                        </Col>
                    </Box>
                </Col>
            </Row> */}
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <TabsStyled defaultActiveKey="1">
                {
                    isSpecific &&
                    <Tabs.TabPane tab="Sucursales" key="2">
                        <PayBenefitEstablishmentBranches pay_benefit_id={pay_benefit_id} city_id={city_id} />
                    </Tabs.TabPane>
                }
                <Tabs.TabPane tab="Usado por usuarios" key="4">
                    <Grid
                        custom={true}
                        source="pay-benefits-users"
                        filterDefaultValues={{
                            meta_pay_benefit_id: pay_benefit_id,
                            $sort: {
                                id: 1
                            }
                        }}
                        actions={{}}
                        columns={columns}
                        filters={
                            <>
                                <InputNumber
                                    alwaysOn
                                    source="meta_user_id"
                                    name="meta_user_id"
                                    label="Id Usuario"
                                    placeholder="Id Usuario"
                                    allowEmpty
                                    style={{ width: '200px' }}
                                />
                                <InputNumber
                                    alwaysOn
                                    source="meta_establishment_id"
                                    name="meta_establishment_id"
                                    label="Id Establecimiento"
                                    placeholder="Id Establecimiento"
                                    allowEmpty
                                    style={{ width: '200px' }}
                                />
                                <InputNumber
                                    alwaysOn
                                    source="meta_establishment_branch_id"
                                    name="meta_establishment_branch_id"
                                    label="Id Sucursal"
                                    placeholder="Id Sucursal"
                                    allowEmpty
                                    style={{ width: '200px' }}
                                />
                            </>
                        }
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Segmento de usuarios" key="6">
                        <PayBenefitUserSegments pay_benefit_id={pay_benefit_id} />
                    </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default PayBenefitUsers