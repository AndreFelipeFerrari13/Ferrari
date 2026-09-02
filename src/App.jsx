import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Users,
  DollarSign,
  Search,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  FileDown,
  X,
  Eye,
} from "lucide-react";
import "./App.css";

import {
  menus,
  paises,
  filtrosPaisDisponiveis,
  grupos,
  statusLista,
  obrigatorios,
  nomesMeses,
  formVazio,
  vendaVazia,
} from "./constants";

import {
  carregarContas,
  moeda,
  formatarData,
  paisCombina,
  valorDaLinha,
  extrairAnoMes,
} from "./utils";

function GraficoTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const quantidade =
    payload.find((item) => item.dataKey === "contasVendidas")?.value || 0;
  const faturamento =
    payload.find((item) => item.dataKey === "faturamento")?.value || 0;

  return (
    <div className="tooltipGrafico">
      <strong>{label}</strong>
      <span>Contas vendidas: {quantidade}</span>
      <span>Faturamento: {moeda(faturamento)}</span>
    </div>
  );
}

function Dashboard({
  total,
  disponiveis,
  faturamentoTotal,
  problemas,
  vendidas,
  anoDashboard,
  setAnoDashboard,
  dadosGrafico,
}) {
  return (
    <>
      <section className="cards">
        <div className="card azul">
          <Users size={24} />
          <span>Total de contas</span>
          <strong>{total}</strong>
        </div>

        <div className="card verde">
          <CheckCircle2 size={24} />
          <span>Disponíveis</span>
          <strong>{disponiveis}</strong>
        </div>

        <div className="card roxo">
          <DollarSign size={24} />
          <span>Faturamento total</span>
          <strong className="valorCard">{moeda(faturamentoTotal)}</strong>
        </div>

        <div className="card vermelho">
          <AlertTriangle size={24} />
          <span>Problemas</span>
          <strong>{problemas}</strong>
        </div>

        <div className="card azul">
          <CheckCircle2 size={24} />
          <span>Vendidas</span>
          <strong>{vendidas}</strong>
        </div>
      </section>

      <section className="painel graficoPainel">
        <div className="cabecalhoPainel">
          <div>
            <span className="etiqueta">Relatório anual</span>
            <h3>Vendas e faturamento por mês</h3>
          </div>

          <div className="anosDashboard">
            {["2026", "2027", "2028"].map((ano) => (
              <button
                key={ano}
                className={anoDashboard === ano ? "anoBtn ativo" : "anoBtn"}
                onClick={() => setAnoDashboard(ano)}
              >
                {ano}
              </button>
            ))}
          </div>
        </div>

        <div className="graficoContainer">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={dadosGrafico}
              margin={{ top: 18, right: 22, bottom: 10, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.14)"
              />
              <XAxis dataKey="mes" stroke="#8ea0bf" />
              <YAxis
                yAxisId="left"
                stroke="#8ea0bf"
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#8ea0bf"
              />
              <Tooltip content={<GraficoTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="contasVendidas"
                name="Contas vendidas"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                barSize={36}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="faturamento"
                name="Faturamento"
                stroke="#a855f7"
                strokeWidth={4}
                dot={{ r: 5, fill: "#a855f7" }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

function DetalhesConta({ conta, onFechar }) {
  if (!conta) return null;

  return (
    <div className="modalOverlay" onClick={onFechar}>
      <div className="modalConta" onClick={(e) => e.stopPropagation()}>
        <div className="modalTopo">
          <div>
            <span className="etiqueta">Dados completos</span>
            <h3>{conta.usuario || "Conta sem usuário"}</h3>
          </div>

          <button className="modalFechar" onClick={onFechar}>
            <X size={18} />
          </button>
        </div>

        <div className="detalhesGrid">
          <div>
            <span>Usuário</span>
            <strong>{conta.usuario || "-"}</strong>
          </div>

          <div>
            <span>Senha TikTok</span>
            <strong>{conta.senhaTikTok || "-"}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{conta.email || "-"}</strong>
          </div>

          <div>
            <span>Senha Email</span>
            <strong>{conta.senhaEmail || "-"}</strong>
          </div>

          <div>
            <span>País</span>
            <strong>{conta.pais || "-"}</strong>
          </div>

          <div>
            <span>Grupo</span>
            <strong>{conta.grupo || "-"}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{conta.status || "-"}</strong>
          </div>

          <div>
            <span>Data de criação</span>
            <strong>{formatarData(conta.dataCriacao)}</strong>
          </div>

          <div>
            <span>Link</span>
            <strong>{conta.link || "-"}</strong>
          </div>

          <div>
            <span>Criado no sistema</span>
            <strong>{conta.criadoEmSistema || "-"}</strong>
          </div>

          <div>
            <span>Valor vendido</span>
            <strong>
              {conta.valorVenda ? moeda(conta.valorVenda) : "-"}
            </strong>
          </div>

          <div>
            <span>Cliente</span>
            <strong>{conta.clienteNome || "-"}</strong>
          </div>

          <div>
            <span>Telefone cliente</span>
            <strong>{conta.clienteTelefone || "-"}</strong>
          </div>

          <div>
            <span>Data venda</span>
            <strong>{conta.dataVenda || "-"}</strong>
          </div>
        </div>

        <div className="observacaoModal">
          <span>Observação</span>
          <p>{conta.observacao || "Sem observação."}</p>
        </div>
      </div>
    </div>
  );
}

function TabelaContas({
  lista,
  vazio,
  onVisualizarConta,
  onEditarConta,
  onExcluirConta,
}) {
  return (
    <div className="tabela">
      <div className="linha cabecalhoTabela">
        <span>Usuário</span>
        <span>País</span>
        <span>Grupo</span>
        <span>Status</span>
        <span>Ações</span>
      </div>

      {lista.length === 0 ? (
        <div className="vazio">{vazio}</div>
      ) : (
        lista.map((conta) => (
          <div className="linha" key={conta.id}>
            <span>
              <b>{conta.usuario}</b>
              <small>{conta.email}</small>
            </span>

            <span>{conta.pais}</span>
            <span>{conta.grupo}</span>

            <span>
              <em className="status">{conta.status}</em>
            </span>

            <span className="acoes">
              <button
                title="Ver dados"
                onClick={() => onVisualizarConta(conta)}
              >
                <Eye size={16} />
              </button>

              <button
                title="Editar conta"
                onClick={() => onEditarConta(conta)}
              >
                <Pencil size={16} />
              </button>

              <button
                title="Excluir conta"
                onClick={() => onExcluirConta(conta.id)}
              >
                <Trash2 size={16} />
              </button>
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function FormularioConta({
  contaEditando,
  versaoFormulario,
  onSalvarConta,
  onCancelarEdicao,
}) {
  const [form, setForm] = useState(formVazio);

  useEffect(() => {
    if (contaEditando) {
      setForm({
        usuario: contaEditando.usuario || "",
        senhaTikTok: contaEditando.senhaTikTok || "",
        email: contaEditando.email || "",
        senhaEmail: contaEditando.senhaEmail || "",
        pais: contaEditando.pais || "Brasil",
        grupo: contaEditando.grupo || "Geral",
        status: contaEditando.status || "Disponível",
        dataCriacao: contaEditando.dataCriacao || "",
        link: contaEditando.link || "",
        observacao: contaEditando.observacao || "",
      });
    } else {
      setForm(formVazio);
    }
  }, [contaEditando?.id, versaoFormulario]);

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function salvar() {
    onSalvarConta(form);
  }

  return (
    <div className="painel formulario">
      <span className="etiqueta">Cadastro manual</span>
      <h3>{contaEditando ? "Editar conta" : "Nova conta"}</h3>

      <label>Usuário *</label>
      <input
        value={form.usuario}
        onChange={(e) => atualizar("usuario", e.target.value)}
        placeholder="@usuario"
      />

      <label>Senha TikTok *</label>
      <input
        value={form.senhaTikTok}
        onChange={(e) => atualizar("senhaTikTok", e.target.value)}
        placeholder="senha do TikTok"
      />

      <label>Email *</label>
      <input
        value={form.email}
        onChange={(e) => atualizar("email", e.target.value)}
        placeholder="email da conta"
      />

      <label>Senha Email *</label>
      <input
        value={form.senhaEmail}
        onChange={(e) => atualizar("senhaEmail", e.target.value)}
        placeholder="senha do email"
      />

      <div className="duasColunas">
        <div>
          <label>País *</label>
          <select
            value={form.pais}
            onChange={(e) => atualizar("pais", e.target.value)}
          >
            {paises.map((pais) => (
              <option key={pais}>{pais}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Grupo *</label>
          <select
            value={form.grupo}
            onChange={(e) => atualizar("grupo", e.target.value)}
          >
            {grupos.map((grupo) => (
              <option key={grupo}>{grupo}</option>
            ))}
          </select>
        </div>
      </div>

      <label>Status *</label>
      <select
        value={form.status}
        onChange={(e) => atualizar("status", e.target.value)}
      >
        {statusLista.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>

      <label>Data de criação *</label>
      <input
        type="date"
        value={form.dataCriacao}
        onChange={(e) => atualizar("dataCriacao", e.target.value)}
      />

      <label>Link</label>
      <input
        value={form.link}
        onChange={(e) => atualizar("link", e.target.value)}
        placeholder="link da conta ou pasta"
      />

      <label>Observação</label>
      <textarea
        value={form.observacao}
        onChange={(e) => atualizar("observacao", e.target.value)}
        placeholder="Anotações importantes..."
      />

      <button className="salvar" onClick={salvar}>
        <Plus size={18} />
        {contaEditando ? "Salvar edição" : "Adicionar conta"}
      </button>

      {contaEditando && (
        <button className="cancelar" onClick={onCancelarEdicao}>
          Cancelar edição
        </button>
      )}
    </div>
  );
}

function GerenciamentoDeContas({
  arquivoRef,
  importarExcel,
  exportarExcel,
  busca,
  setBusca,
  paisFiltro,
  setPaisFiltro,
  contasFiltradas,
  contaEditando,
  versaoFormulario,
  salvarConta,
  cancelarEdicaoConta,
  visualizarConta,
  editarConta,
  excluirConta,
}) {
  return (
    <section className="areaPrincipal">
      <div className="painel painelLista">
        <div className="cabecalhoPainel">
          <div>
            <span className="etiqueta">Controle</span>
            <h3>Gerenciador de Contas</h3>
          </div>

          <div className="botoesTopo">
            <input
              ref={arquivoRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: "none" }}
              onChange={importarExcel}
            />

            <button
              className="botaoPrincipal"
              onClick={() => arquivoRef.current.click()}
            >
              <FileUp size={17} />
              Importar Excel
            </button>

            <button className="botaoPrincipal" onClick={exportarExcel}>
              <FileDown size={17} />
              Exportar Excel
            </button>
          </div>
        </div>

        <div className="filtros" style={{ marginBottom: 16 }}>
          <div className="busca">
            <Search size={16} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar conta..."
            />
          </div>

          <select
            value={paisFiltro}
            onChange={(e) => setPaisFiltro(e.target.value)}
          >
            <option>Todos</option>
            {paises.map((pais) => (
              <option key={pais}>{pais}</option>
            ))}
          </select>
        </div>

        <TabelaContas
          lista={contasFiltradas}
          vazio="Nenhuma conta cadastrada ainda."
          onVisualizarConta={visualizarConta}
          onEditarConta={editarConta}
          onExcluirConta={excluirConta}
        />
      </div>

      <FormularioConta
        contaEditando={contaEditando}
        versaoFormulario={versaoFormulario}
        onSalvarConta={salvarConta}
        onCancelarEdicao={cancelarEdicaoConta}
      />
    </section>
  );
}

function ContasDisponiveis({
  lista,
  filtroPaisDisponiveis,
  setFiltroPaisDisponiveis,
  visualizarConta,
  editarConta,
  excluirConta,
}) {
  return (
    <section className="painel painelLista">
      <div className="cabecalhoPainel">
        <div>
          <span className="etiqueta">Disponíveis</span>
          <h3>Contas disponíveis</h3>
        </div>

        <div className="filtroPaisesRapido">
          {filtrosPaisDisponiveis.map((item) => (
            <button
              key={item.value}
              className={
                filtroPaisDisponiveis === item.value
                  ? "filtroPaisBtn ativo"
                  : "filtroPaisBtn"
              }
              onClick={() => setFiltroPaisDisponiveis(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <TabelaContas
        lista={lista}
        vazio="Nenhuma conta disponível nesse filtro."
        onVisualizarConta={visualizarConta}
        onEditarConta={editarConta}
        onExcluirConta={excluirConta}
      />
    </section>
  );
}

function ContasVendidas({
  contasVendidas,
  contasParaSelecionarVenda,
  salvarVenda,
  excluirConta,
}) {
  const [vendaEditandoId, setVendaEditandoId] = useState(null);
  const [venda, setVenda] = useState(vendaVazia);

  function atualizar(campo, valor) {
    setVenda((atual) => ({ ...atual, [campo]: valor }));
  }

  function limparVenda() {
    setVendaEditandoId(null);
    setVenda(vendaVazia);
  }

  function iniciarEdicaoVenda(conta) {
    setVendaEditandoId(conta.id);
    setVenda({
      contaId: conta.id,
      valorVenda: String(conta.valorVenda || "").replace(".", ","),
      clienteNome: conta.clienteNome || "",
      clienteTelefone: conta.clienteTelefone || "",
    });
  }

  function salvar() {
    const ok = salvarVenda(venda, vendaEditandoId);
    if (ok) limparVenda();
  }

  const contasSelect = contasParaSelecionarVenda.filter(
    (conta) => conta.status !== "Vendida" || conta.id === vendaEditandoId
  );

  return (
    <section className="areaPrincipal">
      <div className="painel painelLista">
        <div className="cabecalhoPainel">
          <div>
            <span className="etiqueta">Vendas</span>
            <h3>Contas vendidas</h3>
          </div>
        </div>

        <div className="tabela">
          <div className="linha cabecalhoTabela">
            <span>Conta</span>
            <span>Cliente</span>
            <span>Telefone</span>
            <span>Valor</span>
            <span>Ações</span>
          </div>

          {contasVendidas.length === 0 ? (
            <div className="vazio">Nenhuma conta vendida ainda.</div>
          ) : (
            contasVendidas.map((conta) => (
              <div className="linha" key={conta.id}>
                <span>
                  <b>{conta.usuario}</b>
                  <small>{conta.email}</small>
                </span>

                <span>{conta.clienteNome || "-"}</span>
                <span>{conta.clienteTelefone || "-"}</span>
                <span>{moeda(conta.valorVenda)}</span>

                <span className="acoes">
                  <button
                    title="Editar venda"
                    onClick={() => iniciarEdicaoVenda(conta)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    title="Excluir conta"
                    onClick={() => excluirConta(conta.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="painel formulario">
        <span className="etiqueta">
          {vendaEditandoId ? "Editar venda" : "Registrar venda"}
        </span>
        <h3>
          {vendaEditandoId ? "Editar dados da venda" : "Nova venda"}
        </h3>

        <label>Selecionar conta *</label>
        <select
          value={venda.contaId}
          disabled={Boolean(vendaEditandoId)}
          onChange={(e) => atualizar("contaId", e.target.value)}
        >
          <option value="">Escolha uma conta</option>
          {contasSelect.map((conta) => (
            <option key={conta.id} value={conta.id}>
              {conta.usuario} - {conta.email}
            </option>
          ))}
        </select>

        <label>Valor vendido *</label>
        <input
          value={venda.valorVenda}
          onChange={(e) => atualizar("valorVenda", e.target.value)}
          placeholder="Ex: 150,00"
        />

        <label>Nome do cliente *</label>
        <input
          value={venda.clienteNome}
          onChange={(e) => atualizar("clienteNome", e.target.value)}
          placeholder="Nome do comprador"
        />

        <label>Telefone do cliente *</label>
        <input
          value={venda.clienteTelefone}
          onChange={(e) => atualizar("clienteTelefone", e.target.value)}
          placeholder="WhatsApp ou telefone"
        />

        <button className="salvar" onClick={salvar}>
          <DollarSign size={18} />
          {vendaEditandoId
            ? "Salvar edição da venda"
            : "Salvar venda"}
        </button>

        {vendaEditandoId && (
          <button className="cancelar" onClick={limparVenda}>
            <X size={16} />
            Cancelar edição
          </button>
        )}
      </div>
    </section>
  );
}

function TelaSimples({ tituloAtual }) {
  return (
    <section className="painel telaSimples">
      <span className="etiqueta">{tituloAtual}</span>
      <h3>{tituloAtual}</h3>
      <p>
        Esta área está separada. O próximo passo é criar os campos específicos
        desse módulo.
      </p>
    </section>
  );
}

export default function App() {
  const arquivoRef = useRef(null);

  const [pagina, setPagina] = useState("home");
  const [contas, setContas] = useState(() => carregarContas());
  const [busca, setBusca] = useState("");
  const [paisFiltro, setPaisFiltro] = useState("Todos");
  const [filtroPaisDisponiveis, setFiltroPaisDisponiveis] =
    useState("Todos");
  const [editandoId, setEditandoId] = useState(null);
  const [anoDashboard, setAnoDashboard] = useState("2026");
  const [versaoFormulario, setVersaoFormulario] = useState(0);
  const [contaVisualizando, setContaVisualizando] = useState(null);

  useEffect(() => {
    localStorage.setItem("ferrari_contas", JSON.stringify(contas));
  }, [contas]);

  const contaEditando = useMemo(() => {
    return contas.find((conta) => conta.id === editandoId) || null;
  }, [contas, editandoId]);

  function cancelarEdicaoConta() {
    setEditandoId(null);
    setVersaoFormulario((v) => v + 1);
  }

  function validarConta(dados) {
    const faltando = obrigatorios.filter(
      (campo) => !String(dados[campo] || "").trim()
    );

    if (faltando.length > 0) {
      alert(
        "Preencha todos os campos obrigatórios:\n\nusuário\nsenha tik tok\nemail\nsenha email\npaís\ngrupo\nstatus\ndata de criação"
      );
      return false;
    }

    return true;
  }

  function salvarConta(dadosFormulario) {
    if (!validarConta(dadosFormulario)) return;

    if (editandoId) {
      setContas((listaAtual) =>
        listaAtual.map((conta) =>
          conta.id === editandoId
            ? {
                ...conta,
                ...dadosFormulario,
                atualizadoEm: new Date().toLocaleString("pt-BR"),
              }
            : conta
        )
      );

      setEditandoId(null);
      setVersaoFormulario((v) => v + 1);
      return;
    }

    const novaConta = {
      id: crypto.randomUUID(),
      ...dadosFormulario,
      valorVenda: "",
      clienteNome: "",
      clienteTelefone: "",
      dataVenda: "",
      criadoEmSistema: new Date().toLocaleString("pt-BR"),
      atualizadoEm: new Date().toLocaleString("pt-BR"),
    };

    setContas((listaAtual) => [novaConta, ...listaAtual]);
    setVersaoFormulario((v) => v + 1);
  }

  function editarConta(conta) {
    setEditandoId(conta.id);
    setPagina("gerenciamento");
  }

  function excluirConta(id) {
    if (!window.confirm("Deseja excluir esta conta?")) return;

    setContas((listaAtual) =>
      listaAtual.filter((conta) => conta.id !== id)
    );

    if (editandoId === id) {
      setEditandoId(null);
      setVersaoFormulario((v) => v + 1);
    }

    setContaVisualizando((contaAtual) =>
      contaAtual?.id === id ? null : contaAtual
    );
  }

  function salvarVenda(dadosVenda, vendaEditandoId) {
    if (
      !dadosVenda.contaId ||
      !dadosVenda.valorVenda ||
      !dadosVenda.clienteNome ||
      !dadosVenda.clienteTelefone
    ) {
      alert(
        "Preencha conta, valor, nome do cliente e telefone do cliente."
      );
      return false;
    }

    const valor = Number(
      String(dadosVenda.valorVenda).replace(",", ".")
    );

    if (Number.isNaN(valor) || valor <= 0) {
      alert("Digite um valor de venda válido.");
      return false;
    }

    const dataVendaAtual = new Date().toLocaleDateString("pt-BR");

    setContas((listaAtual) =>
      listaAtual.map((conta) =>
        conta.id === dadosVenda.contaId
          ? {
              ...conta,
              status: "Vendida",
              valorVenda: valor,
              clienteNome: dadosVenda.clienteNome,
              clienteTelefone: dadosVenda.clienteTelefone,
              dataVenda: vendaEditandoId
                ? conta.dataVenda || dataVendaAtual
                : dataVendaAtual,
              atualizadoEm: new Date().toLocaleString("pt-BR"),
            }
          : conta
      )
    );

    alert(
      vendaEditandoId
        ? "Venda editada com sucesso."
        : "Venda registrada com sucesso."
    );
    return true;
  }

  function importarExcel(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = (e) => {
      try {
        const dados = new Uint8Array(e.target.result);
        const workbook = XLSX.read(dados, { type: "array" });
        const primeiraAba = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraAba];
        const linhas = XLSX.utils.sheet_to_json(planilha, {
          defval: "",
        });

        const importadas = [];
        const ignoradas = [];

        linhas.forEach((linha, index) => {
          const conta = {
            id: crypto.randomUUID(),
            usuario: valorDaLinha(linha, ["usuario", "usuário"]),
            senhaTikTok: valorDaLinha(linha, [
              "senha tik tok",
              "senha tiktok",
              "senha_tik_tok",
            ]),
            email: valorDaLinha(linha, ["email", "e-mail"]),
            senhaEmail: valorDaLinha(linha, [
              "senha email",
              "senha e-mail",
              "senha_email",
            ]),
            pais: valorDaLinha(linha, ["pais", "país"]),
            grupo: valorDaLinha(linha, ["grupo"]),
            status: valorDaLinha(linha, ["status"]),
            dataCriacao: valorDaLinha(linha, [
              "data de criação",
              "data criacao",
              "data_criacao",
            ]),
            link: valorDaLinha(linha, ["link"]),
            observacao: valorDaLinha(linha, [
              "observação",
              "observacao",
              "obs",
            ]),
            valorVenda: "",
            clienteNome: "",
            clienteTelefone: "",
            dataVenda: "",
            criadoEmSistema: new Date().toLocaleString("pt-BR"),
            atualizadoEm: new Date().toLocaleString("pt-BR"),
          };

          const faltaCampo = obrigatorios.some(
            (campo) => !String(conta[campo] || "").trim()
          );

          if (faltaCampo) {
            ignoradas.push(index + 2);
          } else {
            importadas.push(conta);
          }
        });

        if (importadas.length === 0) {
          alert(
            "Nenhuma conta foi importada. Verifique os campos obrigatórios."
          );
          return;
        }

        setContas((listaAtual) => [...importadas, ...listaAtual]);

        let mensagem = `${importadas.length} conta(s) importada(s) com sucesso.`;

        if (ignoradas.length > 0) {
          mensagem += `\n\nLinhas ignoradas: ${ignoradas.join(", ")}`;
        }

        alert(mensagem);
      } catch {
        alert("Erro ao importar a planilha.");
      } finally {
        event.target.value = "";
      }
    };

    leitor.readAsArrayBuffer(arquivo);
  }

  function exportarExcel() {
    if (contas.length === 0) {
      alert("Não existem contas para exportar.");
      return;
    }

    const dados = contas.map((conta) => ({
      usuario: conta.usuario || "",
      "senha tik tok": conta.senhaTikTok || "",
      email: conta.email || "",
      "senha email": conta.senhaEmail || "",
      pais: conta.pais || "",
      grupo: conta.grupo || "",
      status: conta.status || "",
      "data de criação": conta.dataCriacao || "",
      link: conta.link || "",
      observação: conta.observacao || "",
      "valor venda": conta.valorVenda || "",
      "cliente nome": conta.clienteNome || "",
      "cliente telefone": conta.clienteTelefone || "",
      "data venda": conta.dataVenda || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Contas");
    XLSX.writeFile(workbook, "ferrari-control-contas.xlsx");
  }

  const contasFiltradas = useMemo(() => {
    return contas.filter((conta) => {
      const texto =
        `${conta.usuario} ${conta.email} ${conta.pais} ${conta.grupo} ${conta.status}`.toLowerCase();
      const passaBusca = texto.includes(busca.toLowerCase());
      const passaPais =
        paisFiltro === "Todos" || paisCombina(conta.pais, paisFiltro);

      return passaBusca && passaPais;
    });
  }, [contas, busca, paisFiltro]);

  const contasDisponiveisFiltradas = useMemo(() => {
    return contas.filter((conta) => {
      const statusDisponivel = conta.status === "Disponível";
      const passaPais = paisCombina(
        conta.pais,
        filtroPaisDisponiveis
      );
      return statusDisponivel && passaPais;
    });
  }, [contas, filtroPaisDisponiveis]);

  const contasVendidas = contas.filter(
    (conta) => conta.status === "Vendida"
  );
  const contasParaSelecionarVenda = contas;

  const total = contas.length;
  const disponiveis = contas.filter(
    (conta) => conta.status === "Disponível"
  ).length;
  const vendidas = contasVendidas.length;
  const problemas = contas.filter(
    (conta) => conta.status === "Problema"
  ).length;
  const faturamentoTotal = contas.reduce(
    (soma, conta) => soma + Number(conta.valorVenda || 0),
    0
  );

  const dadosGrafico = useMemo(() => {
    const base = nomesMeses.map((mes) => ({
      mes,
      faturamento: 0,
      contasVendidas: 0,
    }));

    contas
      .filter((conta) => conta.status === "Vendida")
      .forEach((conta) => {
        const infoData = extrairAnoMes(conta.dataVenda);
        if (!infoData) return;

        if (String(infoData.ano) !== String(anoDashboard)) return;

        const indiceMes = infoData.mes - 1;
        if (indiceMes < 0 || indiceMes > 11) return;

        base[indiceMes].faturamento += Number(
          conta.valorVenda || 0
        );
        base[indiceMes].contasVendidas += 1;
      });

    return base;
  }, [contas, anoDashboard]);

  function renderConteudo() {
    if (pagina === "home") {
      return (
        <Dashboard
          total={total}
          disponiveis={disponiveis}
          faturamentoTotal={faturamentoTotal}
          problemas={problemas}
          vendidas={vendidas}
          anoDashboard={anoDashboard}
          setAnoDashboard={setAnoDashboard}
          dadosGrafico={dadosGrafico}
        />
      );
    }

    if (pagina === "gerenciamento") {
      return (
        <GerenciamentoDeContas
          arquivoRef={arquivoRef}
          importarExcel={importarExcel}
          exportarExcel={exportarExcel}
          busca={busca}
          setBusca={setBusca}
          paisFiltro={paisFiltro}
          setPaisFiltro={setPaisFiltro}
          contasFiltradas={contasFiltradas}
          contaEditando={contaEditando}
          versaoFormulario={versaoFormulario}
          salvarConta={salvarConta}
          cancelarEdicaoConta={() => {
            setEditandoId(null);
            setVersaoFormulario((v) => v + 1);
          }}
          visualizarConta={setContaVisualizando}
          editarConta={editarConta}
          excluirConta={excluirConta}
        />
      );
    }

    if (pagina === "disponiveis") {
      return (
        <ContasDisponiveis
          lista={contasDisponiveisFiltradas}
          filtroPaisDisponiveis={filtroPaisDisponiveis}
          setFiltroPaisDisponiveis={setFiltroPaisDisponiveis}
          visualizarConta={setContaVisualizando}
          editarConta={editarConta}
          excluirConta={excluirConta}
        />
      );
    }

    if (pagina === "vendidas") {
      return (
        <ContasVendidas
          contasVendidas={contasVendidas}
          contasParaSelecionarVenda={contasParaSelecionarVenda}
          salvarVenda={salvarVenda}
          excluirConta={excluirConta}
        />
      );
    }

    const tituloAtual =
      menus.find((menu) => menu.id === pagina)?.nome ||
      "Ferrari Control";

    return <TelaSimples tituloAtual={tituloAtual} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logoArea">
          <div className="logo">F</div>
          <div>
            <h1>Ferrari Control</h1>
            <p>Gestão de contas e operação</p>
          </div>
        </div>

        <div className="menuLabel">Navegação</div>

        <nav>
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <button
                key={menu.id}
                className={
                  pagina === menu.id ? "menuItem ativo" : "menuItem"
                }
                onClick={() => setPagina(menu.id)}
              >
                <Icon size={18} />
                <span>{menu.nome}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="conteudo">{renderConteudo()}</main>

      <DetalhesConta
        conta={contaVisualizando}
        onFechar={() => setContaVisualizando(null)}
      />
    </div>
  );
}
