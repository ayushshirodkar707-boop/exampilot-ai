'use client';

interface AdSlotProps {
  size: '300x250' | '300x600' | '728x90' | '320x50' | 'responsive';
  className?: string;
  label?: string;
}

export default function AdSlot({ size, className = '', label }: AdSlotProps) {
  const dimensions: Record<string, { width: string; height: string }> = {
    '300x250': { width: '300px', height: '250px' },
    '300x600': { width: '300px', height: '600px' },
    '728x90': { width: '100%', height: '90px' },
    '320x50': { width: '320px', height: '50px' },
    'responsive': { width: '100%', height: '250px' },
  };

  const dim = dimensions[size] || dimensions['responsive'];

  return (
    <div
      className={`ad-slot ${className}`}
      style={{ width: dim.width, height: dim.height, maxWidth: '100%' }}
    >
      {/* 
        ============================================
        GOOGLE ADSENSE AD UNIT
        ============================================
        Replace this entire div's children with your 
        Google AdSense <ins> tag code, for example:
        
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
        
        Size: {size}
        ============================================
      */}
      <div className="text-center">
        <div className="text-xs font-medium uppercase tracking-wider opacity-60">
          {label || 'Advertisement'}
        </div>
        <div className="text-xs mt-1 opacity-40">
          {size} Ad Slot
        </div>
      </div>
    </div>
  );
}
