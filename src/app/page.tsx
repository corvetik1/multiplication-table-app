'use client';

import dynamic from 'next/dynamic';

// Динамический импорт компонента для предотвращения ошибок SSR с MUI
const MultiplicationApp = dynamic(
  () => import('../components/MultiplicationApp'),
  { ssr: false }
);

export default function Home() {
  return <MultiplicationApp />;
}
