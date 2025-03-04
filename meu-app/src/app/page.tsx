"use client";

import ClientList from "@/components/ui/ClientList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <div className="w-full bg-blue-600 text-white py-4 px-3 shadow-md mb-4">
        <h1 className="text-xl font-bold text-center">GO-ENTULHO</h1>
      </div>
      
      {/* O componente ClientList já tem seu próprio container e estilos */}
      <ClientList />
    </main>
  );
}