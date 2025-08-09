import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { Col, Row, Typography, Button, Divider } from 'antd';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { RiCoinsLine } from 'react-icons/ri';

const AppartapayItem = ({ item }) => {
    return (
        <Row
            style={{
                borderBottom: "1px solid #d9d9d9",

            }}
        >
            <Col
                flex="0.5rem"
                style={{
                    background: '#53E38B',
                }}
            />
            <Col
                flex="auto"
                style={{ padding: "0.5rem", }}
            >
                <Row>
                    <Col flex="auto">
                        <Row
                            align="middle"
                        >
                            <Col>
                                <span style={{ margin: '0.2em', fontSize: '0.9em' }}>
                                    <IoCalendarClearOutline />
                                    {" "}
                                    {
                                        `${item?.status_date_completed
                                            ? moment(item.status_date_completed).format("DD-MMM-YYYY")
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
                        <Row>
                            <Typography.Text style={{ margin: 0 }}>
                                {/* {item?.meta_user_first_name || ""} {item?.meta_user_last_name || ""} */}
                                {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                            </Typography.Text>
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
                    <Col>
                        <Row
                            align='middle'
                            style={{ height: '100%' }}
                        >
                            <Button
                                style={{
                                    borderRadius: '1rem',
                                    color: '#01983B',
                                    border: '0',
                                    background: 'rgb(83,227,139,0.5)',
                                    cursor: 'default',
                                }}
                                icon={
                                    <>
                                        <AiOutlineCheckCircle />
                                        {"  "}
                                    </>
                                }
                            >
                                Completado
                            </Button>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default AppartapayItem;