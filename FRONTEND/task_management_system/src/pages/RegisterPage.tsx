import React from 'react';
import Header from '../components/Header';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;
