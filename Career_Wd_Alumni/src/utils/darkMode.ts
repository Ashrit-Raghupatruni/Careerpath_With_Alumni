// Dark mode utility with localStorage persistence
export const initializeDarkMode = (): boolean => {
  const stored = localStorage.getItem('darkMode');
  if (stored !== null) {
    const isDark = stored === 'true';
    document.documentElement.classList.toggle('dark', isDark);
    return isDark;
  }

  // Default to dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', prefersDark);
  return prefersDark;
};

export const toggleDarkMode = (currentDarkMode: boolean): boolean => {
  const newDarkMode = !currentDarkMode;
  localStorage.setItem('darkMode', String(newDarkMode));
  document.documentElement.classList.toggle('dark', newDarkMode);
  return newDarkMode;
};
