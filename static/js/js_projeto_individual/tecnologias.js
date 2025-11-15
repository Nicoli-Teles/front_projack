/* ============================================================
   🔹 SEÇÃO: TECNOLOGIAS (DINÂMICO VIA API) COM TOGGLE DE EXCLUSÃO INLINE
   ============================================================ */
(() => {
  const listaTecnologias = document.getElementById('listaTecnologias'); // deve existir no HTML
  const btnAddTec = document.getElementById('btnAdd');
  const btnDeleteTec = document.getElementById('btnDelete');

  // Lista dinâmica
  let tecnologias = [];
  let exclusaoAtivaTec = false; // Toggle para mostrar o X

  // 🔹 API Base
  const API_BASE = "https://fabricioapis.azurewebsites.net";

  // 🔹 Função para pegar o ID do projeto global
  const getProjetoId = () => window.repoIdProjeto || 1;

  // ============================================================
  // 🔹 Renderizar tecnologias
  // ============================================================
  function renderTecnologias() {
    listaTecnologias.innerHTML = '';

    tecnologias.forEach((tec, index) => {
      const item = document.createElement('div');
      item.classList.add('tecnologia-item');

      const nomeSpan = document.createElement('span');
      nomeSpan.textContent = tec.nome;
      item.appendChild(nomeSpan);

      // Adiciona botão de exclusão inline se toggle estiver ativo
      if (exclusaoAtivaTec) {
        const btnExcluir = document.createElement('img');
        btnExcluir.src = '/static/imagens/imagens_projeto_individual/X.png'; // caminho corrigido para Flask
        btnExcluir.alt = 'Excluir';
        btnExcluir.classList.add('excluir-inline');

        // animação de crescimento
        btnExcluir.style.transform = 'scale(0)';
        btnExcluir.style.transition = 'transform 0.2s ease';
        setTimeout(() => (btnExcluir.style.transform = 'scale(1)'), 10);

        btnExcluir.addEventListener('click', async () => {
          if (!confirm(`Deseja realmente excluir a tecnologia "${tec.nome}"?`)) return;

          try {
            if (tec.id) {
              const res = await fetch(`${API_BASE}/tecnologias/${tec.id}`, {
                method: 'DELETE',
              });
              if (!res.ok) throw new Error(`Erro ao excluir tecnologia: ${res.status}`);
            } else {
              tecnologias.splice(index, 1);
            }
            await carregarTecnologias();
          } catch (err) {
            console.error('Erro ao excluir tecnologia:', err);
            alert('Não foi possível excluir a tecnologia.');
          }
        });

        item.appendChild(btnExcluir);
      }

      listaTecnologias.appendChild(item);
    });
  }

  // ============================================================
  // 🔹 Carregar tecnologias do backend
  // ============================================================
  async function carregarTecnologias() {
    const idProjeto = getProjetoId();
    try {
      const resposta = await fetch(`${API_BASE}/tecnologias?id_projeto=${idProjeto}`);
      if (!resposta.ok)
        throw new Error(`Erro ao buscar tecnologias: ${resposta.status}`);
      const data = await resposta.json();
      tecnologias = data.tecnologias || [];
      renderTecnologias();
    } catch (erro) {
      console.error('Erro ao carregar tecnologias:', erro);
      listaTecnologias.innerHTML =
        '<p style="color:red;">Erro ao carregar tecnologias.</p>';
    }
  }

  // ============================================================
  // 🔹 Criar tecnologia (POST)
  // ============================================================
  async function criarTecnologia(nome) {
    const idProjeto = getProjetoId();
    try {
      const resposta = await fetch(`${API_BASE}/tecnologias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, id_projeto: idProjeto }),
      });
      if (!resposta.ok)
        throw new Error(`Erro ao criar tecnologia: ${resposta.status}`);

      await carregarTecnologias();
    } catch (erro) {
      console.error('Erro ao criar tecnologia:', erro);
      alert('Não foi possível criar a tecnologia.');
    }
  }

  // ============================================================
  // 🔹 Eventos dos botões
  // ============================================================
  if (btnAddTec) {
    btnAddTec.addEventListener('click', async () => {
      const nova = prompt('Digite o nome da nova tecnologia:');
      if (nova && nova.trim() !== '') await criarTecnologia(nova.trim());
    });
  }

  if (btnDeleteTec) {
    btnDeleteTec.addEventListener('click', () => {
      exclusaoAtivaTec = !exclusaoAtivaTec;
      renderTecnologias();
    });
  }

  // ============================================================
  // 🔹 Inicialização
  // ============================================================
  carregarTecnologias();

  // 🔹 Permite atualização externa
  window.carregarTecnologias = carregarTecnologias;
})();
