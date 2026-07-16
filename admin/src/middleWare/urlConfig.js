// src/utils/config/appUrl.js
export const backendUrl_ngrok = "https://ee93-102-89-32-59.ngrok-free.app";
export const backendDomainUrl = "https://testbookstoreapp-backend-my8t.onrender.com";

// Uses Vite's built-in mode detection: dev server = local/ngrok, build = production
export const BASE_URL = import.meta.env.DEV ? backendUrl_ngrok : backendDomainUrl;