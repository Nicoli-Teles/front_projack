/* ============================================================
   🔹 SEÇÃO: SOLICITAÇÕES (com nome + telefone)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const listaSolicitacoes = document.getElementById("listaSolicitacoes");
  const API_BASE = "https://aulaazuremack.azurewebsites.net";
  const repoIdProjeto = window.repoIdProjeto; // ID do projeto globalmente disponível

  console.log("📌 ID do projeto atual:", repoIdProjeto);

  if (!repoIdProjeto || isNaN(repoIdProjeto)) {
    console.error("ID do projeto é inválido:", repoIdProjeto);
    listaSolicitacoes.innerHTML = "<p style='color:red;'>Erro: ID do projeto não encontrado.</p>";
    return;
  }

  // ============================================================
  // 🔹 Carrega todas as solicitações do projeto (status = "Solicitado")
  // ============================================================
  async function carregarSolicitacoes() {
    listaSolicitacoes.innerHTML = "<p>Carregando solicitações...</p>";

    try {
      const res = await fetch(`${API_BASE}/colaborador_projeto/solicitado/${repoIdProjeto}`);

      if (!res.ok) {
        // Erro do servidor (404, 500, etc.)
        listaSolicitacoes.innerHTML = `<p style='color:red;'>Você não possui solicitações</p>`;
        return;
      }

      const data = await res.json();
      console.log("📦 Dados recebidos da API:", data);

      const solicitacoes = data.colaboradores || [];

      if (solicitacoes.length === 0) {
        listaSolicitacoes.innerHTML = "<p>Não há solicitações pendentes para este projeto.</p>";
        return;
      }

      renderSolicitacoes(solicitacoes);

    } catch (err) {
      // Erro de conexão / rede
      console.error("Erro ao conectar com a API:", err);
      listaSolicitacoes.innerHTML = "<p style='color:red;'>Erro de conexão com a API. Verifique se o servidor está online.</p>";
    }
  }

  // ============================================================
  // 🔹 Renderiza a lista de solicitações (nome + telefone)
  // ============================================================
  function renderSolicitacoes(solicitacoes) {
    listaSolicitacoes.innerHTML = "";

    solicitacoes.forEach((sol) => {
      const div = document.createElement("div");
      div.classList.add("solicitacao-item");

      // 🔸 Nome
      const nome = document.createElement("span");
      nome.classList.add("nome");
      nome.textContent = sol.nome;

      // 🔸 Telefone
      const telefone = document.createElement("span");
      telefone.classList.add("telefone");
      telefone.textContent = sol.telefone || "(sem telefone)";

      // 🔸 Botão de aceitar
      const btnAceitar = document.createElement("img");
      btnAceitar.src = "/static/imagens/imagens_projeto_individual/aceitar.png";
      btnAceitar.alt = "Aceitar";
      btnAceitar.classList.add("btn-aceitar");
      btnAceitar.addEventListener("click", () => aceitarSolicitacao(sol.id));

      // 🔸 Botão de rejeitar
      const btnRejeitar = document.createElement("img");
      btnRejeitar.src = "/static/imagens/imagens_projeto_individual/X.png";
      btnRejeitar.alt = "Rejeitar";
      btnRejeitar.classList.add("btn-rejeitar");
      btnRejeitar.addEventListener("click", () => rejeitarSolicitacao(sol.id));

      // Montagem final
      div.appendChild(btnRejeitar);
      div.appendChild(btnAceitar);
      div.appendChild(telefone);
      div.appendChild(nome);

      listaSolicitacoes.appendChild(div);
    });
  }

  // ============================================================
  // 🔹 Aceitar / Rejeitar Solicitação
  // ============================================================
  async function aceitarSolicitacao(id_colaborador) {
    try {
      const response = await fetch(
        `${API_BASE}/colaborador_projeto/${repoIdProjeto}/${id_colaborador}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Colaborando" }),
        }
      );

      if (!response.ok) throw new Error("Erro ao aceitar solicitação");

      alert("Solicitação aceita ✅");

      // 🔁 Atualiza listas
      await carregarSolicitacoes();
      if (typeof carregarColaboradores === "function") {
        await carregarColaboradores();
      }
    } catch (err) {
      alert("Erro ao aceitar solicitação ❌");
      console.error(err);
    }
  }

  async function rejeitarSolicitacao(id_colaborador) {
    try {
      const response = await fetch(
        `${API_BASE}/colaborador_projeto/${repoIdProjeto}/${id_colaborador}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Erro ao rejeitar solicitação");
      alert("Solicitação rejeitada ❌");
      await carregarSolicitacoes();
    } catch (err) {
      alert("Erro ao rejeitar solicitação ❌");
      console.error(err);
    }
  }

  // ============================================================
  // 🔹 Inicialização
  // ============================================================
  carregarSolicitacoes();
});
