import React, { Suspense } from 'react';
import Header from './Header';
import Banner from './Banner';
import IdeasListClient from './IdeasListClient';

export default function IdeasPage() {
  return (
    <>
      <Header />
      <Banner />
      <main style={{ padding: '32px 0', background: '#fafbfc', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Suspense fallback={<div>Loading ideas...</div>}>
            <IdeasListClient />
          </Suspense>
        </div>
      </main>
    </>
  );
} 