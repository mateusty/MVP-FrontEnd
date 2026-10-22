import { Route, Routes } from "react-router-dom"
import { Main } from "../Pages/Main"
import { Parnaso } from "../Pages/Parques/Parnaso"
import { TresPicos } from "../Pages/Parques/TresPicos"
import { MontanhasTere } from "../Pages/Parques/MontanhasTere"
import { Layout } from "../Componentss/Layout"
import { Login } from "../Pages/Login"
import { Eventos } from "../Pages/Eventos" // 1. Import do novo componente

export const Router = () => {
  return (
    <Routes>
        <Route element={<Layout />}>
          <Route 
            path="/" 
            element={<Main />} 
          />
          <Route
            path="/eventos"
            element={<Eventos />} // 2. Nova rota declarada
          />
          <Route
            path="/parnaso"
            element={<Parnaso />}
          />
          <Route
            path="/tres-picos"
            element={<TresPicos />}
          />
          <Route
            path="/montanhas-tere"
            element={<MontanhasTere />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
        </Route>
    </Routes>
  )
}