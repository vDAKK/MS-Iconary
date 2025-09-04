import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  initialItemsPerPage?: number;
  itemsPerPage?: number;
  threshold?: number;
}

export const useInfiniteScroll = <T>(
  items: T[],
  options: UseInfiniteScrollOptions = {}
) => {
  const {
    initialItemsPerPage = 20,
    itemsPerPage = 10,
    threshold = 100
  } = options;

  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Réinitialiser quand les items changent
  useEffect(() => {
    const initialItems = items.slice(0, initialItemsPerPage);
    setVisibleItems(initialItems);
    setPage(0);
    setHasMore(items.length > initialItemsPerPage);
  }, [items, initialItemsPerPage]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulation d'un délai pour éviter le spam
    setTimeout(() => {
      const startIndex = (page + 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newItems = items.slice(startIndex, endIndex);

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setVisibleItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < items.length);
      }

      setIsLoading(false);
    }, 150); // Petit délai pour éviter le spam
  }, [items, page, itemsPerPage, isLoading, hasMore]);

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.offsetHeight;

      if (scrollTop + windowHeight >= docHeight - threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoading, hasMore, threshold]);

  const reset = useCallback(() => {
    const initialItems = items.slice(0, initialItemsPerPage);
    setVisibleItems(initialItems);
    setPage(0);
    setHasMore(items.length > initialItemsPerPage);
    setIsLoading(false);
  }, [items, initialItemsPerPage]);

  return {
    visibleItems,
    isLoading,
    hasMore,
    loadMore,
    reset,
    totalItems: items.length,
    visibleCount: visibleItems.length
  };
};