import { useEffect, useState } from 'react';
import { UnsplashApi } from '../utils/unsplash/UnsplashApi';

interface AppViewProps {
  children: any;
}

export default function AppView({ children }: AppViewProps) {
  const bgChangeInterval = 15 * 60 * 1000;
  const Unsplash = new UnsplashApi();
  const [bgUrl, setBgUrl] = useState(Unsplash.getRandom());

  useEffect(() => {
    setInterval(() => {
      setBgUrl(Unsplash.getRandom());
    }, bgChangeInterval);
  }, []);
  return (
    <div
      className="app-background ease-linear transition-all duration-500"
      style={{ backgroundImage: `url('${bgUrl}')` }}
      role="main-container"
    >
      <div className="flex flex-col min-h-screen app-wrapper">{children}</div>
    </div>
  );
}
