import { BUST, DRAW, defs, type Face, INK, lens, PALETTES, shadow } from "./mascots.ts";
import { AGENT_LOOP_STATES, type AgentLoopState, SQUADMATES, type Squadmate } from "./roster.ts";

export type SquadmateDrawState = AgentLoopState | "idle";

const DRAW_STATES = new Set<string>(["idle", ...AGENT_LOOP_STATES.map((state) => state.id)]);
const BY_ID = new Map<string, Squadmate>(SQUADMATES.map((mate) => [mate.id, mate]));

export class UnknownSquadmateError extends Error {
	readonly imageId: string;

	constructor(imageId: string) {
		super(`Unknown squadmate image: ${imageId}`);
		this.name = "UnknownSquadmateError";
		this.imageId = imageId;
	}
}

export class UnknownSquadmateStateError extends Error {
	readonly state: string;

	constructor(state: string) {
		super(`Unknown squadmate state: ${state}`);
		this.name = "UnknownSquadmateStateError";
		this.state = state;
	}
}

// ---- Eyes for each state, in the 300 x 370 drawing. The lens always covers the right eye. ----
const bead = (x: number, y: number, r = 7) =>
	`<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.3}" fill="#fff" opacity=".9"/>`;
const lid = (x: number, y: number) => `<ellipse cx="${x}" cy="${y + 1}" rx="7.5" ry="3.2" fill="${INK}"/>`;
const bar = (x: number, y: number) =>
	`<rect x="${x - 8}" y="${y - 2.5}" width="16" height="5" rx="2.5" fill="${INK}"/>`;
const arc = (x: number, y: number, up: boolean) =>
	`<path d="M${x - 8} ${y + (up ? 3 : -3)} Q${x} ${y + (up ? -7 : 7)} ${x + 8} ${y + (up ? 3 : -3)}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;

const EYES: Record<SquadmateDrawState, (l: number, r: number, y: number) => string> = {
	idle: (l, r, y) => bead(l, y) + bead(r, y),
	waiting: (l, r, y) => lid(l, y) + lid(r, y),
	planning: (l, r, y) => bead(l + 2, y - 5) + bead(r + 2, y - 5),
	running: (l, r, y) => bead(l + 4, y, 6.5) + bead(r + 4, y, 6.5),
	checking: (l, r, y) => bead(l, y) + bar(r, y),
	done: (l, r, y) => arc(l, y, true) + arc(r, y, true),
	sentback: (l, r, y) => bead(l - 2, y + 5, 6) + bead(r - 2, y + 5, 6),
	blocked: (l, r, y) => bar(l, y) + bar(r, y),
	escalated: (l, r, y) => bead(l, y, 9) + bead(r, y, 9),
	dropped: (l, r, y) => arc(l, y, false) + arc(r, y, false),
};

const FLAT = new Set<SquadmateDrawState>(["sentback", "blocked", "dropped"]);

function face(k: string, state: SquadmateDrawState): Face {
	const blink = state === "waiting" || state === "idle" ? ' class="sm-blink"' : "";
	return {
		eyes: (l, r, y, size) => `<g${blink}>${EYES[state](l, r, y)}</g>${lens(k, r, y, size)}`,
		mouth: (x, y, kind = "smile") => {
			if (kind === "o" || state === "escalated")
				return `<ellipse cx="${x}" cy="${y}" rx="${kind === "o" ? 9 : 6}" ry="${kind === "o" ? 6 : 7}" fill="${INK}" opacity=".75"/>`;
			if (FLAT.has(state))
				return `<path d="M${x - 8} ${y + 3} L${x + 8} ${y + 3}" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
			return `<path d="M${x - 10} ${y} Q${x} ${y + 8} ${x + 10} ${y}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
		},
	};
}

// ---- Marks over the avatar, in the 64 x 64 box. ----
function badge(state: SquadmateDrawState): string {
	if (state === "escalated")
		return `<circle cx="53" cy="53" r="8" fill="#e5484d" stroke="#fff" stroke-width="2.5"/><rect x="52" y="48.2" width="2" height="6" rx="1" fill="#fff"/><circle cx="53" cy="57.2" r="1.15" fill="#fff"/>`;
	if (state === "blocked")
		return `<circle cx="53" cy="53" r="8" fill="#e39b00" stroke="#fff" stroke-width="2.5"/><rect x="49.8" y="49.5" width="2.2" height="7" rx="1" fill="#fff"/><rect x="54" y="49.5" width="2.2" height="7" rx="1" fill="#fff"/>`;
	if (state === "done")
		return `<circle cx="53" cy="53" r="8" fill="#00a240" stroke="#fff" stroke-width="2.5"/><path d="M49.4 53.2 l2.5 2.5 l4.7 -5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
	if (state === "dropped")
		return `<text x="50" y="16" font-family="Inter,system-ui,sans-serif" font-size="11" font-weight="700" fill="#8f8f8f">z</text><text x="56" y="9" font-family="Inter,system-ui,sans-serif" font-size="8" font-weight="700" fill="#b4b4b4">z</text>`;
	if (state === "planning")
		return `<circle cx="53" cy="13" r="2" fill="#a8a8a8"/><circle cx="57.5" cy="8" r="2.8" fill="#a8a8a8"/>`;
	return "";
}

// At 64 px and up the avatar shows the whole mascot. Smaller, it shows the upper body,
// so the face stays readable at 16 px.
function avatar(mate: Squadmate, state: SquadmateDrawState, size: number): string {
	const k = `sm-${mate.name.toLowerCase()}-`;
	const palette = PALETTES[mate.id];
	const draw = DRAW[mate.id];
	const bust = BUST[mate.id];
	if (palette == null || draw == null || bust == null) throw new UnknownSquadmateError(mate.id);
	const full = size >= 64;
	const [x, y, side] = full ? [-35, 0, 370] : bust;
	const scale = Number((64 / side).toFixed(5));
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="${mate.name}, ${mate.role}${state === "idle" ? "" : `, ${state}`}">
${defs(k, palette)}<g transform="scale(${scale}) translate(${-x} ${-y})">${full ? shadow(k) : ""}${draw(k, palette, face(k, state))}</g>
${badge(state)}
</svg>`;
}

export const SQUADMATE_CSS = `<style>
.sm-blink{transform-box:fill-box;transform-origin:center;animation:sm-blink 4.8s infinite}
@keyframes sm-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@media (prefers-reduced-motion:reduce){.sm-blink{animation:none}}
</style>`;

export function squadmateMarkup(imageId: string, state: string, size: number): string {
	const mate = BY_ID.get(imageId);
	if (mate == null) throw new UnknownSquadmateError(imageId);
	if (!DRAW_STATES.has(state)) throw new UnknownSquadmateStateError(state);
	return avatar(mate, state as SquadmateDrawState, size);
}
