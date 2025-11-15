// ===============================
// 🔹 Base da API padronizada
// ===============================
const API_BASE = "https://fabricioapis.azurewebsites.net";

// ===============================
// 🔹 Seleção segura dos elementos
// ===============================
const descricaoEl = document.getElementById('descricaoProjeto');
const nivelEl = document.getElementById('nivelProjeto');
const categoriaEl = document.getElementById('categoriaProjeto');
const statusEl = document.getElementById('statusProjeto');
const nomeHeaderEl = document.getElementById('nomeProjetoHeader'); // <-- ADICIONADO

// ===============================
// 🔹 Função para carregar o projeto
// ===============================
async function carregarProjeto() {
  try {
    let idProjeto = window.repoIdProjeto;

    if (!idProjeto) {
      console.warn("⚠️ ID do projeto não definido — tentando recuperar do localStorage...");
      idProjeto = localStorage.getItem("repoIdProjeto");
    }

    if (!idProjeto) {
      throw new Error("Nenhum ID de projeto encontrado!");
    }

    // Busca projeto na API
    const resposta = await fetch(`${API_BASE}/projeto/${idProjeto}`);
    if (!resposta.ok) throw new Error(`Erro ao buscar projeto: ${resposta.status}`);

    const data = await resposta.json();
    const projeto = data.projeto || (Array.isArray(data) ? data[0] : data);

    if (!projeto) {
      descricaoEl.textContent = "Projeto não encontrado.";
      return;
    }

    window.idIdealizador = projeto.id_idealizador;

    // ===============================
    // 🔹 ATUALIZAÇÃO DA TELA
    // ===============================

    if (nomeHeaderEl) nomeHeaderEl.textContent = projeto.nome || "Projeto sem nome"; 

    if (descricaoEl) descricaoEl.textContent = projeto.descricao || "Sem descrição.";
    if (nivelEl) nivelEl.textContent = projeto.nivel || "Nível não informado";
    if (categoriaEl) categoriaEl.textContent = projeto.categoria || "Categoria não informada";
    if (statusEl) statusEl.textContent = projeto.status || "Status não informado";

  } catch (erro) {
    console.error("❌ Erro ao carregar projeto:", erro);
    if (descricaoEl) descricaoEl.textContent = "Erro ao carregar dados do projeto.";
  }
}

// ===============================
// 🔹 Inicia quando o DOM é carregado
// ===============================
document.addEventListener("DOMContentLoaded", carregarProjeto);
