import { useEffect, useState } from 'react';
import { SPACE_ID_STORAGE_KEY } from '../config/constants.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { slugifyTitle } from '../utils/text.js';
import { useVersionUpdates } from './useVersionUpdates.js';
import mediaMap from '../media-map.json';

const VIEW_STORAGE_KEY = 'hearth:last_view';
const VIEW_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const ITEMS_STORAGE_KEY = 'hearth_template_items_v1';
const SPACE_NAME_STORAGE_KEY = 'hearth_template_space_name';
const DEFAULT_SPACE_NAME = 'HearthUser';
const LOCAL_SPACE_ID = 'local';

const safeStorage = {
  get(key) {
    if (typeof localStorage === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn('Storage read failed', err);
      return null;
    }
  },
  set(key, value) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn('Storage write failed', err);
    }
  },
  remove(key) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn('Storage remove failed', err);
    }
  },
};

const getInitialView = () => {
  const raw = safeStorage.get(VIEW_STORAGE_KEY);
  if (!raw) return 'tonight';
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed?.view &&
      parsed?.timestamp &&
      Date.now() - parsed.timestamp < VIEW_TTL_MS
    ) {
      return parsed.view;
    }
    return 'tonight';
  } catch (err) {
    console.warn('Failed to parse stored view', err);
    return 'tonight';
  }
};

const isShowFullyWatched = (item) => {
  if (!item || item.type !== 'show') return true;
  const seasons = Array.isArray(item.seasons) ? item.seasons : [];
  if (!seasons.length) return false;
  const progress = item.episodeProgress || {};
  return seasons.every(
    (season) =>
      Array.isArray(season.episodes) &&
      season.episodes.length > 0 &&
      season.episodes.every((episode) => Boolean(progress[episode.id])),
  );
};

const buildSeedItems = () => {
  const now = Date.now();
  return Object.entries(mediaMap).map(([title, details], index) => {
    const slug = slugifyTitle(title);
    return {
      id: slug || `item-${index}`,
      title,
      type: details?.type || 'movie',
      status: 'unwatched',
      poster: details?.poster,
      backdrop: details?.backdrop,
      year: details?.year,
      director: details?.director,
      actors: details?.actors,
      genres: details?.genres,
      runtimeMinutes: details?.runtimeMinutes,
      totalSeasons: details?.totalSeasons,
      createdAt: now - index * 1000,
      updatedAt: now - index * 1000,
    };
  });
};

const loadItems = () => {
  const raw = safeStorage.get(ITEMS_STORAGE_KEY);
  if (!raw) return { items: buildSeedItems(), didSeed: true };
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return { items: parsed, didSeed: false };
    }
  } catch (err) {
    console.warn('Failed to parse stored items', err);
  }
  return { items: buildSeedItems(), didSeed: true };
};

export const useAppState = () => {
  const {
    autoReloadCountdown,
    dismissUpdate,
    handleReloadNow,
    newVersionAvailable,
    notifyUpdate,
    updateMessage,
  } = useVersionUpdates();

  const [authResolved, setAuthResolved] = useState(true);
  const [spaceId] = useState(
    () => safeStorage.get(SPACE_ID_STORAGE_KEY) || LOCAL_SPACE_ID,
  );
  const [spaceName, setSpaceName] = useState(
    () => safeStorage.get(SPACE_NAME_STORAGE_KEY) || DEFAULT_SPACE_NAME,
  );
  const [joinError] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(getInitialView);
  const [decisionResult, setDecisionResult] = useState(null);
  const [isDeciding, setIsDeciding] = useState(false);
  const [contextItems, setContextItems] = useState([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isSpaceSetupRunning] = useState(false);
  const isBootstrapping = false;

  useEffect(() => {
    safeStorage.set(SPACE_ID_STORAGE_KEY, spaceId);
  }, [spaceId]);

  useEffect(() => {
    const { items: seededItems, didSeed } = loadItems();
    setItems(seededItems);
    if (didSeed) {
      safeStorage.set(ITEMS_STORAGE_KEY, JSON.stringify(seededItems));
    }
    setLoading(false);
    setAuthResolved(true);
  }, []);

  useEffect(() => {
    safeStorage.set(
      VIEW_STORAGE_KEY,
      JSON.stringify({ view, timestamp: Date.now() }),
    );
  }, [view]);

  useEffect(() => {
    if (items.length && view === 'onboarding') {
      setView('tonight');
    }
  }, [items, view]);

  const notifyError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 4000);
  };

  const persistItems = (nextItems) => {
    safeStorage.set(ITEMS_STORAGE_KEY, JSON.stringify(nextItems));
  };

  const updateItems = (updater) => {
    setItems((prev) => {
      const nextItems =
        typeof updater === 'function' ? updater(prev) : updater;
      persistItems(nextItems);
      return nextItems;
    });
  };

  const handleCreateSpace = (name) => {
    const trimmed = name?.trim() || '';
    const nextName = trimmed || DEFAULT_SPACE_NAME;
    setSpaceName(nextName);
    safeStorage.set(SPACE_NAME_STORAGE_KEY, nextName);
    setView('tonight');
  };

  const handleInvite = async () => {
    const baseUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : '';
    const inviteUrl = `${baseUrl}?join=${spaceId}`;
    const copied = await copyToClipboard(inviteUrl);
    if (copied) {
      notifyUpdate('Invite link copied (template mode).');
    } else {
      notifyError('Could not copy invite link.');
    }
  };

  const handleAddItem = async () => {
    notifyUpdate('Adding items is disabled in the template.');
    setView('tonight');
  };

  const handleImportItems = async () => {
    notifyUpdate('Importing is disabled in the template.');
    setIsImportOpen(false);
  };

  const handleExportItems = async () => {
    if (!items.length) {
      notifyError('Nothing to export yet.');
      return;
    }
    notifyUpdate('Exporting is disabled in the template.');
  };

  const handleSignOut = async () => {
    notifyUpdate('Sign-out is disabled in the template.');
  };

  const handleMarkWatched = async (id, currentStatus) => {
    const item = items.find((entry) => entry.id === id);
    if (
      currentStatus !== 'watched' &&
      item?.type === 'show' &&
      !isShowFullyWatched(item)
    ) {
      notifyError('Finish every episode to mark this show watched.');
      return;
    }
    const newStatus = currentStatus === 'watched' ? 'unwatched' : 'watched';
    updateItems((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, status: newStatus, updatedAt: Date.now() }
          : entry,
      ),
    );
  };

  const handleUpdateItem = async (id, updates) => {
    updateItems((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) return entry;
        const nextItem = { ...entry, ...updates };
        if (
          entry?.type === 'show' &&
          Object.prototype.hasOwnProperty.call(updates, 'episodeProgress')
        ) {
          const fullyWatched = isShowFullyWatched(nextItem);
          if (fullyWatched && entry.status !== 'watched') {
            nextItem.status = 'watched';
          } else if (!fullyWatched && entry.status === 'watched') {
            nextItem.status = 'unwatched';
          }
        }
        nextItem.updatedAt = Date.now();
        return nextItem;
      }),
    );
  };

  const handleDelete = async (id) => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Remove this memory?')
    ) {
      updateItems((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const handleBulkDelete = async (ids) => {
    if (!ids || ids.length === 0) return false;
    if (
      typeof window !== 'undefined' &&
      !window.confirm(
        `Delete ${ids.length} item${ids.length === 1 ? '' : 's'}? This cannot be undone.`,
      )
    ) {
      return false;
    }
    setIsBulkDeleting(true);
    try {
      updateItems((prev) => prev.filter((entry) => !ids.includes(entry.id)));
      setView('tonight');
      return true;
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const startDecision = (poolOfItems) => {
    const pool =
      poolOfItems && poolOfItems.length > 0
        ? poolOfItems
        : items.filter((i) => i.status === 'unwatched');

    if (pool.length === 0) return;

    setIsDeciding(true);
    setContextItems(pool);
    setView('decision');

    setTimeout(() => {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      setDecisionResult(randomItem);
      setIsDeciding(false);
    }, 2000);
  };

  return {
    authResolved,
    autoReloadCountdown,
    contextItems,
    decisionResult,
    dismissUpdate,
    errorMessage,
    handleAddItem,
    handleBulkDelete,
    handleCreateSpace,
    handleDelete,
    handleExportItems,
    handleImportItems,
    handleInvite,
    handleMarkWatched,
    handleReloadNow,
    handleSignOut,
    handleUpdateItem,
    isBulkDeleting,
    isBootstrapping,
    isDeciding,
    isImportOpen,
    isSpaceSetupRunning,
    items,
    joinError,
    loading,
    newVersionAvailable,
    setDecisionResult,
    setIsImportOpen,
    setView,
    spaceId,
    spaceName,
    startDecision,
    updateMessage,
    view,
  };
};
