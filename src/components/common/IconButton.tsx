interface IconButtonProps {
  iconSrc: string;
  width?: number;
  height?: number;
  title?: string;
  alt?: string;
  onClick?: (...arg: any[]) => void;
}

export default function IconButton({
  iconSrc,
  width = 4,
  height = 4,
  title,
  alt,
  onClick,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className="absolute right-0 bottom-0 top-0 px-2 py-1 my-1 mr-1 font-medium text-xs leading-tight rounded-md text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-700 ease-linear transition-all duration-150"
      onClick={onClick}
      title={title}
    >
      <img
        aria-hidden="true"
        className="w-4 h-4"
        width={width}
        height={height}
        src={iconSrc}
        alt={alt}
      />
    </button>
  );
}
