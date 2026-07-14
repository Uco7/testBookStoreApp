// src/utils/config/appUrl.js

// Active ngrok forwarding string from your terminal session
export const backendUrl_ngrok = "https://ee93-102-89-32-59.ngrok-free.app";

// Production backend engine URL
export const backendDomainUrl = "https://testbookstoreapp-backend-my8t.onrender.com";

// Set this switch depending on if you are debugging locally or live in production
const useNgrok = false; 

export const BASE_URL = useNgrok ?backendDomainUrl:backendUrl_ngrok ;