import React from 'react'
import LoginForm from '../components/LoginForm'
import Header from '../components/Header'

function LoginPage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
      <Header/>  
      <main style={{ padding: '2rem', position: 'relative', zIndex: 2 }}>
          <LoginForm/>
      </main>

      {/* Animated Background */}
      <div className="animated-bg">
        <div className="circle"></div>
        <div className="triangle"></div>
      </div>
         
    </div>
  )
}

export default LoginPage
