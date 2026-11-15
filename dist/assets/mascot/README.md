# Acustik mascot

User-supplied artwork from `akustik_pack.zip`. Original source archive is unchanged.

States: hello, thinking, talking, listening, done, oops; avatar variants are also included. Use the SVG files for the website: animated files are roughly 5–6 KB each, compared with roughly 140–160 KB for the full-size PNGs. The states overview and PNG variants are retained as source artwork, not loaded on page startup.

`dist/js/mascot.js` renders animated SVGs as images and chooses static versions for `prefers-reduced-motion: reduce`. Mascots accompany visible text and use empty image descriptions to avoid redundant screen-reader announcements. These are interface reactions, not a voice or AI conversation feature.
