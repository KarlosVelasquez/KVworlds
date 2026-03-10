import { Volume2, VolumeX, Menu } from 'lucide-react';
import { prefetchProjectsRoute } from '@/features/home/lib';
import './TopBar.css';

export default function TopBar({ musicOn, onToggleMusic, onMenuClick }) {
  return (
    <>
      <div className="home-logo">DEKO WORLDS</div>

      <div className="home-topbar-actions">
        <button
          className="bg-neutral-900/80 rounded-full p-2 shadow hover:bg-neutral-800 transition"
          aria-label="Toggle music"
          onClick={onToggleMusic}
        >
          {musicOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
        </button>

        <button
          className="bg-neutral-900/80 rounded-full px-4 py-2 shadow hover:bg-neutral-800 transition text-white font-semibold text-lg"
          aria-label="Menu"
          onMouseEnter={() => {
            prefetchProjectsRoute();
          }}
          onFocus={() => {
            prefetchProjectsRoute();
          }}
          onClick={onMenuClick}
        >
          <Menu className="inline w-6 h-6 mr-1 align-middle" /> MENU
        </button>
      </div>
    </>
  );
}
