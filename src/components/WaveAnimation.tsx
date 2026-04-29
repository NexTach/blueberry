interface WaveAnimationProps {
  isActive: boolean;
}

const BARS = 7;

export default function WaveAnimation({ isActive }: WaveAnimationProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: BARS }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-black transition-all"
          style={{
            height: isActive ? undefined : '6px',
            animation: isActive
              ? `wave 1s ease-in-out infinite`
              : undefined,
            animationDelay: `${(i * 0.12).toFixed(2)}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 6px; }
          50% { height: 40px; }
        }
      `}</style>
    </div>
  );
}
