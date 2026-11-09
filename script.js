// Gerenciador de Tarefas
// Conceitos praticados: DOM, eventos, arrays, objetos, localStorage e filtros.

const CHAVE = "tarefas-v1";

const form = document.getElementById("form-tarefa");
const inputTexto = document.getElementById("texto");
const selectPrioridade = document.getElementById("prioridade");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const botaoLimpar = document.getElementById("limpar");
const botoesFiltro = document.querySelectorAll(".filtros button");

let tarefas = carregar();
let filtroAtual = "todas";

// ---------- Armazenamento ----------
function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch (erro) {
    return [];
  }
}

function salvar() {
  localStorage.setItem(CHAVE, JSON.stringify(tarefas));
}

// ---------- Ações ----------
function adicionar(texto, prioridade) {
  tarefas.push({
    id: Date.now(),
    texto: texto.trim(),
    prioridade,
    concluida: false,
  });
  salvar();
  renderizar();
}

function alternarConclusao(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (tarefa) tarefa.concluida = !tarefa.concluida;
  salvar();
  renderizar();
}

function editar(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) return;
  const novoTexto = prompt("Editar tarefa:", tarefa.texto);
  if (novoTexto && novoTexto.trim() !== "") {
    tarefa.texto = novoTexto.trim();
    salvar();
    renderizar();
  }
}

function remover(id) {
  tarefas = tarefas.filter((t) => t.id !== id);
  salvar();
  renderizar();
}

function limparConcluidas() {
  tarefas = tarefas.filter((t) => !t.concluida);
  salvar();
  renderizar();
}

// ---------- Filtros ----------
function tarefasFiltradas() {
  if (filtroAtual === "pendentes") return tarefas.filter((t) => !t.concluida);
  if (filtroAtual === "concluidas") return tarefas.filter((t) => t.concluida);
  return tarefas;
}

// ---------- Renderização ----------
function criarBotao(rotulo, titulo, aoClicar) {
  const b = document.createElement("button");
  b.textContent = rotulo;
  b.title = titulo;
  b.addEventListener("click", aoClicar);
  return b;
}

function renderizar() {
  lista.innerHTML = "";
  const itens = tarefasFiltradas();

  if (itens.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "vazio";
    vazio.textContent = "Nenhuma tarefa por aqui.";
    lista.appendChild(vazio);
  }

  itens.forEach((t) => {
    const li = document.createElement("li");
    li.className = t.prioridade + (t.concluida ? " concluida" : "");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = t.concluida;
    check.addEventListener("change", () => alternarConclusao(t.id));

    const span = document.createElement("span");
    span.className = "texto";
    span.textContent = t.texto; // textContent evita injeção de HTML

    li.append(
      check,
      span,
      criarBotao("✏️", "Editar", () => editar(t.id)),
      criarBotao("🗑️", "Remover", () => remover(t.id))
    );
    lista.appendChild(li);
  });

  const pendentes = tarefas.filter((t) => !t.concluida).length;
  contador.textContent = `${pendentes} pendente(s) de ${tarefas.length}`;
}

// ---------- Eventos ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  adicionar(inputTexto.value, selectPrioridade.value);
  form.reset();
  selectPrioridade.value = "media";
  inputTexto.focus();
});

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtroAtual = botao.dataset.filtro;
    botoesFiltro.forEach((b) => b.classList.toggle("ativo", b === botao));
    renderizar();
  });
});

botaoLimpar.addEventListener("click", limparConcluidas);

renderizar();
