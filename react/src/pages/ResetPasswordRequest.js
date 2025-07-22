import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import AuthLayout from '../components/AuthLayout';
import { requestPasswordReset } from '../api/auth';

const ResetPasswordRequest = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await requestPasswordReset(values);
      message.success('Запрос на сброс пароля отправлен. Проверьте email.');
      setSubmitted(true);
    } catch (error) {
      message.error('Ошибка при запросе сброса пароля');
      console.error('Reset password request error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Сброс пароля">
      {!submitted ? (
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}
          >
            <Input placeholder="Введите email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Отправить запрос
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>Запрос отправлен. Проверьте ваш email для дальнейших инструкций.</p>
          <a href="/login">Вернуться ко входу</a>
        </div>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordRequest;
