import React from 'react';
import { Layout, Tabs } from 'antd';
import { TabsStyled } from '../../components/Styles';
import Coupons from './Coupons';
import CouponsBranches from './CouponsBranches';

const CouponsManager = () => {
    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey="1">
                <Tabs.TabPane tab="Cupones" key="1">
                    <Coupons />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cupones para sucursales" key="2">
                    <CouponsBranches />
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    )
}

export default CouponsManager;