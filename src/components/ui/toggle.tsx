import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between py-3.5 select-none cursor-pointer group ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="pr-4 flex-1">
        <span className="block text-sm font-semibold text-[#18241f] group-hover:text-[#0f382c] transition-colors">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-[#5e6b64] mt-0.5 leading-relaxed">
            {description}
          </span>
        )}
      </div>

      {/* Apple iOS Style Fluid Pill Toggle: Zero borders, Zero shadows */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onChange(!checked);
        }}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-250 ease-out focus:outline-none ${
          checked ? 'bg-[#0f382c]' : 'bg-black/[0.1]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white transition duration-250 ease-out mt-0.5 ml-0.5 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
