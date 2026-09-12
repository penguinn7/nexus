'use client';

import { SmoothScrollProvider } from '@/components/SmoothScroll';
import { Navigation } from '@/components/Navigation';
import { SceneIntro } from '@/components/SceneIntro';
import { SceneObject } from '@/components/SceneObject';
import { SceneWorld } from '@/components/SceneWorld';
import { SceneCut } from '@/components/SceneCut';
import { SceneSour } from '@/components/SceneSour';
import { SceneStillLife } from '@/components/SceneStillLife';
import { SceneFinale } from '@/components/SceneFinale';

export default function Home() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen">
        <Navigation />
        <main className="relative">
          <SceneIntro />
          <SceneObject />
          <SceneWorld />
          <SceneCut />
          <SceneSour />
          <SceneStillLife />
          <SceneFinale />
        </main>

        {/* subtle portfolio entry — doesn't disturb the exhibit */}
        <a
          href="/portfolio"
          className="fixed bottom-5 left-5 z-50 rounded-full border border-charcoal-200/50 bg-white/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal-500 backdrop-blur-md transition-colors hover:border-charcoal-300 hover:text-charcoal-700"
        >
          portfolio →
        </a>
      </div>
    </SmoothScrollProvider>
  );
}
