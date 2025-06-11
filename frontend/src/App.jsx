import React from 'react'
import { Route,Routes } from 'react-router-dom'

import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoutes from './routes/protectedRoutes'
import Collborate from './pages/Collborate'
import DocPage from './pages/Doc'
import Show  from './pages/Show'
import EditorPage from './pages/EditorPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
        <Route path='/signup' element={<SignupPage></SignupPage>}></Route>
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        <Route path='/profile' element={<ProtectedRoutes><ProfilePage></ProfilePage></ProtectedRoutes>}></Route>
        <Route path='/collaborate' element={<ProtectedRoutes><Collborate></Collborate></ProtectedRoutes>}></Route>
        <Route path='/doc' element={<ProtectedRoutes><DocPage></DocPage></ProtectedRoutes>}></Route>
        <Route path='/showdoc/:docId' element={<ProtectedRoutes><Show></Show></ProtectedRoutes>}></Route>
         <Route path='/editor/:id' element={<ProtectedRoutes><EditorPage></EditorPage></ProtectedRoutes>}></Route>
        

      </Routes>
    
    </div>
  )
}

export default App