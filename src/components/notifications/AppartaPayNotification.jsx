import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { Button, Col, Divider, Row, Typography } from 'antd';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { RiCoinsLine } from 'react-icons/ri';

const NOTIFICATION_TYPE = {
    appartapay: 'appartapay',
    reservation: 'reservation',
    payWithdrawal: 'payWithdrawal',
};

const AppartaPayNotification = ({ item, removeNotificationData }) => {

    return (
        <Row
            key={`appartapay-notification-${item?.id}`}
            style={{
                maxHeight: '7.5rem',
                marginBottom: "1rem",
                borderRadius: "1rem",
                boxShadow: '0 2px 10px -1px rgba(69, 90, 100, 0.3)',
                background: "#fff",
                overflow: "hidden",
                borderLeft: '7px solid #53E38B',
            }}
        >
            <Col
                flex="auto"
                style={{ padding: "0.5rem", }}
            >
                <Row align='middle' justify='space-between'>
                    <Col>
                        <Typography.Title level={5}>
                            {NOTIFICATION_TYPE.appartapay === item.notificationType ? 'appartapay' : 'Pago entrante'}
                        </Typography.Title>
                    </Col>
                    <Button
                        type='text'
                        shape='circle'
                        onClick={() => removeNotificationData({ id: item.id, notificationType: item.notificationType })}
                        icon={<AiOutlineCloseCircle />}
                    />
                </Row>
                <Row>
                    <Col flex="auto">
                        <Row>
                            <Typography.Text style={{ margin: 0 }}>
                                {item?.meta_user_first_name || ""} {item?.meta_user_last_name || ""}
                                {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                            </Typography.Text>
                        </Row>
                        <Row
                            align="middle"
                        >
                            <Col>
                                <span style={{ margin: '0.2em', fontSize: '0.9em' }}>
                                    <IoCalendarClearOutline />
                                    {" "}
                                    {
                                        `${item.status_date_completed
                                            ? moment(item.status_date_completed).format("DD-MM-YYYY")
                                            : "Fecha no relacionada"}`
                                    }
                                </span>
                            </Col>
                            <Divider type='vertical' />
                            <Col>
                                <span style={{ margin: '0.2em', fontSize: '0.9em' }}>
                                    {
                                        moment(
                                            `${item.status_date_completed}`
                                        ).format("hh:mm a")
                                    }
                                </span>
                            </Col>
                        </Row>
                        <Row
                            gutter={[16]}
                        >
                            <Col>
                                <RiCoinsLine size={25} />
                                {" "}
                                <Typography.Text style={{ margin: 0 }}>
                                    {
                                        `$ ${numeral(item?.amount || "").format("0,0")}`
                                    }
                                </Typography.Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
export default AppartaPayNotification;