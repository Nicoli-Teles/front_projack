const modalIA = document.getElementById("modalIA");
const btnIA = document.getElementById("botaoSelecionarIA");
const btnCancelarIA = document.getElementById("btnCancelarIA");
const btnConfirmarIA = document.getElementById("btnConfirmarIA");
const btnFecharIA = document.getElementById("btnFecharIA");
const iaResultado = document.getElementById("iaResultado");

const API_IA = "https://microia.azurewebsites.net/projetos"; // Ajuste conforme necessário

// 🔹 Mostrar modal
btnIA.addEventListener("click", () => {
  modalIA.style.display = "flex";
});

// 🔹 Fechar modal apenas com botão ✖
btnFecharIA.addEventListener("click", () => {
  modalIA.style.display = "none";
  iaResultado.innerHTML = "";
});

// 🔹 Cancelar análise (mantém modal aberto)
btnCancelarIA.addEventListener("click", () => {
  iaResultado.textContent = "❌ A análise foi cancelada.";
});

// 🔹 Chamar IA
btnConfirmarIA.addEventListener("click", async () => {
  iaResultado.textContent = "⏳ A IA está analisando os colaboradores...";

  try {
    const id = window.repoIdProjeto;
    const resposta = await fetch(`${API_IA}/${id}`);
    const dados = await resposta.json();

    if (!resposta.ok) throw new Error(dados.detail || "Erro ao consultar a IA");

    const textoIA = dados.analise_IA || "Nenhuma análise retornada pela IA.";

    // 🔸 Converte markdown simples em HTML
    const htmlFormatado = textoIA
      .replace(/### (.*)/g, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/---/g, "<hr>")
      .replace(/\n/g, "<br>");

    iaResultado.innerHTML = "✅ <strong>Resultado da IA:</strong><br><br>" + htmlFormatado;
  } catch (erro) {
    iaResultado.textContent = "❌ Erro: " + erro.message;
  }
});
