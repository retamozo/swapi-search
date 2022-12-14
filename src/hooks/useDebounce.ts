import { useCallback, useEffect, useRef } from "react";

type UseDebouncedValue = (
  ms?: number,
) => (cb: () => void) => void;

export const useDebounce: UseDebouncedValue = (
  ms: number = 1500,
) => {
  const debounceValueRef = useRef<NodeJS.Timeout>();

  const debounce = useCallback((callback: () => void) => {
    if (debounceValueRef.current) {
      clearTimeout(debounceValueRef.current);
    }

    debounceValueRef.current = setTimeout(() => {
      callback();
    }, ms);
  }, [ms])

  useEffect(() => {
    return () => clearTimeout(debounceValueRef.current);
  }, [ms]);

  return debounce;
};
