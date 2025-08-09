import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Col, Layout, Row } from 'antd';
import SideBar from './SideBar';
import EstablishmentsReports from './EstablishmentsReports';
import ReservationsDetails from './reservationDetails/ReservationsDetail';

import { setCurrentReservationDetails, updateCurrentReservationDetails, changeUserFilter } from './redux/actions';
import { useMedia } from 'react-use';


const Dashboard = (props) => {

    const {
        handleSetCurrentReservationDetails,
        handleUpdateCurrentReservationDetails,
        handleChangeUserFilter
    } = props;

    const listReservationsModeMobile = useMedia("(max-width: 768px)");


    return (
        <Layout.Content
            style={{
                height: '100%',
                overflow: listReservationsModeMobile ? 'auto' : 'hidden',
            }}
        >
            <Row
                style={{
                    position: listReservationsModeMobile ? 'initial' : 'sticky',
                    top: '0px',
                    height: listReservationsModeMobile ? 'auto' : '100%',
                }}
            >
                <Col
                    id='prueba'
                    xs={24} sm={24} md={12} lg={9} xl={7}
                    style={{
                        height: 'auto',
                        background: '#fff',
                        border: "1px solid #d9d9d9",
                        position: listReservationsModeMobile ? 'initial' : 'sticky',
                        top: '0px'
                    }} >
                    <SideBar
                        setReservationDetails={handleSetCurrentReservationDetails}
                        handleChangeUserFilter={handleChangeUserFilter}
                    />
                </Col>
                <Col
                    xs={24} sm={24} md={12} lg={15} xl={17}
                    style={{
                        overflow: listReservationsModeMobile ? 'initial' : 'auto',
                        height: 'auto',
                    }}
                >
                    <EstablishmentsReports />
                    <ReservationsDetails
                        setReservationDetails={handleSetCurrentReservationDetails}
                        handleUpdateCurrentReservationDetails={handleUpdateCurrentReservationDetails}
                    />
                </Col>
            </Row>

        </Layout.Content>
    );
}


/* Inject reducers */

const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = dispatch => {
    return {
        handleSetCurrentReservationDetails: (payload) => dispatch(setCurrentReservationDetails(payload)),
        handleUpdateCurrentReservationDetails: (payload) => dispatch(updateCurrentReservationDetails(payload)),
        handleChangeUserFilter: (payload) => dispatch(changeUserFilter(payload)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
