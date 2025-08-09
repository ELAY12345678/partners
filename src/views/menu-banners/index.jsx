import { Layout, Tabs } from 'antd';
import React from 'react';
import { useSelector } from "react-redux";
import { TabsStyled } from '../../components/Styles';
import PopUpSystem from '../pop-up/PopUpSystem';
import Banners from './Banners';
import BannersSchedule from './BannersSchedule';
import GroupProfile from './GroupProfile';
import { useBanners } from './hooks/useBanners';
const BannersManager = ({ location }) => {

    const defaultSelectedTab = location?.state?.defaultSelectedTab || '1';
    const establishment_id = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters?.establishment_id);
    const [banners, loadingBanners, getBanners] = useBanners();

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey={defaultSelectedTab}>
                <Tabs.TabPane tab="Banners de Apparta Menu" key="1">
                    <Banners getBanners={getBanners} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Banners programación" key="2">
                    <BannersSchedule banners={banners} loadingBanners={loadingBanners} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Perfil de grupos" key="3">
                    <GroupProfile />
                </Tabs.TabPane>
                {[1,1996].includes(establishment_id) ? 
                    <Tabs.TabPane tab="Pop-ups de sistema" key="4 ">
                        <PopUpSystem />
                    </Tabs.TabPane>
                : null}
              
            </TabsStyled>
        </Layout.Content>
    );
}

export default BannersManager;