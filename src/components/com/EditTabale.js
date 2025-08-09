import React, { useEffect, useState } from "react";
import moment from 'moment';
import { Table, Input, InputNumber, Popconfirm, Form, Select, Button, message, TimePicker, ConfigProvider, Empty, DatePicker } from 'antd';
import { getService } from "../../services";
import { AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import deleteIcon from '../../sources/icons/delete.svg';
import editIcon from '../../sources/icons/edit.svg';
import closeIcon from '../../sources/icons/closeGray.svg';
import AsyncButton from "../asyncButton";
import { MINUTES_STEPS_FOR_DISCOUNTS } from "../../constants";

const format = 'hh:mm a';
const { Option } = Select;
const EditableContext = React.createContext();

const SelectField = ({ input, record, onChange, onSearch, source, dataIndex, placeholder, reference, allowClear, ...props }) => {

    const [choices, setChoices] = useState();
    const [optionText, setOptionText] = useState();
    const [optionValue, setOptionValue] = useState();
    const [loading, setLoading] = useState(false);
    const getData = async () => {
        if (reference) {

            const service = getService(reference);
            setLoading(true);
            await service.find({})
                .then(({ data }) => {
                    setLoading(false);
                    setOptionText(
                        data.find(it => (record[source || dataIndex] === it.id))?.[optionText || "name"]
                    )
                    setChoices(data);

                })
                .catch(err => {
                    setLoading(false);
                    message.error(err.message)
                });
        }
    }
    useEffect(() => {
        if (props.choices) {
            setChoices(props.choices);
            let choices = props.choices || [];
            let value = choices.filter(it => (it.id == record[dataIndex]));
            let text = value.length > 0 ? value[0]["name"] : "";
            value = value.length > 0 ? value[0]["id"] : "";
            setOptionText(text);
            setOptionValue(value);
        } else if (record[source || dataIndex]) {
            setOptionText(record[source || dataIndex]["name"]);
            setOptionValue(record[source || dataIndex]["id"]);
        }
        if (reference) {
            getData();
        }
    }, [record])

    return (
        input ? <Select
            loading={loading}
            defaultValue={optionValue || record[dataIndex]}
            showSearch
            style={props.style || { width: 200 }}
            placeholder={placeholder || "Seleccione un registro"}
            optionFilterProp="children"
            onChange={(value) => { onChange(dataIndex, value ? value : null) }}
            onSearch={onSearch}
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            allowClear={allowClear}
        >
            {choices && choices.map(it => (<Option value={it[it.optionValue || "id"]}>
                {it[it.optionText || "name"]}
            </Option>))}
        </Select> : <>{optionText}</>);
}


class EditableCell extends React.Component {

    getInput = ({ defaultValue }) => {

        const { xtype, name, placeholder, onChange, onSearch, choices, source, record, dataIndex, formatter, parser } = this.props;

        switch (xtype) {
            case 'numberfield':
                return <InputNumber
                    min={0}
                    formatter={formatter}
                    parser={parser}
                />;
                break;
            case 'timefield':
                return <TimePicker
                    minuteStep={MINUTES_STEPS_FOR_DISCOUNTS}
                    use12Hours
                    placeholder={placeholder}
                    name={name}
                    format={format}
                />
                break;
            case 'selectfield':
                return <SelectField
                    input {...this.props}
                />
                break;
            case 'datefield':
                return <DatePicker
                    showTime={!!this.props?.showTime}
                    style={{ width: 150 }}
                />
                break;
            default:
                return <Input />;
                break;
        }
    };

    renderField = () => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            xtype,
            record,
            name,
            index,
            children,
            ...restProps
        } = this.props;

        switch (xtype) {
            case 'selectfield':
                return <SelectField {...this.props} />
                break;
            case 'timefield':
                return `${moment(moment(record[dataIndex], format))
                    .format("hh:mm a")
                    }`;
                break;
            default:
                return children;
                break;
        }
    }

    renderCell = (form) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            xtype,
            record,
            index,
            children,
            required,
            dependencyField,
            dependencyCondition,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues[dataIndex] !== currentValues[dataIndex] || (dependencyField && prevValues[dependencyField] !== currentValues[dependencyField])}
                    >
                        {({ getFieldValue }) =>
                            (dependencyField && dependencyCondition && getFieldValue(dependencyField) === dependencyCondition) || (!dependencyField && !dependencyCondition) ? (
                                <Form.Item
                                    style={{ margin: 0 }}
                                    name={dataIndex}
                                    rules={[
                                        {
                                            required: required ? required : false,
                                            message: `Please Input ${title}!`,
                                        },
                                    ]}
                                >
                                    {this.getInput({
                                        record,
                                        defaultValue: xtype === "timefield"
                                            ? moment(moment(record[dataIndex], format))
                                            : xtype === "datefield"
                                                ? moment(record[dataIndex])
                                                : record[dataIndex]
                                    })}
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                ) : (
                    this.renderField(this.props)
                )
                }
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class EditableTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editingKey: '',
            actions: props.actions || {
                edit: props.isAdmin,
                delete: props.isAdmin,
            }
        };
        this.columns = [
            ...this.props.columns,
        ];
        if (this.state.actions.edit || this.state.actions.delete) {
            this.columns = [...this.columns,
            {
                title: 'Acciones',
                dataIndex: 'operation',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <AsyncButton
                                        type="primary"
                                        onClick={() => this.save(form, record)}
                                        style={{ marginRight: 8, borderRadius: '0.5rem' }}
                                        icon={<AiOutlineSave />}
                                    />
                                )}
                            </EditableContext.Consumer>
                            <EditableContext.Consumer>
                                {form => (
                                    <Popconfirm title="Desea Cancelar?" onConfirm={() => {
                                        this.cancel(record.key);
                                    }}>
                                        <Button
                                            type="text"
                                            icon={<img src={closeIcon} alt="Cerrar" />}
                                        />
                                    </Popconfirm>
                                )}
                            </EditableContext.Consumer>

                        </span>
                    ) : (<>
                        {this.state.actions.edit &&
                            <EditableContext.Consumer>
                                {form => (
                                    <Button
                                        icon={<img src={editIcon} alt="Editar" />}
                                        type="text"
                                        disabled={editingKey !== ''}
                                        onClick={() => {
                                            this.edit(record.key)
                                            form.setFieldsValue({
                                                ...record,
                                                start_hour: moment(moment(record?.start_hour, format)),
                                                end_hour: moment(moment(record?.end_hour, format)),
                                                inactive_until: record?.inactive_until ? moment(record?.inactive_until) : null
                                            });
                                        }}
                                    >
                                    </Button>
                                )}
                            </EditableContext.Consumer>
                        }
                        {
                            this.state.actions.delete &&
                            <AsyncButton
                                type="text"
                                icon={<img src={deleteIcon} alt="Eliminar" />}
                                onClick={() => this.delete({ id: record.key })}
                            />
                        }
                    </>
                    );
                },
            },
            ]
        }
    }

    handleChange = (key, value) => {
        console.log(key, value)
        if (this.props.onChange) this.props.onChange(key, value, this.props.form);
        this.props.form.setFieldsValue({
            [key]: value
        });
    };

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save = async (form, record) => {

        await form.validateFields()
            .then(async () => {
                if (this.props.onSubmit)
                    await Promise.resolve(
                        this.props.onSubmit({
                            id: record.id,
                            ...form.getFieldsValue()
                        }, record)
                    ).then(() => {
                        this.cancel(record.key);
                    });
            })
            .catch(() => console.log('No valido'))
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    delete = async (key) => {
        if (this.props.onDelete)
            await this.props.onDelete(key);
    }

    componentWillReceiveProps(nextProps) {
        let { dataSource } = nextProps;
        if (dataSource !== this.state.data)
            this.setState({
                data: dataSource
            });
    }

    componentDidMount() {
        let { dataSource } = this.props;
        this.setState({
            data: dataSource
        });
    }

    renderEmpty = () => {

        if (this.props.renderEmpty)
            return this.props.renderEmpty();

        let { source } = this.props;
        return (<>
            <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                imageStyle={{
                    height: 60,
                }}
                description={
                    <span>
                        {this.props.newTextDescription ? this.props.newTextDescription : "Aún no hay registros, empieza agregando uno nuevo"}
                    </span>
                }
            >
                {this.props.onNew && <Button
                    onClick={() => this.props.onNew()}
                    size="large"
                    type="primary">
                    {this.props.newText || <span> <AiOutlinePlus /> {" "}AGREGAR</span>}
                </Button>}
            </Empty>
        </>);
    }

    render() {

        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    xtype: col.xtype,
                    choices: col.choices,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                    onChange: this.handleChange,
                    ...col
                }),
            };
        });

        return (
            <ConfigProvider renderEmpty={this.renderEmpty}>
                <EditableContext.Provider value={this.props.form}>
                    <Table
                        size="small"
                        bordered={false}
                        loading={this.props.loading}
                        rowKey={this.props.rowKey || "id"}
                        components={components}
                        dataSource={this.state.data && this.state.data.map(it => ({
                            key: it.id,
                            ...it
                        }))}
                        columns={columns}
                        showHeader
                        scroll={this.props.scroll}
                        onExpand={this.props.onExpand}
                        expandedRowRender={this.props.expandedRowRender}
                        pagination={false}
                    />
                </EditableContext.Provider>
            </ConfigProvider>
        );
    }
}

const EditableFormTable = (props) => {

    const [form] = Form.useForm();

    return <Form form={form}  ><EditableTable {...props} form={form} /></Form>
};

export default EditableFormTable;