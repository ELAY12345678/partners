import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';

const AsyncButton = ({ onClick, confirmText, placement, ...rest }) => {

    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (onClick) {
            setLoading(true)
            await Promise.all([onClick()]).then(respuesta => respuesta)
            setLoading(false)
        }
    }

    if (confirmText) {
        return (
            <Popconfirm
                title={confirmText}
                placement={placement}
                okText="Si"
                cancelText="No"
                disabled={rest.disabled}
                onConfirm={async () => await handleClick()}
            >
                <Button loading={loading} {...rest}/>
            </Popconfirm>
        );
    } else {
        return (
            <Button loading={loading} {...rest} onClick={async () => await handleClick()} />
        );
    }
}
export default AsyncButton;