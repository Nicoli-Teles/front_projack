// ==============================
//  Controle do Retângulo Lateral
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btnToggle");
  const retangulo = document.getElementById("retangulo");

  // 🔍 Verifica se os elementos existem no HTML
  if (!btnToggle || !retangulo) {
    console.warn("⚠️ Elementos 'btnToggle' ou 'retangulo' não encontrados no HTML.");
    return;
  }

  // Inicializa o estado do retângulo (oculto)
  retangulo.style.display = "none";

  // ✅ Alterna a exibição ao clicar no botão
  btnToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // evita que o clique fora feche o retângulo

    const visivel = retangulo.style.display === "block";
    retangulo.style.display = visivel ? "none" : "block";
  });

  // ✅ Fecha o retângulo ao clicar fora dele
  document.addEventListener("click", (e) => {
    if (!retangulo.contains(e.target) && e.target !== btnToggle) {
      retangulo.style.display = "none";
    }
  });
});
