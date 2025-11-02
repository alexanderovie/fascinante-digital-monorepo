"use client";

import { API_ENDPOINTS } from '@/lib/api-config';
import type { PlaceDetails, PlacePrediction } from '@/types/places';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface BusinessAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: PlaceDetails) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function BusinessAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  className = '',
  error,
}: BusinessAutocompleteProps) {
  const [debouncedInput] = useDebounce(value, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [sessionToken, setSessionToken] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsListRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate session token for billing optimization (one per autocomplete session)
  useEffect(() => {
    if (isFocused && !sessionToken) {
      // Generate UUID v4 for session token (client-side compatible)
      if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
        setSessionToken(window.crypto.randomUUID());
      } else {
        // Fallback for environments without crypto.randomUUID
        setSessionToken(`${Date.now()}-${Math.random().toString(36).substring(2, 15)}`);
      }
    }
    // Reset session token when focus is lost and suggestions are closed
    if (!isFocused && !showSuggestions && sessionToken) {
      setSessionToken('');
    }
  }, [isFocused, showSuggestions, sessionToken]);

  // Fetch autocomplete suggestions with session token and abort controller
  const { data: predictions, isLoading, error: fetchError } = useQuery({
    queryKey: ['places-autocomplete', debouncedInput, sessionToken],
    queryFn: async ({ signal }) => {
      if (debouncedInput.length < 3) return [];

      // Create abort controller for this request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Combine with query signal if available
      const finalSignal = signal || controller.signal;

      try {
        const url = new URL(API_ENDPOINTS.places.autocomplete, window.location.origin);
        url.searchParams.set('input', debouncedInput);
        if (sessionToken) {
          url.searchParams.set('sessionToken', sessionToken);
        }

        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: finalSignal,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch suggestions');
        }

        const data = await res.json();
        return data.predictions || [];
      } catch (err) {
        // Don't throw if request was aborted
        if (err instanceof Error && err.name === 'AbortError') {
          return [];
        }
        throw err;
      }
    },
    enabled: debouncedInput.length >= 3 && isFocused,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes('400')) {
        return false;
      }
      return failureCount < 1;
    },
    retryDelay: 300,
  });

  const handleSelect = useCallback(
    async (prediction: PlacePrediction) => {
      try {
        // Build URL with session token for billing optimization
        const url = new URL(API_ENDPOINTS.places.details, window.location.origin);
        url.searchParams.set('place_id', prediction.place_id);
        if (sessionToken) {
          url.searchParams.set('sessionToken', sessionToken);
        }

        // Fetch place details with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch details');
        }

        const details: PlaceDetails = await res.json();

        onChange(details.name);
        onSelect?.(details);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setSessionToken(''); // Clear session token after selection
        inputRef.current?.blur();
      } catch (err) {
        // If details fetch fails, use prediction text as fallback
        // Error handling - logging removed for production (following Context7 best practices)
        if (err instanceof Error && err.name !== 'AbortError') {
          // Place details fetch failed - silently use fallback
        }
        onChange(prediction.structured_formatting.main_text);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setSessionToken(''); // Clear session token even on error
      }
    },
    [onChange, onSelect, sessionToken]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || !predictions || predictions.length === 0) {
        if (e.key === 'Escape') {
          setShowSuggestions(false);
          setIsFocused(false);
          inputRef.current?.blur();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < predictions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && predictions[selectedIndex]) {
            handleSelect(predictions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        case 'Tab':
          // Close suggestions on tab, but allow default tab behavior
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('keydown', handleKeyDown);
      return () => input.removeEventListener('keydown', handleKeyDown);
    }
  }, [showSuggestions, predictions, selectedIndex, handleSelect]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsListRef.current) {
      const selectedElement = suggestionsListRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Reset selected index when predictions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [predictions]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = useCallback(() => {
    onChange('');
    setSelectedIndex(-1);
    setShowSuggestions(false);
    setSessionToken(''); // Reset session on clear
    inputRef.current?.focus();
  }, [onChange]);

  const displaySuggestions =
    showSuggestions &&
    isFocused &&
    debouncedInput.length >= 3 &&
    !fetchError;

  const hasValue = value && value.trim().length > 0;
  // No mostrar ícono de búsqueda - mantener igual al campo simple
  const shouldShowLeftIcon = false;
  // Solo botón X cuando hay texto (opcional)
  const shouldShowRightIcon = hasValue;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        {/* Ícono de búsqueda - solo visible cuando hay texto escrito */}
        {shouldShowLeftIcon && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-dusty-gray dark:text-white/50 pointer-events-none" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            const trimmedValue = value ? value.trim() : '';
            if (trimmedValue.length >= 3) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => {
              setIsFocused(false);
              if (!showSuggestions) {
                setSelectedIndex(-1);
              }
            }, 200);
          }}
          placeholder={placeholder || ''}
          className={`input-field ${shouldShowLeftIcon ? 'pl-10' : ''} ${shouldShowRightIcon ? 'pr-10' : ''}`}
          autoComplete="off"
          aria-label={placeholder || 'Business name'}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls="places-suggestions"
          role="combobox"
        />
        {/* Botón X para limpiar - solo visible cuando hay texto */}
        {shouldShowRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label="Clear input"
            >
              <X className="size-3.5 text-dusty-gray dark:text-white/50" />
            </button>
          </div>
        )}
      </div>

      {displaySuggestions && (
        <div
          id="places-suggestions"
          ref={suggestionsListRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-secondary border border-sand-light dark:border-sand-light/40 rounded-sm shadow-lg max-h-60 overflow-auto"
          role="listbox"
          aria-label="Business suggestions"
        >
          {predictions && predictions.length > 0 ? (
            <div className="py-1">
              {predictions.map((prediction: PlacePrediction, index: number) => (
                <button
                  key={prediction.place_id}
                  type="button"
                  onClick={() => handleSelect(prediction)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full px-4 py-3 text-left hover:bg-offwhite-warm dark:hover:bg-gray-800 transition-colors flex items-start gap-3 border-b border-sand-light dark:border-sand-light/20 last:border-b-0 ${selectedIndex === index
                      ? 'bg-offwhite-warm dark:bg-gray-800'
                      : ''
                    }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <MapPin className="size-4 text-primary dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary dark:text-white truncate">
                      {prediction.structured_formatting.main_text}
                    </p>
                    <p className="text-sm text-dusty-gray dark:text-white/70 truncate mt-0.5">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : isLoading ? (
            <div className="px-4 py-3 text-center text-dusty-gray dark:text-white/70 text-sm">
              Buscando...
            </div>
          ) : fetchError ? (
            <div className="px-4 py-3 text-center text-red-500 text-sm">
              Error al buscar. Intenta nuevamente.
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-dusty-gray dark:text-white/70 text-sm">
              No se encontraron negocios
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
