'use client';

import { useState } from 'react';
import { LoginModal } from '../auth/LoginModal';

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header>
      <button onClick={() => setIsLoginModalOpen(true)}>
        로그인
      </button>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}