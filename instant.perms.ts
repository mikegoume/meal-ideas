import type { InstantRules } from '@instantdb/react-native';
import schema from './instant.schema';

const rules = {
  // Meals are public read, but if you want admin-only writes,
  // you'll need to add admin checks in your app logic
  // For now, making them authenticated user writes
  meals: {
    allow: {
      view: 'true', // Everyone can view meals
      create: 'isOwner', // Authenticated users can create
      update: 'isOwner',
      delete: 'isOwner',
    },
    bind: ['isOwner', 'auth.id != null'],
  },

  ingredients: {
    allow: {
      view: 'true',
      create: 'isAuthenticated',
      update: 'isAuthenticated',
      delete: 'isAuthenticated',
    },
    bind: ['isAuthenticated', 'auth.id != null'],
  },

  mealRoles: {
    allow: {
      view: 'true',
      create: 'isAuthenticated',
      update: 'isAuthenticated',
      delete: 'isAuthenticated',
    },
    bind: ['isAuthenticated', 'auth.id != null'],
  },

  mealAims: {
    allow: {
      view: 'true',
      create: 'isAuthenticated',
      update: 'isAuthenticated',
      delete: 'isAuthenticated',
    },
    bind: ['isAuthenticated', 'auth.id != null'],
  },

  // User preferences are private to each user
  userPreferences: {
    allow: {
      view: 'data.userId == auth.id',
      create: 'data.userId == auth.id',
      update: 'data.userId == auth.id',
      delete: 'data.userId == auth.id',
    },
  },

  userRoles: {
    allow: {
      view: 'isOwner',
      create: 'isOwner',
      update: 'isOwner',
      delete: 'isOwner',
    },
    bind: ['isOwner', "data.ref('userPreference.userId') == auth.id"],
  },

  userAims: {
    allow: {
      view: 'isOwner',
      create: 'isOwner',
      update: 'isOwner',
      delete: 'isOwner',
    },
    bind: ['isOwner', "data.ref('userPreference.userId') == auth.id"],
  },
} satisfies InstantRules<typeof schema>;

export default rules;
