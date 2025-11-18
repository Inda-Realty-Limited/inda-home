/**
 * Centralized Environment Configuration
 * 
 * This file validates and exports all environment variables used throughout the application.
 * It provides type-safe access to env vars and fails fast if required variables are missing.
 */



type EnvVarConfig = {
  key: string;
  required: boolean;
  defaultValue?: string;
};

const envVars: Record<string, EnvVarConfig> = {
  API_BASE_URL: {
    key: 'NEXT_PUBLIC_API_BASE_URL',
    required: true,
  },
  ENCRYPTION_SECRET: {
    key: 'NEXT_PUBLIC_ENCRYPTION_SECRET',
    required: true,
  },
  MAPBOX_TOKEN: {
    key: 'NEXT_PUBLIC_MAPBOX_TOKEN',
    required: false,
  },
  GOOGLE_MAPS_API_KEY: {
    key: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    required: false,
  },
  MAP_DEFAULT_LAT: {
    key: 'NEXT_PUBLIC_MAP_DEFAULT_LAT',
    required: false,
  },
  MAP_DEFAULT_LNG: {
    key: 'NEXT_PUBLIC_MAP_DEFAULT_LNG',
    required: false,
  },
  MAP_DEFAULT_ZOOM: {
    key: 'NEXT_PUBLIC_MAP_DEFAULT_ZOOM',
    required: false,
  },
  RESULTS_MAP_EMBED_URL: {
    key: 'NEXT_PUBLIC_RESULTS_MAP_EMBED_URL',
    required: false,
  },
  SV_DEMO_LAT: {
    key: 'NEXT_PUBLIC_SV_DEMO_LAT',
    required: false,
  },
  SV_DEMO_LNG: {
    key: 'NEXT_PUBLIC_SV_DEMO_LNG',
    required: false,
  },
  WHATSAPP_JOSHUA: {
    key: 'NEXT_PUBLIC_WHATSAPP_JOSHUA',
    required: false,
  },
  INDA_WHATSAPP: {
    key: 'NEXT_PUBLIC_INDA_WHATSAPP',
    required: false,
  },
  LINK_TIKTOK: {
    key: 'NEXT_PUBLIC_LINK_TIKTOK',
    required: false,
  },
  LINK_YOUTUBE: {
    key: 'NEXT_PUBLIC_LINK_YOUTUBE',
    required: false,
  },
  LINK_TWITTER: {
    key: 'NEXT_PUBLIC_LINK_TWITTER',
    required: false,
  },
  LINK_X: {
    key: 'NEXT_PUBLIC_LINK_X',
    required: false,
  },
  LINK_INSTAGRAM: {
    key: 'NEXT_PUBLIC_LINK_INSTAGRAM',
    required: false,
  },
  LINK_LINKEDIN: {
    key: 'NEXT_PUBLIC_LINK_LINKEDIN',
    required: false,
  },
  MICROSOFT_CLARITY_ID: {
    key: 'NEXT_PUBLIC_MICROSOFT_CLARITY_ID',
    required: false,
  },
  GA_MEASUREMENT_ID: {
    key: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    required: false,
  },
};

// On the client, Next.js replaces direct property access like
// process.env.NEXT_PUBLIC_... at build-time. Dynamic access
// (process.env[key]) returns undefined in the browser.
// This map ensures client-side reads work by using direct access.
const clientEnv = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_ENCRYPTION_SECRET: process.env.NEXT_PUBLIC_ENCRYPTION_SECRET,
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_MAP_DEFAULT_LAT: process.env.NEXT_PUBLIC_MAP_DEFAULT_LAT,
  NEXT_PUBLIC_MAP_DEFAULT_LNG: process.env.NEXT_PUBLIC_MAP_DEFAULT_LNG,
  NEXT_PUBLIC_MAP_DEFAULT_ZOOM: process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM,
  NEXT_PUBLIC_RESULTS_MAP_EMBED_URL: process.env.NEXT_PUBLIC_RESULTS_MAP_EMBED_URL,
  NEXT_PUBLIC_SV_DEMO_LAT: process.env.NEXT_PUBLIC_SV_DEMO_LAT,
  NEXT_PUBLIC_SV_DEMO_LNG: process.env.NEXT_PUBLIC_SV_DEMO_LNG,
  NEXT_PUBLIC_WHATSAPP_JOSHUA: process.env.NEXT_PUBLIC_WHATSAPP_JOSHUA,
  NEXT_PUBLIC_INDA_WHATSAPP: process.env.NEXT_PUBLIC_INDA_WHATSAPP,
  NEXT_PUBLIC_LINK_TIKTOK: process.env.NEXT_PUBLIC_LINK_TIKTOK,
  NEXT_PUBLIC_LINK_YOUTUBE: process.env.NEXT_PUBLIC_LINK_YOUTUBE,
  NEXT_PUBLIC_LINK_TWITTER: process.env.NEXT_PUBLIC_LINK_TWITTER,
  NEXT_PUBLIC_LINK_X: process.env.NEXT_PUBLIC_LINK_X,
  NEXT_PUBLIC_LINK_INSTAGRAM: process.env.NEXT_PUBLIC_LINK_INSTAGRAM,
  NEXT_PUBLIC_LINK_LINKEDIN: process.env.NEXT_PUBLIC_LINK_LINKEDIN,
  NEXT_PUBLIC_MICROSOFT_CLARITY_ID: process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

function getEnvVar(config: EnvVarConfig): string | undefined {
  const value =
    typeof window === 'undefined'
      ? process.env[config.key]
      : (clientEnv as Record<string, string | undefined>)[config.key];
  
  // Debug logging
  if (config.key === 'NEXT_PUBLIC_API_BASE_URL' && typeof window === 'undefined') {
    console.log('[ENV] Getting API_BASE_URL:', {
      key: config.key,
      value,
      type: typeof value,
      processEnv: process.env.NEXT_PUBLIC_API_BASE_URL,
    });
  }
  
  // Check if value exists (not undefined or null), allow empty strings
  if (value !== undefined && value !== null) {
    return value;
  }
  
  // If no value and it's required, throw error with helpful message
  if (config.required && !config.defaultValue) {
    if (typeof window === 'undefined') {
      throw new Error(
        `Missing required environment variable: ${config.key}\n` +
        `Please add it to your .env.local file:\n` +
        `${config.key}=your_value_here`
      );
    }
    return undefined;
  }
  
  return config.defaultValue;
}

function validateEnv() {
  // Only validate on server-side at runtime (not during build)
  if (typeof window !== 'undefined') return;
  
  const missing: string[] = [];
  
  Object.entries(envVars).forEach(([, config]) => {
    if (config.required && !process.env[config.key]) {
      missing.push(config.key);
    }
  });
  
  if (missing.length > 0) {
    const errorMessage = `

The following required environment variables are not set:

${missing.map(key => `  • ${key}`).join('\n')}

Please add these to your .env.local file:

${missing.map(key => `${key}=your_value_here`).join('\n')}

    `.trim();
    
    console.error(errorMessage);
    throw new Error('Missing required environment variables. Check console for details.');
  }
}

export const env = {
  api: {
    get baseUrl() {
      return getEnvVar(envVars.API_BASE_URL)!;
    },
  },
  security: {
    get encryptionSecret() {
      return getEnvVar(envVars.ENCRYPTION_SECRET)!;
    },
  },
  maps: {
    get mapboxToken() {
      return getEnvVar(envVars.MAPBOX_TOKEN);
    },
    get googleMapsApiKey() {
      return getEnvVar(envVars.GOOGLE_MAPS_API_KEY);
    },
    get defaultLat() {
      return Number(getEnvVar(envVars.MAP_DEFAULT_LAT)) || 6.6018;
    },
    get defaultLng() {
      return Number(getEnvVar(envVars.MAP_DEFAULT_LNG)) || 3.3515;
    },
    get defaultZoom() {
      return Number(getEnvVar(envVars.MAP_DEFAULT_ZOOM)) || 16;
    },
    get resultsEmbedUrl() {
      return getEnvVar(envVars.RESULTS_MAP_EMBED_URL);
    },
    get streetViewDemoLat() {
      return Number(getEnvVar(envVars.SV_DEMO_LAT)) || 40.758;
    },
    get streetViewDemoLng() {
      return Number(getEnvVar(envVars.SV_DEMO_LNG)) || -73.9855;
    },
  },
  contact: {
    get whatsappJoshua() {
      return getEnvVar(envVars.WHATSAPP_JOSHUA);
    },
    get indaWhatsapp() {
      return getEnvVar(envVars.INDA_WHATSAPP);
    },
  },
  social: {
    get tiktok() {
      return getEnvVar(envVars.LINK_TIKTOK);
    },
    get youtube() {
      return getEnvVar(envVars.LINK_YOUTUBE);
    },
    get twitter() {
      return getEnvVar(envVars.LINK_TWITTER) || getEnvVar(envVars.LINK_X);
    },
    get instagram() {
      return getEnvVar(envVars.LINK_INSTAGRAM);
    },
    get linkedin() {
      return getEnvVar(envVars.LINK_LINKEDIN);
    },
  },
  analytics: {
    get clarityId() {
      return getEnvVar(envVars.MICROSOFT_CLARITY_ID);
    },
    get gaId() {
      return getEnvVar(envVars.GA_MEASUREMENT_ID);
    },
  },
  get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
};

export type Env = typeof env;


