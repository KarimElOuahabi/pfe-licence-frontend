import { Breadcrumb, Layout } from "antd";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { SideMenu } from "./SideMenu";

const { Content, Footer, Header } = Layout;

export const AuthenticatedLayout = () => {
  const {pathname} = useLocation();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideMenu />
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>{pathname.split("/")[1]}</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};
