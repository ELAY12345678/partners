import { Button, Col, Row, Typography } from "antd";
import _ from "lodash";
import { useSelector } from "react-redux";
import { Box } from "../../../../../components";

const USERS_ROLES = {
    admin: 'admin',
    user: 'user',
};

const NoPaymentMethod = ({ onClick }) => {


    const currentUser = useSelector(({ appReducer }) => appReducer?.user);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    return (
        <Box style={{
            minHeight: '500px'
        }}>
            <Col style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '8px' }}>
                <Row>
                    <div style={{ background: '#F0EFEF', padding: '1.5rem', aspectRatio: '1 / 1', borderRadius: '999999px' }}>
                        <svg width="36" height="33" viewBox="0 0 36 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27.4582 13.0981L29.8753 12.993C30.2956 12.8879 30.716 12.4675 30.716 11.9421V8.99959H4.65396C4.12852 8.99959 3.70816 8.57924 3.70816 8.15888C3.70816 7.63344 4.12852 7.21308 4.65396 7.21308H9.48804L12.8509 5.63675H3.18272C2.55219 5.63675 2.02674 6.1622 2.02674 6.79273V29.0715C2.02674 29.7021 2.55219 30.2275 3.18272 30.2275H29.56C30.1905 30.2275 30.716 29.7021 30.716 29.0715V23.9222C30.716 23.2917 30.1905 22.7662 29.56 22.7662C28.404 22.7662 27.248 22.7662 25.987 22.7662C24.4106 22.7662 23.1496 21.5052 23.1496 19.8237V15.9355C23.1496 13.3082 25.3564 13.0981 27.4582 13.0981ZM13.5865 7.21308H25.1463L22.9394 2.79936L13.5865 7.21308ZM27.143 7.21308H30.716V6.79273C30.716 6.1622 30.1905 5.63675 29.56 5.63675H26.3022L27.143 7.21308ZM25.4615 3.85024H29.56C31.1363 3.85024 32.3974 5.2164 32.3974 6.79273C32.3974 8.47415 32.3974 10.2607 32.3974 11.9421C32.3974 12.3624 32.3974 12.6777 32.1872 13.0981H32.8177C34.3941 13.0981 35.7602 14.3591 35.7602 15.9355V19.8237C35.7602 21.4001 34.3941 22.7662 32.8177 22.7662H32.1872C32.3974 23.0815 32.3974 23.5018 32.3974 23.9222V29.0715C32.3974 30.6479 31.1363 31.9089 29.56 31.9089H3.18272C1.60639 31.9089 0.240234 30.6479 0.240234 29.0715V6.79273C0.240234 5.2164 1.60639 3.85024 3.18272 3.85024H16.529L23.0445 0.802669C23.4648 0.592491 23.9903 0.802669 24.2005 1.22302L25.4615 3.85024ZM32.8177 14.8846C30.5058 14.8846 28.2989 14.8846 25.987 14.8846C25.3564 14.8846 24.9361 15.3049 24.9361 15.9355V19.8237C24.9361 20.4543 25.3564 20.9797 25.987 20.9797C28.2989 20.9797 30.5058 20.9797 32.8177 20.9797C33.4483 20.9797 33.9737 20.4543 33.9737 19.8237V15.9355C33.9737 15.3049 33.4483 14.8846 32.8177 14.8846Z" fill="black" stroke="black" stroke-width="0.3" />
                            <path d="M28.0883 19.2963C28.8428 19.2963 29.4545 18.6846 29.4545 17.9301C29.4545 17.1756 28.8428 16.564 28.0883 16.564C27.3338 16.564 26.7222 17.1756 26.7222 17.9301C26.7222 18.6846 27.3338 19.2963 28.0883 19.2963Z" fill="black" />
                        </svg>

                    </div>
                </Row>
                <div>
                    <div>
                        <Typography.Title level={5}>Agregar método de pago</Typography.Title>
                    </div>
                    <div>
                        <Typography.Text>Para facilitar a futuro todos tus pagos, agrega ahora</Typography.Text>
                    </div>
                    <div>
                        <Typography.Text>tus métodos de pago.</Typography.Text>
                    </div>
                </div>
                {
                    (currentUser?.role === USERS_ROLES.admin || _.find(currentUser?.permissionsv2, ({ role, establishment_id }) => ['superAdmin'].includes(role) && establishment_id === Number(establishmentFilters?.establishment_id))) ? (
                        <Row>
                            <Button type='primary' style={{ borderRadius: '6px' }} onClick={onClick}>
                                Agregar método
                            </Button>
                        </Row>
                    ) : null
                }
            </Col>
        </Box>
    )
}

export default NoPaymentMethod;