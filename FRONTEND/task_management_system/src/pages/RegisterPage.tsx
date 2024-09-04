import React from 'react';
import Header from '../components/Header';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ padding: '2rem', position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RegisterForm />
      </main>

      {/* Animated Background */}
      <div className="animated-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <div className="circle"></div>
        <div className="triangle"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
