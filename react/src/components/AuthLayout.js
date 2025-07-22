import React from 'react';
import { Layout, Card, Row, Col } from 'antd';
import '../styles/AuthLayout.css';

const { Content } = Layout;

const AuthLayout = ({ children, title }) => {
  return (
    <Layout className="auth-layout">
      <Content className="auth-content">
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Card title={title} className="auth-card">
              {children}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
