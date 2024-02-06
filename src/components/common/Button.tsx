type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
  title: string;
  type: ButtonType;
  disabled?: boolean;
  style?: string;
  onClick?: () => void;
}

export default function Button({
  title,
  type = 'button',
  disabled = false,
  style,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={
        'w-2/5 px-5 py-2.5 leading-tight rounded-md font-medium text-sm text-center shadow-lg shadow-slate-900/30 ease-linear transition-all duration-150 hover:shadow-slate-900/50 ' +
        style
      }
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
}
