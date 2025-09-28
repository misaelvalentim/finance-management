import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const baseClasses =
      'w-full bg-gray-200 rounded-lg border-2 border-transparent px-3 py-2.5 placeholder-gray-500 transition-colors focus:bg-white focus:outline-none';
    const hoverClasses = 'hover:border-magenta/50';
    const focusClasses =
      'focus:border-transparent focus:outline focus:outline-dashed focus:outline-2 focus:outline-offset-4 focus:outline-magenta';

    if (isPassword) {
      return (
        <div className="relative group">
          <input
            type={inputType}
            className={`${baseClasses} ${hoverClasses} ${focusClasses} pr-10`}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 group-focus-within:text-magenta"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={`${baseClasses} ${hoverClasses} ${focusClasses} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
