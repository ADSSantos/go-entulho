export interface Client {
  nif: string;
  nome: string;
  numero: string;
  tipo: string;
  local: string;
  valor: string;
  valorIva: string;
  taxaIva: "6" | "23" | "";
  valorTotal: string;
  data: string;
  hora: string;
  trabalhoConcluido: boolean;
  pagamentoRealizado: boolean;
}
