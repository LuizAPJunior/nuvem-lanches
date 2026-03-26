import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";

function Perfil() {
  const [perfil, setPerfil] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
  });

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        setLoading(true);
        setErro("");

        const response = await api.get("/me/perfil");

        const dados = Array.isArray(response.data)
          ? response.data[0] || {}
          : response.data || {};

        setPerfil(dados);
        setFormData({
          nome: dados.nome || "",
          telefone: dados.telefone || "",
          endereco: dados.endereco || "",
        });
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    };

    buscarPerfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome,
      telefone: formData.telefone,
      endereco: formData.endereco,
    };

    try {
      const response = await api.patch("/me/perfil", payload);
      const dadosAtualizados = Array.isArray(response.data)
        ? response.data[0] || payload
        : response.data || payload;

      setPerfil(dadosAtualizados);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao atualizar perfil.");
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="page-card">
            <p className="status-text">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="page-card">
            <div className="empty-state">
              <p>{erro}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card">
          <PageHeader
            title="Perfil"
            subtitle="Atualize seus dados pessoais"
            showBack={true}
          />

          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
            />

            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={formData.telefone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="endereco"
              placeholder="Endereço"
              value={formData.endereco}
              onChange={handleChange}
            />

            <div className="actions-row">
              <button type="submit" className="btn-primary">
                Salvar perfil
              </button>
            </div>
          </form>

          <div style={{ marginTop: "28px" }}>
            <h3 style={{ marginBottom: "12px" }}>Dados atuais</h3>
            <p className="info-row"><strong>Nome:</strong> {perfil.nome || "Não informado"}</p>
            <p className="info-row"><strong>Telefone:</strong> {perfil.telefone || "Não informado"}</p>
            <p className="info-row"><strong>Endereço:</strong> {perfil.endereco || "Não informado"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;