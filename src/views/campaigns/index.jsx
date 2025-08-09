import React from 'react';
import { Layout, Tabs } from 'antd';

import { TabsStyled } from '../../components/Styles';
import Campaigns from './Campaigns';
import CampaignsAppartaPay from './CampaignAppartaPay';

const CampaignsTabs = () => {

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey="1">
                <Tabs.TabPane tab="Campañas" key="1">
                    <Campaigns />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Campañas de AppartaPay" key="2">
                    <CampaignsAppartaPay />
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default CampaignsTabs;