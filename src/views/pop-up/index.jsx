import { Layout } from 'antd';
import React from 'react';
import PopUpSystem from './PopUpSystem';

const GroupManager = () => {

    // const [banners, loadingBanners, getBanners] = useBanners();

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <PopUpSystem  />
        </Layout.Content>
    );
}

export default GroupManager;