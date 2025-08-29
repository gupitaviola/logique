import dotenv from 'dotenv';
dotenv.config();

if (!process.env.BASE_URL || !process.env.USERNAME || !process.env.PASSWORD ||!process.env.AUCTION_EMAIL ||!process.env.AUCTION_PASSWORD) {
  throw new Error('Missing required environment variables in .env');
}

export const BASE_URL = process.env.BASE_URL;
export const USERNAME = process.env.USERNAME;
export const PASSWORD = process.env.PASSWORD;
export const AUCTION_EMAIL = process.env.AUCTION_EMAIL;
export const AUCTION_PASSWORD = process.env.AUCTION_PASSWORD;