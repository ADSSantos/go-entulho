const nextConfig = {
  output: 'export',
  generateBuildId: () => {
    // Gere um ID único para a build (por exemplo, um timestamp ou hash)
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;