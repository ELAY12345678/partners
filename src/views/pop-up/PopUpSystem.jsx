import { Button, Col, DatePicker, Drawer, Form, Input, message, Row, Select, Table, Tag, TimePicker } from 'antd';
import locale from "antd/es/date-picker/locale/es_ES";
import _, { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { Grid } from "../../components/com";
import { SimpleForm } from '../../components/com/form/SimpleForm';
import { RoundedButton } from '../../components/com/grid/Styles';
import { getService } from '../../services';
const format = "h:mm a";
const formatValue = 'hh:mm a';
const STATUS = [
    {
        id: "active",
        name: "Activo",
    },
    {
        id: "inactive",
        name: "Inactivo",
    },
];
const DAYS_OF_WEEK = [
    { day: 'Lunes', id: 0 },
    { day: 'Martes', id: 1 },
    { day: 'Miércoles', id: 2 },
    { day: 'Jueves', id: 3 },
    { day: 'Viernes', id: 4 },
    { day: 'Sábado', id: 5 },
    { day: 'Domingo', id: 6 },
    { day: 'Festivos', id: 7 },
];

const FRENQUENCY = [
    {
        id: "all",
        name: "Una sola vez",
    },
    {
        id: "specific",
        name: "Recurrente",
    },
];

const SCOPE = [
    {
        id: "all",
        name: "Mostrar en todos los establecimientos",
    },
    {
        id: "specific",
        name: "Mostrar en establecimientos específicos",
    },
];


const INTERVAL = [
    {
        id: "null",
        name: "Sin configurar",
    },
    {
        id: "5",
        name: "5 segundos",
    },
    {
        id: "30",
        name: "30 segundos",
    },
    {
        id: "60",
        name: "1 minuto",
    },
    {
        id: "300",
        name: "5 minutos",
    },
    {
        id: "900",
        name: "15 minutos",
    },
    {
        id: "1800",
        name: "30 minutos",
    },
    {
        id: "3600",
        name: "1 hora",
    },
    {
        id: "21600",
        name: "6 horas",
    },
];

const columns = ({ onRemove, onEdit }) => [
    // {
    //     title: "Id",
    //     dataIndex: "id",
    //     sorter: true,
    //     width: 100,
    // },
    {
        title: "Nombre",
        dataIndex: "name",
        sorter: true,
        width: 200,
    },
    {
        title: "Descripción",
        dataIndex: "description",
        sorter: true,
        width: 200,
    },
    {
        title: "Estado",
        dataIndex: "status",
        sorter: true,
        width: 100,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
    {
        title: "Establecimientos",
        dataIndex: "tables_partners",
        sorter: true,
        width: 'auto',
        render: (value, record) =>
            record?.establishments_ids_included_information ? _.map(JSON.parse(record?.establishments_ids_included_information), ({ full_name }, key) => (
              <div>
                {full_name} 
                {key + 1 === JSON.parse(record?.establishments_ids_included_information || []).length ? '' : ' , '}
              </div>
            )) : '',
    },
    {
        title: "Link",
        dataIndex: "link_url",
        sorter: false,
        // width: 200,
    },
    
    {
        title: "Acciones",
        dataIndex: 'id',
        width: 150,
        render: (id, record) => {
            return (
                <Row>
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
                </Row>
            );
        },
    }
];

const  PopUpSystem = ({ location }) => {

    // const {
    //     establishment_id,    
    //     establishment_branch_id
    // } = location.state;
    const tablesPartnersGroupService = getService('tables-partners-groups');
    const tablesPartnersService = getService('tables-partners');
    const establishmentsServices = getService('establishments');
    
    const [form] = Form.useForm();
    const selectedCampaignId = Form.useWatch('frequency', form);
    const selectedTargetingScope = Form.useWatch('targeting_scope', form); 
    const popupsServices = getService('pop-ups');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState();
    const [updateSource, setUpdateSource] = useState(false);
    const [establishmentBranchSelected, setEstablishmentBranchSelected] = useState();
    const [establishmentBranchesOptions, setEstablishmentBranchesOptions] = useState([]);
    const [establishmentCampaigns, setEstablishmentCampaigns] = useState([])
    const [loadingEstablishmentCampaigns, setloadingEstablishmentCampaigns] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const DAYSOFWEEK = _.map(DAYS_OF_WEEK, ({ day, id }) => ({
        value: Number(id || 0) + 1,
        label: day,
        checked: false,
    }));
    
    const [availabilityScheduleByDay, setavailabilityScheduleByDay] =
        useState(DAYSOFWEEK);
        
    const getEstablishmentBranches = async (value) => {
            if (value === '') {
                setEstablishmentBranchesOptions([])
                setCurrentPage(1)
                return;
            }

            await  establishmentsServices.find({
                    query: {
                        q: value,
                        $client: {
                            skipJoins: true
                        },
                        $limit: 25,
                        $select: ['id', 'name']
                    }
                }).then(({data}) => {  
            const dataResponse = data.map(({id,name})=>({
            // city_name: ,
            // establishment_branch_id: ,
            establishment_id: id,
            full_name: name}))
         
                setEstablishmentBranchesOptions(_.sortBy(dataResponse, [({ full_name }) => full_name]));
            })
            .catch((err) => message.error(err));
        };
    
    const debounceGetEstablishmentBranches = debounce(getEstablishmentBranches, 500, { maxWait: 800 });
    const onRemove = async ({ id }) => {
        await popupsServices.remove(id)
            .then(() => {
                message.success("Pop-up eliminada!");
                setUpdateSource(!updateSource);
                // getEstablishmentCampaigns()
            })
            .catch((error) =>
                message.error('No se pudo eliminar el Sucursal! ' + error?.message)
            )
    };

    const onEdit = (record) => {
        _.forEach(record, (value, key) => {
            if (value === null) {
                delete record[key]
            }
        })
        setSelectedGroup(record);
        setDrawerVisible(true);
    };

    // const getTablesPartner = ()=>{
    //     .find({
    //         query: {
    //             $client:{
    //                 showTablesPartners: true
    //             },
    //             $select: ["id", "name","status"]
    //         }
    //     })
        
    // }
    
    // const [establishmentCampaigns, getEstablishmentCampaigns, loadingEstablishmentCampaigns]
    //     = useEstablishmentCampaigns({
    //         source: "tables-partners",
    //         tables_partners_groups_id: selectedGroup?.id || null,//selectedCampaign?.id
    //         page: currentPage,
    //         filters: {
    //             tables_partners_groups_id: selectedGroup?.id,//selectedCampaign?.id
    //         }
    //     });

    const handleSubmit = async (err, values, form) => {
        if (err) return message.error(err);

        try {
            if (
                moment(values?.end_time).isBefore(moment(values?.start_time))
              // values?.start_time?.format('HH:mm:ss') >
              // values?.end_time?.clone().subtract(1, 'second')?.format('HH:mm:ss')
            ) {
                message.error('¡Ups! El rango de horario no es válido');
              
                return;
            }
            // setisLoading(true);
            const typePopup = values?.frequency
            const DAYSOFWEEKS =
                typePopup === 'all'
                ? undefined
                : _.map(
                    availabilityScheduleByDay.filter(
                        (item) => item?.checked === true,
                    ),
                    'value',
                );

            const STARTDATETIME = values?.start_time?.format('HH:mm:00');
           
            const ENDDATETIME = values?.end_time?.format('HH:mm:00');
            const DATE =
            typePopup === 'all'
                ? moment(values?.day).format('YYYY-MM-DD')
                : undefined; // all
            const data = {
                name: values?.name,
                description: values?.description,
                link_url: values?.link_url,
                status: values?.status,
                targeting_scope: values?.targeting_scope,
                 //genera error
                type: 'system',
                establishments_ids_included: values?.targeting_scope ==='all' ? null : JSON.stringify(establishmentCampaigns?.data?.map((it)=>it?.establishment_id)),
                establishments_ids_included_information: values?.targeting_scope ==='all' ? null : JSON.stringify(establishmentCampaigns?.data) ,
                meta_pop_ups_schedules:
                typePopup === 'all'
                    ? [
                        {
                            period_type: 'date',
                            date: DATE,
                            start_time: STARTDATETIME,
                            end_time: ENDDATETIME,
                            reappear_interval_minutes: values?.reappear_interval_minutes !=='null' ? values?.reappear_interval_minutes : undefined,
                        },
                        ]
                    : _.map(DAYSOFWEEKS, (value) => ({
                            period_type: 'day_of_week',
                            day_of_week: value,
                            start_time: STARTDATETIME,
                            end_time: ENDDATETIME,
                            reappear_interval_minutes: values?.reappear_interval_minutes !=='null' ? values?.reappear_interval_minutes : undefined,
                        })),
            };

            if (selectedGroup && selectedGroup?.id) {
                const event = await popupsServices.patch(selectedGroup?.id, data);
                form.resetFields();
            } else {
                const event = await popupsServices.create(data);
                form.resetFields();
            }
           
            setEstablishmentCampaigns([])
            setSelectedGroup();
            message.success("¡Pop-up creado exitosamente!.");
            setTimeout(() => {
                setUpdateSource(!updateSource);
                setDrawerVisible(false);
            }, 500);
            } catch (error) {
                console.log('error',error)
        }
        
    };

    const setEstablishmentBranchesCampaign = async ({ establishmentBranchSelected, tables_partners_groups_id }) => {
       
        const establishmentName = establishmentBranchesOptions.filter((it)=> it.establishment_id ===JSON.parse(establishmentBranchSelected)?.establishment_id)

        const data = (establishmentCampaigns?.data || []).concat(establishmentName)
       
        setEstablishmentCampaigns({data ,total: (data || [])?.length})
        // const data= {...(JSON.parse(establishmentBranchSelected)),tables_partners_groups_id}
        //     await tablesPartnersService.create(data).then(() => {
                    message.success('Establecimiento añadido correctamente!');
                    setEstablishmentBranchSelected();
                    setUpdateSource(!updateSource);
                    // getEstablishmentCampaigns();
                // }).catch((error) => {
                //     message.error(error?.message);
                // })
    };

    const handleChangeDayStatus = ({ valueChecked }) => {
        const newSchedule = _.map(availabilityScheduleByDay, (day) =>
            day.value === valueChecked
            ? {
                ...day,
                checked:
                //   day?.value === initialValues?.day_of_week ? true :
                    !day.checked,
                }
            : day,
        );
        setavailabilityScheduleByDay(newSchedule);
        const scheduleChecked = newSchedule.filter((item) => item.checked === true);
        form.setFieldsValue({
            day_of_week: scheduleChecked.length ? scheduleChecked : null,
        });
    };

    useEffect(() => {
        if(selectedGroup?.id){
            if (selectedGroup?.pop_ups_schedules?.[0]?.day_of_week) {
               
                const day_of_weeks= selectedGroup?.pop_ups_schedules.map(({day_of_week})=>day_of_week)
            
                const daysOfWeek = DAYSOFWEEK.map((dia) => ({
                  ...dia,
                  checked: !!day_of_weeks.includes(
                    dia?.value,
                  ),
                }));
                setavailabilityScheduleByDay(daysOfWeek);
                form.setFieldsValue({
                  days_of_week: daysOfWeek.length
                    ? daysOfWeek.filter((item) => item.checked === true)
                    : null,
                });
            }
            if(selectedGroup?.pop_ups_schedules?.[0]?.period_type ==='date'){
               
                form.setFieldValue(
                    'day',
                    moment(selectedGroup?.pop_ups_schedules?.[0]?.date),
                );

            }
            form.setFieldValue(
                'frequency',
                selectedGroup?.pop_ups_schedules?.[0]?.period_type ==='date' ? 'all' : 'specific',
            );

            form.setFieldValue(
                'targeting_scope',
                selectedGroup?.targeting_scope,
            );

            
            
            form.setFieldValue(
                'reappear_interval_minutes',
                selectedGroup?.pop_ups_schedules?.[0]?.reappear_interval_minutes ? `${selectedGroup?.pop_ups_schedules?.[0]?.reappear_interval_minutes}` :  'null',
            );

            //    start_hour: moment(source.start_hour, formatValue),
            //             end_hour: moment(moment(source.end_hour, formatValue)),
            form.setFieldValue(
                'start_time',
                moment(selectedGroup?.pop_ups_schedules?.[0]?.start_time, 'HH:mm:ss')
                // moment(moment(selectedGroup?.pop_ups_schedules?.[0]?.start_time, formatValue))
                ,
            );
            //   date_time_start: moment(source.date_time_start),
            //             date_time_end: moment(moment(source.date_time_end)),
            form.setFieldValue(
                'end_time',
                moment(selectedGroup?.pop_ups_schedules?.[0]?.end_time, formatValue)
                
            );
            
            if(selectedGroup?.establishments_ids_included_information){
                const establishment_ids = JSON.parse(selectedGroup?.establishments_ids_included_information)
                setEstablishmentCampaigns({data: establishment_ids ,total: (establishment_ids || [])?.length})
            }
            
            
        }else{
            form.setFieldValue(
            'frequency',
            'all',
            );
            form.setFieldValue(
                'targeting_scope',
                'specific',
            );
            
            form.setFieldValue(
            'name',
            '',
            );
            form.setFieldValue(
            'description',
            '',
            );
            form.setFieldValue(
            'link_url',
            '',
            );
        }
        
    }, [selectedGroup?.id])
    
    const removeEstablishmentBranchesCampaign = ({ id }) => {
       
        const updatedData = establishmentCampaigns.data.filter(item => item.establishment_id !== id);
        

        setEstablishmentCampaigns({
            data: updatedData,
            total: updatedData.length
        });
        message.success('Establecimiento eliminado correctamente!');
        setEstablishmentBranchSelected();
        setUpdateSource(!updateSource);
    };
    return (
        <>
            <Grid
                custom={true}
                source="pop-ups"
                filterDefaultValues={{
                    // establishment_id: 1,// establishment_id,
                    // establishment_branch_id: 1,//establishment_branch_id,
                    type: 'system',
                    $limit: 1000,
                    $client: {
                        showPopUpsSchedules: true,
                    },
                    // $client:{
                    //     showTablesPartners: true
                    // },
                    // $select: ["id", "name","status"]
                }}
                searchField="q"
                searchText="Pop-up..."
                search={true}
                permitFetch={true}
                actions={{}}
                updateSource={updateSource}
                columns={columns({ onRemove, onEdit })}
                extra={
                    <div>
                        <RoundedButton
                            icon={<AiOutlinePlus />}
                            type={"primary"}
                            onClick={() => {
                                setDrawerVisible(true)
                                setSelectedGroup();
                                form.setFieldValue(
                                    'frequency',
                                    'all',
                                  );
                                  form.setFieldValue(
                                    'targeting_scope',
                                    'specific',
                                    );
                                
                                  form.setFieldValue(
                                    'reappear_interval_minutes',
                                    'null',
                                  );
                                  setavailabilityScheduleByDay(DAYSOFWEEK)
                                  
                                // getEstablishmentCampaigns();
                            }}
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
                    title={`${selectedGroup ? 'Editar' : 'Crear'} Pop-up`}
                    placement="right"
                    width={520}
                    visible={drawerVisible}
                    onClose={() => {
                        form.resetFields();
                        setSelectedGroup();
                        setCurrentPage(1)
                        setEstablishmentCampaigns([])
                        setEstablishmentBranchesOptions([])
                        setTimeout(() => {
                            setDrawerVisible(false);
                        }, 500);
                        
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedGroup}
                        onSubmit={handleSubmit}
                        form={form}
                        // source="banners"
                        // id={selectedBanner.id}
                    >
                        <Input
                            flex={1}
                            name='name'
                            label='Nombre'
                            validations={[
                                {
                                    required: true,
                                    message: `Nombre es requerido`
                                }
                            ]}
                        />
                        <Input
                            flex={1}
                            name='description'
                            label='Descripción'
                            validations={[
                                {
                                    required: true,
                                    message: `Descripción es requerida`
                                }
                            ]}
                        />
                        <Input
                            flex={1}
                            name='link_url'
                            label='Link'
                            validations={[
                                {
                                    required: true,
                                    message: `Link es requerido`
                                }
                            ]}
                        />
                        <Select
                            flex={0.5}
                            name='reappear_interval_minutes'
                            label="Intervalo"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Intervalo es requerido`
                                }
                            ]}
                        >
                            {
                                _.map(INTERVAL, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        
                        <Select
                            flex={0.5}
                            name='status'
                            label="Estado"
                            size='large'
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
                        <Select
                            flex={1}
                            disabled={selectedGroup?.id}
                            name='frequency'
                            label="Frecuencia"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Frecuencia es requerida`
                                }
                            ]}
                        >
                            {
                                _.map(FRENQUENCY, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        {selectedCampaignId ==='all' ?
                        
                        <DatePicker
                            flex={1}
                            xtype="date"
                            size="large"
                            label="Fecha"
                            name="day"
                            format="MM/DD/YYYY"
                            locale={locale}
                        />
                     :null}
                    {selectedCampaignId ==='specific' ?
                    <div style={{ }}>
                        <Form.Item
                            name="day_of_week"
                            rules={[
                            {
                                required: false,
                            },
                            ]}
                            label="Días de la semana"
                            labelCol={{ style: {} }}
                        >
                            <div
                            style={{
                                display: 'flex',
                                gap: '5px',
                                marginTop: '2px',
                                flexWrap: 'wrap',
                            }}
                            >
                            {_.map(
                                availabilityScheduleByDay,
                                ({ value, label, checked }) => (
                                <Button
                                    type= {checked ?  'primary' : 'ghost' }
                                    style={{
                                    minWidth: '100px',
                                    color: checked ? 'white' : 'black',
                                    }}
                                    onClick={async () => {
                                        await handleChangeDayStatus({ valueChecked: value });
                                    }}
                                >
                                    {label}
                                </Button>
                                ),
                            )}
                            </div>
                        </Form.Item>
                        </div>
                        :null}
                        <TimePicker
                            flex={0.5}
                            name='start_time'
                            label="Hora inicio"
                            use12Hours={true}
                            minuteStep={30}
                            format={format}
                            validations={[{
                                required: true,
                                message: `Hora Inicio es requerida`
                            }]}
                        />
                        <TimePicker
                            flex={0.5}
                            name='end_time'
                            label="Hora fin"
                            use12Hours={true}
                            minuteStep={30}
                            format={format}
                            validations={[{
                                required: true,
                                message: `Hora Fin es requerida`
                            }]}
                        />
                        {/* <Select
                            flex={1}
                            mode="multiple"
                            size='large'
                            label="Sucursales"
                            name='meta_tables_partners'
                            loading={loadingEstablishmentBranches}
                        >
                            {
                                _.map(establishmentBranches, ({ id, address }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {address}
                                    </Select.Option>
                                )
                            }
                        </Select> */}
                        <Select
                            flex={1}
                            name='targeting_scope'
                            label="Alcance"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Alcance es requerido`
                                }
                            ]}
                        >
                            {
                                _.map(SCOPE, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                                {selectedTargetingScope ==='specific' ?
                                    <div style={{width:'100%',gap:'4px'}}>
                                        <Row style={{ width: '100%',gap:'4px',marginBottom:'8px' }}>
                                    <Col flex="auto">
                                        <Select
                                            showSearch
                                            label="Establecimiento"
                                            placeholder="Añadir establecimiento"
                                            allowClear
                                            // disabled={!selectedGroup?.id}
                                            onSearch={debounceGetEstablishmentBranches}
                                            value={establishmentBranchSelected}
                                            onClear={() => setEstablishmentBranchSelected()}
                                            onSelect={(value) => {
                                                setEstablishmentBranchSelected(value);
                                            }}
                                            optionFilterProp="children"
                                            style={{ width: '100%' }}
                                            filterOption={(input, option) =>option.children.toLowerCase().includes(input.toLowerCase())
                                            } 
                                        >
                                            {
                                                _.map(establishmentBranchesOptions, ({ establishment_branch_id, establishment_id, full_name }, index) =>
                                                    <Select.Option key={index} value={JSON.stringify({ establishment_branch_id, establishment_id })}>
                                                        {full_name}
                                                    </Select.Option>
                                                )
                                            }
                                        </Select>
                                    </Col>
                                    <Col flex='none'>
                                        <AsyncButton
                                            type="primary"
                                            // disabled={!selectedGroup?.id}
                                            onClick={() => setEstablishmentBranchesCampaign({ establishmentBranchSelected, tables_partners_groups_id: selectedGroup?.id })}
                                        >
                                            Añadir
                                        </AsyncButton>
                                    </Col>
                                </Row>
                                    {/* <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} /> */}
                        
                        <Table
                            style={{width:'100%'}}
                            loading={loadingEstablishmentCampaigns}
                            dataSource={establishmentCampaigns?.data || []}
                            columns={[
                                {
                                    title: 'Establecimiento',
                                    dataIndex: 'full_name',
                                    key: 'full_name',
                                    render: (full_name) => full_name 
                                },
                                {
                                    title: 'Acciones',
                                    dataIndex: 'establishment_id',
                                    key: 'establishment_id',
                                    width: 100,
                                    render: (establishment_id                                    ) =>
                                        <AsyncButton
                                            type="link"
                                            onClick={() => removeEstablishmentBranchesCampaign({ id: establishment_id
                                            })}
                                            icon={<AiOutlineDelete />}
                                            confirmText="Desea eliminar?"
                                        >
                                        </AsyncButton>
                                },
                            ]}
                            pagination={{
                                current: currentPage,
                                showSizeChanger: false,
                                pageSize: 9,
                                onChange: (page) => {
                                    setCurrentPage(page);
                                },
                                total: establishmentCampaigns?.total || 0,
                                showTotal: total => {
                                    return `Total ${total} record${total > 1 ? "s" : ""}`;
                                },
                            }}
                        />
                                    </div>
                                :
                                    null

                                } 
                                
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default PopUpSystem;