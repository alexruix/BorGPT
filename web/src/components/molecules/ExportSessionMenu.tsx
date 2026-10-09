import React, { useState, useRef, useEffect } from 'react';
import type { DialogueMessage } from '@/types/stage';
import {
  exportSessionToMarkdown,
  exportSessionToJson,
  triggerBrowserDownload,
} from '@/utils/sessionExport';

interface ExportSessionMenuProps {
  messages: DialogueMessage[];
  currentPhase?: string;
}

export const ExportSessionMenu: React.FC<ExportSessionMenuProps> = ({ messages, currentPhase }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExportMarkdown = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const mdContent = exportSessionToMarkdown(messages, currentPhase);
    triggerBrowserDownload(mdContent, `libreto_ensayo_borgpt_${timestamp}.md`, 'text/markdown');
    setIsOpen(false);
  };

  const handleExportJson = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const jsonContent = exportSessionToJson(messages, currentPhase);
    triggerBrowserDownload(jsonContent, `telemetria_ensayo_borgpt_${timestamp}.json`, 'application/json');
    setIsOpen(false);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={!hasMessages}
        title={hasMessages ? 'Exportar libreto o registro de la función' : 'Aún no hay diálogos en la sesión'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md border transition-all duration-200 ${
          hasMessages
            ? 'bg-stage-surface/80 hover:bg-stage-surface text-arg-celeste-light border-arg-celeste/40 hover:border-arg-celeste shadow-xs hover:shadow-arg-celeste/20 cursor-pointer active:scale-98'
            : 'bg-stage-surface/30 text-text-muted border-stage-border cursor-not-allowed opacity-50'
        }`}
      >
        <svg
          className="w-3.5 h-3.5 text-arg-sol"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Exportar función</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg bg-stage-surface border border-stage-border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-stage-border bg-stage-bg/60">
            <p className="text-[11px] font-sans font-semibold text-text-primary">
              Registro dramatúrgico
            </p>
            <p className="text-[10px] font-mono text-text-tertiary">
              {messages.length} intervenciones registradas
            </p>
          </div>

          <div className="p-1 space-y-0.5">
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="w-full text-left flex items-start gap-2.5 px-2.5 py-2 text-xs rounded-md text-text-primary hover:bg-arg-celeste-dim/20 hover:text-arg-celeste-light transition-colors group cursor-pointer"
            >
              <span className="text-base leading-none">📄</span>
              <div>
                <p className="font-semibold text-[11px] text-text-primary group-hover:text-arg-celeste-light">
                  Libreto Markdown (.md)
                </p>
                <p className="text-[10px] text-text-tertiary">
                  Formato de lectura con pensamientos y acotaciones para dirección.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="w-full text-left flex items-start gap-2.5 px-2.5 py-2 text-xs rounded-md text-text-primary hover:bg-arg-sol-dim/20 hover:text-arg-sol-light transition-colors group cursor-pointer"
            >
              <span className="text-base leading-none">⚙️</span>
              <div>
                <p className="font-semibold text-[11px] text-text-primary group-hover:text-arg-sol-light">
                  Telemetría JSON (.json)
                </p>
                <p className="text-[10px] text-text-tertiary">
                  Datos crudos con timestamps exactos para análisis del engine.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
