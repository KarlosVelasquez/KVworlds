export default function CustomScrollbar({ scrollbarVisible, scrollThumbHeight, scrollThumbTop }) {
  return (
    <div
      className="fixed right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none"
      style={{
        pointerEvents: 'none',
        opacity: scrollbarVisible ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
      }}
    >
      <div className="h-24 w-1.5 rounded-full border border-neutral-700 flex flex-col justify-between py-1 relative">
        <div
          className="w-1 bg-[#B19EEF] rounded-full mx-auto shadow absolute left-1/2 -translate-x-1/2"
          style={{
            height: `${scrollThumbHeight}px`,
            top: `${scrollThumbTop}px`,
            transition: 'top 0.1s cubic-bezier(.4,0,.2,1), height 0.2s cubic-bezier(.4,0,.2,1)',
          }}
        />
      </div>
    </div>
  );
}
