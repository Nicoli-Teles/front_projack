/* ============================================================
   🔹 REPOSITÓRIOS COM TOGGLE DE EXCLUSÃO INLINE
   ============================================================ */
   (() => {
    // 🔹 Base da API padronizada
    const API_BASE = "http://127.0.0.1:8000";
  
    // 🔹 Usa o ID global definido em global.js
    const idProjeto = window.repoIdProjeto || 1;
  
    const listaRepositorios = document.getElementById('listaRepositorios');
    const btnAddRepo = document.getElementById('btnAddRepo');
    const btnDeleteRepo = document.getElementById('btnDeleteRepo');
  
    let repositorios = [];
    let exclusaoAtiva = false;
  
    // ============================================================
    // 🔹 Renderizar repositórios
    // ============================================================
    function renderRepositorios() {
      listaRepositorios.innerHTML = '';
  
      repositorios.forEach(repo => {
        const linha = document.createElement('div');
        linha.classList.add('repositorio-linha');
  
        const img = document.createElement('img');
        img.src = '/static/imagens/imagens_projeto_individual/repositorio_icon.png'; // caminho corrigido
        img.alt = 'Ícone do repositório';
        img.classList.add('repo-icon-out');
  
        const item = document.createElement('div');
        item.classList.add('repositorio-item');
  
        const span = document.createElement('span');
        span.textContent = repo.nome;
  
        item.appendChild(span);
        linha.appendChild(img);
        linha.appendChild(item);
  
        // Adiciona botão de exclusão inline se toggle estiver ativo
        if (exclusaoAtiva) {
          const btnExcluir = document.createElement('img');
          btnExcluir.src = '/static/imagens/imagens_projeto_individual/X.png'; // caminho corrigido
          btnExcluir.alt = 'Excluir';
          btnExcluir.classList.add('excluir-inline');
          btnExcluir.addEventListener('click', async () => {
            if (!confirm(`Deseja realmente excluir o repositório "${repo.nome}"?`)) return;
  
            try {
              const res = await fetch(`${API_BASE}/repositorios/${repo.id}`, { method: 'DELETE' });
              if (!res.ok) throw new Error(`Erro ao excluir repositório: ${res.status}`);
              await carregarRepositorios(idProjeto);
            } catch (err) {
              console.error('Erro ao excluir repositório:', err);
              alert('Não foi possível excluir o repositório.');
            }
          });
          linha.appendChild(btnExcluir);
        }
  
        listaRepositorios.appendChild(linha);
      });
    }
  
    // ============================================================
    // 🔹 Carregar repositórios
    // ============================================================
    async function carregarRepositorios(idProjeto) {
      try {
        const res = await fetch(`${API_BASE}/repositorios?id_projeto=${idProjeto}`);
        if (!res.ok) throw new Error(`Erro ao buscar repositórios: ${res.status}`);
        const data = await res.json();
        repositorios = data.repositorios || [];
        renderRepositorios();
      } catch (erro) {
        console.error('Erro ao carregar repositórios:', erro);
        listaRepositorios.innerHTML = '<p style="color:red;">Erro ao carregar repositórios.</p>';
      }
    }
  
    // ============================================================
    // 🔹 Criar repositório
    // ============================================================
    async function criarRepositorio(nome, idProjeto) {
      try {
        const res = await fetch(`${API_BASE}/repositorios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, id_projeto: idProjeto })
        });
        if (!res.ok) throw new Error(`Erro ao criar repositório: ${res.status}`);
        await carregarRepositorios(idProjeto);
      } catch (erro) {
        console.error('Erro ao criar repositório:', erro);
        alert('Não foi possível criar o repositório.');
      }
    }
  
    // ============================================================
    // 🔹 Botão adicionar repositório
    // ============================================================
    if (btnAddRepo) {
      btnAddRepo.addEventListener('click', async () => {
        const novo = prompt('Digite o nome do novo repositório:');
        if (novo && novo.trim() !== '') await criarRepositorio(novo.trim(), idProjeto);
      });
    }
  
    // ============================================================
    // 🔹 Botão toggle de exclusão
    // ============================================================
    if (btnDeleteRepo) {
      btnDeleteRepo.addEventListener('click', () => {
        exclusaoAtiva = !exclusaoAtiva;
        renderRepositorios();
      });
    }
  
    // ============================================================
    // 🔹 Inicialização
    // ============================================================
    carregarRepositorios(idProjeto);
  
    // 🔹 Permite atualizar externamente
    window.carregarRepositorios = carregarRepositorios;
  })();
  