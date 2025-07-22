import React, { useState } from 'react';
import { Card, Button, Rate, message } from 'antd';
import { ratePhoto } from '../api/photos';

const RatePhotoCard = ({ photo, onRate }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRate = async () => {
    if (rating === 0) {
      message.error('Пожалуйста, выберите оценку');
      return;
    }
    setLoading(true);
    try {
      await ratePhoto(photo.id, rating);
      message.success('Оценка сохранена! Вы получили 1 балл.');
      onRate();
    } catch (error) {
      message.error('Ошибка при оценке фото');
      console.error('Error rating photo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      hoverable
      style={{ width: 300, margin: '16px' }}
      cover={<img alt="photo" src={photo.url} style={{ height: 250, objectFit: 'cover' }} />}
    >
      <Card.Meta title={`Фото от пользователя ${photo.user.name}`} description={`Возраст: ${photo.user.age}, Пол: ${photo.user.gender}`} />
      <Rate value={rating} onChange={setRating} style={{ marginTop: 16 }} />
      <Button type="primary" onClick={handleRate} loading={loading} style={{ marginTop: 16 }}>
        Оценить
      </Button>
    </Card>
  );
};

export default RatePhotoCard;
