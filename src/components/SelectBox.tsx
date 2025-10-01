import '../styles/select.scss';

// src/components/SelectBox.tsx
import React from 'react';

type SelectBoxProps = {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  label?: string;
};

const SelectBox: React.FC<SelectBoxProps> = ({
  value,
  options,
  onChange,
  label,
}) => {
  return (
    <div className="select-container">
      {label && <div className="select-label">{label}</div>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="select"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
