"use client";

import React, { useState, useEffect, useRef } from "react";
import Form from "@/components/Form";
import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Check, Search } from "lucide-react";

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchNumber, setSearchNumber] = useState("");
  const [foundClientNif, setFoundClientNif] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Refs para rolagem
  const clientRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

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
        } catch (e) {
          console.error("Erro ao carregar clientes do localStorage:", e);
          setClients([]);
        }
      }
    }
  }, [isMounted]);

  // Salvar clientes no localStorage sempre que mudar (apenas no cliente)
  useEffect(() => {
    if (isMounted && clients.length > 0) {
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
    } else {
      // Modo de adição: adicionar novo cliente
      setClients([...clients, clientData]);
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
    const updatedClients = clients.map(client => {
      if (client.nif === nif) {
        return { ...client, trabalhoConcluido: !client.trabalhoConcluido };
      }
      return client;
    });
    
    setClients(updatedClients);
  };

  // Função para alternar o status de pagamento
  const togglePagamentoStatus = (nif: string) => {
    const updatedClients = clients.map(client => {
      if (client.nif === nif) {
        return { ...client, pagamentoRealizado: !client.pagamentoRealizado };
      }
      return client;
    });
    
    setClients(updatedClients);
  };

  // Função para remover um cliente
  const handleDeleteClient = (nif: string) => {
    if (isMounted) {
      const confirmed = window.confirm("Tem certeza que deseja excluir este cliente?");
      if (confirmed) {
        const updatedClients = clients.filter((client) => client.nif !== nif);
        setClients(updatedClients);
      }
    }
  };

  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setEditingClient(null);
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
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
      
      // Limpar o destaque após 3 segundos
      setTimeout(() => {
        setFoundClientNif(null);
      }, 3000);
    } else {
      // Não encontrou nenhum cliente
      alert("Nenhum cliente encontrado com este número.");
      setFoundClientNif(null);
    }
  };

  // Renderização condicional para evitar erros de hidratação
  if (!isMounted) {
    return (
      <div className="w-full px-3 py-4 max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-4">
          Adicionar Novo Cliente
        </h1>
        
        <Form 
          onSubmitSuccess={handleClientSubmit} 
          editingClient={null}
          onCancelEdit={handleCancelEdit}
        />
        
        <h2 className="text-lg font-bold mt-6 mb-3">Lista de Clientes</h2>
        <p className="text-center text-gray-500 py-4">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-3 py-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {editingClient ? "Editar Cliente" : "Adicionar Novo Cliente"}
      </h1>
      
      <Form 
        onSubmitSuccess={handleClientSubmit} 
        editingClient={editingClient}
        onCancelEdit={handleCancelEdit}
      />
      
      <h2 className="text-lg font-bold mt-6 mb-3">Lista de Clientes</h2>
      
      {/* Campo de busca por número de telefone */}
      <div className="flex flex-col mb-4 p-3 bg-gray-50 rounded-lg shadow-sm">
        <div className="w-full">
          <label htmlFor="searchNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por número
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="searchNumber"
              className="w-full p-3 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 123-456-789"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchClient()}
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
      
      {clients.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Nenhum cliente cadastrado.</p>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => (
            <div 
              key={client.nif} 
              ref={(el) => {
                clientRefs.current[client.nif] = el;
              }}
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
              <h3 className="font-bold text-lg">{client.nome}</h3>
              <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 mt-2">
                <span className="font-medium">NIF:</span>
                <span>{client.nif}</span>
                
                <span className="font-medium">Número:</span>
                <span className={foundClientNif === client.nif ? "font-bold bg-yellow-200 px-1" : ""}>
                  {client.numero}
                </span>
                
                <span className="font-medium">Tipo:</span>
                <span>{client.tipo}</span>
                
                <span className="font-medium">Endereço:</span>
                <span>{client.local}</span>
                
                <span className="font-medium">Valor:</span>
                <span>{client.valor}</span>
                
                <span className="font-medium">Data:</span>
                <span>{client.data}</span>
                
                <span className="font-medium">Hora:</span>
                <span>{client.hora}</span>
              </div>
              <div className="flex justify-between items-center mt-3 mb-1">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Trabalho:</span>
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      client.trabalhoConcluido 
                      ? "bg-green-500" 
                      : "bg-gray-200"
                    }`}
                    onClick={() => toggleTrabalhoStatus(client.nif)}
                  >
                    {client.trabalhoConcluido && <Check size={16} className="text-white" />}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="font-medium mr-2">Pagamento:</span>
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      client.pagamentoRealizado 
                      ? "bg-green-500" 
                      : "bg-gray-200"
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
                  Editar
                </Button>
                <Button 
                  onClick={() => handleDeleteClient(client.nif)}
                  className="py-3 bg-red-500 hover:bg-red-600 text-white font-medium text-base"
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;