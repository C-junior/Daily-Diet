import { UtensilsCrossed } from 'lucide-react';
import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', light = false }) => {
  const iconBoxSize =
    size === 'sm' ? 'h-8 w-8 rounded-lg' : size === 'lg' ? 'h-11 w-11 rounded-xl' : 'h-9 w-9 rounded-xl';
  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div
        className={`flex items-center justify-center bg-emerald-600 text-white shadow-xs ${iconBoxSize}`}
      >
        <UtensilsCrossed className="h-4 w-4 stroke-[2.4]" />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-extrabold tracking-tight ${textSize} ${
            light ? 'text-white' : 'text-slate-900'
          }`}
        >
          Daily<span className={light ? 'text-emerald-300' : 'text-emerald-600'}>Diet</span>
        </span>
      </div>
    </div>
  );
};
