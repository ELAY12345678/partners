import React from 'react';
import { Layout, Tabs } from 'antd';
import Banners from './Banners';
import BannersSchedule from './BannersSchedule';
import { TabsStyled } from '../../components/Styles';
import { useBanners } from './hooks/useBanners';

const BannersManager = () => {

    const [banners, loadingBanners, getBanners] = useBanners();

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey="1">
                <Tabs.TabPane tab="Banners programación" key="1">
                    <BannersSchedule banners={banners} loadingBanners={loadingBanners} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Banners" key="2">
                    <Banners getBanners={getBanners} />
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default BannersManager;