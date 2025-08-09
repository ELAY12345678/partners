import { Row, Select, Col } from "antd";
import styled from "styled-components";


export const Wrapper = styled.div`
  /* contenedor de card-gateway */
  & .container-sections-button-validations{
  
     display:flex;
     align-items: center;
     background: #f3f3f3 ;
     color: black;
     padding: 2px;
     margin-top: 8px;
  }
/*  */
  & .ant-list {
    background: #fff;
    margin: 4px 0px;
    padding: 8px 4px;
    border-radius: 0px !important;
    box-shadow: 2px 2px 2px #cccccc5e;
  }
  /* & .ant-list-item-meta-content {
        margin: 4px 16px;
    } */
  & .ant-progress-inner {
    height: 60px !important;
    width: 60px !important;
    font-size: 16px !important;
  }
  & .ant-list-split .ant-list-header {
    border-bottom: 0px solid #e8e8e8 !important;
  }
  & .card-list-container h3 {
    font-size: 14px;
    margin-bottom: 0px;
    margin: 8px;
    font-weight: bold;
    color: rgb(0, 0, 0, 0.75);
  }
  & .ant-list-items .ant-list-item {
    cursor: pointer;
    background: #fff;
    margin: 0px !important;
    padding: 0px !important;
    overflow: hidden !important;
    border-radius: 6px;
    border: 1px solid #cccccc5e;
    box-shadow: 3px 3px 3px #cccccc5e;
    margin-bottom: 8px !important;
  }
  & .ant-list-items .ant-list-item.item .ant-list-item-meta {
    padding-left: 8px !important;
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    padding-right: 8px !important;
  }
  & .ant-list-items .ant-list-item.item-steps .ant-list-item-meta {
    padding-left: 0px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-right: 0px !important;
  }
  & .item-steps .ant-list-item-meta-title {
    padding-left: 0px !important;
  }
  & .item-steps .title {
    padding-left: 8px !important;
  }
  & .actions {
    padding: 0px;
    margin-bottom: 8px !important;
    background: #fcd784;
  }
  & .actions .ant-steps-item-title,
  .actions .ant-steps-icon {
    color: #fff !important;
    font-weight: 400 !important;
    font-size: 14px !important;
  }
  & .actions .ant-steps-item-title {
    font-weight: normal !important;
  }
  & .actions .ant-steps-item-content > .ant-steps-item-title::after {
    background: #fff !important;
  }
  /* & .actions {
    background: #fcd784;
  } */
  & .actions.printed{
    background:#fcd784!important;
  }
  & .ant-steps-item{
    padding: 0px 4px;
  }
  & .printed .step-uno::before {
    content: '';
    height: 40px;
    width: 50%;
    background: #88FC84!important;
    width: 80%;
    left: -9px;
    position: absolute;
  }
  & .actions.delivery_assigned{
    background:#88FC84;
  }
   /* & .actions.active {
     background: #red!important;
     color: #fff !important;
   } */
   & .actions.in_progress {
     background: #88FC84!important;
     color: #fff !important;
   }
  & .actions .delivery {
    background: #88fc84 !important;
    color: #fff !important;
  }
  & .actions.shipped {
    background: #88FC84!important;
    color: #fff !important;
  }
  & .actions i.anticon.anticon-check-circle {
    vertical-align: middle !important;
  }
  & .actions .ant-steps-item-container {
    display: flex;
    align-items: center;
  }
  & .actions.ready_for_shipping {
    background: #fcd784 !important;
  }
  & .item-steps .ant-list-item-meta-title {
    padding-left: 8px;
  }
  & h4.ant-list-item-meta-title {
    color: #6B24F8;
    font-size: 14px !important;
    font-weight: bold !important;
    margin-bottom: 0px !important;
    line-height: 16px !important;
    padding-left: 8px;
  }
  & .name span {
    text-transform: Capitalize;
    color: black;
  }
  & .price span {
    color: black;
  }
  & .created-at {
    color: black;
    padding-left: 8px;
  }
  & .footer-actions button.ant-btn.ant-btn-ghost {
    border-radius: 30px !important;
    border-color: var(--color-primary) !important;
    color: var(--color-primary) !important;
    font-size: 12px !important;
  }
  & .delivery-man {
    font-size: 12px !important;
    line-height: 1.4 !important;
  }
  & .delivery-id span {
    font-weight: 600;
  }
  & .footer {
    border-top: 1px solid #cccccc6b;
    margin-top: 0px;
    padding-top: 0px;
  }
  & .footer > div {
    margin: 4px 8px;
  }
  & .name,
  .price {
    padding-left: 8px;
  }
  & .item-steps .ant-list-item-meta-description {
    padding-left: 0px !important;
  }
`;
export const WrapperHealineOrders = styled.div`
  & .sections-title-orders {
    padding: 5px;
    margin-left: 10px;
  }
  & .sections-Domicilio {
    margin-right: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
  }
  & .sections-Domicilio h4 {
    font-size: 14px !important;
    margin-bottom: 0px !important;
    margin-right: 4px;
    margin-left: 4px;
  }
`;
export const WrapperItem = styled.div`
    width:100%;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 10px 10px!important;
    & .ant-list-item-meta-title .title{
        font-size:20px!important;
        text-transform: uppercase !important;
    }
    & .ant-list-item-meta-title .title h2{
        margin-bottom:0px!important;
    }
    & .ant-avatar-image{
        height:80px!important;
        width:80px!important;
    }
    & .title-container{
        display: flex;
        justify-content:space-between;
        align-items: center
    }
    & .price {
        font-size: 24px!important;
        font-weight: bold!important;
        color: rgb(0,0,0,.75)!important;
    }
    /* este codigo es dl cito-sections*/
    
    & .name {
        font-size: 14px;
        color: #0000007d;
        
    }
     & .sections-descriptions-personalization {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    & .section-color-quantity{
       color:#6320c6;
       margin-right: 7px;
       font-size: 14px;
    }
    & .avatar-container{
        display: flex;
        justify-content:space-between;
        align-items: top;
    }
    & .container-quantity-avatar {
        display: flex;
    }
    & .quantity-line{
            /* background: blanchedalmond; */
            max-height: 250px;
            padding:4px;
        }
    & .quantity-line h3{
        color:#6360D7!important;
        margin-bottom:0px!important;
        /* padding-top:60px; */
    }
    & .section-meta-option-name {
        font-size: 14px;
        font-weight: 600;
      }
`;
export const WrapperOrderDetail = styled.div`
  /* & .ant-list-item-meta {
    padding-top: 20px !important;
  } */
  & .col-item {
    padding-left: 20px !important;
    padding-top: 20px;
    padding-right: 0px !important;
  }
  & .col-item-sections {
    background: #fff;
  }
  & .client-information {
    padding: 5px !important;
  }
  &.client-information.in_progress .section-col-title-section-box {
    background: #fff;
  }
  &.client-information.active .section-col-title-section-box {
    background: #fff;
  }
  &.client-information.shipped .section-col-title-section-box {
    background: #fff;
  }
  &.client-information.ready_for_shipping .section-col-title-section-box {
    background: #fff;
  }
  &.client-information.ready_for_pickup .section-col-title-section-box {
    background: #fff;
  }
  &.client-information .section-col-title-section-box {
    background: #fab937fa;
    display: flex;
    justify-content: center;
  }
  & .section-col-title-section-box {
    margin: 0px 0px 0px 0px;
  }
  & .section-col-title {
    background: #fff;
    box-shadow: 0px 3px 3px #dcdcdc;
  }
  & .section-avartar-name {
    display: flex;
    align-items: center;
    justify-content: end;
  }
  & .ant-avatar-image {
    background: transparent;
    margin-right: 10px;
    width: 62px !important;
    height: 61px !important;
  }
  & .container-informations-avatar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & .section-list-container-orders {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & .section-list-order h5 {
    font-size: 12px !important;
    text-align: center;
  }
  & .section-list-order {
    padding: 6px;
    border-radius: 3px;
    border: 1px solid lightgray;
  }
  & .list-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & .section-title-informations {
    padding-top: 10px;
    margin-bottom: 8px;
  }
  & .section-addres-map-title {
    padding-top: 20px;
    margin-bottom: 17px;
  }
  & .section-addres-name {
    text-transform: capitalize;
  }
  & .section-addres-map-title span {
    font-weight: bold;
    color: #464646;
  }
  & .list-addres-sections span {
    font-weight: 600;
  }
  & .section-map {
    width: 260px !important;
    height: 138px !important;
  }
  & .app-map {
    height: 53% !important;
    width: 100% !important;
  }
  & .section-addres-map-information {
    display: flex;
    justify-content: space-between;
  }

  /* section metodo de pago */

  & .section-pyament-container {
    font-weight: bold;
    color: #464646;
  }
  & .section-payments {
    padding-top: 20px;
  }
  & .sections-card-visa {
    display: flex;
  }
  & .sections-card-visa img {
    width: 53px;
  }
  & .sections-card-visa .cc-interior {
    margin-left: 5px;
  }
  & .sections-card-visa .cc-interior-name {
    font-weight: 500;
  }
  & .section-card-approved {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & .sections-head-line {
    display: flex;
    justify-content: space-between;
    padding-top: 17px;
  }
  & .sections-total-prices {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-right: 5px;
  }
  & .sections-headRight {
    vertical-align: middle;
    display: flex;
    align-items: center;
  }
  & .sections-headRight-message {
    background: white;
    padding: 2px;
  }
  & .sections-headRight h3 {
    color: #fff !important;
    text-align: center;
    text-transform: uppercase;
    font-size: 18px;
    width: 100%;
  }
  /* seccion botones de pago */
  & .sectios-row-container {
    padding-top: 20px !important;
  }
  & .buttom-modal {
    color: #fff;
    background-color: var(--board-color-green-light);
    border-color: var(--board-color-green-light);
    width: 100% !important;
  }
  & .accept-payment {
    color: #fff;
    background-color: var(--board-color-blue);
    border-color: var(--board-color-blue);
    width: 100% !important;
  }
  & .sections-button-rejected {
    width: 100%;
    color: red;
    font-weight: 600 !important;
  }
  & .buttom-modal:hover {
    color: #52c41a;
    background-color: #fff;
    border-color: #52c41a;
  }
  & .informations-title span {
    font-weight: bold;
    color: #464646;
  }
`;
export const Badge = styled.div`
color:${props => props.color ? props.color : '#fff '};
font-size: ${props => props.size ? `${props => props.size}em` : '0.8em'};
background:${props => props.background ? props.background : props.color ? 'rgb(107,36,248,0.3)' : '#000'};
width:auto;
align-items:center;
padding: 5px;
border-radius:5px;
`;
export const Box = styled.div`
/* background: #FFF;
padding: 10px;
margin-bottom: 4px;
box-shadow: 3px 3px 3px #cccccc7a;
border: 1px solid #cccccc7a; */
& .ant-list-grid .ant-col > .ant-list-item {
    display: block;
    max-width: 100%;
    margin-bottom: 16px;
    padding-top: 0;
    padding-bottom: 0;
    border-bottom: none;
    background: #fff;
    margin-right: 8px;

}
`;
export const WrapperHeadLineRight = styled.div`
  width: 100% !important;
  & .section-color-Green {
    background: #88fc84;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    align-items: center;
    height: 30px;
  }
  & .sections-color-row {
    /*  display: contents !important; */
    background: #f1f1f1;
  }
  & .section-color-brown {
    background: #feae0f;
    font-size: 14px;
    color: #fff;
    font-weight: 600;
    display: flex;
    align-items: center;
    height: 30px;
  }
  & .sections-link-styles {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px;
  }
  & .sections-link-pickup {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  & .section-images {
    width: 227px;
    /*  background: aquamarine; */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & .section-delivery {
    display: flex;
    justify-content: end;
  }
  & .section-assign {
    width: 200px;
    margin-left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & .section-buttom-printed.ant-btn-link {
    /* background: aqua; */
    width: 100%;
  }
  & .section-send-picked_by_delivery {
    display: flex;
    /* background: aqua; */
    width: 42%;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  & .sections-picked up {
    display: flex;
    /* background: aqua; */
    width: 42%;
    justify-content: center;
    align-items: center;
  }

  & .section-img {
    display: flex;
    align-items: center;
    text-align: center;
  }
  & .section-img .section-buttom-printed {
    /* width: 20px!important;  */
  }
  & .section-img img {
    width: 26px !important;
    height: 24px !important;
    margin-right: 0px;
    margin-left: 2px;
  }
  /*  & .section-images img {
    width: 26px !important;
    height: 24px !important;
    margin-right: 0px;
    margin-left: 11px;
  } */
  & .section-headline-container {
    display: flex;
    justify-content: space-between;
  }
  & .title-head {
    height: 80px !important;
    margin: 0px 0px 8px 0px;
    background: #fff;
    padding: 10px;
    box-shadow: 0px 3px 3px #dcdcdc;
  }
  & .anticon {
    margin-left: 7px;
    margin-right: 7px;
  }
  & .ant-btn-link:hover,
  .ant-btn-link:focus {
    color: #f5222d;
  }
`;
export const WrapperList = styled.div`
  & .product-list {
    max-height: 477px;
    overflow-y: auto !important;
    overflow-x: hidden !important;
  }
  & .product-list::-webkit-scrollbar-track {
    border-radius: 0px !important;
    background-color: transparent !important;
  }

  & .product-list::-webkit-scrollbar {
    width: 5px !important;
    background-color: transparent !important;
  }

  & .product-list::-webkit-scrollbar-thumb {
    border-radius: 10px !important;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)!important; */
    background-color: lightgray !important;
  }
  & .product-list::-webkit-scrollbar {
    width: 10px !important;
  }
`;
export const WrapperClientInformation = styled.div`
  & .section-avartar-title-name h5{
    text-transform: capitalize;
  }
  & .app-map {
    height: 30% !important;
  }
  & .section-avartar-title-name h5 {
    margin-bottom: 0px !important;
    font-size: 15px;
  }
  & .section-approved {
    /* background: aquamarine; */
    /*  height: 55px; */
    width: 50%;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  & .section-approved span {
    font-size: 16px;
    line-height: 20px;
    display: flex;
    padding: 8px;
    font-weight: 600;
    justify-content: center;
  }

  &.client-information .section-approved {
    border: 2px solid #88fc84;
    color: #88fc84;
  }

  &.client-information .section-approved span {
    text-align: center;
  }
  & .section-not-approved {
    /* background: aquamarine; */
    /*  height: 55px; */
    width: 50%;
    justify-content: center;
    display: flex;
    align-items: center;
  }
 
  & .section-not-approved span {
    font-size: 16px;
    line-height: 20px;
    display: flex;
    padding: 8px;
    font-weight: 600;
    justify-content: center;
  }

  &.client-information .section-not-approved {
    border: 2px solid #fab937fa;
    color: #fab937fa;
  }

  &.client-information .section-not-approved span {
    text-align: center;
  }

  &.client-information.in_progress .section-col-title {
    /*   height: 80px!important;
    margin: 0px 0px 8px 0px;
    background: #fff;
    box-shadow: 0px 3px 3px #dcdcdc; */
    padding: 10px;
  }

  &.client-information.in_progress .section-approved {
    border: 2px solid var(--board-color-green-light);
    color: var(--board-color-green-light);
  }
  &.client-information.in_progress .section-col-title {
    /* height: 80px!important;
        margin: 0px 0px 8px 0px;
        background: #fff; */
    /*  box-shadow: 0px 3px 3px #dcdcdc; */
    padding: 0px;
  }
  &.client-information.in_progress .section-card-approved {
    margin-bottom: 25px;
  }
  /* stilos del boton marcar pedido dentro de la modal */
  & .sections-botton-status {
      padding-top: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  & .sections-status-type {
      border-radius: 30px !important;
      border-color: var(--color-primary) !important;
      color: var(--color-primary) !important;
      font-size: 15px !important;
    }
`;
export const WrapperModal = styled.div`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius:5%;
  background:  #fff;
`;
export const Card = styled(Col)`
  margin: 0px 6px;
  min-width:  ${props => props.type === 'purple' ? '15rem' : '10rem'};
  color: ${props => props.type === 'purple' ? '#fff' : '#000'};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius:1rem;
  background-color: ${props => props.type === 'purple'
    ? 'var(--purple)'
    : ' #fff '};

  padding: 1rem;
  overflow: hidden;
  position: relative;
  & .purple-title .ant-col{
    width: 100%;
  }
  & .title {
      color: ${props => props.type === 'purple' ? '#fff' : '#6B24F8'};
      font-size: ${props => props.type === 'purple' ? '1.5em' : '2em'};
      line-height:1em;
      font-weight:bold;
  }
  & .ant-space{
    width: 100%;
  }

  & .grafismo{
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: end;
    top: -50px;
    right:-50px;
  }

  @media (max-width: 768px){
    font-size:1em !important;
    min-width:  auto;
    width:  ${props => props.type === 'purple' ? '100%' : '46%'};
    & .title {
      font-size: ${props => props.type === 'purple' ? '1.5em !important' : '1.7em !important'};
    }
    & .purple-title .ant-col{
      width: auto;
      margin-right: 8px;
    }
  }
  @media (max-width: 500px){
    font-size:0.8em !important;
    & .title {
      font-size: ${props => props.type === 'purple' ? '1.5em !important' : '1.7em !important'};
    }
  }
`;

export const ChartContainer = styled.div`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius:1rem;
  background: #fff ;
  padding: 2rem 1.4rem;
`;

export const DetailReservationContainer = styled(Row)`
    position: sticky;
    top:0px;
    background: rgb(0,0,0,0.1);
    height:100%;
    width:100%;
    z-index:2;
    padding: 1rem;
    transition: all 0.5s linear;
    overflow: auto;
    max-height: 100vh;
    padding-bottom:68px;
`;
export const Modal = styled(Row)`
     background: white;
     padding: 1.5rem;
     box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
     border-radius:1rem;
`;

export const SelectStyled = styled(Select)`
width: 15rem; 
border-bottom: 1px solid #000;
& .ant-select-arrow{
    color: var(--purple);
    font-size:1rem;
}
`;

export const ScheduleWrapper = styled(Row)`
  & .scheduleColumnHour{
    width: 15% !important;
  }
  & .scheduleColumnReservation{
    width: 85% !important;
  }
  @media (max-width:1398px){
    & .scheduleColumnHour{
    width: 18% !important;
    }
    & .scheduleColumnReservation{
      width: 82% !important;
    }
  }
  @media (max-width:1199px){
    & .scheduleColumnHour{
    width: 15% !important;
    }
    & .scheduleColumnReservation{
      width: 85% !important;
    }
  }
  @media (max-width:1087px){
    & .scheduleColumnHour{
    width: 18% !important;
    }
    & .scheduleColumnReservation{
      width: 82% !important;
    }
  }
  @media (max-width:768px){
    & .scheduleColumnHour{
    width: 15% !important;
    }
    & .scheduleColumnReservation{
      width: 85% !important;
    }
  }
  @media (max-width:417px){
    & .scheduleColumnHour h5.ant-typography{
      font-size: 12px !important;
    }
  }
`;