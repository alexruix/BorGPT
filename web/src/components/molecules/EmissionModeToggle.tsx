import React from 'react';
import { PingDot, Badge } from '../atoms';

interface EmissionModeToggleProps {
  manualApproval: boolean;
  onToggle: (enabled: boolean) => void;
  hasPendingRelease?: boolean;
}

export const EmissionModeToggle: React.FC<EmissionModeToggleProps> = ({
  manualApproval,
  onToggle,
  hasPendingRelease,
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!manualApproval)}
      title="Alternar entre transmisión en vivo automática y validación previa por cabina"
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-sans transition-all cursor-pointer ${
        manualApproval
          ? 'bg-stage-elevated border-arg-celeste text-arg-celeste-light shadow-sm shadow-arg-celeste/20 ring-1 ring-arg-celeste/40'
          : 'bg-stage-surface border-stage-border text-text-secondary hover:text-text-primary'
      }`}
    >
      <PingDot
        color={manualApproval ? 'celeste' : 'emerald'}
        isPinging={manualApproval && hasPendingRelease}
        size="md"
      />
      <span className="font-medium">
        {manualApproval ? 'Retención previa activa' : 'Emisión en vivo'}
      </span>
      {manualApproval && (
        <Badge variant="celeste" size="sm">
          Hold
        </Badge>
      )}
    </button>
  );
};
