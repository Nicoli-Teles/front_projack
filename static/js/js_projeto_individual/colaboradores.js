/* ============================================================
   🔹 SEÇÃO: COLABORADORES (dinâmica com nome + telefone)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const listaColaboradores = document.getElementById("listaColaboradores");
  const API_BASE = "https://aulaazuremack.azurewebsites.net";
  const repoIdProjeto = window.repoIdProjeto;

  console.log("📌 ID do projeto atual:", repoIdProjeto);

  if (!repoIdProjeto || isNaN(repoIdProjeto)) {
    console.error("ID do projeto é inválido:", repoIdProjeto);
    listaColaboradores.innerHTML = "<p style='color:red;'>Erro: ID do projeto não encontrado.</p>";
    return;
  }

  // ============================================================
  // 🔹 Carrega os colaboradores do projeto (status = "Colaborando")
  // ============================================================
  async function carregarColaboradores() {
    listaColaboradores.innerHTML = "<p>Carregando colaboradores...</p>";

    try {
      const res = await fetch(`${API_BASE}/colaborador_projeto/colaborando/${repoIdProjeto}`);

      if (!res.ok) {
        // Erro do servidor
        listaColaboradores.innerHTML = `<p style='color:red;'>Você não possuí colaboradores</p>`;
        return;
      }

      const data = await res.json();
      console.log("📦 Dados recebidos (colaboradores):", data);

      const colaboradores = data.colaboradores || [];

      if (colaboradores.length === 0) {
        listaColaboradores.innerHTML = "<p>Não há colaboradores ativos neste projeto.</p>";
        return;
      }

      renderColaboradores(colaboradores);

    } catch (err) {
      // Erro de conexão / rede
      console.error("Erro ao conectar com a API:", err);
      listaColaboradores.innerHTML = "<p style='color:red;'>Erro de conexão com a API. Verifique se o servidor está online.</p>";
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
      imgExcluir.src = "/static/imagens/imagens_projeto_individual/X.png";
      imgExcluir.alt = "Excluir";
      imgExcluir.classList.add("btn-excluir-colaborador");
      imgExcluir.addEventListener("click", () =>
        excluirColaborador(colab.id)
      );

      // 🔸 Imagem de pessoa
      const imgPessoa = document.createElement("img");
      imgPessoa.src = "/static/imagens/imagens_projeto_individual/pessoa.png";
      imgPessoa.alt = "Pessoa";
      imgPessoa.classList.add("icon-pessoa");

      // 🔸 Telefone
      const tel = document.createElement("span");
      tel.classList.add("telefone");
      tel.textContent = colab.telefone || "(sem telefone)";

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
