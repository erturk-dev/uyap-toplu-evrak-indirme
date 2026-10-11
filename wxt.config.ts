import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'UYAP Toplu İndirme',
    description: "UYAP portallarındaki evrakları tek tıkla, düzenli ve toplu olarak bilgisayarınıza indirin.",
    version: '1.0.1',
    permissions: ['downloads'],
    host_permissions: ['https://*.uyap.gov.tr/*'],
    browser_specific_settings: {
      gecko: {
        id: 'uyap-toplu@dev.erturk',
        strict_min_version: '128.0',
        data_collection_permissions: {
        'required': ['none']
        }
      },
    },
  },

});