import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Wrapper } from "./Styles"
const ModalView = ({ children, onCancel, visible, ...props }) => {
    const [open, setOpen] = useState(visible || false);
    useEffect(() => {
        setOpen(visible);
    }, [visible]);
    return (<>
        <Wrapper
            onCancel={() => {
                setOpen(false);
                if (onCancel)
                    onCancel()
            }}
            visible={open}
            {...props}>
            {children}
        </Wrapper>
    </>)
}

export default ModalView;