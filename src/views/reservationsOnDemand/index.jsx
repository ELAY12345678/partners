import React from 'react';
import { Layout, Tabs } from 'antd';
import { TabsStyled } from '../../components/Styles';

import Reservations from './Reservations';
import BlockEstablishments from './BlockEstablishments';

const ReservationsOnDemandManager = () => {

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey="1">
                <Tabs.TabPane tab="Apparta donde quieras" key="1">
                    <Reservations />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Establecimientos bloqueados" key="2">
                    <BlockEstablishments />
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default ReservationsOnDemandManager;