import React from 'react';
import { Card, Kbd, Button } from '@/components/atoms';

interface StageHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StageHelpModal: React.FC<StageHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      key: 'Enter',
      label: 'Enviar réplica',
      desc: 'Procesa el pie del actor y genera la respuesta de BorGPT.',
    },
    {
      key: 'Espacio',
      label: 'Lanzar a sala',
      desc: 'En modo retención, proyecta el texto y emite el audio a los parlantes.',
    },
    {
      key: 'ESC',
      label: 'Cortar voz',
      desc: 'Corta inmediatamente el audio y frena la generación en escena.',
    },
    {
      key: 'Ctrl + M',
      label: 'Silenciar parlantes',
      desc: 'Activa o apaga la salida de audio hacia la sala de teatro.',
    },
    {
      key: 'Ctrl + Enter',
      label: 'Apuntar a BorGPT',
      desc: 'Envía una instrucción interna que solo lee la IA (invisible al público).',
    },
    {
      key: '1 a 4',
      label: 'Cambiar de acto',
      desc: 'Modula el tono dramático de BorGPT según la progresión de la obra.',
    },
    {
      key: '?',
      label: 'Abrir / Cerrar ayuda',
      desc: 'Muestra esta guía rápida de cabina en cualquier momento.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <Card
        elevation="elevated"
        className="w-full max-w-xl p-6 bg-stage-surface border border-gold/40 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stage-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base" aria-hidden="true">📖</span>
            <h2 id="help-title" className="font-display font-bold text-sm text-gold-light">
              Guía rápida de cabina teatral
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar ayuda">
            ✕
          </Button>
        </div>

        <p className="font-body text-xs text-text-secondary mb-4 leading-relaxed">
          Esta consola permite al regidor conducir las intervenciones del avatar en vivo. Todos los controles responden al teclado sin necesidad de usar el ratón durante la función:
        </p>

        <div className="grid grid-cols-1 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-stage-card/70 border border-stage-border rounded-lg p-2.5 text-xs"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-display font-semibold text-text-primary text-xs">
                  {s.label}
                </span>
                <span className="font-body text-text-tertiary text-[11px]">
                  {s.desc}
                </span>
              </div>
              <Kbd variant="gold" className="shrink-0 text-xs px-2 py-1">
                {s.key}
              </Kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-stage-border/60 flex items-center justify-between">
          <span className="text-[11px] font-sans text-text-tertiary">
            Presioná <Kbd>?</Kbd> o <Kbd>ESC</Kbd> para salir de esta pantalla
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Entendido
          </Button>
        </div>
      </Card>
    </div>
  );
};
