/**
 * @desc This file contains all the routes of the application
 */

/**
 * This array contains all the routes that are public
 * Used to check if a route is public
 * Can be acces if the user is already logged in
 */
export const PUBLIC_ROUTES: string[] = ["/", "/auth/new-verification", "/room/[roomId]"];

/**
 * This object contains all the auth routes.
 * Used to check if a route is an auth route
 */
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ERROR: "/auth/error",
  FORGOT_PASSWORD: "/auth/forgot-password",
  NEW_PASSWORD: "/auth/new-password",
};
/**
 * The prefix for API auth routes
 * Used to check if a route is an API route
 */
export const API_AUTH_ROUTES: string = "/api/auth";

/**
 * The default redirect route
 * Used when a user logs in or registers
 */
export const DEFAULT_REDIRECT: string = "/landing";
