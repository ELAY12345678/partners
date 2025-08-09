import { Button, Drawer, Input, InputNumber, message, Select, TimePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../../components/asyncButton';
import { Grid } from '../../../components/com';
import { SimpleForm } from '../../../components/com/form/';
import { RoundedButton } from '../../../components/com/grid/Styles';
import { getService } from '../../../services';
import { useEstablishmentBranches } from '../hooks';

const DAY_OF_WEEK = [
    {
        id: 'monday',
        name: 'Lunes',
    },
    {
        id: 'tuesday',
        name: 'Martes',
    },
    {
        id: 'wednesday',
        name: 'Miércoles',
    },
    {
        id: 'thursday',
        name: 'Jueves',
    },
    {
        id: 'friday',
        name: 'Viernes',
    },
    {
        id: 'saturday',
        name: 'Sábado',
    },
    {
        id: 'sunday',
        name: 'Domingo',
    },
];

const SelectField = ({ choices, ...rest }) => {
    return (
        <Select
            {...rest}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            {
                _.map(choices, ({ id, address }, index) =>
                    <Select.Option
                        key={index}
                        value={id}
                    >
                        {address}
                    </Select.Option>
                )
            }
        </Select>
    );
};

const columns = ({ establishmentBranches, DAY_OF_WEEK, onEdit, onRemove }) => [
    {
        title: "Sucursal",
        dataIndex: "establishment_branch_id",
        key: "establishment_branch_id",
        render: (value) => _.find(establishmentBranches, ({ id }) => id === value)?.address || value
    },
    {
        title: "Día",
        dataIndex: "weekday",
        key: "weekday",
        render: (value) => _.find(DAY_OF_WEEK, ({ id }) => id === value)?.name || value
    },
    {
        title: "Hora Inicio",
        dataIndex: "start_hour",
        key: "start_hour",
        sorter: true,
        render: (value) => moment(value, 'HH:mm:ss').format('h :mm a')
    },
    {
        title: "Hora Fin",
        dataIndex: "end_hour",
        key: "end_hour",
        sorter: true,
        render: (value) => moment(value, 'HH:mm:ss').format('h :mm a')
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

const BranchSchedules = ({ establishment_id }) => {

    const establishmentService = getService('establishment-branchs-schedules');

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState();
    const [establishment_branch_id, setEstablishmentBranchId] = useState();

    const [establishmentBranches, loadingEstablishmentBranches] = useEstablishmentBranches({ establishment_id });

    const onEdit = (record) => {
        setSelectedSchedule({ ...record, start_hour: moment(record.start_hour, 'HH:mm:ss'), end_hour: moment(record.end_hour, 'HH:mm:ss') });
        setDrawerVisible(true);
    }

    const onRemove = async ({ id }) => {
        await establishmentService.remove(id)
            .then(() => {
                message.success("Horario eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        if (data.start_hour)
            data.start_hour = moment(data.start_hour).format('HH:mm:ss')

        if (data.end_hour)
            data.end_hour = moment(data.end_hour).format('HH:mm:ss')

        if (selectedSchedule?.id) {
            data.establishment_branch_id = selectedSchedule?.establishment_branch_id;
            await establishmentService.patch(selectedSchedule.id, data)
                .then(() => {
                    message.success("Horario actualizado!");
                    setDrawerVisible(false);
                    setSelectedSchedule();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await establishmentService.create(data)
                .then(() => {
                    message.success("Horario creado!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    }

    return (
        <>
            <Grid
                source='establishment-branchs-schedules'
                filterDefaultValues={{
                    establishment_id,
                    establishment_branch_id,
                    $sort: {
                        weekday_number: 1,
                    }
                }}
                updateSource={updateSource}
                columns={columns({ establishmentBranches, DAY_OF_WEEK, onEdit, onRemove })}
                permitFetch={true}
                actions={{}}
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
                title={
                    <SelectField
                        placeholder='Sucursal...'
                        loading={loadingEstablishmentBranches}
                        style={{
                            width: '20rem'
                        }}
                        allowClear
                        onSelect={(value) => setEstablishmentBranchId(value)}
                        onClear={(value) => setEstablishmentBranchId()}
                        choices={establishmentBranches}
                    />
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    placement="right"
                    title={`${selectedSchedule ? 'Editar' : 'Crear'} Horario`}
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedSchedule();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={`${selectedSchedule ? 'Actualizar' : 'Crear'}`}
                        noAcceptButtonBlock={true}
                        scrollToFirstError
                        initialValues={selectedSchedule}
                        onSubmit={handleSubmit}
                    >
                        {
                            !selectedSchedule?.id &&
                            < Input
                                type="hidden"
                                name='establishment_id'
                                initial={establishment_id}
                            />
                        }
                        <SelectField
                            flex={1}
                            name='establishment_branch_id'
                            label="Sucursal"
                            size='large'
                            initial={establishment_branch_id}
                            validations={[{ required: true, message: 'Sucursal es requerida' }]}
                            choices={establishmentBranches}
                        />
                        <Select
                            flex={1}
                            name='weekday'
                            label="Día"
                            size='large'
                            validations={[{ required: true, message: 'Día es requerido' }]}
                        >
                            {
                                _.map(DAY_OF_WEEK, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <TimePicker
                            flex={0.5}
                            name='start_hour'
                            label="Hora Inicio"
                            size='large'
                            use12Hours={true}
                            format={'h:mm a'}
                            validations={[{ required: true, message: 'Hora Inicio es requerida' }]}
                        />
                        <TimePicker
                            flex={0.5}
                            name='end_hour'
                            label="Hora Fin"
                            size='large'
                            use12Hours={true}
                            format={'h:mm a'}

                            validations={[{ required: true, message: 'Hora Fin es requerida' }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default BranchSchedules;