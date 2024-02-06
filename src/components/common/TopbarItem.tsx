interface TopbarItemProps {
  children: any;
}

export default function TopbarItem({ children }: TopbarItemProps) {
  return <li className="flex items-center mx-3">{children}</li>;
}
