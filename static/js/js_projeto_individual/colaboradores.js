/* ============================================================
   🔹 SEÇÃO: COLABORADORES (dinâmica com nome + telefone)
   ============================================================ */

   document.addEventListener("DOMContentLoaded", () => {
    const listaColaboradores = document.getElementById("listaColaboradores");
    const API_BASE = "http://127.0.0.1:8000";
    const repoIdProjeto = window.repoIdProjeto;
  
    console.log("📌 ID do projeto atual:", repoIdProjeto);
  
    // ============================================================
    // 🔹 Carrega os colaboradores do projeto (status = Colaborando)
    // ============================================================
    async function carregarColaboradores() {
      try {
        const res = await fetch(`${API_BASE}/colaborador_projeto/projeto/${repoIdProjeto}`);
        if (!res.ok) throw new Error("Erro ao buscar colaboradores do projeto");
  
        const data = await res.json();
        console.log("📦 Dados recebidos (colaboradores):", data);
  
        const ativos = (data.colaboradores || []).filter(
          (col) => col.status === "Colaborando"
        );
  
        if (ativos.length === 0) {
          listaColaboradores.innerHTML = "<p>Sem colaboradores ativos.</p>";
          return;
        }
  
        const colaboradoresCompletos = [];
        for (const col of ativos) {
          const colResp = await fetch(`${API_BASE}/colaboradores/${col.id_colaborador}`);
          const colJson = await colResp.json();
          const dadosColaborador = colJson.colaborador || colJson;
  
          colaboradoresCompletos.push({
            id_colaborador: col.id_colaborador,
            nome: col.nome,
            telefone: dadosColaborador.telefone || "(sem telefone)",
            status: col.status,
          });
        }
  
        renderColaboradores(colaboradoresCompletos);
      } catch (err) {
        console.error("Erro ao carregar colaboradores:", err);
        listaColaboradores.innerHTML = "<p>Erro ao carregar colaboradores.</p>";
      }
    }
  
    // ============================================================
    // 🔹 Renderiza colaboradores (nome + telefone + imagem + excluir)
    // ============================================================
    function renderColaboradores(colaboradores) {
      listaColaboradores.innerHTML = "";
  
      colaboradores.forEach((colab) => {
        const div = document.createElement("div");
        div.classList.add("colaborador-item");
  
        // 🔸 Botão de exclusão
        const imgExcluir = document.createElement("img");
        imgExcluir.src = "/static/imagens/imagens_projeto_individual/X.png"; // caminho correto
        imgExcluir.alt = "Excluir";
        imgExcluir.classList.add("btn-excluir-colaborador");
        imgExcluir.addEventListener("click", () =>
          excluirColaborador(colab.id_colaborador)
        );
  
        // 🔸 Imagem de pessoa
        const imgPessoa = document.createElement("img");
        imgPessoa.src = "/static/imagens/imagens_projeto_individual/pessoa.png"; // caminho correto
        imgPessoa.alt = "Pessoa";
        imgPessoa.classList.add("icon-pessoa");
  
        // 🔸 Telefone
        const tel = document.createElement("span");
        tel.classList.add("telefone");
        tel.textContent = colab.telefone;
  
        // 🔸 Nome
        const nome = document.createElement("span");
        nome.classList.add("nome");
        nome.textContent = colab.nome;
  
        // Montagem final
        div.appendChild(imgExcluir);
        div.appendChild(imgPessoa);
        div.appendChild(tel);
        div.appendChild(nome);
  
        listaColaboradores.appendChild(div);
      });
    }
  
    // ============================================================
    // 🔹 Excluir colaborador (remover vínculo do projeto)
    // ============================================================
    async function excluirColaborador(id_colaborador) {
      if (!confirm("Deseja remover este colaborador do projeto?")) return;
  
      try {
        const response = await fetch(
          `${API_BASE}/colaborador_projeto/${repoIdProjeto}/${id_colaborador}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Erro ao remover colaborador");
        alert("Colaborador removido com sucesso ✅");
        carregarColaboradores();
      } catch (err) {
        console.error(err);
        alert("Erro ao remover colaborador ❌");
      }
    }
  
    // ============================================================
    // 🔹 Permite atualizar externamente (usado por solicitações.js)
    // ============================================================
    window.carregarColaboradores = carregarColaboradores;
  
    // ============================================================
    // 🔹 Inicialização
    // ============================================================
    carregarColaboradores();
  });
  