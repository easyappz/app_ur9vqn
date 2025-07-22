import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, message } from 'antd';
import { LikeOutlined, PictureOutlined, StarOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { getStatistics } from '../api/stats';

// Mock user data
const mockUser = { name: 'Пользователь', points: 0 };

const StatsPage = () => {
  const [stats, setStats] = useState({
    points: 0,
    totalPhotos: 0,
    activePhotos: 0,
    totalRatings: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await getStatistics();
        setStats(data);
      } catch (error) {
        message.error('Ошибка при загрузке статистики');
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <MainLayout user={mockUser} points={stats.points}>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Статистика</h1>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card loading={loading}>
              <Statistic
                title="Баллы"
                value={stats.points}
                prefix={<LikeOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card loading={loading}>
              <Statistic
                title="Всего фото"
                value={stats.totalPhotos}
                prefix={<PictureOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card loading={loading}>
              <Statistic
                title="Активных фото"
                value={stats.activePhotos}
                prefix={<PictureOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card loading={loading}>
              <Statistic
                title="Всего оценок"
                value={stats.totalRatings}
                prefix={<StarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card loading={loading}>
              <Statistic
                title="Средняя оценка"
                value={stats.averageRating.toFixed(2)}
                prefix={<StarOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default StatsPage;
