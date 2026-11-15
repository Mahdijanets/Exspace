# Homepage star background

Title: Hubble View of Entire SWEEPS Field.
Official source: https://science.nasa.gov/asset/hubble/hubble-view-of-entire-sweeps-field/
Credit: NASA, ESA, A. Calamida and K. Sahu (STScI), and the SWEEPS Science Team.

Real Hubble observations of the Milky Way's central stellar field, not an AI image or generated star pattern. Earth is our interactive foreground globe composited over this photograph; this is not a photograph of Earth at that location. A dark CSS overlay improves text contrast.

The homepage requests the official NASA dynamic image at 1600 pixels wide. No original 271 MB TIFF is requested. The procedural Three.js star field is disabled in homepage mode and remains in the solar-system learning scene.

Local download was attempted but blocked by this environment (WinError 10013). `dist/js/space-background.js` therefore keeps `local: null`; the image loads directly in the user's browser from the official NASA URL. Run `python tools/fetch_star_background.py` when network access is available to save a validated local copy and enable its local path. The credit appears only once the photograph loads successfully.
