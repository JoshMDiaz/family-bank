# The Family Bank look: how it was designed, and how to reuse it

This explains how the Family Bank UI was designed, gives the exact recipe, maps it onto PickleXP, and
ends with a prompt you can paste into Claude in `PickleXP/frontend`.

---

## 1. How the decisions were made

The look comes from five decisions, made in this order. The visual style came last.

**1. Start from what you do on each screen, not from how it looks.**
Family Bank has one job: check a number and change it quickly, one-handed, on a phone. So the number
is the largest thing on every screen. Each screen has one main action, and everything else is
secondary. Before styling any PickleXP screen, write down what someone opens it for, in one
sentence. Whatever answers that sentence gets the biggest type and the brand color.

**2. Borrow screens people already know from their iPhone.**
Nothing in Family Bank is a new pattern. Each piece copies an Apple screen:
- each kid is a **card in Apple Wallet** (a card means an account);
- adding or subtracting money works like **sending money in Apple Cash** (a big amount, a keypad, one button);
- the history looks like **Settings or Wallet transaction lists** (white rows in rounded groups, with the date above each group);
- the confirm-before-delete screen works like an **iOS confirmation sheet**.

When people already know how something works, it feels native. A clever custom pattern reads as a
website.

**3. Use color in one place, and keep everything else neutral.**
The gradient cards are the only loud thing on the screen. Everything else uses the system font,
gray backgrounds, white or dark-gray panels, and one accent color for things you can tap (blue).
Green and red mean only money in and money out. Because almost nothing else has color, the cards
look premium.

**4. Make it behave like an app, not a web page.**
Most of what makes it feel native is behavior, not looks:
- **Sheets instead of pages.** Tapping a kid slides a sheet up from the bottom; you swipe it down to close. You never leave the home screen.
- **A built-in keypad** for amounts, so the phone keyboard never covers the screen.
- **Buttons shrink slightly when pressed**, a **short shake** when you enter something invalid, and cards that **fade up one after another** when the page loads.
- Content stays clear of the notch and home bar, and the browser's gray tap flash is turned off.
- Light and dark mode follow the phone's setting automatically.

**5. Set numbers like an instrument, and keep the rest quiet.**
Money is set in **SF Pro Rounded**, bold, with every digit the same width so amounts don't jitter
as they change. The cents are drawn smaller and lighter, so `$144` reads first and `.20` second.
Labels are small gray text in normal sentence case, never all caps everywhere.

---

## 2. The recipe (exact values)

### Colors (Apple's own system colors)

| Color | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#F2F2F7` | `#000000` | page background |
| `--surface` | `#FFFFFF` | `#1C1C1E` | grouped panels and rows |
| `--label` | `#000` | `#FFF` | main text |
| `--label-2` | `rgb(60 60 67 / .6)` | `rgb(235 235 245 / .6)` | secondary text |
| `--label-3` | `rgb(60 60 67 / .3)` | `rgb(235 235 245 / .3)` | placeholders, empty amounts |
| `--separator` | `rgb(60 60 67 / .18)` | `rgb(84 84 88 / .6)` | divider lines between rows |
| `--fill` | `rgb(120 120 128 / .12)` | `rgb(120 120 128 / .24)` | round icon buttons, switch track |
| tint (accent) | `#007AFF` | `#0A84FF` | anything tappable (**one** accent color) |
| positive / negative | `#34C759` / `#FF3B30` | `#30D158` / `#FF453A` | meaning only, never decoration |

**Sheets in dark mode sit on a lighter gray:** the sheet background is `#1C1C1E` and rows inside
it are `#2C2C2E`. Without this, a sheet blends into the black page. This one change makes the
biggest difference in dark mode.

### Type

- **Font:** `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui`. This shows the real San Francisco font on Apple devices.
- **Numbers:** `ui-rounded, "SF Pro Rounded"`, bold, with `tabular-nums` (every digit the same width).
- **Sizes:**
  - 34px bold page title (iOS's "large title")
  - 22px bold section headings
  - 17px main text and buttons (semibold for buttons)
  - 15–16px row titles
  - 13px small gray captions and the labels above each group
- **Hero numbers:** 46–72px with tight letter spacing (`tracking-tight`). Cents at about 55% of that size, at 60–80% opacity.
- **All caps:** only for the **one** small label at the top of the page (the date) and the labels above each group.

### Shapes and spacing

- **Corner rounding:**
  - cards 26px
  - buttons and grouped panels 16px
  - text fields 12px
  - Add/Subtract switch: 9px outer, 7px for the sliding part
  - icon buttons fully round
- **Sizes:**
  - main buttons 56px tall (`h-14`), full width, inside a 16px page margin
  - nothing tappable smaller than 36px; 44px or more for anything important
- **Cards:** 1.7:1 shape (close to a credit card), shadow `0 18px 40px -18px rgba(0,0,0,.55)`. A diagonal white sheen and a faint ring of white in one corner make them look like glass.
- **List rows:** at least 60px tall, a 36px round icon on the left, and the divider line starting where the text starts, not at the edge (the iOS look).

### Motion

- **Press:** `active:scale-[0.97]` plus `transition-transform`, on every button and card.
- **Page load:** each card fades up 16px, with an `cubic-bezier(.2,.8,.2,1)` ease over 0.5s, starting 70ms after the previous card.
- **Add/Subtract switch:** the white part slides over 300ms with an `cubic-bezier(.3,.9,.3,1)` ease.
- **Invalid input:** a 0.35s side-to-side shake.
- **Sheets:** use shadcn's **Drawer** (the `vaul` library). It gives the drag handle and the swipe-down to close.

### Building blocks

1. **Page header.** A small gray date line across the top, with a round + button on the right (gray circle, accent-colored icon). Below that, the 34px bold title.
2. **Headline number.** A gray label above one huge number, like "Holding for 2 kids" over $184.20.
3. **Wallet card.** A gradient background (two colored glows over a diagonal blend):
   - name at top left, a small all-caps brand mark at top right
   - the big amount at bottom left, the latest activity at bottom right
4. **Sheet.** Drag handle, a centered round avatar, the big number, then two buttons side by side: a white one for the less common action and a blue one for the main action.
5. **Grouped list.** A gray date label above each group of rounded white rows.
   - **Edit** switches on red minus circles.
   - Tapping a minus circle reveals a red **Delete** button in that row.
6. **Amount entry.** **Cancel** at top left with the title in the middle, then the Add/Subtract switch, the huge amount, a live "New balance" preview, an optional note field, a 3×4 keypad, and a full-width button that confirms the action.
7. **Delete confirmation.** Shown inside the same sheet, not as a browser pop-up: a round red icon, the question, what will be lost, a red button and a plain **Cancel**.

---

## 3. Applying it to PickleXP

You're halfway there already. `ACCENT_USAGE.md` ("one hero tint per region, state colors are inline
accents") is the same principle as decision 3 above. And PickleXP ships as an iOS and Android app
through Capacitor, so an iOS-style look is a natural fit.

What would change:

| Area | PickleXP today | To get the Family Bank feel |
|---|---|---|
| Body font | Space Grotesk | **The phone's system font (SF Pro).** This is the biggest single change. Space Grotesk reads as a tech product, SF reads as native. |
| Numbers | JetBrains Mono ("instrument readout") | **SF Pro Rounded, bold, same-width digits.** It still looks precise, but warmer. This **replaces rule 1 in TYPOGRAPHY.md.** |
| Accent color | Teal | **Keep teal as the one accent color**, the way iOS apps use a single tint. Use it only for things you can tap and for the selected tab. |
| Hero card | Purple "What You're Playing For" card | **Make it the Wallet-style gradient card.** Purple already means "you" in your color rules, so it's the one card that gets the gradient treatment. |
| Lists (events, standings, activity) | Mixed card styles | **iOS grouped lists:** a gray label above each group and plain rows with one icon each (your ACCENT_USAGE rule 3 already says this). |
| Create and edit flows | Some pages, some sheets | **Sheets everywhere** (shadcn Drawer). Entering a score is a good fit for the **keypad pattern**. |
| Themes | `data-theme` attribute and token layer | Keep your setup. **Only change the token values.** In dark mode, sheets need the lighter-gray treatment. |

**Decide first:** do you want to give up Space Grotesk and JetBrains Mono? If you keep them, you
can still copy the layout, sheets, motion and restraint. The result will be a polished custom
style rather than something that feels like an Apple app. Either choice is reasonable; the
system-font option is what gets you the Family Bank feel.

---

## 4. Prompt to paste into Claude in `PickleXP/frontend`

```text
I want to move the PickleXP frontend toward a native iOS look, modeled on a small app I built
(Family Bank): Apple Wallet-style hero cards, Apple Cash-style number entry, grouped lists like
Settings, bottom sheets instead of new pages, and Apple's system font and colors. It must feel like
a polished first-party Apple app, not a website.

Before changing anything, read src/styles/globals.css, ACCENT_USAGE.md, TYPOGRAPHY.md and UX_AUDIT.md.
Keep the semantic hue contract from ACCENT_USAGE.md (teal = primary/tint, purple = "you"/season,
etc.) and the rule that colors only come from tokens, never hard-coded hex values in components.

Design principles (apply in this order):
1. Start from each screen's job. Write one sentence for what the user opens it to do. Whatever answers
   that gets the largest type and the tint color; everything else is secondary. One main action per screen.
2. Borrow familiar iOS patterns rather than inventing new ones: Wallet cards for "your" hero
   summary, Apple Cash-style amount/score entry, inset grouped lists for collections, and a
   confirmation sheet for destructive actions.
3. Use color in one place. Surfaces are neutral; teal is the only interactive tint; green and red
   mean only success and danger. At most one gradient hero card per screen region.
4. Make it behave like a native app: shadcn Drawer (vaul) sheets with a grabber and swipe-to-dismiss
   for create, edit and detail flows; buttons scale to 0.97 when pressed; a staggered rise animation
   on cards when the page loads; a shake on invalid input; safe-area padding (env(safe-area-inset-*));
   no tap highlight; viewport-fit=cover.
5. Display numbers as large SF Pro Rounded, bold, with tabular-nums; any secondary fraction (cents,
   decimals) smaller and lighter. Labels in sentence case; all caps only for one small label per
   screen and the labels above grouped lists.

Exact tokens (map these onto the existing token layer and light/dark themes; don't add a second
theming system):
- page background #F2F2F7 / #000000; surface #FFFFFF / #1C1C1E; in dark mode, sheets use #1C1C1E
  with #2C2C2E rows inside them
- label #000 / #FFF; secondary label rgb(60 60 67/.6) / rgb(235 235 245/.6);
  tertiary rgb(60 60 67/.3) / rgb(235 235 245/.3)
- separator rgb(60 60 67/.18) / rgb(84 84 88/.6); fill rgb(120 120 128/.12) / (.24)
- success #34C759 / #30D158; danger #FF3B30 / #FF453A; keep teal as the tint
- font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif
- font for numbers: ui-rounded, "SF Pro Rounded", -apple-system, system-ui (replaces mono for
  numbers; update TYPOGRAPHY.md to match)
- type scale: 34 bold large title, 22 bold section heading, 17 body and buttons, 15-16 row titles,
  13 captions and group labels
- corner radius: hero cards 26px, buttons and grouped panels 16px, text fields 12px, segmented
  control 9/7px
- buttons 56px tall and full width inside a 16px page margin; list rows at least 60px with a 36px
  icon and inset separators
- hero card: 1.7:1 aspect ratio, two radial-gradient glows over a linear gradient in the purple
  family, a white diagonal sheen overlay, shadow 0 18px 40px -18px rgba(0,0,0,.55)

How to roll it out:
1. Propose the token and font changes to globals.css as a diff and explain each one. Don't apply them yet.
2. After I approve, pilot on Home only: large-title header (small gray date line, round icon
   button at top right), the "What You're Playing For" card restyled as the Wallet-style hero card,
   and Recent Activity as an inset grouped list.
3. Run the app, screenshot Home in light and dark mode at iPhone width, and show me before going further.
4. Then list every other screen and shared component (SegmentedControl, sheets, list rows,
   buttons) that would need to change, so we can agree on the order for the rest of the update.
```
