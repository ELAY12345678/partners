import styled from 'styled-components';


export const Wrapper = styled.div`
    & .qr-content{
        display:flex;
        justify-content:center;
        align-items:center;
    }
    & .qr-footer button{
        width:50%;
    }
    & .qr-footer{
        display:flex;
        justify-content:center;
        align-items:center;
        margin:8px;
    }
`