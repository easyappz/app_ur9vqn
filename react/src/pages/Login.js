import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { login } from '../api/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values);
      localStorage.setItem('token', response.token);
      message.success('Вход успешен!');
      navigate('/upload');
    } catch (error) {
      message.error('Ошибка при входе');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Вход">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}
        >
          <Input placeholder="Введите email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
        <br />
        <a href="/reset-password-request">Забыли пароль?</a>
      </div>
    </AuthLayout>
  );
};

export default Login;
