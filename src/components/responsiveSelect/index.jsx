import { Select } from "antd";
import _ from "lodash";

const { Option } = Select;

const ResponsiveSelect = ({ choices, valueField, labelField, ...props }) => {

    function detectMobOs() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /iPad Pro/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }
    function detectMobSize() {
        return ((window.innerWidth <= 700) && (window.innerHeight <= 1000));
    }

    if (detectMobOs() && detectMobSize())
        return (
            <>
                <div className="ant-select ant-select-borderless sc-kIPQKe dIxprC ant-select-single ant-select-show-arrow">
                    <div className="ant-select-selector">
                        <span className='ant-select-selection-search' >
                            <select
                                className='ant-select-selection-search-input'
                                placeholder="Seleccione una dirección"
                                {...props}
                                onChange={(event) => {
                                    if (props.onSelect)
                                        props.onSelect(event.target.value);
                                }}
                            >
                                {props?.placeholder && <option value="default">{props?.placeholder}</option>}
                                {
                                    _.map(
                                        choices,
                                        (item, index) =>
                                            <option
                                                aria-selected="false"
                                                key={index}
                                                value={item[valueField || 'id']}

                                            >
                                                {item[labelField || 'name']}
                                            </option>
                                    )
                                }
                            </select>
                        </span>
                    </div>
                    <span className="ant-select-arrow" unselectable="on" aria-hidden="true" style={{ userSelect: 'none' }}>
                        <span role="img" aria-label="down" className="anticon anticon-down ant-select-suffix">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
                                </path>
                            </svg>
                        </span>
                    </span>
                </div>
            </>
        )
    else return (
        <Select {...props}>
            {
                _.map(
                    choices,
                    (item, index) =>
                        <Option
                            key={index}
                            value={item[valueField || 'id']}
                        >
                            {item[labelField || 'name']}
                        </Option>
                )
            }
        </Select>
    )
}

export default ResponsiveSelect;