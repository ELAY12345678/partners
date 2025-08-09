import { Col, Divider, message, Row, Select, Table } from 'antd';
import _, { debounce } from 'lodash';
import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { MyModal } from '../../components/com';
import { getService } from '../../services';
import { useEstablishmentCampaigns } from './hooks/useEstablishmentCampaigns';

const CampaignAppartaPayEstablishments = ({
    modalVisible,
    onCancel,
    selectedCampaign
}) => {

    const establishmentBranchesService = getService('establishments-branchs');
    const establishmentBranchesCampaignsService = getService('pay-campaigns-establishments-branchs');


    const [establishmentBranchesOptions, setEstablishmentBranchesOptions] = useState([]);
    const [establishmentBranchSelected, setEstablishmentBranchSelected] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    const [establishmentCampaigns, getEstablishmentCampaigns, loadingEstablishmentCampaigns]
        = useEstablishmentCampaigns({
            source: "pay-campaigns-establishments-branchs",
            campaign_id: selectedCampaign?.id,
            page: currentPage,
            filters: {
                pay_campaign_id: selectedCampaign?.id,
            }
        });


    const setEstablishmentBranchesCampaign = ({ establishmentBranchSelected, pay_campaign_id }) => {
        establishmentBranchesCampaignsService.create({
            ...JSON.parse(establishmentBranchSelected),
            pay_campaign_id,
            status: 'active'
        }).then(() => {
            message.success('Establecimiento añadido correctamente!');
            setEstablishmentBranchSelected();
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
                setEstablishmentBranchesOptions(_.sortBy(data, [({ full_name }) => full_name]));
            })
            .catch((err) => message.error(err));
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
                        onClick={() => setEstablishmentBranchesCampaign({ establishmentBranchSelected, pay_campaign_id: selectedCampaign.id })}
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
                        title: 'Establecimiento Id',
                        dataIndex: 'establishment_id',
                        key: 'establishment_id'
                    },
                    {
                        title: 'Sucursal Id',
                        dataIndex: 'establishment_branch_id',
                        key: 'establishment_branch_id'
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

export default CampaignAppartaPayEstablishments;