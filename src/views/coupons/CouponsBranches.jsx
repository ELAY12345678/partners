import React, { useState } from 'react';
import { message, Button, Drawer, InputNumber } from 'antd';
import { Grid } from '../../components/com';
import { getService } from '../../services';
import { RoundedButton } from '../../components/com/grid/Styles';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { SimpleForm } from '../../components/com/form/';
import _ from 'lodash';
import { useCoupons } from './hooks/useCoupons';
import { useBranches } from './hooks/useBranches';

const columns = ({ onEdit, onRemove, coupons }) => [
    {
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
    },
    {
        dataIndex: "coupon_id",
        key: "coupon_id",
        title: "Cupón Id",
        sorter: true,
    },
    {
        dataIndex: "establishment_branch_id",
        key: "establishment_branch_id",
        title: "Sucursal Id",
        sorter: true,
    },
    {
        dataIndex: "coupon_id",
        key: "coupon_id_name",
        title: "Cupón",
        sorter: true,
        render: (value) => _.find(coupons, ({ id }) => id === value)?.name || value
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
]

const CouponsBranches = () => {

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState();
    const [dataCouponsId, setDataCouponsId] = useState([]);
    const [dataBranchesId, setDataBranchesId] = useState([]);

    const [coupons] = useCoupons(dataCouponsId);


    const onEdit = (record) => {
        setSelectedCoupon(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        const couponsService = getService('coupons-establishment-branch');
        await couponsService.remove(id)
            .then(() => {
                message.success("Cupón eliminado de la sucursal!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el cupón! ' + error?.message)
            )
    };

    return (
        <>
            <Grid
                source='coupons-establishment-branch'
                filterDefaultValues={{
                    $sort: {
                        id: 1
                    }
                }}
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove, coupons })}
                actions={{}}
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
                returnToParentData={(data) => {
                    setDataCouponsId(data.reduce((acc, { coupon_id }) => {
                        if (!acc.includes(coupon_id)) {
                            acc.push(coupon_id);
                        }
                        return acc;
                    }, []))
                    setDataBranchesId(data.reduce((acc, { establishment_branch_id }) => {
                        if (!acc.includes(establishment_branch_id)) {
                            acc.push(establishment_branch_id);
                        }
                        return acc;
                    }, []))
                }}
                filters={
                    <>
                        <InputNumber
                            alwaysOn
                            source="coupon_id"
                            name="coupon_id"
                            placeholder="Cupón  Id"
                            size="medium"
                            allowEmpty
                            style={{ width: '15rem' }}
                        />
                        <InputNumber
                            alwaysOn
                            source="establishment_branch_id"
                            name="establishment_branch_id"
                            placeholder="Sucursal  Id"
                            size="medium"
                            allowEmpty
                            style={{ width: '15rem' }}
                        />
                    </>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedCoupon ? 'Editar' : 'Añadir'} cupón a la sucursal`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedCoupon();
                    }}
                >
                    <SimpleForm
                        source='coupons-establishment-branch'
                        id={selectedCoupon?.id}
                        textAcceptButton={`${selectedCoupon ? 'Actualizar' : 'Añadir'}`}
                        initialValues={selectedCoupon}
                        onSubmit={() => {
                            setDrawerVisible(false);
                            setUpdateSource(!updateSource);
                            setSelectedCoupon();
                        }}
                    >
                        <InputNumber
                            flex={1}
                            name="coupon_id"
                            label="Cupón Id"
                            size='large'
                            validations={[{ required: true, message: "Cupón Id es requerido" }]}
                        />
                        <InputNumber
                            flex={1}
                            name="establishment_branch_id"
                            label="Sucursal Id"
                            size='large'
                            validations={[{ required: true, message: "Sucursal Id es requerida" }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default CouponsBranches;