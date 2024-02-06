import imgIconCheck from '../../assets/img/icons/icon-checkmark.svg';

interface CheckboxProps {
  name: string;
  defaultValue: boolean;
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
        className="relative peer w-4 h-4 p-2 appearance-none shrink-0 bg-gray-100 border-2 border-indigo-700 rounded checked:border-indigo-800 checked:bg-indigo-800 checked:text-gray-100 hover:bg-indigo-600 hover:border-indigo-600 focus:outline-none focus:ring-offset-0 focus:ring-0 focus:ring-indigo-600 disabled:border-steel-400 disabled:bg-steel-400"
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
        className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none"
        alt="ok"
      />
    </>
  );
}

export default Checkbox;
