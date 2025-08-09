import { useState } from "react";
import { Grid } from "../../components/com";
import { RoundedButton } from "../../components/com/grid/Styles";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { Button, DatePicker, Drawer, Input, message, Select, Tag } from "antd";
import { SimpleForm } from "../../components/com/form/";
import AsyncButton from "../../components/asyncButton";
import { getService } from "../../services";
import moment from "moment";
import locale from "antd/es/date-picker/locale/es_ES";
import _ from "lodash";

const STATUS = [
    {
        id: "active",
        name: "Active",
    },
    {
        id: "inactive",
        name: "Inactive",
    },
];

const columns = ({ onEdit, onRemove }) => [
    {
        key: "id",
        dataIndex: "id",
        title: "Id",
        sorter: true,
    },
    {
        key: "ip",
        dataIndex: "ip",
        title: "Ip",
        sorter: true,
    },
    {
        key: "note",
        dataIndex: "note",
        title: "Nota",
    },
    {
        key: "block_users",
        dataIndex: "block_users",
        title: "Block users",
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color={value === 'inactive' ? 'red' : 'orange'}>{value}</Tag>

    },
    {
        key: "expire_date",
        dataIndex: "expire_date",
        title: "Fecha expiración",
        render: (value) => value && moment(value).format('YYYY-MMM-DD  h:mm:ss a'),
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        key: 'actions',
        render: (id, record) =>
            <>
                <Button
                    type="text"
                    onClick={() => onEdit(record)}
                    icon={<AiOutlineEdit />}
                />

                <AsyncButton
                    type="link"
                    onClick={() => onRemove({ id })}
                    icon={<AiOutlineDelete />}
                    confirmText="Desea eliminar?"
                >
                </AsyncButton>
            </>
    }

];

const BlockIps = () => {

    const ipsBlockListService = getService('black-list-ips');


    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedIp, setSelectedIp] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);

    const onEdit = (record) => {
        setSelectedIp({
            ...record,
            expire_date: record?.expire_date ? moment(record.expire_date) : undefined,
        });
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await ipsBlockListService.remove(id)
            .then(() => {
                message.success("Ip eliminada de la lista!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la ip! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);
        const { id, ...rest } = data;

        if (selectedIp?.id) {
            await ipsBlockListService.patch(selectedIp.id, { ...rest })
                .then(() => {
                    message.success("Ip actualizada!");
                    setDrawerVisible(false);
                    setSelectedIp();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await ipsBlockListService.create({ ...rest })
                .then(() => {
                    message.success("Ip agregada correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <>
            <Grid
                source="black-list-ips"
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove })}
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    },
                }}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
                actions={{}}
                filters={
                    <>
                        <Input
                            source="ip"
                            name="ip"
                            label="ip"
                            placeholder="ip"
                            allowEmpty
                            size="medium"
                            style={{ width: '15rem' }}
                        />
                    </>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedIp ? 'Editar' : 'Crear'}`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedIp();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={`${selectedIp ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedIp}
                        onSubmit={handleSubmit}
                        allowNull={true}
                    >
                        <Input
                            flex={1}
                            label="Ip"
                            size='large'
                            name="ip"
                            validations={[
                                {
                                    required: true,
                                    message: `Ip es requerido`
                                }
                            ]}
                        />
                        <Select
                            flex={1}
                            name='block_users'
                            label="Block users"
                        >
                            {
                                _.map(STATUS, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <DatePicker
                            flex={1}
                            locale={locale}
                            showTime
                            name='expire_date'
                            label='Fecha expiración'
                            format='YYYY-MM-DD h:mm a'
                        />
                        <Input.TextArea
                            flex={1}
                            label="Nota"
                            size='large'
                            name="note"
                        />

                    </SimpleForm>
                </Drawer>
            }
        </>
    )
}

export default BlockIps;