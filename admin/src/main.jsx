import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminProvider } from './context/AdminContext.jsx'
import './css/index.css'
import App from './App.jsx'
import { AdminUserProvider } from './context/AdminuserContext.jsx'
import { AdminTimetableProvider } from './context/Admintimetablecontext.jsx'
import { AdminSubscriptionProvider } from './context/Adminsubscriptioncontext.jsx'
import { AdminBookProvider } from './context/Adminbookcontex.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <AdminUserProvider>
        <AdminTimetableProvider>
          <AdminSubscriptionProvider>
            <AdminBookProvider>



        <App />
            </AdminBookProvider>
          </AdminSubscriptionProvider>
        </AdminTimetableProvider>
      </AdminUserProvider>
    </AdminProvider>
  </StrictMode>
)