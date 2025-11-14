// ================================
// VARIÁVEIS GLOBAIS
// ================================
let listaProjetos = []; // será preenchida pela API

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".projetos-container"); 
  const inputPesquisa = document.querySelector(".barra-pesquisa input");

  if (!container) {
    console.error("❌ Container de projetos não encontrado no HTML!");
    return;
  }

  // ================================
  // FUNÇÃO PARA RENDERIZAR OS CARDS
  // ================================
  function renderizarProjetos() {
    container.innerHTML = ""; // limpa o container

    if (listaProjetos.length === 0) {
      container.innerHTML = "<p>Nenhum projeto encontrado.</p>";
      return;
    }

    listaProjetos.forEach(projeto => {
      // Card principal
      const card = document.createElement("div");
      card.classList.add("projeto-card");

      // Cabeçalho
      const cabecalho = document.createElement("div");
      cabecalho.classList.add("card-cabecalho");
      const titulo = document.createElement("div");
      titulo.classList.add("card-cabecalho-texto");
      titulo.textContent = projeto.nome;
      cabecalho.appendChild(titulo);

      // Corpo
      const corpo = document.createElement("div");
      corpo.classList.add("card-corpo");
      const descricao = document.createElement("p");
      descricao.textContent = projeto.descricao || "Sem descrição disponível.";
      corpo.appendChild(descricao);

      // Rodapé
      const rodape = document.createElement("div");
      rodape.classList.add("card-rodape");

      const statusSpan = document.createElement("span");
      statusSpan.classList.add(
        projeto.status === "Concluído" ? "status-concluido" : "status-andamento"
      );
      statusSpan.textContent = projeto.status || "Em andamento";

      const botao = document.createElement("button");
      botao.classList.add("botao-ver-mais");
      botao.textContent = "Ver mais";

      // 🔹 Redireciona para a rota Flask com o ID do projeto
      botao.addEventListener("click", () => {
        if (!projeto.id) {
          console.warn("⚠️ Projeto sem ID definido. Não é possível redirecionar.");
          return;
        }
        window.location.href = `/projeto/${projeto.id}`; // rota Flask
      });

      rodape.appendChild(statusSpan);
      rodape.appendChild(botao);

      // Monta o card completo
      card.appendChild(cabecalho);
      card.appendChild(corpo);
      card.appendChild(rodape);

      // Adiciona ao container
      container.appendChild(card);
    });
  }

  // ================================
  // CARREGAR PROJETOS DA API
  // ================================
  async function carregarProjetos() {
    try {
      const id_idealizador = window.idIdealizadorGlobal;
      console.log("🧠 ID do idealizador ativo:", id_idealizador);

      const response = await fetch(`https://fabricioapis.azurewebsites.net/projetos/${id_idealizador}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar projetos (HTTP ${response.status})`);
      }

      const data = await response.json();
      console.log("📦 Resposta da API:", data);

      // ✅ Lida tanto com "projeto" único quanto com "projetos" (lista)
      let projetos = [];

      if (data.projetos) {
        projetos = data.projetos;
      } else if (data.projeto) {
        projetos = [data.projeto];
      } else {
        throw new Error("Resposta da API inválida (sem campo 'projeto' ou 'projetos')");
      }

      // Mapeia projetos incluindo o ID
      listaProjetos = projetos.map(p => ({
        id: p.id, // necessário para a navegação
        nome: p.nome,
        descricao: p.descricao || "",
        status: p.status
      }));

      renderizarProjetos();
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      container.innerHTML = "<p>Não foi possível carregar os projetos.</p>";
    }
  }

  // Executa ao abrir a página
  carregarProjetos();
  window.carregarProjetos = carregarProjetos; // <--- garante acesso global

  // ================================
  // PESQUISA DE PROJETOS
  // ================================
  if (inputPesquisa) {
    inputPesquisa.addEventListener("input", () => {
      const termo = inputPesquisa.value.toLowerCase();
      document.querySelectorAll(".projeto-card").forEach(card => {
        const titulo = card.querySelector(".card-cabecalho-texto").textContent.toLowerCase();
        card.style.display = titulo.includes(termo) ? "flex" : "none";
      });
    });
  } else {
    console.warn("⚠️ Campo de pesquisa não encontrado no HTML.");
  }
});
