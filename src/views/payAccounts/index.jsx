import React from 'react';
import { Layout, Tabs } from 'antd';

import { TabsStyled } from '../../components/Styles';
import BranchesAccounts from './BranchesAccounts';
import UsersAccounts from './UsersAccounts';
import PayPending from './PayPending';
import PayBenefits from './PayBenefits';

const CampaignsTabs = ({ location }) => {

    const defaultSelectedTab = location?.state?.defaultSelectedTab || '1';

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey={defaultSelectedTab}>
                <Tabs.TabPane tab="Sucursales" key="1">
                    <BranchesAccounts />
                </Tabs.TabPane>
                <Tabs.TabPane tab="usuarios" key="2">
                    <UsersAccounts />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Pagos pendientes" key="3">
                    <PayPending />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Beneficios" key="4">
                    <PayBenefits />
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default CampaignsTabs;