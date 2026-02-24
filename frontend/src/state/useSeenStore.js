import { useState, useEffect } from 'react';
import { PICKS } from '../data/picks';
import { FRIENDS, FRIEND_MESSAGES } from '../data/circles';
import { SHELF_ITEMS } from '../data/shelf';
import { DEFAULT_PICKS_COUNT } from '../app/constants';

const STORE_KEY = 'seen_store';

const initialState = {
  selectedVibe: null,
  picksCount: DEFAULT_PICKS_COUNT,
  shelfItems: SHELF_ITEMS,
};

export function useSeenStore() {
  const [store, setStore] = useState(initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      setStore(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever store changes
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }, [store]);

  const setSelectedVibe = (vibe) => {
    setStore(prev => ({ ...prev, selectedVibe: vibe }));
  };

  const setPicksCount = (count) => {
    setStore(prev => ({ ...prev, picksCount: count }));
  };

  const addToShelf = (item) => {
    setStore(prev => ({
      ...prev,
      shelfItems: [...prev.shelfItems, item],
    }));
  };

  return {
    store,
    setSelectedVibe,
    setPicksCount,
    addToShelf,
  };
}

export function usePicks() {
  const { store } = useSeenStore();
  const slicedPicks = PICKS.slice(0, store.picksCount);
  return { picks: slicedPicks };
}

export function useCircles() {
  return { circles: FRIENDS };
}

export function useFriendsMessages() {
  return { messages: FRIEND_MESSAGES };
}

export function useShelfItems() {
  const { store } = useSeenStore();
  return { items: store.shelfItems };
}
