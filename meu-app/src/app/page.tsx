"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import ClientList from "@/components/ui/ClientList";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Cabeçalho com gradiente e animação */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-3 shadow-md"
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-sans mx-auto transform translate-x-7">GO-ENTULHO</h1>
          {/* Botão de alternar tema */}
          <ThemeToggle />
        </div>
      </motion.div>

      {/* Container principal para o ClientList */}
      <div className="container mx-auto flex-1 p-4">
        <ClientList />
      </div>
    </main>
  );
}
