// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

const importMap = {
  '@tanstack/react-query': async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild___mf_0_tanstack_mf_1_react_mf_2_query__prebuild__.js'
    );
    return pkg;
  },
  react: async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild__react__prebuild__.js'
    );
    return pkg;
  },
  'react-dom': async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild__react_mf_2_dom__prebuild__.js'
    );
    return pkg;
  },
  notistack: async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild__notistack__prebuild__.js'
    );
    return pkg;
  },
  '@tanstack/react-router': async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild___mf_0_tanstack_mf_1_react_mf_2_router__prebuild__.js'
    );
    return pkg;
  },
  luxon: async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild__luxon__prebuild__.js'
    );
    return pkg;
  },
  '@mui/material': async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild___mf_0_mui_mf_1_material__prebuild__.js'
    );
    return pkg;
  },
  '@emotion/styled': async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild___mf_0_emotion_mf_1_styled__prebuild__.js'
    );
    return pkg;
  },
  '@emotion/react': async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild___mf_0_emotion_mf_1_react__prebuild__.js'
    );
    return pkg;
  },
  'react-hook-form': async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild__react_mf_2_hook_mf_2_form__prebuild__.js'
    );
    return pkg;
  },
  formik: async () => {
    let pkg = await import(
      '__mf__virtual/Cloud Manager Host__prebuild__formik__prebuild__.js'
    );
    return pkg;
  },
};
const usedShared = {
  '@tanstack/react-query': {
    name: '@tanstack/react-query',
    version: '5.51.24',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['@tanstack/react-query'].loaded = true;
      const { '@tanstack/react-query': pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^5.51.24',
    },
  },
  react: {
    name: 'react',
    version: '18.3.1',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['react'].loaded = true;
      const { react: pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^18.3.1',
    },
  },
  'react-dom': {
    name: 'react-dom',
    version: '18.3.1',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['react-dom'].loaded = true;
      const { 'react-dom': pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^18.3.1',
    },
  },
  notistack: {
    name: 'notistack',
    version: '3.0.1',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['notistack'].loaded = true;
      const { notistack: pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^3.0.1',
    },
  },
  '@tanstack/react-router': {
    name: '@tanstack/react-router',
    version: '1.58.3',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['@tanstack/react-router'].loaded = true;
      const { '@tanstack/react-router': pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^1.58.3',
    },
  },
  luxon: {
    name: 'luxon',
    version: '3.4.4',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['luxon'].loaded = true;
      const { luxon: pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^3.4.4',
    },
  },
  '@mui/material': {
    name: '@mui/material',
    version: '5.16.7',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['@mui/material'].loaded = true;
      const { '@mui/material': pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^5.16.7',
    },
  },
  '@emotion/styled': {
    name: '@emotion/styled',
    version: '11.13.0',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['@emotion/styled'].loaded = true;
      const { '@emotion/styled': pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^11.13.0',
    },
  },
  '@emotion/react': {
    name: '@emotion/react',
    version: '11.13.3',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['@emotion/react'].loaded = true;
      const { '@emotion/react': pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^11.13.3',
    },
  },
  'react-hook-form': {
    name: 'react-hook-form',
    version: '7.53.0',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['react-hook-form'].loaded = true;
      const { 'react-hook-form': pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^7.53.0',
    },
  },
  formik: {
    name: 'formik',
    version: '2.1.7',
    scope: ['default'],
    loaded: false,
    from: 'Cloud Manager Host',
    async get() {
      usedShared['formik'].loaded = true;
      const { formik: pkgDynamicImport } = importMap;
      const res = await pkgDynamicImport();
      const exportModule = { ...res };
      // All npm packages pre-built by vite will be converted to esm
      Object.defineProperty(exportModule, '__esModule', {
        value: true,
        enumerable: false,
      });
      return function () {
        return exportModule;
      };
    },
    shareConfig: {
      singleton: true,
      requiredVersion: '^2.1.7',
    },
  },
};
const usedRemotes = [];
export { usedShared, usedRemotes };
