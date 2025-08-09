import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Layout, ConfigProvider, Empty } from 'antd';
import ReservationNotification from './ReservationNotification';
import AppartaPayNotification from './AppartaPayNotification';
import * as actionTypes from '../../redux/app/actions';
import { changeRefresh } from '../../views/orders/redux/actions';
import styled from 'styled-components';
import { useMedia } from 'react-use';

const NOTIFICATION_TYPE = {
    appartapay: 'appartapay',
    reservation: 'reservation',
};

const SiderContainer = styled(Layout.Sider)`
    &.ant-layout-sider {
        max-height: 94vh;
        padding-bottom: 5rem;
        padding: 1rem 0.5rem;
        background:  transparent;
        position: absolute;
        z-index:101;
        right: ${props => props.position === 'right' ? 0 : 'auto'};
        box-shadow: ${props => props.position === 'right' ? 0 : '0 2px 10px -1px rgba(69, 90, 100, 0.3)'};
        overflow:auto !important;
    }
`;

const SideNotification = () => {

    const sideNotificationFullWidth = useMedia("(max-width: 426px)");

    const dispatch = useDispatch();
    const notificationsData = useSelector(({ appReducer }) => appReducer.notificationsData);
    const collapsedNotification = useSelector(({ appReducer }) => appReducer.collapsedNotification);

    const removeNotificationData = notification =>
        dispatch({
            type: actionTypes.REMOVE_NOTIFICATION_DATA,
            payload: notification
        });
    const handleChangeRefresh = () => dispatch(changeRefresh(true));

    const renderEmpty = () => {
        return (
            <Empty
                imageStyle={{
                    height: 0,
                }}
                description=""
            />
        );
    };


    return (
        <SiderContainer
            trigger={null}
            collapsible
            collapsed={collapsedNotification}
            collapsedWidth="0"
            background={sideNotificationFullWidth}
            position="right"
            width={sideNotificationFullWidth ? '100%' : '400px'}
        >
            <ConfigProvider renderEmpty={renderEmpty}>
                <List
                    rowKey={(item)=> `${item.notificationType}-${item.id}`} 
                    dataSource={notificationsData}
                    renderItem={(item) =>
                        item.notificationType === NOTIFICATION_TYPE.reservation ?
                            <ReservationNotification
                                item={item}
                                removeNotificationData={removeNotificationData}
                                handleChangeRefresh={handleChangeRefresh}
                            />
                            :
                            <AppartaPayNotification
                                item={item}
                                removeNotificationData={removeNotificationData}
                            />
                    }
                />
            </ConfigProvider>
        </SiderContainer>
    );
}

export default SideNotification;
