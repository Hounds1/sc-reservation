'use client';

import { Modal } from '@/components/ui/Modal';
import { SignupForm } from './SignupForm';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <SignupForm onSuccess={onClose} />
    </Modal>
  );
}
