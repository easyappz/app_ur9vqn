import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { resetPassword } from '../api/auth';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await resetPassword({ resetToken, newPassword: values.password });
      message.success('Пароль успешно сброшен. Войдите с новым паролем.');
      navigate('/login');
    } catch (error) {
      message.error('Ошибка при сбросе пароля');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Новый пароль">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="password"
          label="Новый пароль"
          rules={[{ required: true, message: 'Введите новый пароль' }]}
        >
          <Input.Password placeholder="Введите новый пароль" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Подтвердите пароль"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Подтвердите пароль" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Сбросить пароль
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default ResetPassword;
