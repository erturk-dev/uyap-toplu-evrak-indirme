import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'UYAP Toplu İndirme',
    version: '0.1.0',
    permissions: ['downloads'],
    host_permissions: ['https://*.uyap.gov.tr/*'],
    browser_specific_settings: {
      gecko: { id: 'uyap-toplu@ornek.dev', strict_min_version: '128.0' },
    },
  },
  
});