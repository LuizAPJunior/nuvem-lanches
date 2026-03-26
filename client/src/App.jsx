import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import ItensPage from "./pages/ItensPage";
import Carrinho from "./pages/Carrinho";
import NovoPedido from "./pages/NovoPedido";
import Historico from "./pages/Historico";
import Perfil from "./pages/Perfil";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itens"
          element={
            <ProtectedRoute>
              <ItensPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrinho"
          element={
            <ProtectedRoute>
              <Carrinho />
            </ProtectedRoute>
          }
        />
        <Route
          path="/novo-pedido"
          element={
            <ProtectedRoute>
              <NovoPedido />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historico"
          element={
            <ProtectedRoute>
              <Historico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;