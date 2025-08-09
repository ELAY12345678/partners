import React from "react";
import { Layout } from "antd";
import MyFooter from "../components/Footer";
import { WrapperPanelLayout } from "./Styles";
const { Content } = Layout;
const PanelLayout = ({ children, ref }) => {
    return (<WrapperPanelLayout>
        <Layout style={{ minHeight: "100vh", background: "red" }}>
            <Layout>
                <Content
                    style={{
                        minHeight: 200
                    }}
                >
                    {children}
                </Content>
                <MyFooter />
            </Layout>
        </Layout>
    </WrapperPanelLayout>);
};

export default PanelLayout;
