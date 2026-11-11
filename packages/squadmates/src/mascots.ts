// The thirteen squad mascots. Frosted toys, one for each agent. Each body takes its shape
// from the place the agent is named after. Every mascot wears one lens over its right eye.
// The source is github.com/moeghashim/tensquads-design-system (scripts/mascots.mjs).
// Here the eyes and the mouth come from a Face, so the avatar can show an Agent loop state.

export type Palette = { readonly light: string; readonly base: string; readonly deep: string; readonly limb: string };

// Draws the eyes, the lens and the mouth. Coordinates are in the 300 x 370 drawing.
export type Face = {
	readonly eyes: (left: number, right: number, y: number, lens: number) => string;
	readonly mouth: (x: number, y: number, kind?: "smile" | "o") => string;
};

export const PALETTES: Record<string, Palette> = {
	master: { light: "#FBD8D0", base: "#EBA196", deep: "#C9746A", limb: "#E3958A" },
	orders: { light: "#DCE8FF", base: "#97B7F5", deep: "#5F86D6", limb: "#8AACEE" },
	support: { light: "#FFD3C7", base: "#F08B70", deep: "#CC5A40", limb: "#E98065" },
	marketing: { light: "#E6DBFF", base: "#B194F2", deep: "#7E5ED0", limb: "#A88BEB" },
	finance: { light: "#EEF1F6", base: "#B6C0CF", deep: "#7E8BA0", limb: "#A9B4C5" },
	inventory: { light: "#FFE1C4", base: "#F4A866", deep: "#D27A34", limb: "#EE9F5A" },
	market: { light: "#D3F0DF", base: "#93D2B1", deep: "#5EA885", limb: "#86C7A5" },
	website: { light: "#FFE7AE", base: "#F5C25C", deep: "#D6952C", limb: "#EDB54E" },
	analytics: { light: "#E8F2C9", base: "#B5CB72", deep: "#7F9840", limb: "#A9C065" },
	hr: { light: "#D4F1FB", base: "#86CDE8", deep: "#4C9EC2", limb: "#7AC4E2" },
	places: { light: "#F6FBC4", base: "#DDEB5C", deep: "#A8B824", limb: "#D3E350" },
	catalog: { light: "#D9DBFF", base: "#8E95F2", deep: "#4F56C4", limb: "#8288EC" },
	channels: { light: "#FFD6F0", base: "#F28CCB", deep: "#C9529C", limb: "#EC80C2" },
};

// The square that shows the upper body in a small avatar: x, y and side, in the drawing.
export const BUST: Record<string, readonly [number, number, number]> = {
	master: [45, 45, 210],
	orders: [45, 50, 210],
	support: [40, 50, 220],
	marketing: [45, 70, 220],
	finance: [40, 90, 220],
	inventory: [40, 80, 220],
	market: [35, 80, 230],
	website: [30, 60, 240],
	analytics: [45, 70, 210],
	hr: [40, 80, 220],
	places: [38, 58, 236],
	catalog: [40, 50, 230],
	channels: [35, 85, 230],
};

export const INK = "#1B1B1F";

export function defs(k: string, c: Palette): string {
	return `<defs><radialGradient id="${k}b" cx="32%" cy="26%" r="85%"><stop offset="0" stop-color="${c.light}"/><stop offset=".55" stop-color="${c.base}"/><stop offset="1" stop-color="${c.deep}"/></radialGradient><radialGradient id="${k}l" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></radialGradient><filter id="${k}f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter><filter id="${k}s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>`;
}

export const lens = (k: string, x: number, y: number, r: number) =>
	`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${k}l)" stroke="#fff" stroke-opacity=".9" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r - 7}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2"/><path d="M${x - r * 0.55} ${y - r * 0.35} A${r * 0.7} ${r * 0.7} 0 0 1 ${x - r * 0.1} ${y - r * 0.68}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/>`;
const limb = (c: Palette, d: string, w = 13) =>
	`<path d="${d}" fill="none" stroke="${c.limb}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity=".96"/>`;
const legs = (c: Palette, a: number, b: number, top: number, w = 13) =>
	limb(c, `M${a} ${top} L${a - 3} 344`, w) +
	limb(c, `M${b} ${top} L${b + 3} 344`, w) +
	`<ellipse cx="${a - 7}" cy="347" rx="17" ry="9" fill="${c.limb}"/><ellipse cx="${b + 7}" cy="347" rx="17" ry="9" fill="${c.limb}"/>`;
const hand = (c: Palette, x: number, y: number, r = 10) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.limb}"/>`;
export const shadow = (k: string) =>
	`<ellipse cx="150" cy="356" rx="95" ry="10" fill="#1B2430" opacity=".14" filter="url(#${k}s)"/>`;
const sheen = (k: string, d: string) => `<path d="${d}" fill="#fff" opacity=".42" filter="url(#${k}f)"/>`;
const rim = (d: string) =>
	`<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;

type Draw = (k: string, c: Palette, f: Face) => string;

export const DRAW: Record<string, Draw> = {
	master: (k, c, f) => `${legs(c, 125, 175, 300)}
${limb(c, "M94 205 Q70 230 74 268")}${hand(c, 74, 270)}
${limb(c, "M206 195 Q244 182 250 128")}<g transform="translate(250 118)"><ellipse rx="12" ry="14" fill="${c.limb}"/><path d="M-9 -8 L-14 -24 M-2 -12 L-3 -30 M5 -11 L9 -28 M10 -5 L18 -18" stroke="${c.limb}" stroke-width="7" stroke-linecap="round"/></g>
<path d="M150 60 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 M144 68 L156 68 L158 84 L142 84 Z" fill="url(#${k}b)"/>
<path d="M88 296 L88 146 A62 62 0 0 1 212 146 L212 296 Q212 310 198 310 L102 310 Q88 310 88 296 Z" fill="url(#${k}b)"/>
<path d="M108 300 L108 154 A42 42 0 0 1 192 154 L192 300" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="5"/>
${sheen(k, "M104 150 A46 46 0 0 1 150 104 Q132 130 112 200 Z")}
${f.eyes(126, 174, 178, 27)}${f.mouth(150, 212)}`,

	orders: (k, c, f) => `${legs(c, 128, 182, 296)}
<g transform="rotate(7 150 300)">
<rect x="114" y="58" width="72" height="44" rx="16" fill="url(#${k}b)"/>
<rect x="98" y="92" width="104" height="212" rx="30" fill="url(#${k}b)"/>
${rim("M104 146 L196 146 M104 200 L196 200 M104 254 L196 254")}
<path d="M118 112 v18 M134 112 v18 M150 112 v18 M166 112 v18 M182 112 v18" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>
${sheen(k, "M106 110 Q104 200 112 290 L122 290 Q114 200 118 110 Z")}
${f.eyes(128, 172, 174, 24)}${f.mouth(150, 214)}
</g>
${limb(c, "M98 214 Q72 230 70 262")}${hand(c, 70, 264)}
<g transform="rotate(-4 236 268)"><rect x="200" y="238" width="72" height="56" rx="8" fill="#E2C49A"/><path d="M200 258 L272 258 M236 238 L236 258" stroke="#C9A472" stroke-width="5"/></g>
${limb(c, "M204 214 Q226 226 222 250")}${hand(c, 222, 252)}${hand(c, 262, 246)}`,

	support: (k, c, f) => `${legs(c, 126, 174, 296)}
${limb(c, "M84 214 Q58 234 62 266")}${hand(c, 62, 268)}
${limb(c, "M216 214 Q244 232 240 266")}${hand(c, 240, 268)}
<rect x="80" y="102" width="140" height="196" rx="66" fill="url(#${k}b)"/>
<rect x="110" y="88" width="80" height="26" rx="9" fill="${c.deep}"/>
<rect x="110" y="286" width="80" height="22" rx="9" fill="${c.deep}"/>
${rim("M92 150 Q150 138 208 150 M86 200 Q150 190 214 200 M92 250 Q150 262 208 250")}
${sheen(k, "M98 130 Q86 200 100 270 L112 270 Q100 200 110 130 Z")}
${f.eyes(128, 172, 196, 24)}${f.mouth(150, 236)}
<path d="M80 186 Q78 54 150 54 Q222 54 220 186" fill="none" stroke="#2A2D34" stroke-width="7" stroke-linecap="round"/>
<rect x="68" y="168" width="20" height="40" rx="9" fill="#2A2D34"/><rect x="212" y="168" width="20" height="40" rx="9" fill="#2A2D34"/>
<path d="M74 206 Q84 250 120 244" fill="none" stroke="#2A2D34" stroke-width="5" stroke-linecap="round"/><circle cx="122" cy="244" r="6" fill="#2A2D34"/>`,

	marketing: (k, c, f) => `${legs(c, 124, 180, 296)}
${limb(c, "M76 226 Q48 244 54 278")}${hand(c, 54, 280)}
<path d="M68 300 Q56 156 130 86 Q190 40 222 120 Q244 200 236 300 Z" fill="url(#${k}b)" stroke="url(#${k}b)" stroke-width="16" stroke-linejoin="round"/>
${sheen(k, "M96 150 Q76 220 86 290 L100 290 Q92 220 110 150 Z")}
${f.eyes(132, 178, 196, 26)}${f.mouth(156, 236)}
${limb(c, "M230 220 Q250 214 252 194")}
<g transform="rotate(-30 252 186)"><path d="M248 176 L276 162 L276 206 L248 192 Z" fill="#F7F3EC" stroke="#D9D1C2" stroke-width="3" stroke-linejoin="round"/><rect x="238" y="178" width="12" height="16" rx="4" fill="#D9D1C2"/></g>
${hand(c, 252, 194)}
<path d="M262 128 Q272 136 268 148 M272 114 Q288 130 280 152" fill="none" stroke="${c.deep}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,

	finance: (k, c, f) => `${legs(c, 124, 176, 286)}
${limb(c, "M62 214 Q36 232 42 266")}${hand(c, 42, 268)}
${limb(c, "M238 196 Q266 176 262 140")}${hand(c, 262, 138)}
<circle cx="262" cy="114" r="18" fill="#F3C548" stroke="#D69E20" stroke-width="3"/><circle cx="262" cy="114" r="10" fill="none" stroke="#B9851A" stroke-width="2.5"/>
<circle cx="150" cy="200" r="98" fill="url(#${k}b)"/>
<circle cx="150" cy="200" r="94" fill="none" stroke="${c.deep}" stroke-opacity=".45" stroke-width="7" stroke-dasharray="3 6"/>
<circle cx="150" cy="200" r="76" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>
${sheen(k, "M84 170 A70 70 0 0 1 150 120 Q110 150 98 210 Z")}
${f.eyes(126, 174, 194, 26)}${f.mouth(150, 232)}`,

	inventory: (k, c, f) => `${legs(c, 122, 178, 296)}
<path d="M150 74 L262 298 L38 298 Z" fill="url(#${k}b)" stroke="url(#${k}b)" stroke-width="24" stroke-linejoin="round"/>
${rim("M110 150 L190 150 M86 200 L214 200 M62 252 L238 252")}
<path d="M150 150 v50 M118 200 v52 M182 200 v52 M150 252 v40 M94 252 v40 M206 252 v40" stroke="${c.deep}" stroke-opacity=".25" stroke-width="3"/>
${sheen(k, "M146 90 Q112 160 74 270 Q104 190 150 104 Z")}
${f.eyes(128, 172, 222, 26)}${f.mouth(150, 262)}
${limb(c, "M66 262 Q40 270 42 300")}${hand(c, 42, 302)}
<rect x="200" y="252" width="66" height="58" rx="6" fill="#D9A86A"/><path d="M200 252 L266 310 M266 252 L200 310" stroke="#B9874A" stroke-width="5"/><rect x="200" y="252" width="66" height="58" rx="6" fill="none" stroke="#B9874A" stroke-width="5"/>
${limb(c, "M226 256 Q232 240 214 244")}${hand(c, 206, 274)}${hand(c, 262, 270)}`,

	market: (k, c, f) => `${legs(c, 122, 178, 300)}
${limb(c, "M44 250 Q14 262 18 296")}${hand(c, 18, 298)}
${limb(c, "M244 228 Q276 200 270 150")}<g transform="translate(270 146)"><circle r="11" fill="${c.limb}"/><path d="M-2 -6 L-4 -32" stroke="${c.limb}" stroke-width="7" stroke-linecap="round"/></g>
<path d="M150 76 L184 132 L203 132 L222 192 L242 192 L258 300 L42 300 L58 192 L78 192 L97 132 L116 132 Z" fill="url(#${k}b)" stroke="url(#${k}b)" stroke-width="22" stroke-linejoin="round"/>
${rim("M82 192 L218 192 M101 132 L199 132")}
${sheen(k, "M150 84 Q120 130 92 210 Q118 160 150 100 Z")}
${f.eyes(122, 178, 236, 34)}${f.mouth(150, 272, "o")}`,

	website: (k, c, f) => `${legs(c, 124, 176, 300, 16)}
<path d="M150 46 Q180 80 174 116 L126 116 Q120 80 150 46 Z" fill="url(#${k}b)"/>
<rect x="112" y="106" width="76" height="62" rx="22" fill="url(#${k}b)"/>
<rect x="96" y="156" width="108" height="70" rx="26" fill="url(#${k}b)"/>
<rect x="78" y="214" width="144" height="94" rx="32" fill="url(#${k}b)"/>
<path d="M120 168 L180 168 M106 226 L194 226" stroke="${c.deep}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
${sheen(k, "M134 62 Q124 90 128 110 L140 110 Q134 84 144 62 Z")}${sheen(k, "M94 228 Q88 260 96 292 L108 292 Q100 258 108 228 Z")}
${f.eyes(126, 172, 254, 24)}${f.mouth(149, 282)}
${limb(c, "M82 252 Q60 262 62 286")}${limb(c, "M218 252 Q244 262 240 286")}
<g transform="rotate(-6 150 300)"><rect x="196" y="270" width="56" height="40" rx="9" fill="#F2EEE6" stroke="#CFC6B6" stroke-width="2"/><path d="M196 290 L252 290 M224 270 L224 290 M210 290 L210 310 M238 290 L238 310" stroke="#CFC6B6" stroke-width="2"/></g>
${hand(c, 202, 292)}${hand(c, 246, 288)}`,

	analytics: (k, c, f) => `${legs(c, 128, 172, 300)}
${limb(c, "M112 200 Q80 220 82 254")}${hand(c, 82, 256)}
<rect x="110" y="104" width="80" height="182" rx="12" fill="url(#${k}b)"/>
<path d="M126 122 v150 M142 122 v150 M158 122 v150 M174 122 v150" stroke="#fff" stroke-opacity=".28" stroke-width="5" stroke-linecap="round"/>
<rect x="86" y="80" width="128" height="30" rx="12" fill="url(#${k}b)"/>
<circle cx="92" cy="100" r="16" fill="url(#${k}b)"/><circle cx="92" cy="100" r="7" fill="none" stroke="${c.deep}" stroke-opacity=".6" stroke-width="3"/>
<circle cx="208" cy="100" r="16" fill="url(#${k}b)"/><circle cx="208" cy="100" r="7" fill="none" stroke="${c.deep}" stroke-opacity=".6" stroke-width="3"/>
<rect x="96" y="280" width="108" height="24" rx="10" fill="url(#${k}b)"/>
${sheen(k, "M116 116 Q112 200 118 276 L126 276 Q120 200 124 116 Z")}
${f.eyes(132, 170, 168, 22)}${f.mouth(150, 202)}
${limb(c, "M188 200 Q220 190 230 160")}
<g transform="rotate(8 248 140)"><rect x="216" y="100" width="66" height="54" rx="8" fill="#fff" stroke="#D6DCE4" stroke-width="2"/><rect x="228" y="130" width="10" height="16" rx="2" fill="${c.deep}"/><rect x="244" y="120" width="10" height="26" rx="2" fill="${c.base}"/><rect x="260" y="110" width="10" height="36" rx="2" fill="${c.deep}"/></g>
${hand(c, 230, 156)}`,

	hr: (k, c, f) => `${legs(c, 128, 184, 296)}
${limb(c, "M78 230 Q50 248 56 280")}${hand(c, 56, 282)}
<path d="M64 300 Q66 150 206 76 Q190 180 222 300 Z" fill="url(#${k}b)" stroke="url(#${k}b)" stroke-width="14" stroke-linejoin="round"/>
<path d="M156 300 Q166 206 258 168 Q246 236 268 300 Z" fill="url(#${k}b)" stroke="url(#${k}b)" stroke-width="14" stroke-linejoin="round" opacity=".92"/>
<path d="M156 300 Q166 206 258 168" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"/>
${rim("M96 290 Q100 180 190 104")}
${sheen(k, "M90 280 Q92 200 150 130 Q110 200 104 280 Z")}
${f.eyes(122, 166, 222, 24)}${f.mouth(144, 258)}
<rect x="114" y="252" width="56" height="40" rx="7" fill="#fff" stroke="#D6DCE4" stroke-width="2"/><circle cx="130" cy="272" r="8" fill="${c.base}"/><path d="M144 266 h18 M144 278 h12" stroke="#9AA3B1" stroke-width="3" stroke-linecap="round"/>
${limb(c, "M214 250 Q196 268 172 268")}${hand(c, 170, 268)}`,
	places: (k, c, f) => `${legs(c, 124, 176, 300)}
${limb(c, "M88 228 Q60 244 64 276")}${hand(c, 64, 278)}
<rect x="88" y="150" width="124" height="156" rx="18" fill="url(#${k}b)"/>
${rim("M100 186 L200 186")}
<path d="M66 158 A84 80 0 0 1 234 158 Z" fill="url(#${k}b)"/>
<path d="M92 156 Q100 112 132 88 M208 156 Q200 112 168 88" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>
<path d="M141 79 L159 79 L162 158 L138 158 Z" fill="${c.deep}" opacity=".55"/>
<rect x="62" y="152" width="176" height="14" rx="7" fill="${c.deep}" opacity=".85"/>
<rect x="144" y="64" width="12" height="16" rx="3" fill="#B0894A"/>
<circle cx="150" cy="56" r="14" fill="#E5574A"/><circle cx="145" cy="51" r="4.5" fill="#fff" opacity=".6"/>
<path d="M150 268 L150 304" stroke="#D9AE45" stroke-width="6" stroke-linecap="round"/>
${sheen(k, "M82 150 A72 70 0 0 1 128 94 Q104 120 98 150 Z")}${sheen(k, "M100 176 Q96 236 104 292 L114 292 Q108 236 112 176 Z")}
${f.eyes(126, 174, 214, 26)}${f.mouth(150, 248)}
${limb(c, "M212 226 Q244 214 250 188")}
<g transform="rotate(-8 256 164)"><path d="M224 140 L246 132 L266 140 L288 132 L288 184 L266 192 L246 184 L224 192 Z" fill="#F4EFE4" stroke="#D3C9B5" stroke-width="2" stroke-linejoin="round"/><path d="M246 132 L246 184 L266 192 L266 140 Z" fill="#E4DAC6"/><path d="M232 176 Q248 154 258 166 T282 148" fill="none" stroke="#5F86D6" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"/><circle cx="282" cy="146" r="6" fill="#E5574A"/></g>
${hand(c, 250, 188)}`,
	catalog: (k, c, f) => `${legs(c, 124, 176, 300)}
${limb(c, "M96 222 Q70 238 72 270")}${hand(c, 72, 272)}
<circle cx="150" cy="58" r="9" fill="${c.deep}" opacity=".85"/>
<path d="M96 300 L96 118 A54 54 0 0 1 204 118 L204 300 Q204 312 192 312 L108 312 Q96 312 96 300 Z" fill="url(#${k}b)"/>
<rect x="108" y="190" width="84" height="112" rx="8" fill="${c.deep}" opacity=".35"/>
<rect x="112" y="204" width="12" height="38" rx="2" fill="#F4EFE4"/><rect x="126" y="198" width="10" height="44" rx="2" fill="#E5574A"/><rect x="138" y="206" width="14" height="36" rx="2" fill="#D9AE45"/><rect x="154" y="200" width="10" height="42" rx="2" fill="#5EA885"/><rect x="166" y="204" width="12" height="38" rx="2" fill="#F4EFE4"/><rect x="180" y="210" width="10" height="34" rx="2" fill="#5F86D6" transform="rotate(-12 185 244)"/>
<rect x="104" y="242" width="92" height="6" rx="3" fill="${c.deep}" opacity=".85"/>
<rect x="112" y="256" width="10" height="40" rx="2" fill="#5F86D6"/><rect x="124" y="262" width="14" height="34" rx="2" fill="#F4EFE4"/><rect x="140" y="254" width="10" height="42" rx="2" fill="#D9AE45"/><rect x="152" y="260" width="12" height="36" rx="2" fill="#E5574A"/><rect x="166" y="256" width="10" height="40" rx="2" fill="#F4EFE4"/><rect x="178" y="262" width="12" height="34" rx="2" fill="#5EA885"/>
<rect x="104" y="296" width="92" height="6" rx="3" fill="${c.deep}" opacity=".85"/>
${sheen(k, "M106 118 A44 44 0 0 1 140 76 Q118 100 112 184 Z")}
${f.eyes(128, 172, 146, 24)}${f.mouth(150, 176)}
${limb(c, "M204 214 Q236 206 244 180")}
<path d="M244 180 Q252 196 258 210" fill="none" stroke="#D3C9B5" stroke-width="2"/>
<g transform="rotate(14 258 232)"><path d="M248 216 L258 206 L268 216 L268 256 L248 256 Z" fill="#F4EFE4" stroke="#D3C9B5" stroke-width="2" stroke-linejoin="round"/><circle cx="258" cy="216" r="3" fill="#D3C9B5"/><path d="M253 232 L263 232 M253 242 L261 242" stroke="#E5574A" stroke-width="3" stroke-linecap="round"/></g>
${hand(c, 244, 180)}`,
	channels: (k, c, f) => `${legs(c, 94, 206, 304)}
${limb(c, "M74 236 Q50 252 54 282")}${hand(c, 54, 284)}
<path d="M214 112 L276 300" stroke="#B0894A" stroke-width="7" stroke-linecap="round"/>
<ellipse cx="279" cy="310" rx="9" ry="22" fill="#C99A5B" transform="rotate(-18 279 310)"/>
<path d="M122 120 L150 98 L178 120 Z" fill="${c.deep}" opacity=".85"/>
<rect x="128" y="118" width="44" height="44" rx="4" fill="url(#${k}b)"/>
<path d="M140 162 L140 138 A10 10 0 0 1 160 138 L160 162 Z" fill="${c.deep}" opacity=".55"/>
<path d="M74 304 L74 196 Q150 116 226 196 L226 304 Q226 312 218 312 L188 312 L188 300 A38 30 0 0 0 112 300 L112 312 L82 312 Q74 312 74 304 Z" fill="url(#${k}b)"/>
<path d="M86 208 L86 200 A5 5 0 0 1 96 200 L96 208 Z M100 208 L100 200 A5 5 0 0 1 110 200 L110 208 Z M114 208 L114 200 A5 5 0 0 1 124 200 L124 208 Z M176 208 L176 200 A5 5 0 0 1 186 200 L186 208 Z M190 208 L190 200 A5 5 0 0 1 200 200 L200 208 Z M204 208 L204 200 A5 5 0 0 1 214 200 L214 208 Z" fill="${c.deep}" opacity=".55"/>
${rim("M82 214 Q150 172 218 214")}
<path d="M118 304 q8 -6 16 0 t16 0 t16 0 t16 0" fill="none" stroke="#4C9EC2" stroke-width="4" stroke-linecap="round" opacity=".8"/><path d="M128 296 q6 -4 12 0 t12 0 t12 0" fill="none" stroke="#86CDE8" stroke-width="3" stroke-linecap="round" opacity=".8"/>
${sheen(k, "M84 200 Q110 170 140 160 Q110 182 96 246 Z")}
${f.eyes(126, 174, 232, 24)}${f.mouth(150, 260)}
${limb(c, "M226 230 Q244 224 246 210")}${hand(c, 246, 210)}`,
};
