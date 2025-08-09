import { Button, Drawer, Input, message, Select } from "antd";
import _ from "lodash";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import AsyncButton from "../../../components/asyncButton";
import { Grid } from "../../../components/com";
import { SimpleForm } from "../../../components/com/form/";
import { RoundedButton } from "../../../components/com/grid/Styles";
import { useBanks } from "../../../hooks/useBanks";
import { getService } from "../../../services";

const ACCOUNT_TYPES = [
    {
        id: "current",
        name: "Corriente",
    },
    {
        id: "saving",
        name: "Ahorros",
    },
];

const IDENTIFY_NUMBER = [
    {
        id: "id",
        name: "Cédula",
    },
    {
        id: "foreigner_id",
        name: "Cédula de extranjería",
    },
    {
        id: "passport",
        name: "Pasaporte",
    },
    {
        id: "ti",
        name: "Tarjeta de identidad",
    },
    {
        id: "nit",
        name: "NIT",
    }
];

const SelectField = ({ choices, ...rest }) => {
    return (
        <Select
            {...rest}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            {
                _.map(choices, ({ id, name }, index) =>
                    <Select.Option
                        key={index}
                        value={id}
                    >
                        {name}
                    </Select.Option>
                )
            }
        </Select>
    );
};

const columns = ({ onRemove, onEdit }) => [
    {
        key: "id",
        dataIndex: "id",
        title: "Id",
        sorter: true,
    },
    {
        key: "bank_id",
        dataIndex: "bank_id",
        title: "Nombre del Banco",
        render: (value, record) => `${record?.bank?.name || value}`
    },
    {
        key: "account_number",
        dataIndex: "account_number",
        title: "Numero de cuenta",
    },
    {
        key: "account_type",
        dataIndex: "account_type",
        title: "Tipo de cuenta",
        render: (value) => _.find(ACCOUNT_TYPES, ({ id }) => id === value)?.name
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        key: 'actions',
        render: (id, record) =>
            <>
                <Button
                    type="text"
                    onClick={() => onEdit(record)}
                    icon={<AiOutlineEdit />}
                />
                <AsyncButton
                    type="link"
                    onClick={() => onRemove({ id })}
                    icon={<AiOutlineDelete />}
                    confirmText="Desea eliminar?"
                >
                </AsyncButton>
            </>
    }
];

const BankAccounts = ({ pay_account_id, establishment_branch_id }) => {

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState();

    const [banks] = useBanks();

    const onEdit = (record) => {
        setSelectedAccount(record);
        setDrawerVisible(true);
    }

    const onRemove = async ({ id }) => {

        const payBankService = getService('pay-banks');

        await payBankService.remove(id)
            .then(() => {
                message.success("Cuenta eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };


    return (
        <>
            <Grid
                source='pay-banks'
                custom={true}
                filterDefaultValues={{
                    pay_account_id,
                    $sort: {
                        createdAt: -1
                    },
                    transaction_type: 'pay',
                }}
                actions={{}}
                updateSource={updateSource}
                columns={columns({ onRemove, onEdit })}
                extra={
                    <>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Agregar
                        </RoundedButton>
                    </>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    placement="right"
                    title={`${selectedAccount ? 'Editar' : 'Crear'} Sucursal`}
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedAccount();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={`${selectedAccount ? 'Editar' : 'Crear'}`}
                        scrollToFirstError
                        initialValues={selectedAccount}
                        source='pay-banks'
                        id={selectedAccount?.id}
                        onSubmit={() => {
                            setDrawerVisible(false);
                            setUpdateSource(!updateSource);
                            setSelectedAccount();
                        }}
                    >
                        {
                            !selectedAccount?.id &&
                            <Input
                                type='hidden'
                                name='pay_account_id'
                                initial={pay_account_id}
                            />
                        }
                        {
                            !selectedAccount?.id &&
                            <Input
                                type='hidden'
                                name='establishment_branch_id'
                                initial={establishment_branch_id}
                            />
                        }
                        {
                            !selectedAccount?.id &&
                            <Input
                                type='hidden'
                                name='transaction_type'
                                initial={'pay'}
                            />
                        }
                        <SelectField
                            flex={1}
                            label='Banco'
                            name="bank_id"
                            choices={banks}
                            validations={[{ required: true, message: 'Banco es requerido' }]}
                        />
                        <Input
                            flex={1}
                            label='Razón social'
                            name="legal_name"
                            validations={[{ required: true, message: 'Razón social es requerida' }]}
                        />
                        <Input
                            flex={1}
                            label='Numero de cuenta'
                            name="account_number"
                            validations={[{ required: true, message: 'Numero de cuenta es requerido' }]}
                        />
                        <SelectField
                            flex={1}
                            label='Tipo de cuenta'
                            name="account_type"
                            choices={ACCOUNT_TYPES}
                            validations={[{ required: true, message: 'Tipo de cuenta es requerido' }]}
                        />
                        <Input
                            flex={1}
                            label='Numero de documento'
                            name="document"
                            validations={[{ required: true, message: 'Numero de documento es requerido' }]}
                        />
                        <SelectField
                            flex={1}
                            label='Tipo de documento'
                            name="document_type"
                            choices={IDENTIFY_NUMBER}
                            validations={[{ required: true, message: 'Tipo de documento es requerido' }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default BankAccounts;