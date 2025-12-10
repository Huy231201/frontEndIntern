
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {useNavigate} from "react-router-dom";
const { Sider } = Layout;

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["key"]);

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  const isExpanded = !collapsed || hovering;

  const navigate = useNavigate();

  const menuItems = [
    { key: "1", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/icon3.png" style={{ width: 24, height: 24 }} /></div>, label: "Thống kê" },
    { key: "2", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/icon2.png" style={{ width: 24, height: 24 }} /></div>, label: "Phiếu thu" },
    { key: "3", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/receipt.png" style={{ width: 24, height: 24 }} /></div>, label: "Hoá đơn" },
    { key: "4", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/Project.png" style={{ width: 24, height: 24 }} /></div>, label: "Dịch vụ/Học phí" },
    { key: "5", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/receipt-discount.png" style={{ width: 24, height: 24 }} /></div>, label: "Quản lý loại miễn giảm" },
    {
      key: "6", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/user-square.png" style={{ width: 24, height: 24 }} /></div>, label: "Quản lý học sinh", children: [
        { key: "6-1", label: "Danh sách học sinh", path: "/student"},
      ]
    },
    { key: "7", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/calendar.png" style={{ width: 24, height: 24 }} /></div>, label: "Quản lý niên khóa", path: "/schoolYear" },
    { key: "8", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/data.png" style={{ width: 24, height: 24 }} /></div>, label: "Quản lý khối / lớp",
      children: [
        { key: "8-1", label: "Quản lý khối", path: "/gradeLevel" },
        { key: "8-2", label: "Quản lý lớp", path: "/class" },
      ]
    },
    { key: "9", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/user-edit.png" style={{ width: 24, height: 24 }} /></div>, label: "Quản lý người dùng" },
    { key: "10", icon: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><img src="/src/assets/icons/category.png" style={{ width: 24, height: 24 }} /></div>, label: "Cài đặt hệ thống" },
  ];

const findPath = (items: any[], key: string): string | undefined => {
  for (const item of items) {
    if (item.key === key) return item.path;
    if (item.children) {
      const childPath = findPath(item.children, key);
      if (childPath) return childPath;
    }
  }
  return undefined;
};


  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed && !hovering}
      width={220}
      collapsedWidth={64}
      style={{position: "sticky", top: 0, height:"100vh", overflowY: "auto", backgroundColor: "#008AFF", transition: "all 0.3s ease"}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo */}
      <div style={{ height: 48, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, border: "none", cursor: "pointer", marginBottom: "16px" }}>
        <img src="/src/assets/icon-3.png" alt="Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />
        {isExpanded && (
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>HDBank</div>
            <div style={{ fontWeight: 400, fontSize: 12, color: "#fff", opacity: 0.9 }}>Xin chào, Quốc (Admin)</div>
          </div>
        )}
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        // onClick={({ key }) => setSelectedKeys([key])}
        onClick={({ key }) => {
        setSelectedKeys([key]); // highlight menu
        const path = findPath(menuItems, key);
        if (path) navigate(path); // điều hướng sang trang tương ứng
        }}

        style={{ backgroundColor: "#008AFF", borderRight: "none", color: "#fff", transition: "all 0.3s ease" }}
        items={menuItems.map(item => ({
          ...item,
          label: isExpanded ? <span style={{ fontWeight: 500, color: "#fff" }}>{item.label}</span> : "",
          children: item.children
            ? item.children.map(sub => ({
              ...sub,
              label: isExpanded ? <span style={{ fontWeight: 700, color: "#fff" }}>{sub.label}</span> : "",
            }))
            : undefined,
        }))}
      />

      {/* Custom styles */}
      <style>{`
        .ant-menu-sub { background-color: #008AFF !important; }
        .ant-menu-item span, .ant-menu-submenu-title span { color: #fff !important; }

        /* hover effect */
        .ant-menu-item:hover, .ant-menu-submenu-title:hover {
          background-color: rgba(255,255,255,0.15) !important;
          position: relative;
        }

        /* selected effect */
        .ant-menu-item-selected, .ant-menu-submenu-selected {
          background-color: rgba(255,255,255,0.15) !important;
          position: relative;
        }

        /* thanh trắng dọc bên trái */
        .ant-menu-item:hover::before,
        .ant-menu-item-selected::before,
        .ant-menu-submenu-title:hover::before,
        .ant-menu-submenu-selected > .ant-menu-submenu-title::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background-color: #fff;
          border-radius: 0 2px 2px 0;
        }

         /* Chrome, Edge, Safari */
          .ant-layout-sider::-webkit-scrollbar {
            display: none;
          }
    
      `}</style>
    </Sider>
  );
}

export default Sidebar;

