import React from 'react';
import { Col, message, Row, } from "antd";
import AsyncButton from "../../../../../components/asyncButton";
import { AiOutlineDelete } from 'react-icons/ai';
import { getService } from '../../../../../services';

import { CreditCardContainerStyled } from './styles';

const ACCOUT_TIPE = {
    current: 'Corriente',
    saving: 'Ahorros',
}

const PayBankAccount = ({ key, item, onFinishRemove, }) => {

    const payBankService = getService('pay-banks');

    const handleRemovePayBankAccount = async (id) => {
        await payBankService.remove(id)
            .then(() => {
                message.success('Cuenta eliminada exitosamente!');
                if (onFinishRemove) {
                    onFinishRemove();
                }
            })
            .catch((error) => {
                message.error(error?.message || 'Upps! intenta nuevamente');
            })
    }

    return (
        <CreditCardContainerStyled key={key}>
            <Row justify="space-between">
                <Col>
                    <div>
                        {item?.bank?.name}
                    </div>
                </Col>
            </Row>
            <Col>
                <Row>
                    <span style={{ fontSize: '18px', fontWeight: '900' }}>
                        {(item?.account_number || '')}
                    </span>
                </Row>
                <Row>
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>
                        {item?.legal_name}
                    </span>
                </Row>
            </Col>
            <Row justify="space-between">
                <Col>
                    {ACCOUT_TIPE?.[item?.account_type] || ''}
                </Col>
                <Col>
                    <AsyncButton
                        confirmText={`¿Seguro que quieres eliminar esta cuenta?, esta acción no podrás deshacerla.`}
                        type="text"
                        style={{ color: '#D62626', marginRight: '-15px' }}
                        icon={<><AiOutlineDelete size={15} />{" "}</>}
                        onClick={() => handleRemovePayBankAccount(item?.id)}
                    >
                        Eliminar
                    </AsyncButton>
                </Col>
            </Row>
        </CreditCardContainerStyled>
    );
}

export default PayBankAccount;