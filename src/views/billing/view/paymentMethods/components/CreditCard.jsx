import React, { useEffect, useRef } from 'react';
import { Col, message, Modal, Radio, Row, Spin, Tooltip } from "antd";
import styled from "styled-components";
import AsyncButton from "../../../../../components/asyncButton";
import { AiOutlineDelete } from 'react-icons/ai';
import Mastercard from '../../../../../sources/icons/mastercard';
import Visa from '../../../../../sources/images/Visa';
import AmericanExpress from '../../../../../sources/images/AmericanExpress';
import DinersClub from '../../../../../sources/images/DinersClub';
import { getService } from '../../../../../services';
import { useSelector } from 'react-redux';

import { LoadingOutlined, } from '@ant-design/icons';
import moment from 'moment/moment';
import { useState } from 'react';
import _ from 'lodash';

import { AiOutlineInfoCircle, AiFillCheckCircle } from 'react-icons/ai';


const MINUTES_TRYING_VERIFY = 10;

const USERS_ROLES = {
    admin: 'admin',
    user: 'user',
};

export const brands = {
    visa: <Visa />,
    mastercard: <Mastercard />,
    'american-express': <AmericanExpress />,
    'diners-club': <DinersClub />,
};

const CreditCardContainerStyled = styled.div`
    background: white;
    border: 1px solid #F0EFEF;
    padding: 15px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 17px;
    max-width: 350px;
    height: 180px;
`;

const CreditCard = ({ key, item, allowToDelete, onFinishRemove, updateCreditCardData }) => {

    const interValTime =  15000;

    const interval = useRef();
    const creditCards = getService('credit-cards');

    const currentUser = useSelector(({ appReducer }) => appReducer?.user);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    const [isVerifying, setIsVerifying] = useState(false);


    const errorModal = ({message}) => {
        Modal.error({
          title: '¡Ups! Hubo un error al agregar tu método de pago. Inténtalo nuevamente.',
          content: message,
        });
      };

    const diffCreatedAtfronNow = () => {
        const now = moment().tz("America/Bogota");
        const createdDate = moment(item?.createdAt);
        const duration = moment.duration(now.diff(createdDate));
        const minutes = duration.asMinutes();
        return minutes;
    }

    const handleRemoveCreditCard = async (id) => {
        await creditCards.remove(id)
            .then(() => {
                message.success('Tarjeta eliminada exitosamente!');
                if (onFinishRemove) {
                    onFinishRemove();
                }
            })
            .catch((error) => {
                message.error(error?.message || 'Upps! intenta nuevamente');
            })
    }

    const handleUpdateDefault = async (id, status) => {
        await creditCards.patch(id, {
            default: String(status),
        })
            .then(() => {
                message.success('Tarjeta actualizada exitosamente!');
                if (onFinishRemove) {
                    onFinishRemove();
                }
            })
            .catch((error) => {
                message.error(error?.message || 'Upps! intenta nuevamente');
            })
    }

    const getCreditcardsData = (id) => {
        creditCards.get(id)
            .then((response) => {
                if (response?.status === 'verified' || diffCreatedAtfronNow() > MINUTES_TRYING_VERIFY) {
                    clearInterval(interval.current);
                    setIsVerifying(false);
                    if (onFinishRemove) {
                        onFinishRemove();
                    }
                }
                if(response?.pay_payment?.rejected_reason){
                    clearInterval(interval.current);
                    setIsVerifying(false);
                    updateCreditCardData(response);
                    if (onFinishRemove) {
                        onFinishRemove();
                    }
                    errorModal({message: response?.pay_payment?.rejected_reason || ''});
                }
            })
            .catch((error) => {
                message.error(error?.message);
            })
    };

    useEffect(() => {
        if (diffCreatedAtfronNow() < MINUTES_TRYING_VERIFY && item?.status === 'pending_verification') {
            setIsVerifying(true);
            interval.current = setInterval(() => {
                getCreditcardsData(item?.id);
            }, interValTime);
        }
        return () => {
            clearInterval(interval.current);
        }
    }, [item.createdAt, item?.id])


    return (
        <CreditCardContainerStyled key={key}>
            <Row justify="space-between">
                <Col>
                    <div>
                        {brands?.[item?.brand]}
                    </div>
                </Col>
                <Col style={{ fontSize: '12px', fontWeight: '400' }}>

                    {
                        isVerifying ? (
                            <Row align={'middle'} gutter={6}>
                                <Col>
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 12 }} spin />} size='small' style={{ display: 'flex' }} />
                                </Col>
                                <Col>
                                    <span>
                                        Verificando...
                                    </span>
                                </Col>
                            </Row>
                        ) : (
                            <>
                                <span>
                                    {item?.status === 'not_verified' && "No verificada"}
                                    {item?.status === 'pending_verification' && "Pendiente de verificación"}
                                    {item?.status === 'verified' && (
                                        <Row align={'middle'} gutter={6}>
                                            <Col>
                                                <span>
                                                    Verificada
                                                </span>
                                            </Col>
                                            <Col>
                                                <AiFillCheckCircle  style={{color: "#52c41a"}}/>
                                            </Col>
                                        </Row>
                                    )}
                                </span>
                                {
                                    item?.pay_payment?.rejected_reason && (
                                        <span style={{ cursor: 'pointer' }}>
                                            <Tooltip title={item?.pay_payment?.rejected_reason || ''}>
                                                {" "}<AiOutlineInfoCircle />
                                            </Tooltip>
                                        </span>
                                    )
                                }
                            </>
                        )
                    }

                </Col>
            </Row>
            <Col>
                <Row>
                    <span style={{ fontSize: '18px', fontWeight: '900' }}>
                        {(item?.masked_number || '')?.replace(/(.{4})/g, '$1 ')}
                    </span>
                </Row>
                <Row>
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>
                        {item?.owner_name}
                    </span>
                </Row>
            </Col>
            <Row justify="space-between">
                <Col>
                    <Radio
                        disabled={item?.status !== 'verified'}
                        checked={item?.default === 'true' ? true : false}
                        onChange={(value) => handleUpdateDefault(item?.id, value.target.checked)}
                    >
                        Por defecto
                    </Radio>
                </Col>
                {
                    (
                        allowToDelete
                        && (
                            currentUser?.role === USERS_ROLES.admin
                            || _.find(currentUser?.permissionsv2, ({ role, establishment_id }) =>
                                ['superAdmin'].includes(role)
                                && establishment_id === Number(establishmentFilters?.establishment_id)
                            )
                        )
                    ) && (
                        <Col>
                            <AsyncButton
                                confirmText={`¿Seguro que quieres eliminar tu tarjeta?, esta acción no podrás deshacerla.`}
                                type="text"
                                style={{ color: '#D62626', marginRight: '-15px' }}
                                icon={<><AiOutlineDelete size={15} />{" "}</>}
                                onClick={() => handleRemoveCreditCard(item?.id)}
                            >
                                Eliminar
                            </AsyncButton>
                        </Col>
                    )
                }
            </Row>
        </CreditCardContainerStyled>
    );
}

export default CreditCard;