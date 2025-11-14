document.addEventListener("DOMContentLoaded", function () {
  const btnAdd = document.getElementById("add-habilidade");
  const lista = document.getElementById("habilidades-lista");
  const idUsuario = window.location.pathname.split("/").pop(); // pega o id da URL

  let campoAtivo = null;

  // ==========================
  // 🔹 CARREGAR HABILIDADES DO BANCO
  // ==========================
  async function carregarHabilidades() {
    try {
      const resp = await fetch(`http://127.0.0.1:8000/habilidades/${idUsuario}`);
      const dados = await resp.json();

      lista.innerHTML = "";
      dados.habilidades.forEach(nome => criarHabilidade(nome, false));
    } catch (err) {
      console.error("Erro ao carregar habilidades:", err);
    }
  }

  // ==========================
  // 🔹 SALVAR HABILIDADES NO BANCO
  // ==========================
  async function salvarHabilidades() {
    const habilidades = Array.from(lista.querySelectorAll("input"))
      .map(input => input.value.trim())
      .filter(Boolean);

    try {
      await fetch(`http://127.0.0.1:8000/habilidades/${idUsuario}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habilidades),
      });
      console.log("Habilidades salvas:", habilidades);
    } catch (err) {
      console.error("Erro ao salvar habilidades:", err);
    }
  }

  // ==========================
  // 🔹 CRIAR ELEMENTO DE HABILIDADE
  // ==========================
  function criarHabilidade(nome = "", nova = true) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("habilidade-item");

    const input = document.createElement("input");
    input.type = "text";
    input.name = "habilidades[]";
    input.value = nome;
    if (!nova) input.disabled = true;

    const removerBtn = document.createElement("button");
    removerBtn.textContent = "❌";
    removerBtn.classList.add("remover-habilidade");

    removerBtn.addEventListener("click", async () => {
      wrapper.remove();
      await salvarHabilidades(); // atualiza banco
    });

    wrapper.appendChild(input);
    wrapper.appendChild(removerBtn);
    lista.appendChild(wrapper);

    if (nova) {
      input.focus();
      campoAtivo = input;
      input.placeholder = "Digite e pressione Enter";

      input.addEventListener("keypress", async function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          const texto = input.value.trim();
          if (texto === "") {
            wrapper.remove();
            campoAtivo = null;
            return;
          }
          input.value = texto;
          input.disabled = true;
          campoAtivo = null;
          await salvarHabilidades(); // salva nova
        }
      });
    }
  }

  // ==========================
  // 🔹 ADICIONAR NOVA HABILIDADE
  // ==========================
  btnAdd.addEventListener("click", function () {
    if (campoAtivo !== null) {
      campoAtivo.focus();
      return;
    }
    criarHabilidade("", true);
  });

  // ==========================
  // 🔹 INICIALIZAR
  // ==========================
  carregarHabilidades();
});
