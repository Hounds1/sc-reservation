'use client';

import { Modal } from '../ui/AuthModal';
import { LoginCard } from './LoginCard';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LoginCard onSuccess={onClose} />
    </Modal>
  );
}