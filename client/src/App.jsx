import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import MainPage from './components/MainPage/MainPage'
import ProjectPage from './components/ProjectPage/ProjectPage'

import './App.css'
import { AddProject } from './components/Project/AddProject'
import { AddTask } from './components/Tasks/AddTask'
import { UpdateProject } from './components/Project/UpdateProject'
import { UpdateTask } from './components/Tasks/UpdateTask'
import TaskPage from './components/Tasks/TaskPage'
import { AddSubtask } from './components/Tasks/AddSubtask'
import { UpdateSubtask } from './components/Tasks/UpdateSubtask'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='main-page-wrapper'>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/add-project' element={<AddProject></AddProject>}/>
              <Route path='/project/:projectId' element={<ProjectPage/>}/>
              <Route path='/project/:projectId/edit' element={<UpdateProject/>}/>
              <Route path='/project/:projectId/add-task' element={<AddTask></AddTask>}/>
              <Route path='/add-task' element={<AddTask></AddTask>}/>
              <Route path='/task/:taskId' element={<TaskPage/>}/>
              <Route path='/task/:taskId/edit' element={<UpdateTask/>}/>
              <Route path='/task/:taskId/add-subtask' element={<AddSubtask/>}/>
              <Route path='/subtask/:taskId/edit' element={<UpdateSubtask/>}/>
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
            </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
