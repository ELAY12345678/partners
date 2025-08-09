import { Col, Divider, message, Row, Select, Space, Table } from 'antd';
import _, { debounce } from 'lodash';
import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import AsyncSelect from '../../components/asyncSelect';
import { MyModal } from '../../components/com';
import { getService } from '../../services';
import { useEstablishmentCampaigns } from './hooks/useEstablishmentCampaigns';

const SHOW_SCREEN = [
    {
        id: 'establishment_profile',
        name: 'Perfil restaurante',
    },
    {
        id: 'checkout',
        name: 'Checkout',
    },
    {
        id: 'home',
        name: 'Home',
    },
];

const CampaignMenuItems = ({
    modalVisible,
    onCancel,
    selectedCampaign
}) => {

    const establishmentService = getService('establishments');
    const menuItemsCampaignsService = getService('menu-items-campaigns');
    const establishmnetmenuItemsService = getService('establishment-menu-items');


    const [establishmentOptions, setEstablishmentOptions] = useState([]);
    const [menuItemsOptions , setMenuItemsOptions] = useState([]);

    const [establishmentBranchSelected, setEstablishmentBranchSelected] = useState();
    const [menuItemSelected, setMenuItemSelected] = useState();
    const [showScreenSelected, setShowScreenSelected] = useState();

    const [currentPage, setCurrentPage] = useState(1);

    const [establishmentCampaigns, getEstablishmentCampaigns, loadingEstablishmentCampaigns] =
        useEstablishmentCampaigns({
            campaign_id: selectedCampaign?.id,
            page: currentPage,
            source: 'menu-items-campaigns',
            filters: {
                meta_campaign_id: selectedCampaign?.id,
                $select: ['meta_establishment_name', 'meta_campaign_name', 'show_screen','meta_menu_item_name'],
                // $sort: {
                //     meta_establishment_name: 1
                // },
            }
        });


    const setMenuItemCampaign = ({ meta_menu_item_id, campaign_id, show_screen }) => {
        menuItemsCampaignsService.create({
            meta_campaign_id: campaign_id,
            meta_menu_item_id: meta_menu_item_id,
            show_screen
        }).then(() => {
            message.success('Establecimiento añadido correctamente!');
            setEstablishmentBranchSelected();
            setShowScreenSelected();
            setMenuItemSelected();
            getEstablishmentCampaigns();
        }).catch((error) => {
            message.error(error?.message);
        })
    };

    const removeEstablishmentBranchesCampaign = ({ id }) => {
        menuItemsCampaignsService.remove(id).then(() => {
            message.success('Plato eliminado correctamente!');
            setEstablishmentBranchSelected();
            setMenuItemSelected();
            getEstablishmentCampaigns();
        }).catch((error) => {
            message.error(error?.message);
        })
    };

    const getEstablishments = async (value) => {
        if (value === '') {
            setEstablishmentOptions([])
            return;
        }
        await establishmentService.find({
            query: {
                q: value,
                $client: {
                    skipJoins: true
                },
                $limit: 25,
                $select: ['id', 'name']
            }
        })
            .then(({ data }) => {
                if (!_.isEmpty(data))
                    setEstablishmentOptions(data);
            })
            .catch((err) => message.error(err));
    };

    const getEstablishmentMenuItems = async (value) => {
        if (value === '' && establishmentBranchSelected) {
            setMenuItemsOptions([])
            return;
        }
        await establishmnetmenuItemsService.find({
            query: {
                q: value,
                $client: {
                    filterByQ: true
                },
                establishment_id: establishmentBranchSelected,
                $limit: 50,
            }
        })
            .then(( data ) => {
                if (!_.isEmpty(data))
                setMenuItemsOptions(data);
            })
            .catch((err) => message.error(err));
    };

    const handleChangeShowScreem = async ({ id, show_screen }) => {
        await menuItemsCampaignsService.patch(id, {
            show_screen
        })
            .then(() => {
                message.success('Cambios guardados exitosamente!');
                getEstablishmentCampaigns();
            })
            .catch((err) => message.error('Error al actualizar! ' + err?.message))
    };

    const debounceGetEstablishmentBranches = debounce(getEstablishments, 800, { maxWait: 900 });

    const debounceGetEstablishmentMenuItems = debounce(getEstablishmentMenuItems, 800, { maxWait: 900 });

    return (
        <MyModal
            title={`Platillos en la campaña ${selectedCampaign?.name}`}
            onCancel={onCancel}
            visible={modalVisible}
        >
            <Row gutter={8}>
                <Col flex="auto">
                    <Space direction='vertical' style={{ width: '100%' }}>
                        <Select
                            showSearch
                            placeholder="Buscar establecimiento"
                            allowClear
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
                                _.map(establishmentOptions, ({ id, name }, index) =>
                                    <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Select
                            disabled={!establishmentBranchSelected}
                            showSearch
                            placeholder="Añadir plato"
                            allowClear
                            onSearch={debounceGetEstablishmentMenuItems}
                            value={menuItemSelected}
                            onClear={() => setMenuItemSelected()}
                            onSelect={(value) => {
                                setMenuItemSelected(value);
                            }}
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                _.map(menuItemsOptions, ({ id, name }, index) =>
                                    <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Space>
                </Col>
                <Col flex='none'>
                    <AsyncButton
                        type="primary"
                        onClick={() => {
                            setMenuItemCampaign({
                                meta_menu_item_id: menuItemSelected,
                                campaign_id: selectedCampaign.id,
                                show_screen: showScreenSelected
                            })
                        }
                        }
                    >
                        Añadir
                    </AsyncButton>
                </Col>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />

            <Table
                loading={loadingEstablishmentCampaigns}
                dataSource={establishmentCampaigns?.data || []}
                columns={[
                    {
                        title: 'Establecimiento - Plato',
                        dataIndex: 'meta_establishment_name',
                        key: 'meta_establishment_name',
                        render: (meta_establishment_name, {meta_menu_item_name }) => meta_establishment_name + ' - ' + meta_menu_item_name
                    },
                    {
                        title: 'Show Screen',
                        dataIndex: 'show_screen',
                        key: 'Ubicación pantalla',
                        render: (value, record) =>
                            <AsyncSelect
                                options={SHOW_SCREEN}
                                record={record}
                                value={_.find(SHOW_SCREEN, ({ id }) => id === value)?.name || 'Ninguna'}
                                onChange={async (value) => await handleChangeShowScreem({ id: record.id, show_screen: value })}
                            />
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
        </MyModal>
    );
}

export default CampaignMenuItems;