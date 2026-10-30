# 01 — Visual identity: the reading book

Replaces the default shadcn look. What failed, in counts: 5 views built from the same centred `Card`,
164 raw palette classes, 26 emojis acting as icons, one theme, no route, no test.

## 1. The concept

A reading book, the object an 8-year-old already knows from the classroom. The teacher prepares it, the
student reads it. Each question is an open book: the text on one page, the question on the other.

| Screen | Layout change |
|---|---|
| Question | two facing pages instead of one stacked card |
| Generation | a table of contents, with the descriptors as its lines |
| Result | the last page of the book, a list of what was read |

## 2. The skeleton

One root per screen: `Book`, which owns `main` and the single `h1`. Inside it: `BookHeader` (the running
head), `Spread`, `Page` and `Folio` (the foot of the page, which holds the navigation). Secondary
information goes in the running head or the folio, never in another box.

`Card` and `Badge` do not enter a screen. Forbidden: card in card, grey subtitle, a pill on every row.

Layers: **the printed book** (type, rules, page numbers) and **the reader's marks** (highlighter, and
the teacher's correction beside the answer). Ask "who put this here?".

## 3. Meanings

| Colour or mark | Means | Never used for |
|---|---|---|
| `primary`, the cloth cover | brand and main action | selection, a right answer |
| `mark`, the highlighter | what the reader chose | decoration, hover |
| `correct` | the right answer, after answering | success of a system action |
| `miss`, soft clay | a wrong answer: part of learning | a system failure |
| `error` | something failed and needs action now | a wrong answer |

Budgets: one solid main action per screen. `error` appears only when the app failed. A child's wrong
answer is never alarm red and never shakes. Colour is never alone: a check mark, a cross or a word goes
with it. The difficulty levels carry no traffic-light colour, because they are not a verdict.

## 4. Type

Faces, picked by the user on the pilot: **Lora** for titles and **Andika**, drawn for beginning readers,
for reading and interface. Five sizes: small, body, heading, title, figure.
Figures are tabular wherever they are compared. The body size is settled on the running app.

## 5. Themes

Light only: cream paper on a desk, in daylight. The dark theme was built and removed by the user's
decision. This is a deliberate exception to the frontend standard, which asks for two themes.

## 6. Motion

Little. The material is paper. The moments that exist: a page arrives (240 ms), the highlighter marks
the choice (240 ms). Nothing loops except loading. No shake, no bounce, no sound. Reduced motion gives an
instant swap.

## 7. Screens

| Screen | What it is in the concept | What changes in the layout |
|---|---|---|
| Question (pilot) | an open book | two facing pages, one on the phone; folio holds the navigation |
| Generation | table of contents | descriptors as lines with dotted leaders; options in the margin |
| PDF selection | the proofs to print | a list of pages to keep |
| PDF ready | the book is printed | a closing page with one action |
| Result | the last page | score as a figure, a line per descriptor |

The teacher's screens (generation, selection, PDF) speak to an adult. The question and the result speak
to the child: bigger type, 44 px targets, short and kind sentences.

## 8. Pilot and order

Pilot: Question. Then Result, Generation, the PDF screens, each one a commit; then routes, then the lock.

**Reload.** The app has no database, so a reload loses the generated questions and returns to Generation.
This is a known exception to "reloading rebuilds the screen", accepted by the user.

## 9. Guarantees

| Rule | Guarantee |
|---|---|
| Text and control pairs have contrast | `src/styles/contrast.test.ts` |
| Only cheap properties animate, no `100vh` | `src/styles/motion.test.ts` |
| One root per screen | `no-restricted-imports` + `expectOneBook()` in each screen test |
| Colour only by token | `no-restricted-syntax` in `eslint.config.js` |
| Accessibility and overflow, every route, 390 and 1280 px | `e2e/routes.spec.ts` with axe |
| Keyboard, focus after navigation, reduced motion, main paths | `e2e/flows.spec.ts` |
| Initial JS at most 250 KB gzip | `scripts/check-bundle.mjs` |

`npm run check` and `npm run test:e2e` run them. There is no CI yet, so nothing runs them on its own.
