import { useState } from 'react'

import '../src/css/App.css'
import {BrowserRouter as Router,Routes, Route} from "react-router-dom"
import Dashbord from './components/Dashbord'
import Users from './components/Users'
import UploadedItems from './components/UploadedItems'
import Reminders from './components/Reminders'
import CreateNotice from './components/CreateNotice'
import AdminAuth from './components/authcomponent/adminAuth'
import  SavedTImetable  from './components/SavedTImetable'
import SubscribedUsers from './components/SubscribedUsers'
import UsersActivities from './components/UsersActivities'
import AdminProtectedRoute from './components/authcomponent/Adminprotectedroute'
import PrivacyPolicy from './components/PrivacyPolicy'
import UsersDeleteAccountInfo from './components/UsersDeleteACtInfo'

function App() {
    return (
        <div className="App">
            <Router>

            <Routes>
                <Route path='/admin/dasbord-page' element={
                    <AdminProtectedRoute>

                    <Route path='/' element={<AdminAuth />} /> 
                    <Dashbord />
                    </AdminProtectedRoute>
                    
                    } />  
            
                <Route path='/users' element={<Users />} /> 
                
                <Route path='/users/uploaded-items' element={<UploadedItems />} /> 
                <Route path='/users/saved-timetable' element={<SavedTImetable/>} /> 
                <Route path='/users-reminders' element={<Reminders />} /> 
                <Route path='/create/users-notice' element={<CreateNotice />} /> 
                <Route path='/users/subscribed-users' element={<SubscribedUsers/>} /> 
                <Route path='/users/users-activities/page' element={<UsersActivities/>} /> 
                <Route path='/privacy-policy/page' element={<PrivacyPolicy/>} /> 
                <Route path='/users/delete-account/info-page' element={<UsersDeleteAccountInfo/>} /> 

                
                
            </Routes>

            
            </Router>
        </div>
    )
}

export default App
