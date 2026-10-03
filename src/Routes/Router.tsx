import { Route, Routes } from "react-router-dom"
import { Main } from "../Pages/Main"

export const Router = () => {
  return (
    <Routes>
        <Route 
          path="/" 
          element={<Main />} 
        />
    </Routes>
  )
}