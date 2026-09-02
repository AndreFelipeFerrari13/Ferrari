import {
  LayoutDashboard,
  Users,
  DollarSign,
  Settings,
  CheckCircle2,
  Package,
  ClipboardList,
} from "lucide-react";

export const menus = [
  { id: "home", nome: "Visão Geral", icon: LayoutDashboard },
  {
    id: "gerenciamento",
    nome: "Gerenciamento de Contas",
    icon: ClipboardList,
  },
  { id: "disponiveis", nome: "Contas disponíveis", icon: Users },
  { id: "vendidas", nome: "Contas vendidas", icon: CheckCircle2 },
  { id: "producao", nome: "Controle de Produção", icon: Package },
  { id: "financeiro", nome: "Controle Financeiro", icon: DollarSign },
  { id: "adm", nome: "Sistema / ADM Geral", icon: Settings },
];

export const paises = ["Brasil", "EUA", "Alemanha", "Outro"];

export const filtrosPaisDisponiveis = [
  { label: "Todos", value: "Todos" },
  { label: "Brasil", value: "Brasil" },
  { label: "Estados Unidos", value: "EUA" },
  { label: "Alemanha", value: "Alemanha" },
];

export const grupos = [
  "Geral",
  "Shop BR",
  "Shop EUA",
  "Shop ALE",
  "Monetização",
];

export const statusLista = [
  "Disponível",
  "Vendida",
  "Aquecendo",
  "Ativa",
  "Pausada",
  "Problema",
];

export const obrigatorios = [
  "usuario",
  "senhaTikTok",
  "email",
  "senhaEmail",
  "pais",
  "grupo",
  "status",
  "dataCriacao",
];

export const nomesMeses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const formVazio = {
  usuario: "",
  senhaTikTok: "",
  email: "",
  senhaEmail: "",
  pais: "Brasil",
  grupo: "Geral",
  status: "Disponível",
  dataCriacao: "",
  link: "",
  observacao: "",
};

export const vendaVazia = {
  contaId: "",
  valorVenda: "",
  clienteNome: "",
  clienteTelefone: "",
};
