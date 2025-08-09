import React from 'react';
import { Layout, Tabs } from 'antd';

import { TabsStyled } from '../../components/Styles';
import Invoices from './view/invoices';
import PaymentMethods from './view/paymentMethods';
import AccounStatus from './view/accounStatus';
import OldInvoices from './view/old-invoices';

const CampaignsTabs = () => {

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey="1">
                <Tabs.TabPane tab="Estado de cuenta" key="1">
                   <AccounStatus/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Facturas" key="2">
                   <Invoices/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Métodos de Pago" key="3">
                    <PaymentMethods/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Lista de Facturas Comisiones" key="4">
                    <OldInvoices/>
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default CampaignsTabs;