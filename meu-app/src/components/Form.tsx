"use client";

import React, { useState, useEffect } from "react";
import { CustomInput } from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";


interface FormProps {
  onSubmitSuccess: (newClient: Client) => void;
  editingClient?: Client | null;
  onCancelEdit?: () => void; // Nova prop para cancelar edição
}

const Form = ({ onSubmitSuccess, editingClient, onCancelEdit }: FormProps) => {
  // Estado para controlar se estamos em modo de edição
  const isEditing = Boolean(editingClient);
  
  const [formData, setFormData] = useState<Client>(
    editingClient || {
      nif: "",
      nome: "",
      numero: "",
      tipo: "",
      local: "",
      valor: "",
      data: "",
      hora: "",
      trabalhoConcluido: false,
      pagamentoRealizado: false,
    }
  );

  // Reset do formulário quando editingClient muda
  useEffect(() => {
    if (editingClient) {
      setFormData(editingClient);
    } else {
      setFormData({
        nif: "",
        nome: "",
        numero: "",
        tipo: "",
        local: "",
        valor: "",
        data: "",
        hora: "",
        trabalhoConcluido: false,
        pagamentoRealizado: false,
      });
    }
  }, [editingClient]);

  const [errors, setErrors] = useState({
    nif: "",
    numero: "",
  });

  const formatarNumero = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 3) {
      return numeros;
    } else if (numeros.length <= 6) {
      return `${numeros.slice(0, 3)}-${numeros.slice(3)}`;
    } else {
      return `${numeros.slice(0, 3)}-${numeros.slice(3, 6)}-${numeros.slice(6, 9)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    
    // Tratamento especial para checkboxes
    if (type === "checkbox") {
      setFormData({ ...formData, [id]: checked });
      return;
    }
    
    let valorFormatado = value;

    if (id === "nif" || id === "numero") {
      valorFormatado = formatarNumero(value);
    }

    if (
      id === "nome" ||
      id === "tipo" ||
      id === "local" ||
      id === "valor"
    ) {
      if (value.length > 30) {
        setErrors({ ...errors, [id]: "Máximo de 30 caracteres permitido." });
        return;
      } else {
        setErrors({ ...errors, [id]: "" });
      }
    }

    setFormData({ ...formData, [id]: valorFormatado });

    if (id === "nif" || id === "numero") {
      const numeros = valorFormatado.replace(/\D/g, "");
      if (numeros.length > 9) {
        setErrors({ ...errors, [id]: "Máximo de 9 dígitos permitido." });
      } else if (numeros.length < 9) {
        setErrors({ ...errors, [id]: "Digite exatamente 9 dígitos." });
      } else if (!/^\d*$/.test(numeros)) {
        setErrors({ ...errors, [id]: "Apenas números são permitidos." });
      } else {
        setErrors({ ...errors, [id]: "" });
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "nif" || id === "numero") {
      const numeros = value.replace(/\D/g, "");
      if (numeros.length < 9) {
        e.target.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      alert("Por favor, corrija os erros antes de prosseguir.");
      return;
    }

    const isFormValid = Object.entries(formData).every(
      ([key, value]) => key === "trabalhoConcluido" || key === "pagamentoRealizado" || (typeof value === "string" && value.trim() !== "")
    );
    if (!isFormValid) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Envia os dados para o componente pai
    onSubmitSuccess(formData);

    // Se NÃO estiver editando, limpa o formulário
    if (!isEditing) {
      setFormData({
        nif: "",
        nome: "",
        numero: "",
        tipo: "",
        local: "",
        valor: "",
        data: "",
        hora: "",
        trabalhoConcluido: false,
        pagamentoRealizado: false,
      });

      alert("Cliente adicionado com sucesso!");
    } else {
      // Se estiver editando
      alert("Cliente atualizado com sucesso!");
      
      // Se existir a função de cancelar edição, chama ela
      if (onCancelEdit) {
        onCancelEdit();
      }
    }
  };

  // Função para cancelar a edição
  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
      <CustomInput
        label="Digite o NIF"
        id="nif"
        placeholder="000-000-000"
        value={formData.nif}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.nif}
      />
      <CustomInput
        label="Digite o nome"
        id="nome"
        placeholder=""
        value={formData.nome}
        onChange={handleChange}
      />
      <CustomInput
        label="Digite o número"
        id="numero"
        placeholder="000-000-000"
        value={formData.numero}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.numero}
      />
      <CustomInput
        label="Digite o tipo de entulho"
        id="tipo"
        placeholder=""
        value={formData.tipo}
        onChange={handleChange}
      />
      <CustomInput
        label="Digite o endereço"
        id="local"
        placeholder=""
        value={formData.local}
        onChange={handleChange}
      />
      <CustomInput
        label=""
        id="valor"
        placeholder="000"
        value={formData.valor}
        onChange={handleChange}
      />
      <CustomInput
        label="Data"
        id="data"
        type="date"
        value={formData.data}
        onChange={handleChange}
      />
      <CustomInput
        label="Hora"
        id="hora"
        type="time"
        value={formData.hora}
        onChange={handleChange}
      />
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button type="submit" className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base">
          {isEditing ? "Atualizar" : "Adicionar"}
        </Button>
        
        {isEditing && (
          <Button 
            type="button" 
            onClick={handleCancel} 
            className="py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium text-base"
          >
            Cancelar
          </Button>
        )}
        
        {isEditing ? null : (
          <div></div> // Espaço vazio para manter o grid alinhado quando não há botão cancelar
        )}
      </div>
    </form>
  );
};

export default Form;