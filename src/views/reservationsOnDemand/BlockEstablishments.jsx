import { useState } from "react";
import { Grid } from "../../components/com";
import { RoundedButton } from "../../components/com/grid/Styles";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { Button, Drawer, Input, message } from "antd";
import { SimpleForm } from "../../components/com/form/";
import AsyncButton from "../../components/asyncButton";
import { getService } from "../../services";



const columns = ({ onEdit, onRemove }) => [
    {
        key: "id",
        dataIndex: "id",
        title: "Id",
        sorter: true,
    },
    {
        key: "name",
        dataIndex: "name",
        title: "Nombre",
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

const BlockEstablishments = () => {

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);

    const onEdit = (record) => {
        setSelectedReservation({
            ...record,
        });
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        const reservationsOnDemandBlockListService = getService('reservation-on-demand-block-list-establishments');
        await reservationsOnDemandBlockListService.remove(id)
            .then(() => {
                message.success("Establecimiento eliminado de la lista!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el establecimiento! ' + error?.message)
            )
    };

    return (
        <>
            <Grid
                source="reservation-on-demand-block-list-establishments"
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
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedReservation ? 'Editar' : 'Crear'} Reserva`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedReservation();
                    }}
                >
                    <SimpleForm
                        source="reservation-on-demand-block-list-establishments"
                        textAcceptButton={`${selectedReservation ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedReservation}
                        id={selectedReservation?.id}
                        onSubmit={() => {
                            setDrawerVisible(false);
                            setSelectedReservation();
                            setUpdateSource(!updateSource);
                        }}
                    >
                        <Input
                            flex={1}
                            label="Nombre establecimiento"
                            size='large'
                            name="name"
                            validations={[
                                {
                                    required: true,
                                    message: `Nombre es requerido`
                                }
                            ]}
                        />

                    </SimpleForm>
                </Drawer>
            }
        </>
    )
}

export default BlockEstablishments;