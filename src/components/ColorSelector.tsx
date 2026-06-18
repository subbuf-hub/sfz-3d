import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import PlywoodViewer from './PlywoodViewer';
import './ColorSelector.css';

interface WoodColor {
  name: string;
  value: string;
}

const ColorSelector: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState<string>('#A0522D');

  const woodColors: WoodColor[] = [
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
  ];

  // Создаем кнопки через цикл for
  const createButtons = () => {
    const result = [];
    for (let i = 0; i < woodColors.length; i++) {
      const wood = woodColors[i];
      result.push(
        <button
  key={i}
  className="quick-color-btn"
  style={{ backgroundColor: wood.value }}
  onClick={() => setPrimaryColor(wood.value)}
  title={wood.name}
>
  <span className="quick-color-tooltip">{wood.name}</span>
  <span className="visually-hidden">{wood.name}</span>
</button>
      );
    }
    return result;
  };

  return (
    <Container fluid className="color-selector-container">
      <Row className="h-100 g-0">
        <Col md={4} className="left-panel">
          <Card className="color-card">
            <Card.Body className="card-body">
              <h3 className="title">
                <span className="title-icon">🪵</span>
                Выбор цвета древесины
              </h3>
              
              <Form className="color-form">
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">
                    <span className="label-icon">🎨</span>
                    Основной цвет
                  </Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="color-picker"
                    />
                    <Form.Control
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="ms-2 color-input"
                      style={{ width: '120px' }}
                    />
                  </div>
                </Form.Group>
              </Form>

              <div className="quick-colors-section">
                <h5 className="section-title">
                  <span className="section-icon">🌳</span>
                  Породы дерева
                </h5>
                <p className="section-subtitle">Нажмите для быстрого выбора</p>
                <div className="quick-colors">
                  {createButtons()}
                </div>
              </div>

              <div className="color-info">
                <h6 className="info-title">Текущий цвет древесины:</h6>
                <div className="color-previews">
                  <div className="color-preview-item">
                    <div className="color-preview" style={{ backgroundColor: primaryColor }} />
                    <span className="color-label">Основа</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} className="right-panel">
          <PlywoodViewer primaryColor={primaryColor} />
        </Col>
      </Row>
    </Container>
  );
};

export default ColorSelector;