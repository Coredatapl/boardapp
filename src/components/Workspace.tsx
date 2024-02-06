interface WorkspaceProps {
  children: any;
}

function Workspace({ children }: WorkspaceProps) {
  return (
    <div className="flex flex-col items-center justify-center grow">
      {children}
    </div>
  );
}

export default Workspace;
