import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import PhotoCard from '../components/PhotoCard';
import { uploadPhoto } from '../api/photos';

// Mock user data (in real app, this would come from API)
const mockUser = { name: 'Пользователь', points: 0 };

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [points, setPoints] = useState(mockUser.points);

  // Mock photo list (in real app, fetch from API)
  useEffect(() => {
    setPhotos([
      { id: 1, url: 'https://via.placeholder.com/300', isActive: false },
    ]);
  }, []);

  const handleUpload = async ({ file }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const response = await uploadPhoto(formData);
      setPhotos([...photos, response.photo]);
      message.success('Фото успешно загружено');
    } catch (error) {
      message.error('Ошибка при загрузке фото');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    // Refresh photo list or update points (mock here)
    message.success('Статус фото обновлен');
    setPhotos([...photos]);
  };

  return (
    <MainLayout user={mockUser} points={points}>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Загрузить фото</h1>
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            Выбрать фото
          </Button>
        </Upload>
        <h2 style={{ marginTop: '24px' }}>Ваши фото</h2>
        <Row gutter={[16, 16]}>
          {photos.map((photo) => (
            <Col key={photo.id}>
              <PhotoCard photo={photo} onToggle={handleToggle} points={points} />
            </Col>
          ))}
        </Row>
        {photos.length === 0 && <p>У вас пока нет загруженных фото.</p>}
      </div>
    </MainLayout>
  );
};

export default UploadPage;
