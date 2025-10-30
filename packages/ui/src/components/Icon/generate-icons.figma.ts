import { client } from '@figma/code-connect';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const FIGMA_FILE_URL =
  'https://www.figma.com/design/D1kkLnJBPHsZWxooDE18HW/Icons-Akamai-DS';

function toIconExportName(figmaComponentName: string): string {
  // Example: "core_chat-add" => take segment after '_' => "chat-add"
  const namePart = figmaComponentName.includes('_')
    ? figmaComponentName.split('_').slice(1).join('_')
    : figmaComponentName;
  const parts = namePart.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const pascal = parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
  return `Icon${pascal}`;
}

async function generateIcons() {
  const components = await client.getComponents(FIGMA_FILE_URL);

  // Keep only icon-like components. Example names observed: "core_chat-add"
  const filtered = components.filter(({ name }: { name: string }) => /[_-]/.test(name));

  const mapped = filtered.map((component: { name: string }) => ({
    ...component,
    exportName: toIconExportName(component.name),
  }));

  const unique = new Map<string, (typeof mapped)[number]>();
  for (const c of mapped) {
    if (!unique.has(c.exportName)) {
      unique.set(c.exportName, c);
    }
  }

  const exportNames = Array.from(unique.keys()).sort();
  const lines = exportNames.map((n) => `  ${n},`).join('\n');
  const connects = Array.from(unique.values())
    .sort((a, b) => a.exportName.localeCompare(b.exportName))
    .map(
      (c) =>
        `figma.connect('${c.figmaUrl}', { example: () => <${c.exportName} /> });`,
    )
    .join('\n');

  const out = `import figma from '@figma/code-connect';
import React from 'react';

import {
${lines}
} from '../../assets/iconsV2';

${connects}
`;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outPath = path.join(__dirname, 'icons.figma.tsx');
  fs.writeFileSync(outPath, out, { encoding: 'utf8' });
  // eslint-disable-next-line no-console
  console.log(`Wrote ${outPath}`);
}

generateIcons().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
