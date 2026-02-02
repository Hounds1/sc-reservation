'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
}

export function Modal({ isOpen, onClose, children, showCloseButton = true }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isClosingRef = useRef(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      isClosingRef.current = false;
      setIsVisible(true);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // 다음 프레임에서 애니메이션 시작
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else if (isVisible && !isClosingRef.current) {
      // 외부에서 isOpen이 false가 되었을 때 닫기 애니메이션 수행
      isClosingRef.current = true;
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'unset';
      }, 200);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isVisible]);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsAnimating(false);
    // 애니메이션 완료 후 실제로 닫기
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      onClose();
    }, 200); // 애니메이션 duration과 일치
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-200 ease-out
        ${isAnimating ? 'bg-black/50' : 'bg-black/0'}
      `}
      onClick={handleClose}
    >
      <div 
        className={`
          relative
          transition-all duration-200 ease-out
          ${isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={handleClose}
            className={`
              absolute -top-2 -right-2 z-10 w-8 h-8 
              bg-white rounded-full shadow-lg 
              flex items-center justify-center 
              hover:bg-gray-100 hover:scale-110
              transition-all duration-150
            `}
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
