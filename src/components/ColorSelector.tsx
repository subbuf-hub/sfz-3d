import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import PlywoodViewer from './PlywoodViewer';
import './ColorSelector.css';

// Интерфейс для декора с фото
interface Decor {
  id: string;
  name: string;
  image: string;
  thumbnail?: string;
}

// Предустановленные декоры с фото
const DECORS: Decor[] = [
  { 
    id: 'oak', 
    name: 'Дуб', 
    image: './images/D600.jpg',
    thumbnail: './images/D600.jpg'
  },{ 
    id: 'veneto', 
    name: 'ВЕНЕТО', 
    image: './images/veneto_.jpg',
    thumbnail: './images/veneto_.jpg'
  },
];

const ColorSelector: React.FC = () => {
  const [topColor, setTopColor] = useState<string>('#D4A574');
  const [edgeColor, setEdgeColor] = useState<string>('#8B7D6B');
  const [selectedDecor, setSelectedDecor] = useState<Decor | null>(null);

  const woodColors = [
    { name: 'Сосна', value: '#E8D5B7' },
    { name: 'Дуб светлый', value: '#D4A574' },
    { name: 'Дуб темный', value: '#B8860B' },
    { name: 'Орех', value: '#8B6914' },
    { name: 'Махагон', value: '#6B3A2A' },
    { name: 'Венге', value: '#3C1A0A' },
    { name: 'Береза', value: '#E6D5B8' },
    { name: 'Ясень', value: '#C4B091' },
    { name: 'Клен', value: '#E8DCC8' },
    { name: 'Вишня', value: '#A0522D' },
    { name: 'Красное дерево', value: '#8B3A2A' },
    { name: 'Палисандр', value: '#4A2810' },
    { name: 'Тик', value: '#B8860B' },
    { name: 'Оливка', value: '#B8A88A' },
    { name: 'Ятоба', value: '#8B4513' },
    { name: 'Белый', value: '#F5F0E8' },
    { name: 'Серый', value: '#A8A098' },
    { name: 'Черный', value: '#2C2C2C' },
  ];

  const edgeColors = [
    { name: 'Темная сосна', value: '#C4A88A' },
    { name: 'Темный дуб', value: '#A67B4A' },
    { name: 'Темный орех', value: '#6B4C1A' },
    { name: 'Темный махагон', value: '#4A2A1A' },
    { name: 'Венге темный', value: '#2A1A0A' },
    { name: 'Темная береза', value: '#C4B89A' },
    { name: 'Темный ясень', value: '#A89878' },
    { name: 'Темный клен', value: '#C8BCA0' },
    { name: 'Темная вишня', value: '#7A3A1A' },
    { name: 'Красное дерево', value: '#6B2A1A' },
    { name: 'Палисандр', value: '#3A1A0A' },
    { name: 'Темный тик', value: '#9A7A2A' },
    { name: 'Темная оливка', value: '#9A8A6A' },
    { name: 'Темная ятоба', value: '#6B3A1A' },
    { name: 'Белый', value: '#F5F0E8' },
    { name: 'Серый', value: '#A8A098' },
    { name: 'Черный', value: '#2C2C2C' },
  ];

  const handleDecorSelect = (decor: Decor | null) => {
    setSelectedDecor(decor);
    if (decor) {
      setTopColor('#D4A574');
    }
  };

  return (
    <Container fluid className="color-selector-container">
      <Row className="h-100 g-0">
        <Col md={4} className="left-panel">
          <Card className="color-card">
            <Card.Body className="card-body">
              <h3 className="title">
                <span className="title-icon">🪵</span>
                Выбор цвета ДСП
              </h3>

              {/* Выбор фото-декора */}
              <div className="quick-colors-section">
                <h5 className="section-title">
                  <span className="section-icon">🖼️</span>
                  Выбор фото-декора
                </h5>

                <div className="decor-grid">
                  {DECORS.map((decor) => (
                    <button
                      key={decor.id}
                      onClick={() => handleDecorSelect(decor)}
                      className={`decor-btn ${selectedDecor?.id === decor.id ? 'active' : ''}`}
                    >
                      <div 
                        className="decor-thumbnail"
                        style={{
                          backgroundImage: `url(${decor.thumbnail || decor.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <span className="decor-name">{decor.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="quick-colors-section">
                <h5 className="section-title">
                  <span className="section-icon">⬆️</span>
                  Быстрый выбор для верха
                </h5>
                <p className="section-subtitle">Нажмите для выбора цвета верха</p>
                <div className="quick-colors">
                  {woodColors.map((wood, index) => (
                    <button
                      key={index}
                      className="quick-color-btn"
                      style={{ backgroundColor: wood.value }}
                      onClick={() => {
                        setTopColor(wood.value);
                        if (selectedDecor) setSelectedDecor(null);
                      }}
                      title={wood.name}
                    >
                      <span className="quick-color-tooltip">{wood.name}</span>
                      <span className="visually-hidden">{wood.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="quick-colors-section">
                <h5 className="section-title">
                  <span className="section-icon">📐</span>
                  Быстрый выбор для кромок
                </h5>
                <p className="section-subtitle">Нажмите для выбора цвета кромок</p>
                <div className="quick-colors">
                  {edgeColors.map((color, index) => (
                    <button
                      key={index}
                      className="quick-color-btn"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setEdgeColor(color.value)}
                      title={color.name}
                    >
                      <span className="quick-color-tooltip">{color.name}</span>
                      <span className="visually-hidden">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="color-info">
                <h6 className="info-title">Текущие цвета:</h6>
                <div className="color-previews">
                  <div className="color-preview-item">
                    <div className="color-preview" style={{ backgroundColor: topColor }} />
                    <span className="color-label">Верх</span>
                  </div>
                  <div className="color-preview-item">
                    <div className="color-preview" style={{ backgroundColor: edgeColor }} />
                    <span className="color-label">Кромка</span>
                  </div>
                  {selectedDecor && (
                    <div className="color-preview-item">
                      <div className="color-preview decor-preview" style={{ 
                        backgroundImage: `url(${selectedDecor.thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }} />
                      <span className="color-label">Декор</span>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} className="right-panel">
          <PlywoodViewer 
            topColor={topColor}
            edgeColor={edgeColor}
            decorImage={selectedDecor?.image}
            decorName={selectedDecor?.name}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ColorSelector;