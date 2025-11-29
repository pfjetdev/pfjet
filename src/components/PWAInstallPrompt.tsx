'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPrompt(false);
      setIsClosing(false);
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }, 300);
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 transition-all duration-300 ease-out ${
        isClosing ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="bg-background rounded-2xl shadow-2xl border border-border p-4 flex items-center gap-4">
        {/* App Icon */}
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-black">
          <Image
            src="/icons/icon-96x96.png"
            alt="PF Jet"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">PF Jet</h3>
          <p className="text-xs text-muted-foreground">Add to Home Screen</p>
        </div>

        {/* Install Button */}
        <button
          onClick={handleInstall}
          className="flex-shrink-0 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Install
        </button>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1.5 rounded-full hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
