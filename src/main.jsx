import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('SW: Найдено обновление!')
    if (confirm('Доступно новое обновление. Обновить сейчас?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('SW: Приложение готово к работе офлайн')
  },
  onRegisterError(error) {
    console.error('SW: Ошибка регистрации:', error)
  }
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

