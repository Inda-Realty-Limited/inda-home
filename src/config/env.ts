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
    defaultValue: 'inda_super_secret_key',
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
    defaultValue: '6.6018',
  },
  MAP_DEFAULT_LNG: {
    key: 'NEXT_PUBLIC_MAP_DEFAULT_LNG',
    required: false,
    defaultValue: '3.3515',
  },
  MAP_DEFAULT_ZOOM: {
    key: 'NEXT_PUBLIC_MAP_DEFAULT_ZOOM',
    required: false,
    defaultValue: '16',
  },
  RESULTS_MAP_EMBED_URL: {
    key: 'NEXT_PUBLIC_RESULTS_MAP_EMBED_URL',
    required: false,
  },
  SV_DEMO_LAT: {
    key: 'NEXT_PUBLIC_SV_DEMO_LAT',
    required: false,
    defaultValue: '40.758',
  },
  SV_DEMO_LNG: {
    key: 'NEXT_PUBLIC_SV_DEMO_LNG',
    required: false,
    defaultValue: '-73.9855',
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
    defaultValue: 'https://www.tiktok.com/',
  },
  LINK_YOUTUBE: {
    key: 'NEXT_PUBLIC_LINK_YOUTUBE',
    required: false,
    defaultValue: 'https://www.youtube.com/',
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
    defaultValue: 'https://instagram.com/',
  },
  LINK_LINKEDIN: {
    key: 'NEXT_PUBLIC_LINK_LINKEDIN',
    required: false,
    defaultValue: 'https://www.linkedin.com/',
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

function getEnvVar(config: EnvVarConfig): string | undefined {
  const value = process.env[config.key];
  
  if (!value && config.required && !config.defaultValue) {
    if (typeof window === 'undefined') {
      console.error(`Missing required environment variable: ${config.key}`);
    }
    return undefined;
  }
  
  return value || config.defaultValue;
}

function validateEnv() {
  const missing: string[] = [];
  
  Object.entries(envVars).forEach(([, config]) => {
    if (config.required && !process.env[config.key] && !config.defaultValue) {
      missing.push(config.key);
    }
  });
  
  if (missing.length > 0 && typeof window === 'undefined') {
    console.warn(
      `⚠️  Missing required environment variables:\n  - ${missing.join('\n  - ')}\n` +
      `Please check your .env.local file against .env.example`
    );
  }
}

validateEnv();

export const env = {
  api: {
    baseUrl: getEnvVar(envVars.API_BASE_URL) || 'https://inda-core-backend-services.onrender.com',
  },
  security: {
    encryptionSecret: getEnvVar(envVars.ENCRYPTION_SECRET) || 'inda_super_secret_key',
  },
  maps: {
    mapboxToken: getEnvVar(envVars.MAPBOX_TOKEN),
    googleMapsApiKey: getEnvVar(envVars.GOOGLE_MAPS_API_KEY),
    defaultLat: Number(getEnvVar(envVars.MAP_DEFAULT_LAT)),
    defaultLng: Number(getEnvVar(envVars.MAP_DEFAULT_LNG)),
    defaultZoom: Number(getEnvVar(envVars.MAP_DEFAULT_ZOOM)),
    resultsEmbedUrl: getEnvVar(envVars.RESULTS_MAP_EMBED_URL),
    streetViewDemoLat: Number(getEnvVar(envVars.SV_DEMO_LAT)),
    streetViewDemoLng: Number(getEnvVar(envVars.SV_DEMO_LNG)),
  },
  contact: {
    whatsappJoshua: getEnvVar(envVars.WHATSAPP_JOSHUA),
    indaWhatsapp: getEnvVar(envVars.INDA_WHATSAPP),
  },
  social: {
    tiktok: getEnvVar(envVars.LINK_TIKTOK),
    youtube: getEnvVar(envVars.LINK_YOUTUBE),
    twitter: getEnvVar(envVars.LINK_TWITTER) || getEnvVar(envVars.LINK_X),
    instagram: getEnvVar(envVars.LINK_INSTAGRAM),
    linkedin: getEnvVar(envVars.LINK_LINKEDIN),
  },
  analytics: {
    clarityId: getEnvVar(envVars.MICROSOFT_CLARITY_ID),
    gaId: getEnvVar(envVars.GA_MEASUREMENT_ID),
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export type Env = typeof env;

