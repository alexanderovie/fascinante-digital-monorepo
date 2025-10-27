import { generateManifest } from '@repo/seo-config';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return generateManifest('app');
}
