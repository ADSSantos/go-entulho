"use client";

import React, { useState, useEffect } from "react";
import CustomInput from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";
//import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaPhone, FaMapMarkerAlt, FaEuroSign, FaCalendarAlt, FaClock, FaEnvira, FaLevelDownAlt, FaPortrait } from "react-icons/fa";

interface FormProps {
  onSubmitSuccess: (newClient: Client) => void;
  editingClient?: Client | null;
  onCancelEdit?: () => void;
}

const Form = ({ onSubmitSuccess, editingClient, onCancelEdit }: FormProps) => {
  const isEditing = Boolean(editingClient);

  const [formData, setFormData] = useState<Client>(
    editingClient || {
      nif: "",
      nome: "",
      numero: "",
      tipo: "",
      local: "",
      valor: "",
      valorIva: "",
      taxaIva: "",
      valorTotal: "",
      descarga: "",
      data: "",
      hora: "",
      trabalhoConcluido: false,
      pagamentoRealizado: false,
    }
  );

  const [errors, setErrors] = useState({
    nif: "",
    numero: "",
    valor: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        valorIva: "",
        taxaIva: "",
        valorTotal: "",
        descarga: "",
        data: "",
        hora: "",
        trabalhoConcluido: false,
        pagamentoRealizado: false,
      });
    }
  }, [editingClient]);

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

  const calcularValorComIva = (valor: string, taxa: '6' | '23' | '') => {
    if (!valor || !taxa) return '';

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    const taxaNumerico = parseFloat(taxa);

    const valorComIva = valorNumerico * (1 + taxaNumerico / 100);
    return valorComIva.toFixed(2).replace('.', ',');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    let valorFormatado = value;

    if (id === "nif" || id === "numero") {
      valorFormatado = formatarNumero(value);
    }

    if (id === "valor") {
      // Substituir vírgula por ponto para cálculos
      valorFormatado = value.replace(',', '.');

      // Validar valor
      if (!/^\d+([.]\d{1,2})?$/.test(valorFormatado)) {
        setErrors({ ...errors, valor: "Valor inválido" });
        return;
      } else {
        setErrors({ ...errors, valor: "" });
      }
    }

    if (id === "taxaIva") {
      // Calcular valor com IVA quando a taxa muda
      const valorComIva = calcularValorComIva(formData.valor, value as '6' | '23' | '');

      setFormData({
        ...formData,
        [id]: value as '6' | '23' | '',
        valorIva: valorComIva,
        valorTotal: valorComIva
      });
      return;
    }

    // Para outros campos, atualiza normalmente
    setFormData({ ...formData, [id]: valorFormatado });

    // Se for valor, recalcula IVA se já tiver taxa selecionada
    if (id === "valor" && formData.taxaIva) {
      const valorComIva = calcularValorComIva(valorFormatado, formData.taxaIva as '6' | '23');
      setFormData(prev => ({
        ...prev,
        valor: valorFormatado,
        valorIva: valorComIva,
        valorTotal: valorComIva
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "nif" || id === "numero") {
      const numeros = value.replace(/\D/g, "");
      if (numeros.length < 9) {
        setErrors({ ...errors, [id]: `O ${id === "nif" ? "NIF" : "número"} deve ter 9 dígitos.` });
      } else {
        setErrors({ ...errors, [id]: "" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      alert("Por favor, corrija os erros antes de prosseguir.");
      setIsSubmitting(false);
      return;
    }

    const isFormValid = Object.entries(formData).every(
      ([key, value]) =>
        key === "trabalhoConcluido" ||
        key === "pagamentoRealizado" ||
        key === "valorIva" ||
        key === "taxaIva" ||
        key === "valorTotal" ||
        (typeof value === "string" && value.trim() !== "")
    );

    if (!isFormValid) {
      alert("Por favor, preencha todos os campos.");
      setIsSubmitting(false);
      return;
    }

    // Simula uma requisição assíncrona
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Envia os dados para o componente pai
    onSubmitSuccess(formData);

    // Feedback visual
    //alert(isEditing ? "Cliente atualizado com sucesso!" : "Cliente adicionado com sucesso!");

    // Limpa o formulário se não estiver editando
    if (!isEditing) {
      setFormData({
        nif: "",
        nome: "",
        numero: "",
        tipo: "",
        local: "",
        valor: "",
        valorIva: "",
        taxaIva: "",
        valorTotal: "",
        descarga: "",
        data: "",
        hora: "",
        trabalhoConcluido: false,
        pagamentoRealizado: false,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
      {/* Campos do formulário com ícones e animações */}
      <CustomInput
        label="NIF"
        id="nif"
        placeholder="000-000-000"
        value={formData.nif}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.nif}
        icon={<FaPortrait className="text-gray-400" />}
      />
      <CustomInput
        label="Nome"
        id="nome"
        placeholder="Nome completo"
        value={formData.nome}
        onChange={handleChange}
        icon={<FaUser className="text-gray-400" />}
      />
      <CustomInput
        label="Número"
        id="numero"
        placeholder="000-000-000"
        value={formData.numero}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.numero}
        icon={<FaPhone className="text-gray-400" />}
      />
      <CustomInput
        label="Tipo de Entulho"
        id="tipo"
        placeholder="Tipo de entulho"
        value={formData.tipo}
        onChange={handleChange}
        icon={<FaEnvira  className="text-gray-400" />}
      />
      <CustomInput
        label="Endereço"
        id="local"
        placeholder="Endereço completo"
        value={formData.local}
        onChange={handleChange}
        icon={<FaMapMarkerAlt className="text-gray-400" />}
      />
      <CustomInput
        label="Valor do Serviço (€)"
        id="valor"
        placeholder="Valor sem IVA"
        value={formData.valor.replace('.', ',')}
        onChange={handleChange}
        error={errors.valor}
        icon={<FaEuroSign className="text-gray-400" />}
      />
      <div className="relative">
        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          Selecione a taxa de IVA
        </label>
        <select
          id="taxaIva"
          value={formData.taxaIva}
          onChange={handleChange}
          className="w-full p-3 text-base border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecione a taxa de IVA</option>
          <option value="6" className="text-gray-600">IVA 6%</option>
          <option value="23">IVA 23%</option>
        </select>
      </div>
      {formData.valorIva && (
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-gray-400">Valor com IVA: {formData.valorIva} €</p>
        </div>
      )}

<CustomInput
        label="Descarga (€)"
        id="descarga"
        placeholder="Valor Da Descarga"
        value={formData.descarga}
        onChange={handleChange}
        icon={<FaLevelDownAlt className="text-gray-300" />}
      />

      <CustomInput
        label="Data"
        id="data"
        type="date"
        placeholder=""
        value={formData.data}
        onChange={handleChange}
        icon={<FaCalendarAlt className="text-gray-400" />}
      />
      <CustomInput
        label="Hora"
        id="hora"
        type="time"
        placeholder=""
        value={formData.hora}
        onChange={handleChange}
        icon={<FaClock className="text-gray-400" />}
      />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button
          type="submit"
          className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processando..." : isEditing ? "Atualizar" : "Adicionar"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            onClick={onCancelEdit}
            className="py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium text-base"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default Form;