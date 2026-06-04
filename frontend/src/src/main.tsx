import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import SystemFlowPage from './pages/SystemFlowPage.tsx'
import Layout from './components/Layout.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/system-flow" element={<SystemFlowPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
)
