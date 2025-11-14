/* ============================================================
   🔹 SEÇÃO: SOLICITAÇÕES (com nome + telefone)
   ============================================================ */
   document.addEventListener("DOMContentLoaded", () => {
    const listaSolicitacoes = document.getElementById("listaSolicitacoes");
    const API_BASE = "http://127.0.0.1:8000";
    const repoIdProjeto = window.repoIdProjeto; // ID do projeto globalmente disponível
    
    console.log("📌 ID do projeto atual:", repoIdProjeto);
    
    // Verifique se repoIdProjeto está definido
    if (repoIdProjeto === undefined || repoIdProjeto === null || isNaN(repoIdProjeto)) {
      console.error("ID do projeto é inválido:", repoIdProjeto);
      alert("Erro: ID do projeto não encontrado.");
      return; // Não prosseguir se o ID do projeto não estiver válido
    }
  
    // ============================================================
    // 🔹 Carrega todas as solicitações do projeto
    // ============================================================
    async function carregarSolicitacoes() {
      try {
        const res = await fetch(`${API_BASE}/colaborador_projeto/projeto/${repoIdProjeto}`);
        if (!res.ok) throw new Error("Erro ao buscar vínculos de colaboradores");
  
        const data = await res.json();
        console.log("📦 Dados recebidos da API:", data);
  
        const solicitadas = (data.colaboradores || []).filter(
          (col) => col.status === "Solicitado"
        );
  
        if (solicitadas.length === 0) {
          listaSolicitacoes.innerHTML = "<p>Sem solicitações pendentes.</p>";
          return;
        }
  
        const solicitacoesCompletas = [];
        for (const col of solicitadas) {
          const colResp = await fetch(`${API_BASE}/colaboradores/${col.id_colaborador}`);
          const colJson = await colResp.json();
          const dadosColaborador = colJson.colaborador || colJson;
  
          solicitacoesCompletas.push({
            id_colaborador: col.id_colaborador,
            nome: col.nome,
            telefone: dadosColaborador.telefone || "(sem telefone)",
            status: col.status,
          });
        }
  
        renderSolicitacoes(solicitacoesCompletas);
      } catch (err) {
        console.error("Erro ao carregar solicitações:", err);
        listaSolicitacoes.innerHTML = "<p>Erro ao carregar solicitações.</p>";
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
        telefone.textContent = sol.telefone;
  
        // 🔸 Botão de aceitar
        const btnAceitar = document.createElement("img");
        btnAceitar.src = "/static/imagens/imagens_projeto_individual/aceitar.png"; // rota Flask
        btnAceitar.alt = "Aceitar";
        btnAceitar.classList.add("btn-aceitar");
        btnAceitar.addEventListener("click", () =>
          aceitarSolicitacao(sol.id_colaborador)
        );
  
        // 🔸 Botão de rejeitar
        const btnRejeitar = document.createElement("img");
        btnRejeitar.src = "/static/imagens/imagens_projeto_individual/X.png"; // rota Flask
        btnRejeitar.alt = "Rejeitar";
        btnRejeitar.classList.add("btn-rejeitar");
        btnRejeitar.addEventListener("click", () =>
          rejeitarSolicitacao(sol.id_colaborador)
        );
  
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
        await carregarSolicitacoes(); // Apenas uma chamada
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
  