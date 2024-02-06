import { useGlobalState } from '../utils/useGlobalState';

interface FooterProps {
  children?: any;
}

function Footer({ children }: FooterProps) {
  const { globalState } = useGlobalState();

  return (
    <footer className="pt-8 pb-2 bg-gradient-to-t from-black/60">
      <div className="container relative mx-auto px-4">
        {children}
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center text-white/70">
            <div className="text-xs py-1">
              <span className="font-semibold tracking-wider">Board App</span>{' '}
              &copy; {new Date().getFullYear()}
              <a
                className={`${
                  globalState.mobile ? 'hidden' : ''
                } text-xs hover:text-white`}
                href="https://coredata.pl"
                target="blank"
                rel="noreferrer"
              >
                <p className="">coredata.pl</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
