'use client';

import { Modal } from '../ui/AuthModal';
import { SignupCard } from './SignupCard';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <SignupCard onSuccess={onClose} />
    </Modal>
  );
}