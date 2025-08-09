import { Layout } from 'antd';
import React from 'react';
import Banners from './Banners';

const GroupManager = () => {

    // const [banners, loadingBanners, getBanners] = useBanners();

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Banners  />
        </Layout.Content>
    );
}

export default GroupManager;