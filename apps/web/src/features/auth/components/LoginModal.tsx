'use client';

import { Modal } from '@/components/ui/Modal';
import { LoginForm } from './LoginForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LoginForm onSuccess={onClose} />
    </Modal>
  );
}
