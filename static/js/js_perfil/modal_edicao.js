document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal-edicao");
  const btnEditar = document.getElementById("editarPerfilBtn");
  const btnSalvar = document.getElementById("salvar-edicao");
  const btnCancelar = document.getElementById("cancelar-edicao");

  const campos = {
    nome: document.getElementById("edit-nome"),
    funcao: document.getElementById("edit-funcao"),
    pais: document.getElementById("edit-pais"),
    cidade: document.getElementById("edit-cidade"),
    sobre_mim: document.getElementById("edit-sobre"),
    telefone: document.getElementById("edit-telefone"),
    linkedin: document.getElementById("edit-linkedin"),
    email: document.getElementById("edit-email"),
    github: document.getElementById("edit-github"),
  };

  const elementos = {
    nome: document.querySelector(".nome"),
    funcao: document.querySelector(".funcao"),
    pais: document.querySelector(".pais"),
    cidade: document.querySelector(".cidade"),
    sobre_mim: document.querySelector(".sobre_mim"),
    telefone: document.querySelector(".telefone"),
    linkedin: document.querySelector(".linkedin"),
    email: document.querySelector(".email"),
    github: document.querySelector(".github"),
  };

  // 🔹 Controle da imagem selecionada
  let iconSelecionado = null;
  const icones = document.querySelectorAll(".icone-foto");

  icones.forEach((icone) => {
    icone.addEventListener("click", () => {
      icones.forEach((i) => i.classList.remove("selecionado"));
      icone.classList.add("selecionado");
      iconSelecionado = icone.dataset.foto; // o nome do arquivo (ex: cat_icon.png)
    });
  });

  // 🔹 Abrir modal e preencher campos
  btnEditar.addEventListener("click", () => {
    for (let campo in campos) {
      campos[campo].value = elementos[campo]?.textContent?.trim() || "";
    }

    // Detecta e marca o ícone atual do perfil
    const imgPerfil = document.getElementById("perfil-circular");
    if (imgPerfil && imgPerfil.src) {
      const nomeArquivo = imgPerfil.src.split("/").pop();
      iconSelecionado = nomeArquivo;
      icones.forEach((i) => {
        if (i.dataset.foto === nomeArquivo) {
          i.classList.add("selecionado");
        } else {
          i.classList.remove("selecionado");
        }
      });
    }

    modal.style.display = "flex";
  });

  // 🔹 Cancelar
  btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 🔹 Salvar alterações (com tratamento completo de erro e FormData)
  btnSalvar.addEventListener("click", async () => {
    const id = localStorage.getItem("idUsuario");
    if (!id) {
      alert("Usuário não logado!");
      return;
    }

    const formData = new FormData();
    for (let campo in campos) {
      formData.append(campo, campos[campo].value || "");
    }

    // Inclui o ícone selecionado (nome do arquivo, não o arquivo)
    if (iconSelecionado) {
      formData.append("icon", iconSelecionado);
    }

    try {
      const resp = await fetch(`https://microidealizador.azurewebsites.net/perfil/${id}`, {
        method: "PUT",
        body: formData, // 🔹 sem Content-Type manual
      });

      let json;
      try {
        json = await resp.json();
      } catch {
        throw new Error("Resposta inválida do servidor");
      }

      if (!resp.ok) {
        console.error("Erro da API:", json);
        throw new Error(json.detail || json.mensagem || JSON.stringify(json));
      }

      alert(json.mensagem || "Perfil atualizado com sucesso!");
      modal.style.display = "none";
      location.reload();

    } catch (err) {
      console.error("Erro completo:", err);
      alert("Erro ao conectar com o servidor: " + err.message);
    }
  });

  // 🔹 Fechar modal clicando fora
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});



