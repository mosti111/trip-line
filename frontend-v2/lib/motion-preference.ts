export type MotionChoice = 'system' | 'full' | 'reduced';

export function motionChoice(value: string | null): MotionChoice {
  return value === 'system' || value === 'reduced' ? value : 'full';
}

export function resolveMotion(choice: MotionChoice, systemReduced: boolean): 'full' | 'reduced' {
  return choice === 'system' ? systemReduced ? 'reduced' : 'full' : choice;
}

// No default is persisted: an existing System/Reduced value is a visitor choice.
// Runs before paint so saved preferences and the Full default agree with CSS.
export const motionBootstrap = `(()=>{let choice='full';try{const saved=localStorage.getItem('tripline-motion');if(saved==='system'||saved==='reduced')choice=saved}catch{}const reduced=choice==='reduced'||(choice==='system'&&matchMedia('(prefers-reduced-motion: reduce)').matches);const root=document.documentElement;root.dataset.motionChoice=choice;root.dataset.motionEffective=reduced?'reduced':'full';root.dataset.motionLayout=reduced?'static':'motion'})()`;
