import axios from 'axios';

// Axios instance setup
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// --- API Functions for Events Hub & Buddy Beacon ---

/**
 * Fetches events, with an optional filter for category.
 * @param {string} category - The category to filter by (e.g., "hackathons").
 * @returns {Promise} An axios promise for the request.
 */
export const getEvents = (category) => {
    let url = '/api/events';
    if (category && category !== 'all') {
        // Format the category for the backend (e.g., 'hackathons' -> 'Hackathon')
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1, -1);
        url += `?category=${formattedCategory}`;
    }
    return api.get(url);
};

/**
 * Creates a new team-finding post.
 * @param {object} postData - The data for the new post { eventId, description, extraSkills }.
 * @returns {Promise} An axios promise for the request.
 */
export const createTeamPost = (postData) => {
    return api.post('/api/posts/team-finding', postData);
};

/**
 * Fetches all team-finding posts for a specific event.
 * @param {string} eventId - The ID of the event.
 * @returns {Promise} An axios promise for the request.
 */
export const getPostsForEvent = (eventId) => {
    return api.get(`/api/posts/event/${eventId}`);
};

/**
 * Creates a new event.
 * @param {object} eventData - The data for the new event.
 * @returns {Promise} An axios promise for the request.
 */
export const createEvent = (eventData) => {
    return api.post('/api/events', eventData);
};

/**
 * Fetches the unified Buddy Beacon feed (Team Posts + Beacon Posts).
 */
export const getBuddyBeaconFeed = () => {
    return api.get('/api/beacon/feed');
};
/**
 * Fetches posts the current user has applied to (Applicant View)
 */
export const getAppliedPosts = () => {
    return api.get('/api/beacon/applied-posts');
};
/**
 * Apply to a Team Post or Buddy Beacon
 * @param {string} postId
 * @param {object} applicationData (optional: message, applicantSkills, etc)
 */
export const applyToPost = (postId, applicationData = {}) => {
    return api.post(`/api/beacon/apply/${postId}`, applicationData);
};

/**
 * Fetches posts created by the current user (host dashboard).
 */
export const getMyBeaconPosts = () => {
    return api.get('/api/beacon/my-posts');
};

/**
 * Accepts an applicant for a post.
 * @param {string} applicationId
 * @param {string} postId
 */
export const acceptApplication = (applicationId, postId) => {
    return api.post(`/api/beacon/application/${applicationId}/accept?postId=${postId}`);
};

/**
 * Rejects an applicant for a post.
 * @param {string} applicationId
 * @param {string} postId
 * @param {string} reason
 * @param {string} note
 */
export const rejectApplication = (applicationId, postId, reason, note) => {
    return api.post(`/api/beacon/application/${applicationId}/reject?postId=${postId}&reason=${reason}&note=${encodeURIComponent(note || '')}`);
};

/**
 * Deletes a post from My Posts dashboard.
 * @param {string} postId
 */
export const deleteMyPost = (postId) => {
    return api.delete(`/api/beacon/my-posts/${postId}`);
};

// Default export of the configured axios instance
export default api;