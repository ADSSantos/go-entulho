"use client";

import React, { useState, useEffect, useRef } from "react";
import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Check, Search, Edit, Trash, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Form from "@/components/Form";

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchNumber, setSearchNumber] = useState("");
  const [foundClientNif, setFoundClientNif] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [sortBy, setSortBy] = useState<"nome" | "data" | "valorTotal">("nome");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Refs para rolagem
  const clientRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Verificar se o componente está montado (cliente)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Carregar clientes do localStorage ao iniciar (apenas no cliente)
  useEffect(() => {
    if (isMounted) {
      const savedClients = localStorage.getItem("clients");
      if (savedClients) {
        try {
          setClients(JSON.parse(savedClients));
          toast.success("Clientes carregados com sucesso!");
        } catch (e) {
          console.error("Erro ao carregar clientes do localStorage:", e);
          setClients([]);
          toast.error("Erro ao carregar clientes.");
        }
      }
    }
  }, [isMounted]);

  // Salvar clientes no localStorage sempre que mudar (apenas no cliente)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("clients", JSON.stringify(clients));
    }
  }, [clients, isMounted]);

  // Função para lidar com a adição de um novo cliente ou atualização de existente
  const handleClientSubmit = (clientData: Client) => {
    if (editingClient) {
      // Modo de edição: atualizar cliente existente
      const updatedClients = clients.map((client) =>
        client.nif === editingClient.nif ? clientData : client
      );
      setClients(updatedClients);
      setEditingClient(null); // Limpar o modo de edição
      toast.success("Cliente atualizado com sucesso!");
    } else {
      // Modo de adição: adicionar novo cliente
      setClients([...clients, clientData]);
      toast.success("Cliente adicionado com sucesso!");
    }
  };

  // Função para iniciar a edição de um cliente
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    // Rolar para o formulário (apenas no cliente)
    if (isMounted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Função para alternar o status de trabalho concluído
  const toggleTrabalhoStatus = (nif: string) => {
    const updatedClients = clients.map((client) => {
      if (client.nif === nif) {
        return { ...client, trabalhoConcluido: !client.trabalhoConcluido };
      }
      return client;
    });

    setClients(updatedClients);
    toast.success("Status de trabalho atualizado!");
  };

  // Função para alternar o status de pagamento
  const togglePagamentoStatus = (nif: string) => {
    const updatedClients = clients.map((client) => {
      if (client.nif === nif) {
        return { ...client, pagamentoRealizado: !client.pagamentoRealizado };
      }
      return client;
    });

    setClients(updatedClients);
    toast.success("Status de pagamento atualizado!");
  };

  // Função para remover um cliente com animação de fragmentação
  const handleDeleteClient = (nif: string) => {
    if (isMounted) {
      // Exibe um toast personalizado com botões de confirmação e cancelamento
      toast.custom(
        (t) => (
          <div className="dark:bg-gray-800/20 p-4 rounded-lg shadow-lg flex flex-col items-center backdrop-blur-lg bg-opacity-75">
            <p className="text-lg font-medium mb-4">Tem certeza que deseja excluir este cliente?</p>
            <div className="flex gap-3">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  // Filtra a lista de clientes, removendo o cliente com o NIF especificado
                  const updatedClients = clients.filter((client) => client.nif !== nif);
  
                  // Atualiza o estado e o localStorage
                  setClients(updatedClients);
                  localStorage.setItem("clients", JSON.stringify(updatedClients));
  
                  // Exibe uma mensagem de sucesso
                  toast.success("Cliente excluído com sucesso!", {
                    duration: 1000, // 1 segundos
                  });
  
                  // Fecha o toast de confirmação
                  toast.dismiss(t.id);
                }}
              >
                Excluir
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  // Fecha o toast de confirmação sem fazer nada
                  toast.dismiss(t.id);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity, // Mantém o toast aberto até o usuário interagir
        }
      );
    }
  };

  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setEditingClient(null);
    toast("Edição cancelada.", { icon: "⚠️" });
  };

  // Função para buscar cliente por número de telefone
  const searchClient = () => {
    if (!isMounted) return;

    // Formatar número para busca (removendo formatação)
    const formattedSearch = searchNumber.replace(/\D/g, "");

    // Buscar cliente pelo número
    const found = clients.find((client) => {
      const clientNum = client.numero.replace(/\D/g, "");
      // Busca parcial (se o número digitado está contido no número do cliente)
      return clientNum.includes(formattedSearch);
    });

    if (found) {
      // Definir o NIF do cliente encontrado para destacá-lo
      setFoundClientNif(found.nif);

      // Rolar até o cliente encontrado
      setTimeout(() => {
        if (clientRefs.current[found.nif]) {
          clientRefs.current[found.nif]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      // Limpar o destaque após 3 segundos
      setTimeout(() => {
        setFoundClientNif(null);
      }, 5000);
    } else {
      // Não encontrou nenhum cliente
      toast.error("Nenhum cliente encontrado com este número.");
      setFoundClientNif(null);
    }
  };

  // Função para ordenar os clientes
  const sortedClients = [...clients].sort((a, b) => {
    if (sortBy === "nome") {
      return sortOrder === "asc" ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome);
    } else if (sortBy === "data") {
      return sortOrder === "asc" ? a.data.localeCompare(b.data) : b.data.localeCompare(a.data);
    } else {
      const valorA = parseFloat(a.valorTotal.replace(",", "."));
      const valorB = parseFloat(b.valorTotal.replace(",", "."));
      return sortOrder === "asc" ? valorA - valorB : valorB - valorA;
    }
  });

  // Renderização condicional para evitar erros de hidratação
  if (!isMounted) {
    return (
      <div className="center-container debug-border-red">
  <h6 className="text-xl font-bold dark:text-gray-500 text-center debug-border-blue">Adicionar Novo Cliente</h6>
        <Form onSubmitSuccess={handleClientSubmit} editingClient={null} onCancelEdit={handleCancelEdit} />
        <h2 className="text-lg font-bold mt-6 mb-3">Lista de Clientes</h2>
        <p className="text-center text-gray-500 py-4">Carregando...</p>
      </div>
    );
  }
  // Variavel responsavel por definir a cor do texto nas tags span
  const textColor = "text-gray-500";

  return (
    <div className="w-full px-3 py-4 max-w-lg mx-auto ">
      <Toaster /> {/* Adiciona o componente Toaster para exibir as mensagens */}
      <h1 className="text-xl font-bold mb-4 ml-4 text-center dark:text-gray-300">
        {editingClient ? "Editar Cliente" : "Adicionar Novo Cliente"}
      </h1>

      <Form
        onSubmitSuccess={handleClientSubmit}
        editingClient={editingClient}
        onCancelEdit={handleCancelEdit}
      />

      <h2 className="text-lg font-bold mt-6 mb-3 dark:text-gray-300">Lista de Clientes</h2>

      {/* Campo de busca por número de telefone */}
      <div className="flex flex-col mb-4 p-3  rounded-lg shadow-sm">
        <div className="w-full" >
          <label htmlFor="searchNumber" className="block text-sm font-medium dark:text-gray-300 mb-1">
            Buscar por número
          </label>
          <div className="flex gap-2 ">
            <input
              type="text"
              id="searchNumber"
              className="w-full p-3 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 123-456-789"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchClient()}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-md flex items-center justify-center"
              onClick={searchClient}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Ordenação */}
      <div className="flex items-center gap-2 mb-4 ">
        <span className="text-sm font-medium">Ordenar por:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "nome" | "data" | "valorTotal")}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option className=" dark:bg-gray-400" value="nome">Nome</option>
          <option className=" dark:bg-gray-400" value="data">Data</option>
          <option className=" dark:bg-gray-400" value="valorTotal">Valor Total</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="p-2 dark:bg-gray-400 rounded-md hover:bg-gray-300"
        >
          <ArrowUpDown size={16} />
        </button>
      </div>

      {clients.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Nenhum cliente cadastrado.</p>
      ) : (
        <div className="space-y-4" >
          <AnimatePresence>
            {sortedClients.map((client) => (
              <motion.div
                key={client.nif}
                ref={(el) => {
                  clientRefs.current[client.nif] = el;
                }}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.1, x: 100, rotate: 360 }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                className={`border-2 rounded-lg p-4 shadow transition-all duration-300 ${
                  client.trabalhoConcluido && client.pagamentoRealizado
                    ? "border-l-8 border-l-green-500"
                    : client.trabalhoConcluido
                    ? "border-l-8 border-l-yellow-500"
                    : "border-gray-200"
                } ${
                  foundClientNif === client.nif
                    ? "bg-blue-50 scale-102 ring-2 ring-blue-400"
                    : "bg-white"
                }`}
              >
                
                <h3  className={`text-xl font-bold ${textColor}`}>{client.nome}</h3>
                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 mt-2 ">
                  <span className={`font-medium ${textColor}`}>NIF:</span>
                  <span className={`font-medium  ${textColor}`}>{client.nif}</span>

                  <span className={`font-medium  ${textColor}`}>Número:</span>
                  <span className={foundClientNif === client.nif ? "font-bold dark: bg-yellow-400 px-1" : `font-medium ${textColor}`} >
                    {client.numero}
                  </span>

                  <span className={`font-medium  ${textColor}`}>Tipo:</span>
                  <span className={`font-medium  ${textColor}`}>{client.tipo}</span>

                  <span className={`font-medium  ${textColor}`}>Endereço:</span>
                  <span className={`font-medium  ${textColor}`}>{client.local}</span>

                  <span className={`font-medium  ${textColor}`}>Valor s/ IVA:</span>
                  <span className={`font-medium  ${textColor}`}>{client.valor} €</span>

                  <span className={`font-medium  ${textColor}`}>Taxa IVA:</span>
                  <span className={`font-medium  ${textColor}`}>{client.taxaIva ? `${client.taxaIva}%` : "N/A"}</span>

                  <span className={`font-medium  ${textColor}`}>Valor c/ IVA:</span>
                  <span className={`font-medium  ${textColor}`}>{client.valorTotal} €</span>

                  <span className={`font-medium  ${textColor}`}>Descarga:</span>
                  <span className={`font-medium  ${textColor}`}>{client.descarga} €</span>

                  <span className={`font-medium  ${textColor}`}>Data:</span>
                  <span className={`font-medium  ${textColor}`}>{client.data}</span>

                  <span className={`font-medium  ${textColor}`}>Hora:</span>
                  <span className={`font-medium  ${textColor}`}>{client.hora}</span>
                </div>
                <div className="flex justify-between items-center mt-3 mb-1">
                  <div className="flex items-center">
                    <span className={`font-medium mr-2 ${textColor}`}>Trabalho:</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center  cursor-pointer transition-colors ${
                        client.trabalhoConcluido ? "bg-green-500" : "bg-gray-200"
                      }`}
                      onClick={() => toggleTrabalhoStatus(client.nif)}
                    >
                      {client.trabalhoConcluido && <Check size={16} className="text-white" />}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className={`font-medium mr-2 ${textColor}`}>Pagamento:</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        client.pagamentoRealizado ? "bg-green-500" : "bg-gray-200"
                      }`}
                      onClick={() => togglePagamentoStatus(client.nif)}
                    >
                      {client.pagamentoRealizado && <Check size={16} className="text-white" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    onClick={() => handleEditClient(client)}
                    className="py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-base"
                  >
                    <Edit size={16} className="mr-2" /> Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClient(client.nif)}
                    className="py-3 bg-red-500 hover:bg-red-600 text-white font-medium text-base"
                  >
                    <Trash size={16} className="mr-2" /> Excluir
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ClientList;