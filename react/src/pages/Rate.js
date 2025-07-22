import React, { useState, useEffect } from 'react';
import { Form, Select, Slider, Button, Row, Col, message } from 'antd';
import MainLayout from '../components/MainLayout';
import RatePhotoCard from '../components/RatePhotoCard';
import { getPhotosForRating } from '../api/photos';

// Mock user data
const mockUser = { name: 'Пользователь', points: 0 };

const RatePage = () => {
  const [form] = Form.useForm();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(mockUser.points);

  const initialFilters = {
    gender: '',
    ageRange: [18, 50],
  };

  useEffect(() => {
    loadPhotos(initialFilters);
  }, []);

  const loadPhotos = async (filters) => {
    setLoading(true);
    try {
      const data = await getPhotosForRating({
        gender: filters.gender,
        minAge: filters.ageRange[0],
        maxAge: filters.ageRange[1],
      });
      setPhotos(data.photos);
    } catch (error) {
      message.error('Ошибка при загрузке фото для оценки');
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (values) => {
    loadPhotos({
      gender: values.gender,
      ageRange: values.ageRange,
    });
  };

  const handleRate = () => {
    setPoints(points + 1);
    loadPhotos(form.getFieldsValue());
  };

  return (
    <MainLayout user={mockUser} points={points}>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Оценить фото</h1>
        <Form
          form={form}
          layout="inline"
          onFinish={handleFilterSubmit}
          initialValues={initialFilters}
          style={{ marginBottom: '24px' }}
        >
          <Form.Item name="gender" label="Пол">
            <Select placeholder="Выберите пол" style={{ width: 200 }}>
              <Select.Option value="">Все</Select.Option>
              <Select.Option value="male">Мужской</Select.Option>
              <Select.Option value="female">Женский</Select.Option>
              <Select.Option value="other">Другой</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="ageRange" label="Возраст">
            <Slider range min={18} max={100} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Применить фильтр
            </Button>
          </Form.Item>
        </Form>
        <Row gutter={[16, 16]} justify="center">
          {loading ? (
            <Col>
              <p>Загрузка...</p>
            </Col>
          ) : photos.length > 0 ? (
            photos.map((photo) => (
              <Col key={photo.id}>
                <RatePhotoCard photo={photo} onRate={handleRate} />
              </Col>
            ))
          ) : (
            <Col>
              <p>Нет фото для оценки с текущими фильтрами.</p>
            </Col>
          )}
        </Row>
      </div>
    </MainLayout>
  );
};

export default RatePage;
