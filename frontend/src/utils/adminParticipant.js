const STORAGE_KEY = 'adminParticipantFlags';

const readFlags = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Failed to parse admin participant flags:', error);
    return {};
  }
};

const writeFlags = (flags) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch (error) {
    console.error('Failed to persist admin participant flags:', error);
  }
};

export const setAdminParticipantFlag = (email, value) => {
  if (!email) return;
  const key = email.trim().toLowerCase();
  const flags = readFlags();

  if (value) {
    flags[key] = true;
  } else {
    delete flags[key];
  }

  writeFlags(flags);
};

export const getAdminParticipantFlag = (email) => {
  if (!email) return undefined;
  const key = email.trim().toLowerCase();
  const flags = readFlags();
  if (!Object.prototype.hasOwnProperty.call(flags, key)) {
    return undefined;
  }
  return !!flags[key];
};

