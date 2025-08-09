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

const CampaignEstablishments = ({
    modalVisible,
    onCancel,
    selectedCampaign
}) => {

    const establishmentBranchesService = getService('establishments-branchs');
    const establishmentBranchesCampaignsService = getService('establishments-branchs-campaigns');


    const [establishmentBranchesOptions, setEstablishmentBranchesOptions] = useState([]);
    const [establishmentBranchSelected, setEstablishmentBranchSelected] = useState();
    const [showScreenSelected, setShowScreenSelected] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    const [establishmentCampaigns, getEstablishmentCampaigns, loadingEstablishmentCampaigns] =
        useEstablishmentCampaigns({
            campaign_id: selectedCampaign?.id,
            page: currentPage,
            source: "establishments-branchs-campaigns",
            filters: {
                meta_campaign_id: selectedCampaign?.id,
                $select: ['meta_establishment_name', 'meta_establishment_branch_address', 'show_screen'],
                $sort: {
                    meta_establishment_name: 1
                },
            }
        });


    const setEstablishmentBranchesCampaign = ({ establishment_branch_id, campaign_id, show_screen }) => {
        establishmentBranchesCampaignsService.create({
            meta_campaign_id: campaign_id,
            meta_establishment_branch_id: establishment_branch_id,
            show_screen
        }).then(() => {
            message.success('Establecimiento añadido correctamente!');
            setEstablishmentBranchSelected();
            setShowScreenSelected();
            getEstablishmentCampaigns();
        }).catch((error) => {
            message.error(error?.message);
        })
    };

    const removeEstablishmentBranchesCampaign = ({ id }) => {
        establishmentBranchesCampaignsService.remove(id).then(() => {
            message.success('Establecimiento eliminado correctamente!');
            setEstablishmentBranchSelected();
            getEstablishmentCampaigns();
        }).catch((error) => {
            message.error(error?.message);
        })
    };

    const getEstablishmentBranches = (value) => {
        if (value === '') {
            setEstablishmentBranchesOptions([])
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
                if (!_.isEmpty(data))
                    setEstablishmentBranchesOptions(_.sortBy(data, [({ full_name }) => full_name]));
            })
            .catch((err) => message.error(err));
    };

    const handleChangeShowScreem = async ({ id, show_screen }) => {
        await establishmentBranchesCampaignsService.patch(id, {
            show_screen
        })
            .then(() => {
                message.success('Cambios guardados exitosamente!');
                getEstablishmentCampaigns();
            })
            .catch((err) => message.error('Error al actualizar! ' + err?.message))
    };

    const debounceGetEstablishmentBranches = debounce(getEstablishmentBranches, 500, { maxWait: 800 });

    return (
        <MyModal
            title={`Establecimientos en la campaña ${selectedCampaign?.name}`}
            onCancel={onCancel}
            visible={modalVisible}
        >
            <Row gutter={8}>
                <Col flex="auto">
                    <Space direction='vertical' style={{ width: '100%' }}>
                        <Select
                            showSearch
                            placeholder="Añadir sucursal"
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
                                _.map(establishmentBranchesOptions, ({ establishment_branch_id, full_name }, index) =>
                                    <Select.Option key={index} value={establishment_branch_id}>
                                        {full_name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Select
                            showSearch
                            placeholder="Ubicación"
                            allowClear
                            value={showScreenSelected}
                            onClear={() => setShowScreenSelected()}
                            onSelect={(value) => {
                                setShowScreenSelected(value);
                            }}
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                _.map(SHOW_SCREEN, ({ id, name }, index) =>
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
                            setEstablishmentBranchesCampaign({
                                establishment_branch_id: establishmentBranchSelected,
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
                        title: 'Establecimiento',
                        dataIndex: 'meta_establishment_name',
                        key: 'meta_establishment_name',
                        render: (meta_establishment_name, { meta_establishment_branch_address }) => meta_establishment_name + ' - ' + meta_establishment_branch_address
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
                                onChange={async(value)=> await handleChangeShowScreem({ id: record.id, show_screen: value })}
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

export default CampaignEstablishments;