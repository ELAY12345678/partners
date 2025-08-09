import React from 'react';
import moment from 'moment';
import { Row, Col, Typography, Button, List, Avatar, Popover } from 'antd';
import { Badge, ScheduleWrapper } from './Styles';

import { FiUsers, FiClock } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { BsCalendarEvent } from 'react-icons/bs'

import squareTicket from '../../sources/icons/squareTicket.svg';

import { DEFAULT_USER_AVATAR, S3_PATH_IMAGE_HANDLER } from '../../constants';
import MinuteProgress from '../../components/minuteProgress';

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
        title: "Reservas del usuario",
        color: "#6B24F8",
    }
};

const STATUS_RESERVATION = {
    claimed: "Reclamada",
    acquired: "Adquirida",
    pendingApproval: 'Pendiente de aprobación',
};


const CommentIcon = () => (
    <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="13.2612" cy="12.9725" rx="13" ry="12.9725" fill="#F0EFEF" />
        <path d="M20.5488 19.0686C21.0868 18.3475 21.456 17.5147 21.6292 16.6318C21.8023 15.7489 21.775 14.8383 21.5492 13.9674C21.3235 13.0964 20.905 12.2873 20.3247 11.5997C19.7445 10.9121 19.0172 10.3636 18.1966 9.99458C18.0179 8.96621 17.6071 7.99212 16.9954 7.14631C16.3838 6.30051 15.5875 5.60524 14.6669 5.11333C13.7463 4.62143 12.7256 4.34584 11.6826 4.30749C10.6395 4.26915 9.6014 4.46906 8.64716 4.89205C7.69293 5.31503 6.84766 5.94995 6.17559 6.74857C5.50352 7.54719 5.02232 8.48849 4.76856 9.50095C4.51479 10.5134 4.49515 11.5704 4.71111 12.5916C4.92707 13.6128 5.37296 14.5713 6.01489 15.3944L4.82161 16.5791C4.70249 16.6998 4.6218 16.8531 4.58972 17.0196C4.55763 17.1861 4.57559 17.3584 4.64133 17.5148C4.70574 17.6716 4.8151 17.8058 4.95565 17.9005C5.0962 17.9952 5.26164 18.0462 5.43113 18.047H10.3158C10.8023 19.0726 11.5692 19.9394 12.5279 20.5471C13.4866 21.1548 14.5977 21.4786 15.7328 21.4809H20.8836C21.0531 21.4801 21.2185 21.4291 21.3591 21.3344C21.4996 21.2396 21.609 21.1054 21.6734 20.9487C21.7391 20.7923 21.7571 20.62 21.725 20.4535C21.6929 20.287 21.6122 20.1337 21.4931 20.0129L20.5488 19.0686ZM9.72349 15.4716C9.72466 15.7591 9.74762 16.0461 9.79216 16.3301H7.50004L7.80051 16.0382C7.88097 15.9584 7.94484 15.8635 7.98842 15.7588C8.032 15.6542 8.05444 15.542 8.05444 15.4287C8.05444 15.3154 8.032 15.2032 7.98842 15.0986C7.94484 14.9939 7.88097 14.899 7.80051 14.8192C7.31939 14.3433 6.93796 13.7764 6.67853 13.1514C6.41911 12.5264 6.28688 11.8559 6.2896 11.1793C6.2896 9.81318 6.83228 8.50305 7.79824 7.53708C8.76421 6.57111 10.0743 6.02844 11.4404 6.02844C12.5064 6.02203 13.5475 6.34984 14.4175 6.96577C15.2876 7.58171 15.9427 8.4548 16.2908 9.46232H15.7328C14.139 9.46232 12.6105 10.0954 11.4836 11.2224C10.3566 12.3494 9.72349 13.8779 9.72349 15.4716ZM18.7718 19.764L18.8147 19.8069H15.7328C14.7398 19.8051 13.7782 19.4592 13.0117 18.8279C12.2452 18.1967 11.7213 17.3192 11.5292 16.345C11.3371 15.3708 11.4887 14.3601 11.9582 13.4851C12.4276 12.6102 13.1859 11.925 14.1039 11.5464C15.0218 11.1678 16.0427 11.1192 16.9924 11.4088C17.9422 11.6985 18.7622 12.3084 19.3127 13.1348C19.8632 13.9612 20.1102 14.9529 20.0116 15.9409C19.9129 16.929 19.4748 17.8523 18.7718 18.5535C18.61 18.712 18.5175 18.928 18.5142 19.1545C18.5147 19.268 18.5377 19.3804 18.5819 19.485C18.6261 19.5897 18.6907 19.6845 18.7718 19.764Z" fill="#202020" />
        <circle cx="20.7455" cy="12.0096" r="2.82465" fill="#E78686" />
    </svg>

)

export const ScheduleItem = ({ item, status, setReservationDetails }) => {

    return (
        <Row
            style={{
                borderBottom: "1px solid #d9d9d9",
                padding: "0.5rem",
            }}
        >
            <Col
                flex={'100%'}
            >
                <Row gutter={16}>
                    <Col flex='none'>
                        <Avatar
                            size={50}
                            src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                                url: item.meta_establishment_path_logo || DEFAULT_USER_AVATAR,
                                width: 50,
                                height: 50,
                            })}`
                            }
                        />
                    </Col>
                    <Col flex='auto'>
                        <Row>
                            <Typography.Title level={5} style={{ margin: 0, fontWeight: 'bolder' }} >
                                <b>
                                    {item?.meta_establishment_name}
                                </b>
                            </Typography.Title>
                        </Row>
                        <Row>
                            <Typography.Text>
                                {item?.meta_establishment_branch_address}
                            </Typography.Text>
                        </Row>
                    </Col>
                    <Col flex='none'>
                        {item.status === 'pendingApproval' && (
                            <MinuteProgress
                                record={item}
                                width={50}
                            />
                        )}
                        {
                            (status.key === RESERVATIONS_TYPES.reservation_by_filter.key && item.status !== 'pendingApproval') && (
                                <span style={{ margin: '0.2em', fontSize: '0.9em' }}>
                                    {STATUS_RESERVATION[item.status] || ""}
                                </span>
                            )
                        }
                    </Col>
                </Row>
                <Row align='middle'>
                    <Col flex="auto">
                        <Typography.Text style={{ margin: 0, fontWeight: 'bold' }} >

                            {item?.meta_user_first_name || ""} {item?.meta_user_last_name || ""}

                        </Typography.Text>
                        {item?.user_comment ? (
                            <>
                                <Popover
                                    content={
                                        <div style={{ padding: '10px 0px' }}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Descripción y/o preferencias
                                            </Typography.Title>
                                            {item?.user_comment}
                                        </div>
                                    }
                                    placement='left'
                                >
                                    <Button type='text' shape='circle'>
                                        <CommentIcon />
                                    </Button>
                                </Popover>
                            </>) : null}
                    </Col>
                    <Col flex='none'>
                        <Button
                            onClick={() => setReservationDetails({ ...item, key: status })}
                            shape="circle"
                            type="text"
                            icon={<AiOutlineEye size={25} />}
                        />
                    </Col>
                </Row>


                <Row gutter={8} style={{ marginBottom: '8px' }} align='middle'>
                    <Col >
                        <BsCalendarEvent size={14} />
                    </Col>
                    <Col >
                        {
                            item?.establishment_reservation_count ? (
                                <Typography.Text >
                                    Visita #{Number(item?.establishment_reservation_count + 1)}
                                </Typography.Text>
                            )
                                : (
                                    <Typography.Text >
                                        Primera visita
                                    </Typography.Text>
                                )
                        }
                    </Col>
                </Row>

                {
                    status.key !== RESERVATIONS_TYPES.invoice_pending.key && (
                        <Row gutter={8}>
                            <Col flex="auto">
                                <Row
                                    gutter={[16]}
                                >
                                    <Col>
                                        <FiUsers size={20} />
                                        {" "}
                                        <Typography.Text >
                                            {item.persons || ""}
                                        </Typography.Text>
                                    </Col>
                                    {
                                        item?.meta_percentage && (
                                            <Col>
                                                <Badge
                                                     color='#F98B76'
                                                     background='#FDE8E3'
                                                >
                                                    {`${item.meta_percentage || ""}%`}
                                                </Badge>
                                            </Col>
                                        )
                                    }

                                </Row>
                                {
                                    item.meta_deal_name && (
                                        <Row>
                                            <span
                                                style={{
                                                    color: '#6B24F8',
                                                    fontSize: '1em',
                                                }}
                                            >
                                                <img src={squareTicket} alt='icon-ticket' height='10em' />
                                                {" "}
                                                {item.meta_deal_name}
                                            </span>
                                        </Row>
                                    )
                                }
                            </Col>
                        </Row>
                    )
                }
                {
                    (status.key === RESERVATIONS_TYPES.invoice_pending.key || status.key === RESERVATIONS_TYPES.reservation_by_filter.key) && (
                        <Row gutter={16}>
                            <Col>
                                <span style={{ margin: '0.2em', fontSize: '0.9em' }}>
                                    <IoCalendarClearOutline />
                                    {" "}
                                    {
                                        moment(
                                            item.meta_day,
                                            "YYYY-MM-DD"
                                        ).format("dddd D MMMM")
                                    }
                                </span>
                            </Col>
                            <Col>
                                <span>
                                    <FiClock />
                                    {" "}
                                    {
                                        item.meta_start_hour &&
                                        moment(
                                            `${item.meta_start_hour}`,
                                            "HH:mm:ss"
                                        ).format("hh:mm a")
                                    }
                                </span>
                            </Col>
                        </Row>
                    )
                }
                {
                    item.status !== 'pendingApproval' &&
                    <Row>
                        <Col>
                            <Button
                                style={{
                                    borderRadius: '1rem',
                                    color: '#fff',
                                    border: '0',
                                    background: '#35D172',
                                    marginTop: '8px',
                                }}
                                size='small'
                                onClick={() => setReservationDetails({ ...item, key: status })}
                            >
                                Califica este usuario
                            </Button>
                        </Col>
                    </Row>
                }
            </Col>
        </Row>
    );
}

const Schedule = (props) => {

    const { status, setReservationDetails, meta_start_hour, reservationsData } = props;

    return (
        <ScheduleWrapper>
            <Col className="scheduleColumnHour" >
                <Row
                    align='middle'
                    justify='center'
                    style={{
                        height: '100%',
                        borderLeft: `5px solid ${status.color ? status.color : 'pink'}`,
                        padding: "5px 5px",
                        textAlign: "center",
                        borderRight: "1px solid #d9d9d9",
                        borderBottom: "1px solid #d9d9d9",

                    }}
                >
                    <Col>
                        <Typography.Title
                            level={5}
                            style={{
                                margin: 0,
                                maxWidth: '4em'
                            }}>
                            {
                                moment(
                                    `${meta_start_hour}`,
                                    "HH:mm:ss"
                                ).format("hh:mm a")
                            }
                        </Typography.Title>
                    </Col>
                </Row>
            </Col>
            <Col className="scheduleColumnReservation">
                <List
                    dataSource={reservationsData || []}
                    renderItem={item =>
                        <ScheduleItem item={item} status={status} setReservationDetails={setReservationDetails} />
                    }
                />
            </Col>
        </ScheduleWrapper>
    )
}

export default Schedule;