/* ============================================================
   🔹 MODO DE EXCLUSÃO - TECNOLOGIAS E REPOSITÓRIOS
   ============================================================ */

   (() => {
    const API_BASE = "http://127.0.0.1:8000";
  
    // Usa o ID global do projeto
    const projetoId = window.repoIdProjeto || 1;
    const btnDeleteTec = document.getElementById('btnDelete');
    const btnDeleteRepo = document.getElementById('btnDeleteRepo');
  
    const editTecnologias = document.getElementById('editTecnologias');
    const editRepositorios = document.getElementById('editRepositorios');
  
    let modoExclusaoTec = false;
    let modoExclusaoRepo = false;
  
    // ============================================================
    // 🔹 Tecnologias
    // ============================================================
    if (btnDeleteTec && editTecnologias) {
      btnDeleteTec.addEventListener('click', () => {
        modoExclusaoTec = !modoExclusaoTec;
        editTecnologias.querySelectorAll('.item-editavel').forEach(div => {
          if (modoExclusaoTec) {
            if (!div.querySelector('.btn-excluir-mini')) {
              const btn = document.createElement('button');
              btn.textContent = '✖';
              btn.classList.add('btn-excluir-mini');
              btn.addEventListener('click', () => div.remove());
              div.appendChild(btn);
            }
          } else {
            const btn = div.querySelector('.btn-excluir-mini');
            if (btn) btn.remove();
          }
        });
      });
    }
  
    // ============================================================
    // 🔹 Repositórios
    // ============================================================
    if (btnDeleteRepo && editRepositorios) {
      btnDeleteRepo.addEventListener('click', () => {
        modoExclusaoRepo = !modoExclusaoRepo;
        editRepositorios.querySelectorAll('.item-editavel').forEach(div => {
          if (modoExclusaoRepo) {
            if (!div.querySelector('.btn-excluir-mini')) {
              const btn = document.createElement('button');
              btn.textContent = '✖';
              btn.classList.add('btn-excluir-mini');
              btn.addEventListener('click', () => div.remove());
              div.appendChild(btn);
            }
          } else {
            const btn = div.querySelector('.btn-excluir-mini');
            if (btn) btn.remove();
          }
        });
      });
    }
  })();
  
  /* ============================================================
     🔹 DEFINIÇÕES GLOBAIS
     ============================================================ */
  
  // ID do projeto atual
  const projetoId = window.repoIdProjeto || 1; // A variável já está definida no HTML com o ID do projeto
  const idUsuario = window.idUsuario || localStorage.getItem("idUsuario"); // Obtenção do ID do usuário
  
  // Elementos do DOM
  const btnExcluirProjeto = document.querySelector(".btn-excluir"); // Botão para excluir o projeto
  const btnDeleteTec = document.getElementById("btnDelete"); // Botão para excluir tecnologias
  const btnDeleteRepo = document.getElementById("btnDeleteRepo"); // Botão para excluir repositórios
  const listaTecnologias = document.getElementById("listaTecnologias"); // Lista de tecnologias
  const listaRepositorios = document.getElementById("listaRepositorios"); // Lista de repositórios
  
  console.log("🚀 Botão de excluir projeto encontrado:", btnExcluirProjeto); // Verifique se o botão foi encontrado
  
  // ============================================================
    // 🔹 EXCLUSÃO DE PROJETO
    // ============================================================
  if (btnExcluirProjeto) {
    btnExcluirProjeto.addEventListener("click", async () => {
      const confirmar = confirm("Tem certeza de que deseja excluir este projeto?");
      // Requisição para pegar os detalhes do projeto e obter o ID do idealizador
      const resposta = await fetch(`${API_BASE}/projeto/${projetoId}`);
        
      if (!confirmar) return; // Se o usuário não confirmar, não faz nada
  
      try {
        // Fazendo a requisição para excluir o projeto
        const res = await fetch(`${API_BASE}/projetos/${projetoId}`, {
          method: 'DELETE',
        });
  
        if (!res.ok) {
          throw new Error("Erro ao excluir o projeto.");
        }
  
        alert("Projeto excluído com sucesso!");
  

        if (!resposta.ok) {
          throw new Error("Erro ao obter dados do projeto.");
        }
  
        const dadosProjeto = await resposta.json();
        console.log(dadosProjeto);

        // Acessa o ID do idealizador a partir da resposta da API
        const idUsuario = dadosProjeto.projeto.id_idealizador; // Acessando o id_idealizador da resposta

        console.log("🚀 Id do Idealizador carregado:", idUsuario);
  
        // Após a exclusão, redireciona para a página de projetos do idealizador
        if (idUsuario) {
          // Redireciona para a página de projetos do idealizador
          window.location.href = `/projetos/${idUsuario}`;
        } else {
          console.error("❌ ID do idealizador não encontrado!");
          alert("Não foi possível redirecionar para a página de projetos.");
        }
  
      } catch (error) {
        console.error("❌ Erro ao excluir o projeto:", error);
        alert("Não foi possível excluir o projeto.");
      }
    });
  }
  