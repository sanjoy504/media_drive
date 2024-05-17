import { useCallback, useEffect, useRef } from "react";

// Debounce function
export const useDebounceDelay = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

// Custom hook for infinite scrolling
export function useInfiniteScroll(callback, loading, isAllDataLoad) {
    const observerElement = useRef(null);
    
    const handleObservers = useCallback((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && !isAllDataLoad) {
        callback();
      }
    }, [loading, isAllDataLoad, callback]);
  
    useEffect(() => {
      const observer = new IntersectionObserver(handleObservers, {
        root: null,
        rootMargin: "10px",
        threshold: 1.0,
      });
  
      if (observerElement.current) {
        observer.observe(observerElement.current);
      }
  
      return () => {
        if (observerElement.current) {
          observer.unobserve(observerElement.current);
        }
      };
    }, [handleObservers]);
  
    return observerElement;
  }
  