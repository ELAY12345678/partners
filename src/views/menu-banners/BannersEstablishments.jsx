import { Col, Divider, InputNumber, message, Row, Select, Table } from 'antd';
import _, { debounce } from 'lodash';
import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { MyModal } from '../../components/com';
import { getService } from '../../services';
import { useEstablishmentBanners } from './hooks/useEstablishmentBanners';

const CampaignEstablishments = ({
    modalVisible,
    onCancel,
    selectedBannerProgramming
}) => {

    const establishmentService = getService('establishments');
    const establishmentBranchesBannersService = getService('menu-banner-establishments');


    const [establishmentBranchesOptions, setEstablishmentBranchesOptions] = useState([]);
    const [establishmentBranchSelected, setEstablishmentBranchSelected] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    const [establishmentCampaigns, getEstablishmentCampaigns, loadingEstablishmentCampaigns] = useEstablishmentBanners({ menu_banner_id: selectedBannerProgramming?.id, page: currentPage })


    const setEstablishmentBranchesCampaign = ({ establishment_id, menu_banner_id }) => {
        establishmentBranchesBannersService.create({
            menu_banner_id,
            establishment_id,
            status: 'active',
        }).then(() => {
            message.success('Establecimiento añadido correctamente!');
            setEstablishmentBranchSelected();
            getEstablishmentCampaigns();
        }).catch((error) => {
            message.error(error?.message);
        })
    };

    const removeEstablishmentBranchesCampaign = ({ id }) => {
        establishmentBranchesBannersService.remove(id).then(() => {
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
        establishmentService.find({
            query: {
                q: value,
                $select: ['id', 'name'],
                $client: {
                    skipJoins: true
                },
                $limit: 15,
            }
        })
            .then(({ data }) => {
                setEstablishmentBranchesOptions(_.sortBy(data, [({ name }) => name]));
            })
            .catch((err) => message.error(err));
    };

    const debounceGetEstablishmentBranches = debounce(getEstablishmentBranches, 500, { maxWait: 800 });

    return (
        <MyModal
            title={`Establecimientos - ${selectedBannerProgramming?.name}`}
            onCancel={onCancel}
            visible={modalVisible}
        >
            <Row gutter={8}>
                <Col flex="auto">

                    {/* <InputNumber
                        placeholder="Id Establecimiento"
                        style={{ width: '100%' }}
                        value={establishmentBranchSelected}
                        onChange={(value) => {
                            setEstablishmentBranchSelected(value);
                        }}
                    /> */}
                    <Select
                        showSearch
                        placeholder="Añadir Establecimiento"
                        allowClear
                        onSearch={debounceGetEstablishmentBranches}
                        value={establishmentBranchSelected}
                        onClear={() => setEstablishmentBranchSelected()}
                        onSelect={(value) => {
                            setEstablishmentBranchSelected(value);
                        }}
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}

                    >
                        {
                            _.map(establishmentBranchesOptions, ({ id, name }, index) =>
                                <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Col>
                <Col flex='none'>
                    <AsyncButton
                        type="primary"
                        onClick={() => setEstablishmentBranchesCampaign({ establishment_id: establishmentBranchSelected, menu_banner_id: selectedBannerProgramming.id })}
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
                        title: 'Id Establecimiento',
                        dataIndex: 'establishment_id',
                        key: 'establishment_id',
                        // render: (meta_establishment_name, { meta_establishment_branch_address }) => meta_establishment_name + ' - ' + meta_establishment_branch_address
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