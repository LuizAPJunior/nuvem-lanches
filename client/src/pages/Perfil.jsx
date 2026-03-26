import { useEffect, useState } from "react";
import api from "../api/axios";

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
    return <div style={{ padding: "24px" }}>Carregando perfil...</div>;
  }

  if (erro) {
    return <div style={{ padding: "24px" }}>{erro}</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Perfil</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "400px",
          marginTop: "16px",
        }}
      >
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

        <button type="submit">Salvar perfil</button>
      </form>

      <div style={{ marginTop: "24px" }}>
        <h3>Dados atuais</h3>
        <p><strong>Nome:</strong> {perfil.nome || "Não informado"}</p>
        <p><strong>Telefone:</strong> {perfil.telefone || "Não informado"}</p>
        <p><strong>Endereço:</strong> {perfil.endereco || "Não informado"}</p>
      </div>
    </div>
  );
}

export default Perfil;