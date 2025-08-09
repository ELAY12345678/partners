import React from 'react';
import { Button, Col, Divider, message, Row, Typography } from 'antd';
import { HiOutlineDocumentDownload } from 'react-icons/hi';

import { useTransferDetails } from './hooks/useTransferDetails';
import numeral from 'numeral';
import { getService } from '../../services';
import AsyncButton from '../../components/asyncButton';

import styled from "styled-components";
import { MyModal } from '../../components/com';

const Title1 = styled(Typography.Paragraph)`
    font-weight: 700 !important;
    font-size: 1.125rem !important;
    color: black;
`;

const Title1Purple = styled(Typography.Paragraph)`
    font-weight: 700 !important;
    font-size: 1.125rem;
    color: var(--primary) !important;
`;

const Title2 = styled(Typography.Paragraph)`
    font-weight: 700 !important;
    font-size: 0.875rem !important;
    color: var(--primary) !important;
    margin-bottom: 0px !important;
`;

const Title3 = styled(Typography.Title)`
    font-weight: 700 !important;
    font-size: 0.75rem !important;
    color: black;
`;
const Text = styled(Typography.Paragraph)`
    font-weight: 400 !important;
    font-size: 0.75rem;
    color: black;
`;

const ModalTitle = styled(Col)`
    padding: 15px 20px !important;
    & .downloadLink {
    }
    & .ant-btn-link {
        padding: 0px !important;
        margin-top: 14px;

        text-decoration-line: underline !important;
        font-weight: 700 !important;
        color: var(--white) !important;
        font-size: 0.875rem !important;
    }
    & .textLink {
        text-decoration-line: underline !important;
        font-weight: 700 !important;
        color: var(--white) !important;
        font-size: 0.875rem !important;
        margin-left: 10px;
    }
`;


const TransferDetails = ({ id,date, establishment_id, onCancel, visible }) => {

    const [dataDetails] = useTransferDetails({ id });

    const onExportExcelTransferDetails = async () => {
        const reportIncomeExoensesService = getService('report-income-expenses');
        await reportIncomeExoensesService.find({
            query: {
                $client: { generateExcelWithDetails: true },
                pay_withdrawal_id: id,
                establishment_id
            }
        })
            .then((response) => window.open(response.path, '_blank'))
            .catch((error) => message.error(error.message || 'No se pudo exportar los registros!'))
    };

    const totalIngresos = dataDetails?.ConsumptionsAndReservations?.sum_income
        + dataDetails?.PercentageSubsidized?.sum_income
        + dataDetails?.administrationIncomes?.sum_income;

    const totalEgresos = dataDetails?.commissionsReservations?.sum_commission_total_amount_tax_excl
        + dataDetails?.commissionsAppartaPay?.sum_commission_total_amount_tax_excl
        + dataDetails?.administrationOutcomes?.sum_amount
        + dataDetails?.PercentageSubsidized?.sum_commission_total_amount_tax_incl;

    const totalIva = dataDetails?.commissionsReservations?.sum_commission_tax_amount
        + dataDetails?.commissionsAppartaPay?.sum_commission_tax_amount
        + dataDetails?.administrationOutcomes?.sum_commission_tax_amount;


    return (
        <MyModal
            title={
                <>
                    <ModalTitle>
                        <Row>
                            Detalle transferencia {date}
                        </Row>
                        <Row >
                            {/* <Button type="link">
                                    <Row gutter={8}>
                                    <Col>
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                                            <defs>
                                                <clipPath id="clip-path">
                                                    <rect id="Rectangle_1215" dataName="Rectangle 1215" width="24" height="24" fill="#fff" />
                                                </clipPath>
                                            </defs>
                                            <g id="Group_1966" dataName="Group 1966" clipPth="url(#clip-path)">
                                                <path id="Path_1162" dataName="Path 1162" d="M8.571,17.819l4,4,4-4" transform="translate(-0.571 -0.818)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                <path id="Path_1163" dataName="Path 1163" d="M12.571,12.818v9" transform="translate(-0.571 -0.818)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                <path id="Path_1164" dataName="Path 1164" d="M21.451,18.909a5,5,0,0,0-2.88-9.09h-1.26a8,8,0,1,0-13.74,7.29" transform="translate(-0.571 -0.818)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                            </g>
                                        </svg>
                                    </Col>
                                    <Col className='downloadLink'>
                                        Descargar
                                    </Col>
                                    </Row>
                                </Button> */}
                            <AsyncButton
                                type="primary"
                                style={{ background: 'transparent', padding: '0px', boxShadow: 'none !important', marginTop: '14px' }}
                                onClick={onExportExcelTransferDetails}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                                        <defs>
                                            <clipPath id="clip-path">
                                                <rect id="Rectangle_1215" dataName="Rectangle 1215" width="24" height="24" fill="#fff" />
                                            </clipPath>
                                        </defs>
                                        <g id="Group_1966" dataName="Group 1966" clipPth="url(#clip-path)">
                                            <path id="Path_1162" dataName="Path 1162" d="M8.571,17.819l4,4,4-4" transform="translate(-0.571 -0.818)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                            <path id="Path_1163" dataName="Path 1163" d="M12.571,12.818v9" transform="translate(-0.571 -0.818)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                            <path id="Path_1164" dataName="Path 1164" d="M21.451,18.909a5,5,0,0,0-2.88-9.09h-1.26a8,8,0,1,0-13.74,7.29" transform="translate(-0.571 -0.818)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </g>
                                    </svg>

                                }
                            >
                                <span className='textLink'>
                                    Descargar detalle
                                </span>
                            </AsyncButton>
                        </Row>
                    </ModalTitle>
                </>
            }
            onCancel={onCancel}
            visible={visible}
        >
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <Row>
                    <Title3>
                        Detalles de Ingresos
                    </Title3>
                </Row>
                <Row>
                    <Text>
                        Total ingresos recibidos al wallet sin descontar ningún tipo de comisión
                    </Text>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            Ingresos por {dataDetails?.commissionsAppartaPay?.apparta_pay_count} pagos recibidos Apparta Pay
                        </Text>
                    </Col>
                    <Col>
                        < Text>
                            ${numeral(dataDetails?.ConsumptionsAndReservations?.sum_income)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            Ingresos administrativos
                        </Text>
                    </Col>
                    <Col>
                        <Text>
                            ${numeral(dataDetails?.administrationIncomes?.sum_income)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            Ingreso por descuento subsidiado en {dataDetails?.PercentageSubsidized?.apparta_pay_count} reservas
                        </Text>
                    </Col>
                    <Col>
                        <Text>
                            ${numeral(dataDetails?.PercentageSubsidized?.sum_income)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Title2 level={5}>
                            Ingresos Totales
                        </Title2>
                    </Col>
                    <Col>
                        <Title2 level={5}>
                            ${numeral(totalIngresos)?.format('0,0')}
                        </Title2>
                    </Col>
                </Row>
                <Divider style={{ background: '#707070' }} />
                <Row>
                    <Title3>
                        Detalles de Egresos
                    </Title3>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            Comisiones por {dataDetails?.commissionsReservations?.reservations_count} reservas y {dataDetails?.commissionsReservations?.reservations_persons} comensales
                        </Text>
                    </Col>
                    <Col>
                        <Text>
                            ${numeral(dataDetails?.commissionsReservations?.sum_commission_total_amount_tax_excl)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            Comisiones por {dataDetails?.commissionsAppartaPay?.apparta_pay_count} pagos recibidos por Apparta Pay
                        </Text>
                    </Col>
                    <Col>
                        <Text >
                            ${numeral(dataDetails?.commissionsAppartaPay?.sum_commission_total_amount_tax_excl)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            Comisiones por {dataDetails?.PercentageSubsidized?.apparta_pay_count} reservas con descuentos subsidiados
                        </Text>
                    </Col>
                    <Col>
                        <Text >
                            ${numeral(dataDetails?.PercentageSubsidized?.sum_commission_total_amount_tax_incl)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            Egreso por administración
                        </Text>
                    </Col>
                    <Col>
                        <Text>
                            ${numeral(dataDetails?.administrationOutcomes?.sum_amount)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Title2 >
                            Egresos Totales (sin IVA)
                        </Title2>
                    </Col>
                    <Col>
                        <Title2>
                            ${numeral(totalEgresos)?.format('0,0')}
                        </Title2>
                    </Col>
                </Row>
                <Divider style={{ background: '#707070' }} />
                <Row>
                    <Title3>
                        Detalles de Impuestos
                    </Title3>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            IVA a comisiones por Reserva
                        </Text>
                    </Col>
                    <Col>
                        <Text>
                            ${numeral(dataDetails?.commissionsReservations?.sum_commission_tax_amount)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            IVA a comisiones por Apparta Pay
                        </Text>
                    </Col>
                    <Col>
                        <Text>
                            ${numeral(dataDetails?.commissionsAppartaPay?.sum_commission_tax_amount)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Text>
                            IVA a egreso por administración
                        </Text>
                    </Col>
                    <Col>
                        <Text>
                            ${numeral(dataDetails?.administrationOutcomes?.sum_commission_tax_amount)?.format('0,0')}
                        </Text>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col>
                        <Title2 >
                            Impuestos Totales
                        </Title2>
                    </Col>
                    <Col>
                        <Title2>
                            ${numeral(totalIva)?.format('0,0')}
                        </Title2>
                    </Col>
                </Row>
                <Divider style={{ background: '#707070' }} />
                <Row justify='space-between'>
                    <Col>
                        <Title1Purple>
                            Total Transferido
                        </Title1Purple>
                    </Col>
                    <Col>
                        <Title1Purple>
                            ${numeral(totalIngresos - totalEgresos - totalIva)?.format('0,0')}
                        </Title1Purple>
                    </Col>
                </Row>
                {/* <Row>
                <AsyncButton
                    type="primary"
                    style={{ borderRadius: '0.5rem' }}
                    onClick={onExportExcelTransferDetails}
                    icon={<HiOutlineDocumentDownload />}
                >
                    Descargar Detalle
                </AsyncButton>
            </Row> */}
                <Divider style={{ background: 'transparent', borderTop: 0, }} />
            </div>
        </MyModal>
    )
};

export default TransferDetails;