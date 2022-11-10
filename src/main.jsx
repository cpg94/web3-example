import { MantineProvider  } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/Auth'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider>
      <NotificationsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>
)
