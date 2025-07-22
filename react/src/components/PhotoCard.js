import React from 'react';
import { Card, Button, Switch } from 'antd';
import { togglePhotoActive } from '../api/photos';

const PhotoCard = ({ photo, onToggle, points }) => {
  const handleToggle = async () => {
    try {
      await togglePhotoActive(photo.id);
      onToggle();
    } catch (error) {
      console.error('Error toggling photo status:', error);
    }
  };

  return (
    <Card
      hoverable
      style={{ width: 240, margin: '16px' }}
      cover={<img alt="photo" src={photo.url} style={{ height: 200, objectFit: 'cover' }} />}
    >
      <Card.Meta title={`Фото #${photo.id}`} description={`Активно: ${photo.isActive ? 'Да' : 'Нет'}`} />
      <Switch
        checked={photo.isActive}
        onChange={handleToggle}
        disabled={!photo.isActive && points <= 0}
        style={{ marginTop: 16 }}
      />
      {!photo.isActive && points <= 0 && (
        <p style={{ color: 'red', marginTop: 8 }}>Недостаточно баллов для активации</p>
      )}
    </Card>
  );
};

export default PhotoCard;
