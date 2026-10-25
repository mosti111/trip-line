export type MotionChoice = 'system' | 'full' | 'reduced';

export function motionChoice(value: string | null): MotionChoice {
  return value === 'full' || value === 'reduced' ? value : 'system';
}

export function resolveMotion(choice: MotionChoice, systemReduced: boolean): 'full' | 'reduced' {
  return choice === 'system' ? systemReduced ? 'reduced' : 'full' : choice;
}

// Runs before paint so system accessibility and explicit choice agree with CSS.
export const motionBootstrap = `(()=>{let choice='system';try{const saved=localStorage.getItem('tripline-motion');if(saved==='full'||saved==='reduced')choice=saved}catch{}const reduced=choice==='reduced'||(choice==='system'&&matchMedia('(prefers-reduced-motion: reduce)').matches);const root=document.documentElement;root.dataset.motionChoice=choice;root.dataset.motionEffective=reduced?'reduced':'full';root.dataset.motionLayout=reduced?'static':'motion'})()`;
