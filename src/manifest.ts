import type { Manifest } from 'webextension-polyfill-ts'
import pkg from '../package.json'
import { IS_DEV, PORT } from '../scripts/utils'

export async function getManifest(): Promise<Manifest.WebExtensionManifest> {
  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    background: {
      service_worker: 'background.js',
    },
    content_scripts: [
      {
        matches: ['http://*/*', 'https://*/*', '<all_urls>'],
        js: ['./content/index.global.js'],
        css: ['./content/index.css'],
        run_at: 'document_start',
      },
    ],
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    web_accessible_resources: [
      {
        resources: ['assets/*'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['pageScript/index.global.js'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['popup/index.html'],
        matches: ['<all_urls>'],
      },
    ],
    permissions: ['tabs', 'storage', 'activeTab', 'notifications', 'declarativeContent'],
  }

  if (IS_DEV) {
    // this is required on dev for Vite script to load
    manifest.manifest_version = 2
    manifest.background = {
      page: 'background.js',
      persistent: false,
    }
    manifest.web_accessible_resources = ['assets/*', 'pageScript/index.global.js', 'popup/index.html']
    manifest.content_security_policy = `script-src \'self\' http://localhost:${PORT}; object-src \'self\'`
  }

  return manifest
}
