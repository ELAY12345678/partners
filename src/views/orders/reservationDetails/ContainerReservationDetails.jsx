import { Button, Col, Drawer, Row, Typography } from "antd";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useMedia } from "react-use";
import { DetailReservationContainer, Modal } from "../Styles";

const ContainerReservationDetails = ({ children, onClose, title }) => {
    const dropEstablishmentFilters = useMedia("(max-width: 767px)");
    if (dropEstablishmentFilters)
        return (
            <Drawer
                title={title}
                destroyOnClose
                placement="bottom"
                visible={true}
                height="100%"
                headerStyle={{
                    border: 0,
                }}
                closeIcon={
                    <AiOutlineCloseCircle
                        size={20}
                        style={{ color: 'var(--purple)', cursor: 'pointer' }}
                    />
                }
                onClose={onClose}
            >
                {children}
            </Drawer>
        )

    else return (
        <>
            {
                true &&
                <DetailReservationContainer
                    align='middle'
                >
                    <Col xs={24} sm={24} md={24} lg={20} xl={13}>
                        <Modal>
                            <Row
                                justify='space-between'
                                align='bottom'
                                style={{ width: '100%' }}
                            >
                                <Col>
                                    <Typography.Title level={5}>
                                        {title}
                                    </Typography.Title>
                                </Col>
                                <Col>
                                    <Button
                                        type='text'
                                        shape='circle'
                                        onClick={onClose}
                                    >
                                        <AiOutlineCloseCircle
                                            size={20}
                                            style={{ color: 'var(--purple)', cursor: 'pointer' }}
                                        />
                                    </Button>
                                </Col>
                            </Row>
                            {children}
                        </Modal>
                    </Col>
                </DetailReservationContainer>
            }
        </>
    )
}

export default ContainerReservationDetails;