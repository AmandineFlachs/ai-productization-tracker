// One-shot: embed docs/amandine.jpg as a base64 circular avatar in Scene 3 of
// architecture.svg. Base64-inlined so GitHub's README preview renders it (GitHub
// sandboxes SVGs and strips external image refs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SVG = path.join(ROOT, 'docs', 'architecture.svg');
const JPG = path.join(ROOT, 'docs', 'amandine.jpg');

const b64 = fs.readFileSync(JPG).toString('base64');
const dataUrl = `data:image/jpeg;base64,${b64}`;

let svg = fs.readFileSync(SVG, 'utf8');

// 1) Add avatar clipPath next to screenshot-clip
const clipMarker = `    <clipPath id="screenshot-clip">
      <rect x="640" y="128" width="560" height="488"/>
    </clipPath>`;
const clipReplacement = `${clipMarker}

    <clipPath id="avatar-clip">
      <circle cx="640" cy="495" r="38"/>
    </clipPath>`;
if (!svg.includes(clipMarker)) throw new Error('clip marker not found');
if (svg.includes('id="avatar-clip"')) {
  // Idempotent: already embedded — replace only the data URL inside the image
  svg = svg.replace(/(<image id="avatar-img"[^>]*href=")[^"]*(")/, `$1${dataUrl}$2`);
} else {
  svg = svg.replace(clipMarker, clipReplacement);

  // 2) Push byline down from y=510 to y=565 so the avatar fits above it
  const bylineMarker = `    <text x="640" y="510" text-anchor="middle" class="mono ink-2" font-size="13">By Amandine Flachs</text>`;
  const bylineReplacement = `    <text x="640" y="565" text-anchor="middle" class="mono ink-2" font-size="13">By Amandine Flachs</text>`;
  if (!svg.includes(bylineMarker)) throw new Error('byline marker not found');
  svg = svg.replace(bylineMarker, bylineReplacement);

  // 3) Insert avatar group just before the byline group. Reuses the byline's
  //    Scene 3 fade keyTimes for a synchronized appearance.
  const bylineGroupMarker = `  <g opacity="0">
    <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0"
             keyTimes="0; 0.692; 0.708; 0.892; 0.917; 1" dur="12s" repeatCount="indefinite"/>
    <text x="640" y="565" text-anchor="middle" class="mono ink-2" font-size="13">By Amandine Flachs</text>
  </g>`;
  const avatarGroup = `  <g opacity="0">
    <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0"
             keyTimes="0; 0.692; 0.708; 0.892; 0.917; 1" dur="12s" repeatCount="indefinite"/>
    <image id="avatar-img" x="602" y="457" width="76" height="76"
           preserveAspectRatio="xMidYMid slice"
           clip-path="url(#avatar-clip)"
           href="${dataUrl}"/>
    <circle cx="640" cy="495" r="38" fill="none" stroke="#1a1d27" stroke-width="1.25"/>
  </g>

${bylineGroupMarker}`;
  if (!svg.includes(bylineGroupMarker)) throw new Error('byline group marker not found');
  svg = svg.replace(bylineGroupMarker, avatarGroup);
}

fs.writeFileSync(SVG, svg);
console.log('Embedded photo into', SVG, '(' + svg.length + ' bytes)');
