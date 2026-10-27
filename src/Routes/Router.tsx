
import { Route, Routes, Navigate } from "react-router-dom";
import { Main } from "../Pages/Main";
import { Parnaso } from "../Pages/Parques/Parnaso";
import { TresPicos } from "../Pages/Parques/TresPicos";
import { MontanhasTere } from "../Pages/Parques/MontanhasTere";
import { Layout } from "../Componentss/Layout";
import { Login } from "../Pages/Login";
import { Eventos } from "../Pages/Eventos";
import { AdminTrilhas } from "../Pages/Admin/AdminTrilhas";

function RotaAdmin() {
  const token = sessionStorage.getItem("token");

  let admin = false;

  try {
    const usuario = JSON.parse(
      sessionStorage.getItem("usuario") || "null"
    );

    admin = Boolean(token && usuario?.role === "admin");
  } catch {
    admin = false;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return <AdminTrilhas />;
}

export const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<Main />} />

        <Route path="/eventos" element={<Eventos />} />

        <Route path="/parnaso" element={<Parnaso />} />

        <Route path="/tres-picos" element={<TresPicos />} />

        <Route
          path="/montanhas-tere"
          element={<MontanhasTere />}
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/trilhas"
          element={<RotaAdmin />}
        />

      </Route>
    </Routes>
  );
};
