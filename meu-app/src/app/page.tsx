"use client";

import ClientList from "@/components/ui/ClientList";
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Cabeçalho com gradiente e animação */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-3 shadow-md mb-4"
      >
        <h1 className="text-2xl font-bold text-center font-sans">GO-ENTULHO</h1>
      </motion.div>
      
      {/* O componente ClientList já tem seu próprio container e estilos */}
      <ClientList />
    </main>
  );
}