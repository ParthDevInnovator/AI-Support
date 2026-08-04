import { forwardRef } from 'react';

export const InputField = forwardRef<HTMLInputElement, any>(({ id, label, type = 'text', placeholder, error, rightSlot, ...rest }, ref) => {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-sm font-medium" style={{ color: '#F0ECE6' }}>{label}</label>
                {rightSlot}
            </div>
            <input
                id={id}
                ref={ref}
                type={type}
                placeholder={placeholder}
                style={{
                    backgroundColor: '#1f1209',
                    borderColor: error ? '#EA610E' : '#64290C',
                    color: '#F0ECE6',
                    outline: 'none',
                }}
                className="w-full h-11 px-4 rounded-xl border text-sm transition-all focus:border-[#EA610E] placeholder:text-[#5a4435]"
                {...rest}
            />
            {error && <p className="text-xs font-medium" style={{ color: '#EA610E' }}>{error}</p>}
        </div>
    );
});
InputField.displayName = 'InputField';
