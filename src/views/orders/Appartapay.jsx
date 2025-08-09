import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, List, message } from 'antd';
import { Badge } from './Styles';
import AppartapayItem from './AppartapayItem';

import { changeAppartaPayRefresh, setAppartaPayDatas } from './redux/actions';

import { BiUser } from 'react-icons/bi';
import { getService } from '../../services';

const PAYMENT_STATUS = {
    created: 'created',
    canceled: 'canceled',
    rejected: 'rejected',
    pending: 'pending',
    completed: 'completed',
    withdrawal_generated: 'withdrawal_generated',
    expired: 'expired',
    activate_after_date: 'activate_after_date',
}

const Header = ({ title, count }) =>
    <Row
        type='flex'
        align='middle'
        justify="space-between"
        style={{
            height: 50,
            width: '100%',
            fontSize: '1.2em',
            background: " #fafafa",
            borderBottom: "1px solid #d9d9d9",
            borderTop: "1px solid #d9d9d9",
            padding: "0px 10px",
        }}
    >
        {title}
        <Row
            type='flex'
            align='middle'
            gutter={16}
        >
            <Col>
                <Badge>
                    <BiUser size={20} />
                    {" "}
                    {count}
                    {/* <sup>+</sup> */}
                </Badge>
            </Col>
        </Row>
    </Row>;


const Appartapay = ({ style }) => {

    const dispatch = useDispatch();
    const user = useSelector(({ appReducer }) => appReducer?.user);
    const appartapayData = useSelector(({ dashboardReducer }) => dashboardReducer.appartapayDatas);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    const userFilter = useSelector(({ dashboardReducer }) => dashboardReducer.userFilter);
    const refresh = useSelector(({ dashboardReducer }) => dashboardReducer.refreshAppartapay);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(appartapayData.currentPage || 1);
    const [paymentsCount, setPaymentsCount] = useState(appartapayData.total || 0);

    const getAppartaPayData = ({ filters, page }) => {
        if (user.role === 'admin' && _.isEmpty(establishmentFilters)) {
            dispatch(changeAppartaPayRefresh(false));
            dispatch(setAppartaPayDatas({}));
            setPaymentsCount(0);
            return;
        }
        setLoading(true);
        const servicePayments = getService("pay-payments");

        servicePayments
            .find({
                query: {
                    ...filters,
                    meta_establishment_branch_id: establishmentFilters.establishment_branch_id,
                    meta_establishment_id: establishmentFilters.establishment_id,
                    type: {
                        $in: ['consumption', 'reservation']
                    },
                    status: PAYMENT_STATUS.completed,
                    $sort: {
                        status_date_completed: -1,
                    },
                    $limit: 10,
                    $skip: (page - 1) * 10,
                    $client: {
                        skipJoins: true
                    }
                }
            })
            .then((response) => {
                dispatch(setAppartaPayDatas({ ...response, currentPage: page }));
                setPaymentsCount(response.total);
                dispatch(changeAppartaPayRefresh(false));
                setLoading(false);
            })
            .catch(err => {
                message.error(err.message);
                setLoading(false);
                dispatch(changeAppartaPayRefresh(false));
            });
    }

    useEffect(() => {
        if (refresh || userFilter) {
            setCurrentPage(1);
            getAppartaPayData({
                filters: { q: userFilter },
                page: 1
            });
        }
    }, [refresh, userFilter])


    return (
        <div style={{
            ...style,
            width: '100%',
            overflow: 'auto',
            paddingBottom: '1em'
        }}>
            <Header title={"Pagos verificados"} count={paymentsCount} />
            <List
                loading={loading}
                dataSource={appartapayData.data}
                pagination={{
                    current: currentPage,
                    onChange: page => {
                        setCurrentPage(page);
                        getAppartaPayData({
                            filters: { q: userFilter },
                            page
                        });
                    },
                    showSizeChanger: false,
                    pageSize: 10,
                    pageSizeOptions: ["10"],
                    total: paymentsCount
                }}
                renderItem={item =>
                    <AppartapayItem
                        item={item}
                    />
                }
            />
        </div>
    );
}

export default Appartapay;