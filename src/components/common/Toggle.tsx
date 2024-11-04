interface ToggleProps {
  name: string;
  defaultValue?: boolean;
  label?: string;
  style?: string;
  disabled?: boolean;
  children?: any;
  onChange: () => void;
}

function Toggle({
  name,
  label,
  defaultValue,
  style,
  disabled,
  children,
  onChange,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-center">
      <input
        id={name}
        type="checkbox"
        className="appearance-none peer w-9 focus:outline-none checked:bg-green-200 h-5 bg-gray-300 rounded-full before:inline-block before:rounded-full before:bg-gray-500 checked:before:bg-green-600 before:h-4 before:w-4 checked:before:translate-x-full cursor-pointer shadow-inner transition-all duration-400 before:ml-0.5 before:mt-0.5"
        defaultChecked={defaultValue}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        htmlFor={name}
        className={`flex flex-col justify-center py-2 ml-2 px-2 select-none text-sm font-medium ${
          disabled ? 'text-gray-500' : style
        }`}
      >
        {children ? children : label}
      </label>
    </div>
  );
}

export default Toggle;
