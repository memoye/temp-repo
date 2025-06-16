"use client";

import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function usePersistedForm<T extends FieldValues = FieldValues>(
  form: UseFormReturn<T>,
  key: string,
  onRecovered?: (data: T) => void,
) {
  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        onRecovered?.(parsedData);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, [key, form, onRecovered]);

  // Save data on change
  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem(key, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [key, form]);

  // Clear saved data
  const clearPersistedData = () => {
    localStorage.removeItem(key);
  };

  return { clearPersistedData };
}
