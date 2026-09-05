import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textVariant?: 'landing' | 'compact' | 'institute' | 'full';
  theme?: 'dark' | 'light';
  imageSrc?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textVariant = 'landing',
  theme = 'dark',
  imageSrc = '/assets/images/logo.png'
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-base' }
  };

  const dim = sizeMap[size];

  return (
    <div className={`group flex items-center gap-3 select-none cursor-pointer ${className}`}>
      {/* Visual Emblem matching ThinkAHead logo in reference images */}
      <div
        className={`relative ${dim.icon} flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 p-1 transition-transform duration-300 ease-out group-hover:scale-[1.2] group-hover:-rotate-1 group-hover:shadow-lg`}
      >
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt="ThinkAHead Logo"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="logo-orbit" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="logo-petal-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
                <linearGradient id="logo-petal-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="logo-leaf-green" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="logo-head-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {/* Orbital Ring with Node */}
              <ellipse
                cx="50"
                cy="38"
                rx="42"
                ry="18"
                transform="rotate(-15 50 38)"
                stroke="url(#logo-orbit)"
                strokeWidth="2.5"
                opacity="0.85"
              />
              <circle cx="80" cy="42" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

              {/* Stylized Human Profile in Vibrant Royal Blue */}
              <path
                d="M 50 20
                   C 62 20 68 28 68 36
                   C 68 45 62 48 58 48
                   C 56 48 54 49 53 52
                   C 52 57 52 64 52 68
                   C 49 61 47 56 46 51
                   C 44 48 40 47 38 46
                   C 36 45 36 43 38 42
                   C 39 41 40 39 37 36
                   C 36 34 38 31 39 29
                   C 41 24 45 20 50 20 Z"
                fill="url(#logo-head-blue)"
              />

              {/* Glowing Brain / Mind inside Profile */}
              <path
                d="M 52 24
                   C 58 23 63 26 63 31
                   C 64 35 60 39 55 39
                   C 52 39 48 36 48 32
                   C 48 28 50 25 52 24 Z"
                fill="url(#logo-petal-orange)"
              />
              <path
                d="M 51 27 C 55 26 58 29 57 32 C 56 35 53 34 52 37"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Cupped Supporting Green Leaves / Foundation */}
              <path
                d="M 22 55
                   C 30 63 40 68 49 71
                   C 48 78 45 84 42 89
                   C 46 85 50 77 51 72
                   C 52 77 56 85 60 89
                   C 57 84 54 78 53 71
                   C 62 68 72 63 80 55
                   C 73 66 61 75 52 79
                   C 51 73 47 73 46 79
                   C 37 75 25 66 22 55 Z"
                fill="url(#logo-leaf-green)"
              />

              {/* Leaves arcs */}
              <path
                d="M 22 55 C 31 60 39 60 46 58 C 38 65 29 64 22 55 Z"
                fill="#10b981"
              />
              <path
                d="M 78 55 C 69 60 61 60 54 58 C 62 65 71 64 78 55 Z"
                fill="#10b981"
              />
            </svg>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-none transition-transform duration-300 ease-out group-hover:scale-[1.06]">
          {textVariant === 'institute' ? (
            <>
              <span className={`font-black tracking-wider uppercase text-xs md:text-sm ${theme === 'dark' ? 'text-cyan-400' : 'text-sky-900'}`}>
                THE INSTITUTE OF HUMAN CAPABILITY
              </span>
              <span className={`font-bold tracking-wide uppercase text-[10px] md:text-xs ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                DEVELOPMENT AND RESEARCH
              </span>
            </>
          ) : (
            <>
              <span className={`font-black ${dim.text} tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ThinkAHead
              </span>
              <span className={`font-bold ${dim.sub} tracking-wide text-cyan-500 dark:text-cyan-400 mt-0.5`}>
                Learning Hub
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
