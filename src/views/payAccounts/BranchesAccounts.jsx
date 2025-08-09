import { Avatar, Button, Col, Row, Divider, Statistic, Tag } from 'antd';
import { Grid } from "../../components/com";
import { S3_PATH_IMAGE_HANDLER } from "../../constants";
import { AiOutlineEye } from "react-icons/ai";
import numeral from "numeral";
import { Box } from '../../components/Styles';
import { useTotalAmounts } from "./hooks";
import { useNavigate } from "react-router-dom";
import _ from 'lodash';

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

const columns = ({ navigate }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        title: "Id establecimiento",
        dataIndex: "establishment_branch_id",
        key: "establishment_branch_id",
        sorter: true,
    },
    {
        title: "Logo",
        dataIndex: "establishment",
        key: "establishment",
        render: (establishment) =>
            <Avatar
                size="large"
                alt={'Avatar'}
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: establishment?.gallery_logo,
                    width: 64,
                    height: 64,
                })}`}
            />
    },
    {
        title: "Establecimiento",
        dataIndex: "establishment",
        key: "establishment_name",
        render: (establishment) => establishment?.name
    },
    {
        title: "Sucursal",
        dataIndex: "establishment_branch",
        key: "establishment_branch",
        render: (establishment_branch) => establishment_branch?.address
    },
    {
        title: "Total ingreso wallet",
        dataIndex: "amount_available",
        key: "amount_available",
        sorter: true,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`

    },
    {
        title: "Total egreso wallet",
        dataIndex: "amount_withdrawal",
        key: "amount_withdrawal",
        sorter: true,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`

    },
    {
        title: "Balance wallet",
        dataIndex: "id",
        key: "wallet_balance",
        sorter: true,
        render: (id, { amount_available, amount_withdrawal }) => `$ ${numeral(amount_available - amount_withdrawal || "").format("0,0")}`
    },
    {   
        title: "Estado",
        dataIndex: "status",
        key: "status",
        sorter: true,
        render: (value) => {
            const status = _.find(STATUS, ({ id }) => id === value) || value
            return <Tag color={status?.color} >
                {status?.name || status}
            </Tag>
        }
    
},
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, record) =>
            <Button
                type="link"
                onClick={() =>
                    navigate(
                        '/dashboard/management/pay-accounts/details',
                        {
                            state: {
                                pay_account_id: id,
                                account_name: `${record?.establishment?.name} - ${record?.establishment_branch?.address}`,
                                establishment_id: record?.establishment_id,
                                establishment_branch_id: record?.establishment_branch_id
                            }
                        }
                    )
                }
                icon={<AiOutlineEye />}
            />
    },
];

const BranchesAccounts = () => {
    const navigate = useNavigate();
    const [establishmentsTotalAmounts, loadingEstablishmentsTotalAmounts] = useTotalAmounts();

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Total ingresado (COP)"
                                value={establishmentsTotalAmounts?.amount_available}
                                precision={2}
                                loading={loadingEstablishmentsTotalAmounts}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={8}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Total retirado (COP)"
                                value={establishmentsTotalAmounts?.amount_withdrawal}
                                precision={2}
                                loading={loadingEstablishmentsTotalAmounts}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={8}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Balance (COP)"
                                value={establishmentsTotalAmounts?.amount}
                                precision={2}
                                loading={loadingEstablishmentsTotalAmounts}
                            />
                        </Col>
                    </Box>
                </Col>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Grid
                custom={true}
                source="pay-accounts"
                filterDefaultValues={{
                    type: 'establishment_branch',
                    $sort: {
                        id: 1
                    }
                }}
                searchField="q"
                searchText="Buscar..."
                search={true}
                actions={{}}
                columns={columns({ navigate })}
            />
        </>
    );
}

export default BranchesAccounts;