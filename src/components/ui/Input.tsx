import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

/** Input táctil. type="date" cubre el date picker nativo del sistema. */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`h-12 w-full rounded-md border bg-surface px-3.5 text-base text-foreground outline-none transition placeholder:text-muted focus:ring-2 focus:ring-primary/40 ${
        invalid ? 'border-danger' : 'border-border focus:border-primary'
      } ${className}`}
      {...props}
    />
  );
});

export default Input;
