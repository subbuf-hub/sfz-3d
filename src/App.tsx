import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Showcase3D from './components/Showcase3D';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <div className="text-center text-white">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <h4>Загрузка 3D приложения...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Навигация */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
        <div className="container">
          <span className="navbar-brand fw-bold fs-2">
            <span className="text-primary">3D</span> Showcase
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link active" href="#">Главная</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Портфолио</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Услуги</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Контакты</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero секция */}
      <header className="bg-primary bg-gradient text-white py-5">
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-3 animate__animated animate__fadeInUp">
            Интерактивная 3D Демонстрация
          </h1>
          <p className="lead mb-4 fs-4">
            Современные веб-технологии для впечатляющего пользовательского опыта
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-light btn-lg px-4">Начать просмотр</button>
            <button className="btn btn-outline-light btn-lg px-4">Узнать больше</button>
          </div>
        </div>
      </header>

      {/* 3D компонент */}
      <Showcase3D />

      {/* Карточки с преимуществами */}
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow hover-scale transition">
              <div className="card-body text-center p-4">
                <div className="display-1 text-primary mb-3">🎯</div>
                <h5 className="card-title fw-bold fs-4">Интерактивность</h5>
                <p className="card-text text-muted">
                  Полный контроль над 3D сценой: вращение, масштабирование, панорамирование
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow hover-scale transition">
              <div className="card-body text-center p-4">
                <div className="display-1 text-primary mb-3">⚡</div>
                <h5 className="card-title fw-bold fs-4">Производительность</h5>
                <p className="card-text text-muted">
                  Оптимизированный рендеринг и плавная анимация 60 FPS
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow hover-scale transition">
              <div className="card-body text-center p-4">
                <div className="display-1 text-primary mb-3">🌍</div>
                <h5 className="card-title fw-bold fs-4">Кросс-платформенность</h5>
                <p className="card-text text-muted">
                  Работает на всех устройствах и современных браузерах
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Футер */}
      <footer className="bg-dark text-white-50 mt-auto py-4">
        <div className="container text-center">
          <p className="mb-0">© 2024 3D Showcase Project. Создано с любовью к технологиям</p>
        </div>
      </footer>

      <style>{`
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default App;