import React from 'react';
import _ from 'lodash';
import { Button, Divider, Switch, Tooltip, message, Table } from 'antd';
import { MyModal } from '../../components/com';

import { FiExternalLink } from 'react-icons/fi';
import { getService } from '../../services';

const ModalAppartaMenu = ({ visible, setVisible, establishmentBranch, slug, getEstablishmenBranch, isAdmin }) => {

    const establishmentBranchService = getService("establishments-branchs");

    const handleChangeStatus = (id, payload) => {
        establishmentBranchService.patch(id, { ...payload })
            .then(() => {
                message.success('Estado actualizado!');
                getEstablishmenBranch();
            })
            .catch((err) => message.error('No se pudo actualizar el estado!', err))
    }

    return (
        <MyModal
            title={"AppartaMenu"}
            onCancel={() => {
                setVisible(false);
            }}
            visible={visible}
        >
            <Table
                pagination={false}
                dataSource={establishmentBranch}
                columns={[
                    { title: 'Ubicación', dataIndex: 'address', key: 'address' },
                    {
                        title: 'Estado',
                        dataIndex: 'apparta_menu_status',
                        key: 'apparta_menu_status',
                        render: (apparta_menu_status, { id }) =>
                            <Tooltip title={isAdmin ? null : 'Para activar o desactivar tu AppartaMenu contacta a tu Account Manager'}>
                                <Switch
                                    checked={apparta_menu_status === 'active'}
                                    onChange={(value) => isAdmin ? handleChangeStatus(id, { apparta_menu_status: value ? 'active' : 'disabled' }) : {}}
                                />
                            </Tooltip>
                    },
                    {
                        title: 'Enlace',
                        dataIndex: 'id',
                        key: 'id',
                        render: (id, { apparta_menu_status }) => <Button
                            type="link"
                            disabled={!slug || apparta_menu_status !== 'active'}
                            icon={<FiExternalLink />}
                            onClick={() => window.open(`https://menu.tu-mesa.com/${slug}/${id}/`, '_blank').focus()}
                        />
                    },
                ]}
            />
            <Divider style={{ background: 'transparent', borderTop: 0 }} />
        </MyModal>

    );
}

export default ModalAppartaMenu;
