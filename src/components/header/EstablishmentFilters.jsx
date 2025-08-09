import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import _ from 'lodash';

import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoStorefrontOutline } from 'react-icons/io5';
import { EstablishmentFilterWrapper } from './Styles';
import ResponsiveSelect from '../responsiveSelect';

const PERMISSIONS_TYPE = {
    establishments: "establishments",
    events: "events"
}

const RestaurantFilters = (props) => {

    const {
        user,
        showBranch,
        establishmentFilters,
        handleSetEstablishmentFilters,
    } = props;

    const { permissionsv2 = [] } = user;

    const [branches, setBranches] = useState([]);
    const [establishments] = useState([
        {
            establishment_id: 'default',
            name: 'Restaurante',
        },
        ..._.filter(
            permissionsv2,
            (item) => item.type === PERMISSIONS_TYPE.establishments
        )
    ]);


    useEffect(() => {
        if (establishmentFilters?.establishment_id) {

            const findBranches = _.find(
                permissionsv2, (item) =>
                item.establishment_id
                && item.establishment_id
                === parseInt(establishmentFilters?.establishment_id)
            )?.establishments_branchs || [];

            setBranches([
                {
                    id: 'default',
                    address: 'Dirección',
                },
                ...findBranches
            ]);

        }
        else
            setBranches([{
                id: 'default',
                address: 'Dirección',
            },
            ]);

    }, [establishmentFilters.establishment_id, permissionsv2])

    return (
        <Row>
            <Col>
                <Row align='middle'>
                    <Col>
                        <IoStorefrontOutline />
                    </Col>
                    <Col>
                        <EstablishmentFilterWrapper>
                            <ResponsiveSelect
                                defaultValue="default"
                                bordered={false}
                                onSelect={(value) =>
                                    handleSetEstablishmentFilters(
                                        value === "default"
                                            ? {}
                                            : { establishment_id: value }
                                    )}
                                value={establishmentFilters.establishment_id || "default"}
                                choices={establishments}
                                valueField='establishment_id'
                            />
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
                                    defaultValue="default"
                                    bordered={false}
                                    onSelect={(value) => {
                                        handleSetEstablishmentFilters({
                                            ...establishmentFilters,
                                            establishment_branch_id: value === "default" ? undefined : value,
                                        })
                                    }}
                                    value={establishmentFilters.establishment_branch_id || "default"}
                                    choices={branches}
                                    labelField="address"
                                />
                            </EstablishmentFilterWrapper>
                        </Col>
                    </Row>
                </Col >
            }
        </Row >
    );
}

export default RestaurantFilters;