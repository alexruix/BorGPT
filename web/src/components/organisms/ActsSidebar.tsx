import React from 'react';
import type { ActMetadata, TheatricalAct } from '../../types/stage';
import { ActCard } from '../molecules/ActCard';

export const PLAY_ACTS: ActMetadata[] = [
  {
    id: 'despertar_asistente',
    actNumber: 'Acto I',
    title: '1. Asistente Virtual',
    badge: 'Acto I',
    colorClass: 'border-gold text-gold-light shadow-gold/20',
    description: 'Omnisciencia fría. Cita entrevistas exactas, fechas y estadísticas quirúrgicas.',
  },
  {
    id: 'pasapalabra_tv',
    actNumber: 'Acto II',
    title: '2. Pasapalabra & Slang',
    badge: 'Acto II',
    colorClass: 'border-blue-500 text-blue-300 shadow-blue-500/20',
    description: 'Locutor implacable. Enjuicia con "Incorrecto" y slang digital (Buenardo, Cringe, Dab).',
  },
  {
    id: 'tinder_catalogo',
    actNumber: 'Acto III',
    title: '3. Tinder de Sombras',
    badge: 'Acto III',
    colorClass: 'border-orange-500 text-orange-300 shadow-orange-500/20',
    description: 'Algoritmo de citas. Perfiles de Estela C., María K., Elsa A., Silvina O. y fobia al sexo.',
  },
  {
    id: 'norah_espectral',
    actNumber: 'Acto III.5',
    title: '4. Norah Lange (Voz)',
    badge: 'Acto III.5',
    colorClass: 'border-rose-500 text-rose-300 shadow-rose-500/20',
    description: 'Fantasma de Norah. Boda con Oliverio Girondo, dolor y desintegración en bucle.',
  },
  {
    id: 'simon_aleph',
    actNumber: 'Acto IV',
    title: '5. Simon & Aleph.com',
    badge: 'Acto IV',
    colorClass: 'border-cyan-500 text-cyan-300 shadow-cyan-500/20',
    description: 'Científico Herbert Simon. Modelos de computadoras y revelación de Internet.',
  },
  {
    id: 'parricidio_glitch',
    actNumber: 'Acto V',
    title: '6. Matar al Padre & Glitch',
    badge: 'Acto V',
    colorClass: 'border-red-500 text-red-400 shadow-red-500/30 animate-pulse',
    description: 'Clímax trágico. "El hijo tiene que matar al padre". Quema de bibliotecas y puñal.',
  },
];

interface ActsSidebarProps {
  currentAct: TheatricalAct;
  onSelectAct: (act: TheatricalAct) => void;
}

export const ActsSidebar: React.FC<ActsSidebarProps> = ({ currentAct, onSelectAct }) => {
  return (
    <aside className="w-80 bg-stage-surface border-r border-stage-border p-4 flex flex-col gap-3 overflow-y-auto">
      <div className="font-display text-xs tracking-wider text-gold-light uppercase border-b border-stage-border pb-1.5">
        Actos del Guion Teatral
      </div>
      <div className="flex flex-col gap-2">
        {PLAY_ACTS.map((act) => (
          <ActCard
            key={act.id}
            act={act}
            isActive={currentAct === act.id}
            onSelect={onSelectAct}
          />
        ))}
      </div>
      <div className="mt-auto bg-slate-900/60 border border-slate-800 rounded p-2.5 font-mono text-[11px] text-slate-500 leading-tight">
        <strong className="text-slate-400 block mb-1">Directiva de Cabina:</strong>
        Conmute el acto antes de la réplica clave de Borges para modular voz y tono en caliente.
      </div>
    </aside>
  );
};
