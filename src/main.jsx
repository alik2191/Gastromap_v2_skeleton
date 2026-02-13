import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Доступно новое обновление. Обновить сейчас?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Приложение готово к работе офлайн')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

