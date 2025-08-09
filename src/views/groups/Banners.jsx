import { Button, Col, Drawer, Input, message, Row, Select, Table, Tag } from 'antd';
import _, { debounce } from 'lodash';
import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { Grid } from "../../components/com";
import { SimpleForm } from '../../components/com/form/SimpleForm';
import { RoundedButton } from '../../components/com/grid/Styles';
import { getService } from '../../services';
import { useEstablishmentCampaigns } from "./hooks/useEstablishmentCampaigns";


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

const columns = ({ onRemove, onEdit }) => [
    {
        title: "Id",
        dataIndex: "id",
        sorter: true,
        width: 100,
    },
    {
        title: "Nombre",
        dataIndex: "name",
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
            _.map(record?.tables_partners, ({ establishment_branch_address, establishment_name }, key) => (
              <div>
                {establishment_name + ' - ' +establishment_branch_address} 
                {key + 1 === record?.tables_partners.length ? '' : ' , '}
              </div>
            )),
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

const Group = ({ establishment_id }) => {
    const tablesPartnersGroupService = getService('tables-partners-groups');
    const tablesPartnersService = getService('tables-partners');
    const establishmentBranchesService = getService('establishments-branchs');
    // const [establishmentBranches, loadingEstablishmentBranches] = useEstablishmentBranches({ establishment_id: 1 });
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState();
    const [updateSource, setUpdateSource] = useState(false);
    const [establishmentBranchSelected, setEstablishmentBranchSelected] = useState();
    const [establishmentBranchesOptions, setEstablishmentBranchesOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
       const getEstablishmentBranches = (value) => {
            if (value === '') {
                setEstablishmentBranchesOptions([])
                setCurrentPage(1)
                return;
            }
            establishmentBranchesService.find({
                query: {
                    q: value,
                    $client: {
                        fullName: true
                    },
                }
            })
                .then((data) => {
                    setEstablishmentBranchesOptions(_.sortBy(data, [({ full_name }) => full_name]));
                })
                .catch((err) => message.error(err));
        };
    
  const debounceGetEstablishmentBranches = debounce(getEstablishmentBranches, 500, { maxWait: 800 });
    const onRemove = async ({ id }) => {
        await tablesPartnersGroupService.remove(id)
            .then(() => {
                message.success("Sucursal eliminada!");
                setUpdateSource(!updateSource);
                getEstablishmentCampaigns()
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

    const [establishmentCampaigns, getEstablishmentCampaigns, loadingEstablishmentCampaigns]
        = useEstablishmentCampaigns({
            source: "tables-partners",
            tables_partners_groups_id: selectedGroup?.id || null,//selectedCampaign?.id
            page: currentPage,
            filters: {
                tables_partners_groups_id: selectedGroup?.id,//selectedCampaign?.id
            }
        });

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);
        if (selectedGroup && selectedGroup.id) {
            const dataFormat = {
                ...data,
                pay_account: undefined,
                // meta_tables_partners: establishmentBranches.filter((item)=> data?.meta_tables_partners.includes(item?.id))
            }
            await tablesPartnersGroupService.patch(selectedGroup.id, dataFormat)
                .then(() => {
                    message.success("Grupo actualizado!");
                    setDrawerVisible(false);
                    setSelectedGroup();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            try {
                const dataTablesPartnersGroup = {
                    name: data?.name,
                    status:  data?.status
                }
                await tablesPartnersGroupService.create(dataTablesPartnersGroup)
                    .then(async(response) => {
                        console.log('reponse tablespartners group',response?.id)
                            message.success("Grupo Creado!");
                            setUpdateSource(!updateSource);
                            setDrawerVisible(false);
                        // const dataFormat = establishmentBranches.filter((item)=> data?.meta_tables_partners.includes(item?.id))
                        //     .map(({ pay_account,id , ...rest }) => ({
                        //         // ...rest,
                        //         establishment_branch_id: id,
                        //         establishment_id: pay_account?.establishment_id,
                        //         tables_partners_groups_id: response?.id,
                        //         // establishment_id: meta_tables_partners.map(p => p.pay_account?.establishment_id)
                        //     }))
                        //     console.log('dataFormatdataFormat====>>>>>',dataFormat)
                        //     await Promise.all(
                        //         _.map(dataFormat, (item) => crateDiscounts(item)),
                        //     );




                        // await tablesPartnersService.create(dataFormat)
                        // .then(() => {
                        //     message.success("Grupo Creado!");
                        //     setDrawerVisible(false);
                        //     setUpdateSource(!updateSource);
                        // })
                    })
                    .catch(err => message.error(err.message));
            } catch (e){
                console.log('datadatadata e',e)
            }
        }
    };

      const setEstablishmentBranchesCampaign = async ({ establishmentBranchSelected, tables_partners_groups_id }) => {
        console.log('establishmentBranchSelectedestablishmentBranchSelected',establishmentBranchSelected)
        const data= {...(JSON.parse(establishmentBranchSelected)),tables_partners_groups_id}
            await tablesPartnersService.create(data).then(() => {
                    message.success('Establecimiento añadido correctamente!');
                    setEstablishmentBranchSelected();
                    setUpdateSource(!updateSource);
                    getEstablishmentCampaigns();
                    
                }).catch((error) => {
                    message.error(error?.message);
                })
       };
   
   const removeEstablishmentBranchesCampaign = ({ id }) => {
        tablesPartnersService.remove(id).then(() => {
            message.success('Establecimiento eliminado correctamente!');
            setEstablishmentBranchSelected();
            setUpdateSource(!updateSource);
            getEstablishmentCampaigns();
        }).catch((error) => {
            message.error(error?.message);
        })
    };
    return (
        <>
            <Grid
                custom={true}
                source="tables-partners-groups"
                filterDefaultValues={{
                    // status: "active",
                    // $limit: 100000,
                    $client:{
                        showTablesPartners: true
                    },
                    $select: ["id", "name","status"]
                }}
                searchField="name"
                searchText="Grupo..."
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
                                getEstablishmentCampaigns();
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
                    title={`${selectedGroup ? 'Editar' : 'Crear'} Grupo`}
                    placement="right"
                    width={520}
                    visible={drawerVisible}
                    onClose={() => {
                        setSelectedGroup();
                        setCurrentPage(1)
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
                        <Select
                            flex={1}
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
                                <Row style={{ width: '100%',gap:'4px' }}>
                                        <Col flex="auto">
                                            <Select
                                                showSearch
                                                label="Sucursal"
                                                placeholder="Añadir sucursal"
                                                allowClear
                                                disabled={!selectedGroup?.id}
                                                onSearch={debounceGetEstablishmentBranches}
                                                value={establishmentBranchSelected}
                                                onClear={() => setEstablishmentBranchSelected()}
                                                onSelect={(value) => {
                                                    setEstablishmentBranchSelected(value);
                                                }}
                                                optionFilterProp="children"
                                                style={{ width: '100%' }}
                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
                                                disabled={!selectedGroup?.id}
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
                                    dataIndex: 'establishment_name',
                                    key: 'establishment_name',
                                    render: (establishment_name, { establishments_branchs_address }) => establishment_name + ' - ' + establishments_branchs_address
                                },
                                {
                                    title: 'Acciones',
                                    dataIndex: 'id',
                                    key: 'id',
                                    width: 100,
                                    render: (id) =>
                                        <AsyncButton
                                            type="link"
                                            onClick={() => removeEstablishmentBranchesCampaign({ id })}
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
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default Group;