import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { StyledModal, Title } from "./styles";
import CreditCardForm from './CreditCardForm';
import PaymentOption from "./PaymentOption";
import AccountForm from "./AccountForm";

const PaymentMethodsModalForm = ({ open, onClose, onFinish, selectAsDefault,  payAccountId, onFinishPayBankAccount }) => {

  const [selectedFormPayMethod, setSelectedFormPayMethod] = useState('credit_card');


  // useEffect(() => {
  //  if(!payAccountId){
  //   setSelectedFormPayMethod('credit_card');
  //  }
  // }, [payAccountId])
  


  return (
    <StyledModal
      centered
      open={open}
      onCancel={onClose}
      title={'Agregar método de pago'}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Col>
        <Row wrap={false} gutter={57}>
          <Col flex={'none'}>
            <Title style={{ margin: '0px !important' }} >
              Método de pago
            </Title>
            <br />
            <PaymentOption
              selected={'credit_card' === selectedFormPayMethod}
              title={"Tarjeta de Crédito"}
              onClick={() => {
                setSelectedFormPayMethod('credit_card');
              }}
            />
            <br />
            <PaymentOption
              selected={'account' === selectedFormPayMethod}
              title={"Cta. ahorros/Corriente"}
              onClick={() => {
                setSelectedFormPayMethod('account');
              }}
            />
          </Col>
          {
            'credit_card' === selectedFormPayMethod && (
              <CreditCardForm
                onClose={onClose} 
                onFinish={onFinish}
                selectAsDefault={selectAsDefault}
                open={open}
            />
            )
          }
          {
            'account' === selectedFormPayMethod && (
              <AccountForm
                onClose={onClose} 
                onFinish={onFinishPayBankAccount}
                selectAsDefault={selectAsDefault}
                open={open}
                payAccountId={payAccountId}
            />
            )
          }
             
        </Row>
      </Col >
    </StyledModal >
  );
}
export default PaymentMethodsModalForm;