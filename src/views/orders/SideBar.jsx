import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { Row, Col, Menu, Input, Layout } from 'antd';

import { MdOutlineNotificationsActive } from 'react-icons/md';
import { IoWalletOutline } from 'react-icons/io5';
import { BiSearch } from 'react-icons/bi';

import Reservations from './Reservations';
import Appartapay from './Appartapay';
import { useMedia } from 'react-use';

const SideBar = (props) => {

    const {
        setReservationDetails,
        handleChangeUserFilter,
    } = props;

    const [visibleContent, setVisibleContent] = useState("reservations");
    const [sideContentHeight, setSideContentHeight] = useState(0);
    const dropEstablishmentFilters = useMedia("(max-width: 718px)");
    const listReservationsModeMobile = useMedia("(max-width: 768px)");

    const debounceHandleChangeUserFilter = useMemo(() => debounce(handleChangeUserFilter, 1000), []);

    const userFilter = useSelector(({ dashboardReducer }) => dashboardReducer.userFilter);

    useEffect(() => {
        const updateWidth = () => {
            const height = window.innerHeight;
            setSideContentHeight(height);
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => {
            window.removeEventListener("resize", updateWidth)
        }
    }, []);

    const SideMenu = ({ style }) => {

        return (
            <Menu
                mode="horizontal"
                selectedKeys={[visibleContent]}
                onSelect={(e) => setVisibleContent(e.key)}
                style={style}
                items={[
                    {
                        key: 'reservations',
                        label: 'Reservas',
                        icon: <MdOutlineNotificationsActive size={25} />
                    },
                    {
                        key: 'appartapay',
                        label: 'AppartaPay',
                        icon: <IoWalletOutline size={25} />
                    }
                ]}
            />
        )
    }

    const SideContent = ({ styles }) => {

        const [heightEstablishmentFilter, setHeightEstablishmentFilter] = useState(0);

        useEffect(() => {
            setHeightEstablishmentFilter(dropEstablishmentFilters ? 45 : 0);
        }, [dropEstablishmentFilters])

        if (visibleContent === 'reservations') {
            return (
                <Layout.Content style={{
                    height: listReservationsModeMobile ? 'auto' : `${sideContentHeight - 54 - 63 - 52 - heightEstablishmentFilter}px`,
                }}>
                    <Reservations
                        setReservationDetails={setReservationDetails}
                        listReservationsModeMobile={listReservationsModeMobile}
                    />
                </Layout.Content >
            )
        } else {
            return <Appartapay style={{ height: listReservationsModeMobile ? 'auto' : `${sideContentHeight - 54 - 63 - 55 - heightEstablishmentFilter}px` }} />
        }
    }

    return (
        <Layout.Content
            style={{
                height: 'auto',
            }}
        >
            <Row
                justify='center'
                style={{
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <Col>
                    <SideMenu
                        style={{ height: '50px', border: 0 }}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Row
                        style={{ height: '63px', padding: '0.7rem 1rem' }}
                    >
                        <Input
                            allowClear
                            placeholder="Búsqueda por cliente"
                            style={{
                                borderRadius: '0.5rem'
                            }}
                            suffix={<BiSearch />}
                            defaultValue={userFilter}
                            onChange={(e) => {
                                if(e.target.value?.length > 3 || e.target.value?.length  === 0)
                                debounceHandleChangeUserFilter(e.target.value);
                            }}
                        />
                    </Row>
                </Col>
            </Row>
            <SideContent />

        </Layout.Content>
    );
}

export default SideBar;