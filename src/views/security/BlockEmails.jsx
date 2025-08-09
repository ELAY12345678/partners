import { useState } from "react";
import { Grid } from "../../components/com";
import { RoundedButton } from "../../components/com/grid/Styles";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { Button, Drawer, Input, message } from "antd";
import { SimpleForm } from "../../components/com/form/";
import AsyncButton from "../../components/asyncButton";
import { getService } from "../../services";
import _ from "lodash";


const columns = ({ onEdit, onRemove }) => [
    {
        key: "id",
        dataIndex: "id",
        title: "Id",
        sorter: true,
    },
    {
        key: "domain",
        dataIndex: "domain",
        title: "Dominio",
        sorter: true,
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

const BlockEmailsDomain = () => {

    const emailsBlockListService = getService('black-list-emails');


    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);

    const onEdit = (record) => {
        setSelectedDomain({
            ...record,
        });
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await emailsBlockListService.remove(id)
            .then(() => {
                message.success("Dominio eliminado de la lista!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el dominio! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);
        const { id, ...rest } = data;

        if (selectedDomain?.id) {
            await emailsBlockListService.patch(selectedDomain.id, { ...rest })
                .then(() => {
                    message.success("Dominio actualizada!");
                    setDrawerVisible(false);
                    setSelectedDomain();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await emailsBlockListService.create({ ...rest })
                .then(() => {
                    message.success("Dominio agregada correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <>
            <Grid
                source="black-list-emails"
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove })}
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    },
                }}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
                actions={{}}
                filters={
                    <>
                        <Input
                            source="domain"
                            name="domain"
                            label="domain"
                            placeholder="domain"
                            allowEmpty
                            size="medium"
                            style={{ width: '15rem' }}
                        />
                    </>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedDomain ? 'Editar' : 'Crear'}`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedDomain();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={`${selectedDomain ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedDomain}
                        onSubmit={handleSubmit}
                        allowNull={true}
                    >
                        <Input
                            flex={1}
                            label="Dominio"
                            size='large'
                            name="domain"
                            validations={[
                                {
                                    required: true,
                                    message: `Dominio es requerido`
                                }
                            ]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    )
}

export default BlockEmailsDomain;