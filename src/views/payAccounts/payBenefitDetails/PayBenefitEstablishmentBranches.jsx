import { Col, Drawer, InputNumber, message, Row, Select, Tag } from "antd";
import _ from "lodash";
import { useState } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import AsyncButton from "../../../components/asyncButton";
import { Grid } from "../../../components/com";
import { SelectField } from "../../../components/com/form/";
import { RoundedButton } from "../../../components/com/grid/Styles";
import TransferTable from "../../../components/com/TransferTable";
import { useCities } from "../../../hooks/useCities";
import { getService } from "../../../services";

const STATUS = [
    {
        id: 'active',
        name: 'active',
        color: 'success'
    },
    {
        id: 'inactive',
        name: 'inactive',
        color: 'error'
    },
];

const columns = ({ cities, onRemove }) => [
    {
        key: "establishment_id",
        dataIndex: "establishment_id",
        title: "Id Establecimiento",
        sorter: true,
    },
    {
        key: "establishment_branch_id",
        dataIndex: "establishment_branch_id",
        title: "Id Sucursal",
        sorter: true,
    },
    {
        key: "city_id",
        dataIndex: "city_id",
        title: "Ciudad",
        sorter: true,
        render: (value) => _.find(cities, ({ id }) => value === id)?.name || ''
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
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, record) => {
            return (
                <>
                    <AsyncButton
                        type="link"
                        onClick={() => onRemove({ id })}
                        icon={<AiOutlineDelete />}
                        confirmText="Desea eliminar?"
                    >
                    </AsyncButton>
                </>
            );
        },
    }
];

const PayBenefitEstablishmentBranches = ({ pay_benefit_id, city_id }) => {

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedEstablishment, setSelectedEstablishment] = useState();

    const [selectedCityId, setSelectedCityId] = useState(city_id);

    const payBenefitsEstablismentsService = getService('pay-benefits-establishments-branchs');

    const [cities, loadingCities] = useCities();

    const onRemove = async ({ id }) => {
        await payBenefitsEstablismentsService.remove(id)
            .then(() => {
                message.success("Programación Eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };

    const handleSubmit = async (data) => {
        await payBenefitsEstablismentsService
            .create(
                _.map(data, ({ establishment_branch_id, establishment_id, city_id }) => ({
                    establishment_branch_id,
                    establishment_id,
                    pay_benefit_id,
                    city_id,
                    status: 'active',
                }))
            )
            .then((response) => {
                setSelectedEstablishment();
                setSelectedCityId();
                setUpdateSource(!updateSource);
                setDrawerVisible(false);
                message.success("Establecimientos agregados a este beneficio correctamente!");
            })
            .catch((err) => {
                message.error(err.message);
            });

    };

    return (
        <>
            <Grid
                custom={true}
                updateSource={updateSource}
                source="pay-benefits-establishments-branchs"
                filterDefaultValues={{
                    pay_benefit_id: pay_benefit_id,
                    $sort: {
                        id: 1
                    }
                }}
                actions={{}}
                columns={columns({ cities, onRemove })}
                filters={
                    <>
                        <InputNumber
                            alwaysOn
                            source="establishment_id"
                            name="establishment_id"
                            label="Id Establecimiento"
                            placeholder="Id Establecimiento"
                            allowEmpty
                            style={{ width: '200px' }}
                        />
                        <InputNumber
                            alwaysOn
                            source="establishment_branch_id"
                            name="establishment_branch_id"
                            label="Id Sucursal"
                            placeholder="Id Sucursal"
                            allowEmpty
                            style={{ width: '200px' }}
                        />
                        <SelectField
                            alwaysOn
                            disabled={!!city_id}
                            defaultValue={city_id}
                            loading={loadingCities}
                            source="city_id"
                            name="city_id"
                            label="city_id"
                            placeholder="Ciudad"
                            allowEmpty
                            choices={cities}
                            size="medium"
                            style={{
                                width: '15em'
                            }}
                        />
                    </>
                }
                extra={
                    <div>
                        <RoundedButton
                            icon={<AiOutlinePlus />}
                            type={"primary"}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    height={'80%'}
                    style={{ height: '100%' }}
                    placement="bottom"
                    title='Añadir establecimientos participantes'
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedCityId();
                    }}
                    extra={
                        <Row gutter={8}>
                            <Col>
                                <Select
                                    disabled={!!city_id}
                                    defaultValue={selectedCityId}
                                    loading={loadingCities}
                                    placeholder="Ciudad"
                                    allowClear
                                    onClear={() => setSelectedCityId()}
                                    choices={cities}
                                    size="medium"
                                    style={{
                                        width: '15em'
                                    }}
                                    onSelect={(value) => setSelectedCityId(value)}
                                >
                                    {
                                        _.map(cities, ({ id, name }, index) =>
                                            <Select.Option value={id} key={index}>
                                                {name}
                                            </Select.Option>
                                        )
                                    }
                                </Select>
                            </Col>
                            <Col>
                                <AsyncButton
                                    type="primary"
                                    style={{ borderRadius: '0.5rem' }}
                                    onClick={() => handleSubmit(selectedEstablishment)}
                                >
                                    Guardar
                                </AsyncButton>
                            </Col>
                        </Row>
                    }
                >
                    <TransferTable
                        city_id={selectedCityId}
                        pay_benefit_id={pay_benefit_id}
                        onChange={(values) => setSelectedEstablishment(values)}
                    />
                </Drawer>

            }
        </>
    )
}

export default PayBenefitEstablishmentBranches;