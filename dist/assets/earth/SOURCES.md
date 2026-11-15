# Earth assets

Earth with Clouds 3D Model — NASA Visualization Technology Applications and Development (VTAD).
https://science.nasa.gov/resource/earth-with-clouds-3d-model/

Blue Marble: Next Generation + Topography and Bathymetry, June 2004, 5400 × 2700 — NASA Earth Observatory.
https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/

Selected map: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography-bathymetry/june/world.topo.bathy.200406.3x5400x2700.jpg

The bathymetry variant visualizes the ocean floor, rather than depicting live ocean conditions. Original NASA map colors are used without the previous blue recoloring shader. Local filename: `blue-marble-bathymetry-june.jpg` (separate from the older base map).

The loader uses `nasa-earth.glb` when downloaded, otherwise a sphere with the Blue Marble map (local JPEG first, official NASA URL second). It does not label the map-backed sphere as a downloaded NASA 3D model. Credit is displayed only after the respective asset loads successfully.

Run `python tools/fetch_earth_assets.py` to retrieve the files. Actual successful downloads are recorded with hashes in `downloads.json`. Binary assets are not included until this command succeeds. NASA imagery is a historical composite, not a live satellite view.

Media usage: https://www.nasa.gov/nasa-brand-center/images-and-media/
