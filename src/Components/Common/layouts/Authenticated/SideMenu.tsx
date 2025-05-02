import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../router/router";

const { Sider } = Layout;

export const SideMenu = () => {
  const navigate = useNavigate();
  const handleClick = (route: string) => {
    navigate(route);
  };

  const [collapsed, setCollapsed] = useState(false);

  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const items: MenuItem[] = Object.values(ROUTES)
    .filter((value) => value.path !== "/login")
    .map((value) =>
      getItem(value.label, value.path, <UserOutlined />, value?.children)
    );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        onClick={(route) => handleClick(route.key)}
      />
    </Sider>
  );
};
