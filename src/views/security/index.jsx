import React from 'react';
import { Layout, Tabs } from 'antd';
import { TabsStyled } from '../../components/Styles';
import BlockIps from './BlockIps';
import BlockDevices from './BlockDevices';
import BlockEmailsDomain from './BlockEmails';


const ReservationsOnDemandManager = () => {

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey="1">
                <Tabs.TabPane tab="Ips bloqueadas" key="1">
                    <BlockIps />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Dispositivos bloqueados" key="2">
                    <BlockDevices />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Correos bloqueados" key="3">
                    <BlockEmailsDomain />
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default ReservationsOnDemandManager;