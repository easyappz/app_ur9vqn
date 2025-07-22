import React from 'react';
import { Layout, Menu, Avatar, Dropdown, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, PictureOutlined, BarChartOutlined } from '@ant-design/icons';
import '../styles/MainLayout.css';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children, user, points }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Вы успешно вышли из системы');
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: 'upload',
      label: <Link to="/upload">Загрузить фото</Link>,
      icon: <PictureOutlined />,
    },
    {
      key: 'rate',
      label: <Link to="/rate">Оценить фото</Link>,
      icon: <PictureOutlined />,
    },
    {
      key: 'stats',
      label: <Link to="/stats">Статистика</Link>,
      icon: <BarChartOutlined />,
    },
  ];

  return (
    <Layout className="main-layout">
      <Header className="header">
        <div className="logo">Оценка Фото</div>
        <Menu theme="dark" mode="horizontal" items={menuItems} className="menu" />
        <div className="user-info">
          <span>Баллы: {points}</span>
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar icon={<UserOutlined />} style={{ marginLeft: 16, cursor: 'pointer' }} />
          </Dropdown>
        </div>
      </Header>
      <Content className="content">{children}</Content>
      <Footer className="footer">Оценка Фото ©2023</Footer>
    </Layout>
  );
};

export default MainLayout;
