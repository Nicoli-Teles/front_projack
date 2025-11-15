/* ============================================================
   🔹 MODAL DE EDIÇÃO DO PROJETO
   ============================================================ */
(() => {
  // 🔹 Base da API padronizada
  const API_BASE = "https://fabricioapis.azurewebsites.net";

  // 🔹 Usa o ID global
  const projetoId = window.repoIdProjeto;

  // 🔹 Elementos do DOM
  const btnEditar = document.querySelector('.btn-editar');
  const modal = document.getElementById('modalEdicao');
  const btnSalvar = document.getElementById('btnSalvarModal');
  const btnCancelar = document.getElementById('btnCancelarModal');

  const editNome = document.getElementById('editNome');       // <-- NOVO
  const editDescricao = document.getElementById('editDescricao');
  const editNivel = document.getElementById('editNivel');
  const editCategoria = document.getElementById('editCategoria');
  const editStatus = document.getElementById('editStatus');
  const editTecnologias = document.getElementById('editTecnologias');
  const editRepositorios = document.getElementById('editRepositorios');

  const nomeHeader = document.getElementById('nomeProjetoHeader'); // <-- Nome no topo
  const descricao = document.querySelector('.texto');
  const nivel = document.querySelector('.nivel .valor');
  const categoria = document.querySelector('.categoria .valor');
  const status = document.querySelector('.status .valor');

  // --- Abrir modal ---
  if (btnEditar) btnEditar.addEventListener('click', abrirModal);

  async function abrirModal() {
    modal.style.display = 'flex';
    try {
      const projeto = (await (await fetch(`${API_BASE}/projeto/${projetoId}`)).json()).projeto;

      editNome.value = projeto.nome || "";                        // <-- NOVO
      editDescricao.value = projeto.descricao;
      editNivel.value = projeto.nivel;
      editCategoria.value = projeto.categoria;
      editStatus.value = projeto.status || "Em andamento";

      // Buscar tecnologias e repositórios
      const tecnologias = (await (await fetch(`${API_BASE}/tecnologias?id_projeto=${projetoId}`)).json()).tecnologias || [];
      const repositorios = (await (await fetch(`${API_BASE}/repositorios?id_projeto=${projetoId}`)).json()).repositorios || [];

      renderModalItens(editTecnologias, tecnologias);
      renderModalItens(editRepositorios, repositorios);

    } catch (err) {
      console.error(err);
      alert('Erro ao carregar dados do projeto.');
    }
  }

  // --- Função para renderizar tecnologias/repos ---
  function renderModalItens(container, itens) {
    container.innerHTML = '';

    itens.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('item-editavel');
      div.dataset.id = item.id;

      const span = document.createElement('span');
      span.textContent = item.nome;
      span.contentEditable = true;

      div.appendChild(span);
      container.appendChild(div);
    });
  }

  // --- Salvar alterações ---
  if (btnSalvar) btnSalvar.addEventListener('click', async () => {
    try {
      const projetoAtualizado = {
        nome: editNome.value.trim(),         // <-- SALVANDO NOME
        id_idealizador: 1,
        nivel: editNivel.value.trim(),
        categoria: editCategoria.value.trim(),
        descricao: editDescricao.value.trim(),
        status: editStatus.value.trim()
      };

      await fetch(`${API_BASE}/projetos/${projetoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projetoAtualizado)
      });

      // Atualiza interface
      nomeHeader.textContent = projetoAtualizado.nome;            // <-- ATUALIZA NO TOPO
      descricao.textContent = projetoAtualizado.descricao;
      nivel.textContent = projetoAtualizado.nivel;
      categoria.textContent = projetoAtualizado.categoria;
      status.textContent = projetoAtualizado.status;

      // Atualiza tecnologias e repositórios
      await atualizarItens(editTecnologias, 'tecnologias');
      await atualizarItens(editRepositorios, 'repositorios');

      // Atualiza listas globais se existirem
      if (typeof carregarTecnologias === 'function') await carregarTecnologias(projetoId);
      if (typeof carregarRepositorios === 'function') await carregarRepositorios(projetoId);

      modal.style.display = 'none';

    } catch (err) {
      console.error(err);
      alert('Erro ao salvar alterações.');
    }
  });

  // --- Função para atualizar tecnologias/repos ---
  async function atualizarItens(container, endpoint) {
    for (const div of container.querySelectorAll('.item-editavel')) {
      const id = div.dataset.id;
      const nome = div.querySelector('span').textContent.trim();
      if (id) {
        await fetch(`${API_BASE}/${endpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, id_projeto: projetoId })
        });
      }
    }
  }

  // --- Fechar modal ---
  if (btnCancelar) btnCancelar.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
})();
