import { Route, Routes } from "react-router-dom"
import { Main } from "../Pages/Main"
import { Parnaso } from "../Pages/Parques/Parnaso"
import { TresPicos } from "../Pages/Parques/TresPicos"
import { MontanhasTere } from "../Pages/Parques/MontanhasTere"
import { Layout } from "../Componentss/Layout"

export const Router = () => {
  return (
    <Routes>
        <Route element={<Layout />}>
          <Route 
            path="/" 
            element={<Main />} 
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
        </Route>
    </Routes>
  )
}