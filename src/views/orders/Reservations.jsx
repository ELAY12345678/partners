import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from "moment";
import { ConfigProvider, Empty, List, message, Collapse } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setReservationsDatas, changeRefresh } from './redux/actions'

import {
    ReflexContainer,
    ReflexSplitter,
} from 'react-reflex'
import 'react-reflex/styles.css'


import { MdOutlineNotificationsActive } from 'react-icons/md';

import Schedule, { ScheduleItem } from './Schedule';
import { Badge } from './Styles';

import { getService } from '../../services';
import ControlledElement from '../../components/resizablePanel/ResizablePanels';

const { Panel } = Collapse;

const CURRENT_DATE = moment().add(1, 'days').format('YYYY-MM-DD');
const INITIAL_DATE_INVOICE_PENDING = moment().subtract(3, 'days').format('YYYY-MM-DD');

const STATUS_RESERVATION = {
    claimed: "claimed",  // Reclamado
    acquired: "acquired", // Adquirida
    pendingApproval: 'pendingApproval', // Pendiente de aprobación
};

const RESERVATIONS_TYPES = {
    today: {
        key: 'today',
        title: "Reservas de hoy",
        color: "#AC83FF"
    },
    tomorrow: {
        key: "tomorrow",
        title: "Reservas para mañana",
        color: "#F4CD4D"
    },
    invoice_pending: {
        key: "invoice_pending",
        title: "Pendiente valor de factura",
        color: "#FFB091",
    },
    reservation_by_filter: {
        key: "reservation_by_filter",
        title: "Reservas por usuario",
        color: "#6B24F8",
    }
};

const Reservations = (props) => {

    const {
        setReservationDetails,
        listReservationsModeMobile,
    } = props;

    const userFilter = useSelector(({ dashboardReducer }) => dashboardReducer.userFilter);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    const user = useSelector(({ appReducer }) => appReducer?.user);


    const ListReservations = React.forwardRef((props, ref) => {
        const {
            filterDefaultValues,
            status,
            setReservationDetails,
            userFilter,
            key,
            ...rest
        } = props;

        const dispatch = useDispatch();

        const reservationsData = useSelector(({ dashboardReducer }) => dashboardReducer.reservationsDatas[status.key] || []);
        let groupData = {}
        if (status.key !== RESERVATIONS_TYPES.invoice_pending.key && status.key !== RESERVATIONS_TYPES.reservation_by_filter.key)
            groupData = _.groupBy(reservationsData, 'meta_start_hour')

        const refresh = useSelector(({ dashboardReducer }) => dashboardReducer.refresh);
        const [reservationsCount, setReservationsCount] = useState(reservationsData.length || 0);
        const [loading, setLoading] = useState(false);

        const getReservationsData = () => {
            if ((user?.role === 'admin' || user?.permissionsv2?.length > 5) && _.isEmpty(establishmentFilters)) {
                dispatch(changeRefresh(false));
                setReservationsCount(0)
                dispatch(
                    setReservationsDatas({
                        key: status.key,
                        data: [],
                    })
                );
                return;
            }
            setLoading(true);
            const reservationService = getService('reservations');
            reservationService
                .find({
                    query: {
                        establishment_id: {
                            $in: user?.permissionsv2?.map(({ establishment_id }) => establishment_id),
                        },
                        q: userFilter,
                        $limit: 100000,
                        $sort: {
                            meta_start_hour: 1,
                        },
                        $client: {
                            skipJoins: true,
                            withEstablishmentReservationCount:true,
                        },
                        ...establishmentFilters,
                        ...filterDefaultValues,
                    }
                })
                .then(({ data }) => {
                    setReservationsCount(data.length)
                    dispatch(
                        setReservationsDatas({
                            key: status.key,
                            data: data,
                        })
                    );
                    dispatch(changeRefresh(false));
                    setLoading(false);
                })
                .catch(err => {
                    message.error(err.message);
                    dispatch(changeRefresh(false));
                    setLoading(false);
                });
        };

        useEffect(() => {
            if (refresh || userFilter) {
                getReservationsData();
            }
        }, [refresh, userFilter]);

        const ScheduleList = () => {
            return (
                <>
                    {
                        status.key === RESERVATIONS_TYPES.invoice_pending.key || status.key === RESERVATIONS_TYPES.reservation_by_filter.key
                            ? (
                                <List
                                    dataSource={reservationsData}
                                    loading={loading}
                                    renderItem={item =>
                                        <ScheduleItem
                                            item={item}
                                            status={status}
                                            setReservationDetails={setReservationDetails}
                                        />
                                    }
                                />
                            ) : (
                                <List
                                    dataSource={Object.keys(groupData)}
                                    loading={loading}
                                    renderItem={meta_start_hour =>
                                        <Schedule
                                            meta_start_hour={meta_start_hour}
                                            reservationsData={groupData[meta_start_hour]}
                                            status={status}
                                            setReservationDetails={setReservationDetails}
                                        />
                                    }
                                />
                            )
                    }
                </>
            )
        }


        if (listReservationsModeMobile) {
            return (
                <Collapse
                    accordion
                    expandIconPosition='right'
                    defaultActiveKey={['1']}
                    className="site-collapse-custom-collapse"
                >
                    <Panel
                        className="site-collapse-custom-panel"
                        header={status.title}
                        key={key}
                        extra={
                            <Badge>
                                <MdOutlineNotificationsActive size={20} />
                                {" "}
                                {reservationsCount}
                            </Badge>
                        }
                    >
                        <ScheduleList />
                    </Panel>
                </Collapse>
            );
        }
        else
            return (
                <ControlledElement
                    innerRef={ref}
                    title={status.title}
                    counter={
                        <Badge>
                            <MdOutlineNotificationsActive size={20} />
                            {" "}
                            {reservationsCount}
                        </Badge>
                    }
                    {...rest}
                >
                    <ScheduleList />
                </ControlledElement>
            );
    });

    if (userFilter)
        return (
            <ReflexContainer orientation="horizontal">
                <ListReservations
                    minSize={50}
                    setReservationDetails={setReservationDetails}
                    status={RESERVATIONS_TYPES.reservation_by_filter}
                    userFilter={userFilter}
                    filterDefaultValues={{
                        status: { $in: [STATUS_RESERVATION.acquired, STATUS_RESERVATION.claimed, STATUS_RESERVATION.pendingApproval] },
                        expire_day: { $gte: moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss") },
                        $sort: {
                            expire_day: -1,
                        }
                    }}
                />
            </ReflexContainer >
        )
    else
        if (listReservationsModeMobile)
            return (
                <>
                    <ListReservations
                        key="1"
                        setReservationDetails={setReservationDetails}
                        status={RESERVATIONS_TYPES.today}
                        filterDefaultValues={{
                            status: STATUS_RESERVATION.acquired,
                            meta_day: moment().format("YYYY-MM-DD"),
                        }}
                    />
                    <ListReservations
                        key="2"
                        setReservationDetails={setReservationDetails}
                        status={RESERVATIONS_TYPES.tomorrow}
                        filterDefaultValues={{
                            status: STATUS_RESERVATION.acquired,
                            meta_day: moment().add(1, "days").format("YYYY-MM-DD"),
                        }}
                    />
                    <ListReservations
                        key="3"
                        setReservationDetails={setReservationDetails}
                        status={RESERVATIONS_TYPES.invoice_pending}
                        filterDefaultValues={{
                            status: STATUS_RESERVATION.claimed,
                            createdAt: {
                                $lte: CURRENT_DATE,
                                $gte: INITIAL_DATE_INVOICE_PENDING
                            },
                            reported_invoice_amount: "null",
                            $sort: {
                                createdAt: -1,
                            }
                        }}
                    />
                </>
            )
        else
            return (
                <ReflexContainer orientation="horizontal">
                    <ListReservations
                        propagateDimensionsRate={200}
                        propagateDimensions={true}
                        direction={1}
                        minSize={50}
                        flex={1}
                        setReservationDetails={setReservationDetails}
                        status={RESERVATIONS_TYPES.today}
                        filterDefaultValues={{
                            status: STATUS_RESERVATION.acquired,
                            meta_day: moment().format("YYYY-MM-DD"),
                        }}
                    />
                    <ReflexSplitter
                        propagate={true}
                    />
                    <ListReservations
                        propagateDimensionsRate={200}
                        propagateDimensions={true}
                        direction={[-1]}
                        minSize={50}
                        flex={0}
                        setReservationDetails={setReservationDetails}
                        status={RESERVATIONS_TYPES.tomorrow}
                        filterDefaultValues={{
                            status: STATUS_RESERVATION.acquired,
                            meta_day: moment().add(1, "days").format("YYYY-MM-DD"),
                        }}
                    />

                    <ReflexSplitter
                        propagate={true}
                    />
                    <ListReservations
                        propagateDimensionsRate={200}
                        propagateDimensions={true}
                        direction={-1}
                        minSize={50}
                        flex={0}
                        setReservationDetails={setReservationDetails}
                        status={RESERVATIONS_TYPES.invoice_pending}
                        filterDefaultValues={{
                            status: STATUS_RESERVATION.claimed,
                            createdAt: {
                                $lte: CURRENT_DATE,
                                $gte: INITIAL_DATE_INVOICE_PENDING
                            },
                            reported_invoice_amount: "null",
                            $sort: {
                                createdAt: -1,
                            }
                        }}
                    />
                </ReflexContainer >
            );
};


const ReservationsProvider = (props) => {

    const renderEmpty = () => {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                imageStyle={{
                    height: 60,
                }}
                description="No se encontraron reservas"
            />
        );
    };

    return (
        <ConfigProvider renderEmpty={renderEmpty}>
            <Reservations {...props} />
        </ConfigProvider>
    )
}

export default ReservationsProvider;