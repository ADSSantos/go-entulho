/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Habilita a exportação estática
  images: {
    unoptimized: true, // Desativa a otimização de imagens para exportação estática
  },
};


module.exports = nextConfig;