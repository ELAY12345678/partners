import styled from 'styled-components';

export const Wrapper = styled.div`

    & .arrow-left{
        position:absolute;
        left:20px;
    }
    & .arrow-right{
        position:absolute;
        right:20px;
    }
    & .ant-btn-icon-only.ant-btn-lg {
        width: 60px!important;
        height: 60px!important;
        font-size: 24px!important;
    }
`;
export const ItemWrapper = styled.div`
    display: flex!important;
    justify-content: center!important
    height: 80vh!important;
    margin-bottom:4px;
    
    & > div{
        max-width:1200px!important;
        overflow: hidden;
        margin:10px 0px;
    }

    & .slick-dots-bottom {
        bottom: 0px!important;
    }
    & .ant-carousel .slick-dots-bottom{
        bottom: 0px!important;
    }
    & .slick-dots-bottom{
        bottom: 0px!important;
    }
`;

export const ImageWrapper = styled.div`
    & img{
        object-fit:contain!important;
        max-width: 100%;
        height: auto;
    }
`
export const VideoWrapper = styled.div`
    & > div{
        width: 100%!important;
        height: 100%!important;
        min-width: 640px;
        min-height: 360px;

    }
`
export const AudioWrapper = styled.div`
    & > audio{
        width: 100%!important;
        height: 100%!important;
        min-width: 640px;
        min-height: 360px;

    }
`