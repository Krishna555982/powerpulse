import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  const [logoSrc, setLogoSrc] = useState<string>('/logo.png?v=4');

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      if (!isMounted) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0;
        } else if (r > 200 && g > 200 && b > 200) {
          const maxVal = Math.max(r, g, b);
          const alphaFactor = (240 - maxVal) / 40; 
          data[i + 3] = data[i + 3] * Math.max(0, alphaFactor);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setLogoSrc(canvas.toDataURL('image/png'));
    };
    
    img.src = '/logo.png?v=4';
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <img 
      src={logoSrc} 
      alt="Power Pulse Energy Logo" 
      className={`object-contain ${className}`}
    />
  );
}
