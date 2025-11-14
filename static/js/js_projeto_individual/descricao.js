// ===============================
// 🔹 Base da API padronizada
// ===============================
const API_BASE = "https://fabricioapis.azurewebsites.net"; // <-- use a mesma base do restante

// ===============================
// 🔹 Seleção segura dos elementos
// ===============================
const descricaoEl = document.getElementById('descricaoProjeto');
const nivelEl = document.getElementById('nivelProjeto');
const categoriaEl = document.getElementById('categoriaProjeto');
const statusEl = document.getElementById('statusProjeto');  // Novo elemento para o status

// ===============================
// 🔹 Função para carregar o projeto
// ===============================
async function carregarProjeto() {
  try {
    // Garante que o ID global exista
    let idProjeto = window.repoIdProjeto;
    if (!idProjeto) {
      console.warn("⚠️ ID do projeto não definido — tentando recuperar do localStorage...");
      idProjeto = localStorage.getItem("repoIdProjeto");
    }

    if (!idProjeto) {
      throw new Error("Nenhum ID de projeto encontrado!");
    }

    // Busca os dados do projeto na API
    const resposta = await fetch(`${API_BASE}/projeto/${idProjeto}`);

    if (!resposta.ok) throw new Error(`Erro ao buscar projeto: ${resposta.status}`);

    const data = await resposta.json();
    console.log("🔍 Retorno da API:", data);

    // Adapta conforme o formato retornado
    const projeto = data.projeto || (Array.isArray(data) ? data[0] : data);

    if (!projeto) {
      descricaoEl.textContent = "Projeto não encontrado.";
      return;
    }

    window.idIdealizador = projeto.id_idealizador; // Acessando o id_idealizador da resposta

    console.log("🚀 Id do Idealizador carregado:", idIdealizador);


    // Atualiza o conteúdo na tela
    if (descricaoEl) descricaoEl.textContent = projeto.descricao || "Sem descrição.";
    if (nivelEl) nivelEl.textContent = projeto.nivel || "Nível não informado";
    if (categoriaEl) categoriaEl.textContent = projeto.categoria || "Categoria não informada";
    if (statusEl) statusEl.textContent = projeto.status || "Status não informado"; // Preenche o campo de status

  } catch (erro) {
    console.error("❌ Erro ao carregar projeto:", erro);
    if (descricaoEl) descricaoEl.textContent = "Erro ao carregar dados do projeto.";
  }
}

// ===============================
// 🔹 Aguarda o carregamento do DOM
// ===============================
document.addEventListener("DOMContentLoaded", carregarProjeto);
