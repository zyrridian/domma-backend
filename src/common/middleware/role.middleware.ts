// import { Plugin, Server } from '@hapi/hapi';

// export const roleMiddleware: Plugin<void> = {
//   name: 'role-based-authorization',
//   version: '1.0.0',
//   register: async (server: Server) => {
//     // Add a pre handler to check roles
//     server.ext('onPreHandler', (request, h) => {
//       // If there's no auth requirement or if it's not a role requirement, continue
//       const routeSettings = request.route.settings.auth;
//       if (!routeSettings || typeof routeSettings === 'boolean' || !routeSettings.scope) {
//         return h.continue;
//       }

//       // If there's no credentials (shouldn't happen if JWT auth is required before this)
//       if (!request.auth.credentials) {
//         return h.response({ message: 'Authentication required' }).code(401).takeover();
//       }

//       // Check if the user has the required role
//       const requiredScopes = Array.isArray(routeSettings.scope) ? routeSettings.scope : [routeSettings.scope];
//       const userRole = request.auth.credentials.role as string;

//       if (!requiredScopes.includes(userRole) && !requiredScopes.includes('*')) {
//         return h.response({ message: 'Insufficient permissions' }).code(403).takeover();
//       }

//       return h.continue;
//     });
//   }
// };
