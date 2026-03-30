import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import ItensPage from "./pages/ItensPage";
import Carrinho from "./pages/Carrinho";
import Pedido from "./pages/Pedido";
import Historico from "./pages/Historico";
import Perfil from "./pages/Perfil";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No navbar on these pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Navbar only on these pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<ItensPage />} />
          <Route path="/itens" element={<ItensPage />} />
          <Route path="/carrinho" element={<ProtectedRoute><Carrinho /></ProtectedRoute>} />
          <Route path="/pedido/:id" element={<ProtectedRoute><Pedido /></ProtectedRoute>} />
          <Route path="/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;