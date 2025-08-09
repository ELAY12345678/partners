import React, { useState } from 'react';
import { Select, Col, Row, message } from 'antd';
import _ from 'lodash';
import debounce from "lodash/debounce";
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoStorefrontOutline } from 'react-icons/io5';
import { EstablishmentFilterWrapper } from './Styles';
import { getService } from '../../services';
import ResponsiveSelect from '../responsiveSelect';

const { Option } = Select;

const PERMISSIONS_TYPE = {
    establishments: "establishments",
    events: "events"
}

const RestaurantFiltersForAdmin = (props) => {

    const {
        user,
        showBranch,
        establishmentFilters,
        handleSetEstablishmentFilters,
    } = props;

    const establishmentsServices = getService('establishments');
    const establishmentsBranchsServices = getService('establishments-branchs');
    const [establishmentsOptions, setEstablishmentsOptions] = useState([]);
    const [establishmentBranchsOptions, setEstablishmentBranchsOptions] = useState([]);
    const [loadingBranchs, setLoadingBranchs] = useState(false);

    const getEstablishmentsDatas = (value) => {
        if (value === '') {
            setEstablishmentsOptions([])
            return;
        }
        establishmentsServices.find({
            query: {
                q: value,
                $client: {
                    skipJoins: true
                },
                $limit: 25,
                $select: ['id', 'name']
            }
        })
            .then(({ data }) => setEstablishmentsOptions(data))
            .catch((err) => message.error(err));
    };

    const getBranchsDatas = ({ establishment_id }) => {
        setLoadingBranchs(true);
        establishmentsBranchsServices.find({
            query: {
                establishment_id,
                $client: {
                    skipJoins: true
                },
                $limit: 10000,
            }
        })
            .then(({ data }) => {
                setEstablishmentBranchsOptions(data);
                setLoadingBranchs(false);
            })
            .catch((err) => {
                setLoadingBranchs(false);
                message.error(err)
            });

    };

    const debounceGetEstablishmentsDatas = debounce(getEstablishmentsDatas, 500, { maxWait: 800 });

    return (
        <Row>
            <Col>
                <Row align='middle'>
                    <Col>
                        <IoStorefrontOutline />
                    </Col>
                    <Col>
                        <EstablishmentFilterWrapper>
                            <Select
                                showSearch
                                bordered={false}
                                placeholder="Restaurante"
                                allowClear
                                onSearch={debounceGetEstablishmentsDatas}
                                onClear={() => handleSetEstablishmentFilters({})}
                                onSelect={(value) => {
                                    handleSetEstablishmentFilters({ establishment_id: value });
                                    getBranchsDatas({ establishment_id: value });
                                }}
                                optionFilterProp="children"
                                value={establishmentFilters.establishment_id}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {
                                    _.map(establishmentsOptions, ({ id, name }, index) =>
                                        <Option
                                            key={index}
                                            value={id}
                                            label={name}
                                        >
                                            {name}
                                        </Option>
                                    )
                                }
                            </Select>
                        </EstablishmentFilterWrapper>
                    </Col>
                </Row>
            </Col>
            {
                showBranch &&
                <Col>
                    <Row align='middle'>
                        <Col>
                            <HiOutlineLocationMarker />
                        </Col>
                        <Col>
                            <EstablishmentFilterWrapper>
                                <ResponsiveSelect
                                    placeholder="Dirección"
                                    loading={loadingBranchs}
                                    bordered={false}
                                    allowClear
                                    onSelect={(value) => {
                                        handleSetEstablishmentFilters({
                                            ...establishmentFilters,
                                            establishment_branch_id: value === 'default' ? undefined : parseInt(value),
                                        })
                                    }}
                                    onClear={() =>
                                        handleSetEstablishmentFilters({
                                            ...establishmentFilters,
                                            establishment_branch_id: undefined,
                                        })
                                    }
                                    value={establishmentFilters.establishment_branch_id}
                                    labelField="address"
                                    choices={establishmentBranchsOptions}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                />
                            </EstablishmentFilterWrapper>
                        </Col>
                    </Row>
                </Col>
            }
        </Row>
    );
}

export default RestaurantFiltersForAdmin;