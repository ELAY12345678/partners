import React, { useState } from 'react';
import { Select } from 'antd';
import _ from 'lodash';

const AsyncSelect = ({ value, options, onChange, style }) => {

    const [isLoading, setIsLoading] = useState(false);

    const  handleChange = async(value) => {
        if (onChange) {
            setIsLoading(true)
            await Promise.all([onChange(value)])
            setIsLoading(false)
        }
    }

    return (
        <Select
            bordered={false}
            style={style ? style : { minWidth: '12rem' }}
            value={value}
            onChange={handleChange}
            loading={isLoading}
            disabled={isLoading}
        >
            {
                _.map(options, ({ id, name }, index) =>
                    <Select.Option key={index} value={id}>
                        {name}
                    </Select.Option>
                )
            }
        </Select>
    )
};

export default AsyncSelect;
