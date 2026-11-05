# Project guidance

This is Batool’s personal coding-learning website for a young girl. It is a static site with an Arabic homepage and English interactive lessons.

## Design direction

- Follow Apple-inspired principles: clear hierarchy, readable system typography, generous spacing, consistent controls, immediate feedback, and restrained motion.
- Keep the experience creative, welcoming, attractive, and kid-friendly. Avoid making it feel empty or like a skeleton.
- Do not add icons, emoji, mascots, sparkles, or decorative icon libraries. Use clear text for actions, scores, ratings, and locked states.
- Keep the full-screen “hello BATOOL” entrance. The user explicitly wants the Mac welcome-screen feeling preserved.
- The current hello is a custom SVG handwriting animation. It is an approximation, and may need further refinement; do not claim it matches Apple exactly.
- Keep color, but avoid bright, saturated, visually tiring combinations and busy rainbow backgrounds. The latest palette uses cream and sage with muted peach, blue, and other gentle lesson accents.
- Preserve Arabic right-to-left layout and correct direction for English text and code.
- Respect reduced-motion preferences, keyboard navigation, visible focus, readable contrast, and comfortable touch targets.

## Files and implementation

- `index.html`: homepage, lessons, expandable curriculum, welcome entrance.
- `first_task.html`, `second_task.html`, `third_task.html`, `fourth_task.html`: interactive lesson pages.
- `styles.css`: shared layout, typography, controls, and accessibility styles.
- `playful.css`: colorful presentation and latest palette overrides, including welcome-screen styling. Loaded after `styles.css`.
- The lesson pages still contain inline styles. Check the cascade before changing shared rules; avoid accumulating conflicting overrides when refining the design.
- Preserve lesson content, quiz behavior, scores, level unlocking, and existing localStorage keys.
- Use plain HTML, CSS, and JavaScript unless a framework is specifically requested. No build system is required.

## Verification and current state

- `node verify.cjs` checks inline JavaScript syntax, emoji absence, and local stylesheet/page links.
- `git diff --check` checks patch whitespace.
- Browser visual verification was not completed in the previous design session. Do not describe the current appearance as visually verified.
- `browser-check.cjs` is a temporary browser-check script if present. Its cached Playwright path is machine-specific, and its homepage flow predates the restored welcome dialog. Update it before relying on it.
- Review desktop and narrow mobile layouts, welcome dismissal and keyboard behavior, curriculum expansion, and quiz interactions when resuming design work.
- Existing unrelated working-tree edits may be present. Inspect status and preserve them; do not commit, publish, or deploy unless requested.

## Next session

The user has deferred further design improvements. Resume from the gentle palette and restored handwritten hello entrance, using their next feedback to guide changes.
