import imgIconCheck from '../../assets/img/icons/icon-checkmark.svg';

interface CheckboxProps {
  name: string;
  defaultValue?: boolean;
  label?: string;
  style?: string;
  children?: any;
  onChange: () => void;
}

function Checkbox({
  name,
  label,
  defaultValue,
  style,
  children,
  onChange,
}: CheckboxProps) {
  return (
    <>
      <input
        id={name}
        type="checkbox"
        className="appearance-none relative peer w-6 h-6 p-px shrink-0 bg-gray-300 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-green-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:bg-green-600 checked:border-green-600 focus:checked:border-green-600 disabled:border-steel-400 disabled:bg-steel-400"
        defaultChecked={defaultValue}
        onChange={onChange}
      />
      <label
        htmlFor={name}
        className={'w-full py-2 ml-2 text-sm font-medium ' + style}
      >
        {children ? children : label}
      </label>
      <img
        src={imgIconCheck}
        width={4}
        height={4}
        className="absolute w-4 h-4 ml-1 hidden peer-checked:block pointer-events-none"
        alt="ok"
      />
    </>
  );
}

export default Checkbox;
