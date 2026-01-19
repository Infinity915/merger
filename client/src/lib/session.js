export const USER_KEY = 'studcollab_user';

export function saveUser(user) {
    try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
        // ignore
    }
}

export function loadUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

export function clearUser() {
    try {
        localStorage.removeItem(USER_KEY);
    } catch (e) { }
}

export function saveScoped(userEmail, key, value) {
    if (!userEmail) return;
    try {
        const fullKey = `sc:${userEmail}:${key}`;
        localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) { }
}

export function loadScoped(userEmail, key) {
    if (!userEmail) return null;
    try {
        const fullKey = `sc:${userEmail}:${key}`;
        const raw = localStorage.getItem(fullKey);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

export function clearScoped(userEmail, key) {
    if (!userEmail) return;
    try {
        const fullKey = `sc:${userEmail}:${key}`;
        localStorage.removeItem(fullKey);
    } catch (e) { }
}
