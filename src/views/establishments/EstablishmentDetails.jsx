import React from 'react';
import { Layout, Tabs } from 'antd';
import NotFound from '../NotFound';
import { useEstablishment } from './hooks/useEstablishment';
import { TabsStyled } from '../../components/Styles';
import Categories from './establishmentDetails/Categories';
import Branches from './establishmentDetails/Branches';
import Profile from './establishmentDetails/Profile';
import Users from './establishmentDetails/Users';
import InvoiceProfiles from './establishmentDetails/InvoiceProfiles';
import BranchSchedules from './establishmentDetails/BranchSchedules';
import AppartaPay from './establishmentDetails/AppartaPay';
import ThirdPartyCodes from './establishmentDetails/ThirdPartyCodes';
import LinkTree from './establishmentDetails/LinkTree';
import { useInvoiceProfile } from './hooks';
import { useParams } from 'react-router-dom';

const EstablishmentDetails = () => {

    const { establishmentId } = useParams();

    const [establishmentData, setEstablishmentData] = useEstablishment({ id: establishmentId });
    const [invoiceProfiles, loadingInvoiceProfiles, getInvoiceProfiles] = useInvoiceProfile({ establishment_id: establishmentId });

    if (!establishmentId) return <NotFound />;
    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <TabsStyled defaultActiveKey="1">
                <Tabs.TabPane tab="Datos Generales" key="1">
                    <Profile establishmentData={establishmentData} setEstablishmentData={setEstablishmentData} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Categorías" key="2">
                    <Categories establishmentData={establishmentData} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Sucursales" key="3">
                    <Branches establishment_id={establishmentData?.id} invoiceProfiles={invoiceProfiles}  payCommissionsFor={establishmentData?.pay_commissions_for} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Usuarios" key="4">
                    <Users establishment_id={establishmentData?.id} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Perfiles de Facturación" key="5">
                    <InvoiceProfiles establishment_id={establishmentData?.id} getInvoiceProfiles={getInvoiceProfiles} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Horarios" key="6">
                    <BranchSchedules establishment_id={establishmentData?.id} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="AppartaPay" key="7">
                    <AppartaPay establishment_id={establishmentData?.id} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Códigos de terceros" key="8">
                    <ThirdPartyCodes establishment_id={establishmentData?.id} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="LinkTree" key="9">
                    <LinkTree establishment_id={establishmentData?.id} slug={establishmentData?.slug} />
                </Tabs.TabPane>
            </TabsStyled>
        </Layout.Content>
    );
}

export default EstablishmentDetails;