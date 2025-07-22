import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { register } from '../api/auth';

const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await register(values);
      localStorage.setItem('token', response.token);
      message.success('Регистрация успешна!');
      navigate('/upload');
    } catch (error) {
      message.error('Ошибка при регистрации');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Регистрация">
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ gender: 'male', age: 25 }}
      >
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
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: 'Введите имя' }]}
        >
          <Input placeholder="Введите имя" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Пол"
          rules={[{ required: true, message: 'Выберите пол' }]}
        >
          <Select placeholder="Выберите пол">
            <Option value="male">Мужской</Option>
            <Option value="female">Женский</Option>
            <Option value="other">Другой</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="age"
          label="Возраст"
          rules={[{ required: true, message: 'Введите возраст' }]}
        >
          <InputNumber min={1} max={120} placeholder="Введите возраст" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </div>
    </AuthLayout>
  );
};

export default Register;
