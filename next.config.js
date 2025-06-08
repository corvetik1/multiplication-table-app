/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем проверку ESLint при сборке
  eslint: {
    // Предупреждения и ошибки ESLint не будут вызывать сбой сборки
    ignoreDuringBuilds: true,
  },
  // Отключаем проверку типов TypeScript при сборке
  typescript: {
    // Ошибки TypeScript не будут вызывать сбой сборки
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
