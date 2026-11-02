'use client';

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react';
import { emptyJourney, journeyStorageKey, moveJourneyDestination, parseJourney, readJourney, validJourneyType, type JourneyState } from '@/lib/journey';

type Snapshot = JourneyState & { drawerOpen: boolean };
type JourneyContext = Snapshot & {
  addDestination: (id: string) => void;
  removeDestination: (id: string) => void;
  moveDestination: (id: string, offset: number) => void;
  setJourneyType: (type: string) => void;
  openJourney: () => void;
  closeJourney: () => void;
};
const Context = createContext<JourneyContext | null>(null);
const serverSnapshot: Snapshot = { ...emptyJourney, drawerOpen: false };

function createJourneyStore() {
  let state = serverSnapshot;
  let hydrated = false;
  const listeners = new Set<() => void>();
  function hydrate() {
    if (hydrated || typeof window === 'undefined') return;
    hydrated = true;
    try { state = { ...readJourney(sessionStorage.getItem(journeyStorageKey)), drawerOpen: false }; } catch { state = { ...serverSnapshot }; }
  }
  function update(next: Snapshot, persist = true) {
    state = next;
    if (hydrated && persist) {
      try { sessionStorage.setItem(journeyStorageKey, JSON.stringify({ destinations: state.destinations, journeyType: state.journeyType })); } catch { /* Session storage may be unavailable; the current page remains usable. */ }
    }
    listeners.forEach(listener => listener());
  }
  return {
    subscribe(listener: () => void) { hydrate(); listeners.add(listener); listener(); return () => { listeners.delete(listener); }; },
    getSnapshot: () => state,
    addDestination(id: string) { hydrate(); if (parseJourney(id)[0] !== id) return; update({ ...state, destinations: parseJourney([...state.destinations, id].join(',')) }); },
    removeDestination(id: string) { hydrate(); update({ ...state, destinations: state.destinations.filter(place => place !== id) }); },
    moveDestination(id: string, offset: number) { hydrate(); update({ ...state, destinations: moveJourneyDestination(state.destinations, id, offset) }); },
    setJourneyType(type: string) { hydrate(); update({ ...state, journeyType: validJourneyType(type) }); },
    openJourney() { hydrate(); update({ ...state, drawerOpen: true }, false); },
    closeJourney() { update({ ...state, drawerOpen: false }, false); },
  };
}
export function JourneyProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createJourneyStore);
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, () => serverSnapshot);
  return <Context.Provider value={{ ...state, addDestination: store.addDestination, removeDestination: store.removeDestination, moveDestination: store.moveDestination, setJourneyType: store.setJourneyType, openJourney: store.openJourney, closeJourney: store.closeJourney }}>{children}</Context.Provider>;
}
export function useJourney() {
  const context = useContext(Context);
  if (!context) throw new Error('useJourney must be used inside JourneyProvider');
  return context;
}
