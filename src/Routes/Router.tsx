import { Route, Routes } from "react-router-dom"
import { Main } from "../Pages/Main"
import { Layout } from "../Componentss/Layout"

export const Router = () => {
  return (
    <Routes>
        <Route element={<Layout />}>
          <Route 
            path="/" 
            element={<Main />} 
          />
        </Route>
    </Routes>
  )
}