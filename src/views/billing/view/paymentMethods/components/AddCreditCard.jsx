import { Button, Typography } from "antd";
import styled from "styled-components";

const CreditCardContainerStyled = styled(Button)`
    background: white;
    border: 1px dashed #F0EFEF;
    padding: 15px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 17px;
    max-width: 350px;
    height: 180px;
    margin: 0px !important;
`;

const AddCreditCard = ({onClick}) => {
    return (
        <CreditCardContainerStyled block onClick={onClick}>
            <div>
                <div style={{ background: '#F0EFEF', padding: '0.5rem', aspectRatio: '1 / 1', borderRadius: '999999px' }}>
                    <svg width="43" height="44" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_12_2943)">
                            <path d="M21.213 11.3934V32.6066" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10.6064 22H31.8196" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_12_2943">
                                <rect width="30" height="30" fill="white" transform="translate(0 22) rotate(-45)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
            <div>
                <Typography.Title level={5}>
                    Agregar método de pago
                </Typography.Title>
            </div>
        </CreditCardContainerStyled>
    )
}

export default AddCreditCard;