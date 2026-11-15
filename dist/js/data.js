export const missions = [
  {
    id: "apollo-lm",
    name: "Apollo Lunar Modules",
    kind: "Moon landing craft",
    years: "1969-1972",
    world: "Moon",
    image: "assets/missions/apollo-lm.svg",
    summary: "Six Apollo Lunar Modules carried astronaut crews to the Moon. Their lower descent stages stayed behind and became launch pads for the trip back to lunar orbit.",
    story: [
      "The Apollo Lunar Module was a two-part spacecraft built only for space: a descent stage with the landing engine and legs, and an ascent stage that carried the crew cabin.",
      "Between Apollo 11 and Apollo 17, six Lunar Modules landed crews on the Moon. When it was time to leave, the astronauts lifted off in the ascent stage and left the descent stage at the landing site.",
      "The landing sites are still important historical places. Lunar orbiters have photographed the hardware, tracks and experiment areas that remain on the surface."
    ],
    facts: [
      ["Number of crewed lunar landings", "Six Apollo missions landed on the Moon"],
      ["What was left behind", "The lower descent stage of each Lunar Module"],
      ["Main job", "Carry two astronauts from lunar orbit to the surface and back"],
      ["First Lunar Module on the Moon", "Eagle, during Apollo 11"],
      ["Where the stages remain", "At six Apollo landing sites on the Moon"]
    ],
    source: { name: "NASA Science: Apollo Landing Sites", url: "https://science.nasa.gov/resource/apollo-landing-sites/" },
    quiz: [
      ["Which part of each Lunar Module stayed on the Moon?", "The descent stage", "The whole spacecraft", "Only the antenna", "The command module"],
      ["How many Apollo missions landed astronauts on the Moon?", "Six", "Two", "Ten", "Twelve"],
      ["Where did the ascent stage take the astronauts?", "Back to lunar orbit", "Directly to Earth", "To another landing site", "To a space station"],
      ["What was the name of the Apollo 11 Lunar Module?", "Eagle", "Falcon", "Orion", "Intrepid"],
      ["What was the Lunar Module built to do?", "Land a crew on the Moon", "Study Saturn's rings", "Fly in Earth's atmosphere", "Search for exoplanets"],
      ["Where are the Apollo landing sites located?", "On the Moon", "On Mars", "On asteroids", "In deep space"]
    ]
  },
  {
    id: "lunar-roving-vehicles",
    name: "Lunar Roving Vehicles",
    kind: "Moon rover program",
    years: "1971-1972",
    world: "Moon",
    image: "assets/missions/lunar-roving-vehicles.svg",
    summary: "Three battery-powered Lunar Roving Vehicles let Apollo astronauts drive much farther from their landers. All three rovers remained on the Moon.",
    story: [
      "The Lunar Roving Vehicle was an electric, foldable car made for low gravity and vacuum. It carried two astronauts, tools, samples and a television camera.",
      "Apollo 15, Apollo 16 and Apollo 17 each brought one rover. The three vehicles were driven 27.8 km, 26.7 km and 35.9 km across the lunar surface.",
      "Because the rovers could not return to Earth, they were parked near the Lunar Modules and left behind when the crews launched home."
    ],
    facts: [
      ["Number driven on the Moon", "Three"],
      ["Apollo missions that used them", "Apollo 15, 16 and 17"],
      ["Vehicle mass", "210 kg"],
      ["Longest total drive", "35.9 km on Apollo 17"],
      ["Where they are now", "Still on the Moon near their landing sites"]
    ],
    source: { name: "NSSDCA: The Apollo Lunar Roving Vehicle", url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html" },
    quiz: [
      ["How many Lunar Roving Vehicles were driven on the Moon?", "Three", "One", "Five", "Seven"],
      ["Which missions used the rovers?", "Apollo 15, 16 and 17", "Apollo 11, 12 and 13", "Apollo 8, 9 and 10", "Gemini 4, 5 and 6"],
      ["What powered each Lunar Roving Vehicle?", "Batteries", "A gasoline engine", "Sails", "Steam"],
      ["About how much did each rover weigh?", "210 kg", "2,100 kg", "21 kg", "10 kg"],
      ["Which mission had the longest total rover drive?", "Apollo 17", "Apollo 11", "Apollo 12", "Apollo 14"],
      ["What happened to the rovers after the missions?", "They stayed on the Moon", "They returned to Earth", "They flew to Mars", "They melted"]
    ]
  },
  {
    id: "alsep",
    name: "Apollo Lunar Surface Experiments Package",
    kind: "Moon science stations",
    years: "1969-1977",
    world: "Moon",
    image: "assets/missions/alsep.svg",
    summary: "Apollo crews left sets of instruments called ALSEP on the Moon. They measured moonquakes, heat, dust, charged particles and the very thin lunar atmosphere.",
    story: [
      "ALSEP was a portable science station unpacked and arranged by astronauts near their landing sites. Different missions carried different instruments.",
      "The stations measured the Moon's interior and environment, including seismic activity, heat flow, the solar wind, magnetic fields and the extremely thin atmosphere.",
      "Apollo 12, 14, 15, 16 and 17 used SNAP-27 radioisotope power systems. The stations worked for years after the astronauts left and were shut down in 1977."
    ],
    facts: [
      ["What ALSEP means", "Apollo Lunar Surface Experiments Package"],
      ["Power source", "SNAP-27 radioisotope thermoelectric generators"],
      ["Kinds of measurements", "Moonquakes, heat flow, particles and atmosphere"],
      ["Missions with ALSEP", "Apollo 12, 14, 15, 16 and 17"],
      ["Working lifetime", "About five to eight years for the deployed stations"]
    ],
    source: { name: "NASA Science: ALSEP power systems", url: "https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/legacy-systems/" },
    quiz: [
      ["What does ALSEP stand for?", "Apollo Lunar Surface Experiments Package", "Advanced Lunar Science Explorer Program", "Automated Lunar Sample Equipment", "Apollo Landing Safety Equipment Package"],
      ["What powered the Apollo 12, 14, 15, 16 and 17 stations?", "SNAP-27 RTGs", "Car batteries", "Mars winds", "Lunar rivers"],
      ["Which event could ALSEP instruments measure?", "Moonquakes", "Ocean tides", "Volcanic eruptions on Mars", "Solar eclipses on Earth"],
      ["Who set up the equipment?", "Apollo astronauts", "Robotic dogs", "Tourists", "The Lunar Module itself"],
      ["How long did the deployed stations operate?", "Five to eight years", "Five minutes", "Only one day", "Until the launch ended"],
      ["What did ALSEP help scientists study?", "The Moon's interior and environment", "Saturn's rings", "Distant galaxies", "Earth's oceans"]
    ]
  },
  {
    id: "surveyor",
    name: "Surveyor Program",
    kind: "Moon landing program",
    years: "1966-1968",
    world: "Moon",
    image: "assets/missions/surveyor.svg",
    summary: "Surveyor spacecraft were the first U.S. vehicles to make controlled soft landings on the Moon, testing the ground before Apollo astronauts arrived.",
    story: [
      "From 1966 to 1968, seven Surveyor spacecraft were sent toward the Moon. Five made successful soft landings and returned close-up images and surface data.",
      "Surveyor cameras looked at soil and rocks in detail. Some spacecraft used scoops or magnets and chemical instruments to test the surface.",
      "The program proved that the lunar ground could support a landing craft, helping NASA choose safer places for the Apollo missions."
    ],
    facts: [
      ["Program dates", "1966 to 1968"],
      ["Successful landings", "Five of seven spacecraft"],
      ["Main goal", "Photograph the surface and test whether it was safe for crewed landings"],
      ["Tools carried", "Television cameras, soil samplers, magnets and chemical instruments"],
      ["Where they remain", "At their lunar landing or impact sites"]
    ],
    source: { name: "NSSDCA: Surveyor to the Moon", url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/surveyor.html" },
    quiz: [
      ["What was Surveyor's main job?", "Test the Moon before Apollo landings", "Fly astronauts to Mars", "Map Saturn", "Carry satellites"],
      ["How many Surveyors made successful soft landings?", "Five", "Two", "Six", "None"],
      ["During which years did the program operate?", "1966-1968", "1976-1978", "1996-1998", "2004-2008"],
      ["What did each Surveyor carry to image the surface?", "A television camera", "A movie theater", "A telescope mirror", "A paper map"],
      ["Why was the soil tested?", "To see if the terrain could support a lander", "To grow plants", "To find gold", "To build roads"],
      ["Where are the Surveyor spacecraft now?", "On the Moon", "In a museum", "Back on Earth", "Orbiting Jupiter"]
    ]
  },
  {
    id: "sojourner",
    name: "Sojourner",
    kind: "Mars rover",
    years: "1997",
    world: "Mars",
    image: "assets/missions/sojourner.svg",
    summary: "Sojourner was the first robotic rover to explore Mars. The small rover worked far longer than planned and studied rocks, soil, air and weather.",
    story: [
      "Sojourner landed with Mars Pathfinder in Ares Vallis on July 4, 1997. The rover was about the size of a small wagon and weighed 10.6 kg.",
      "Its planned mission lasted seven days, but it explored for 83 days and traveled about 100 meters. It sent back images and chemical measurements of rocks and soil.",
      "Pathfinder's final data transmission arrived on September 27, 1997. The lander and rover remained together at the landing site."
    ],
    facts: [
      ["Landing date", "July 4, 1997"],
      ["Landing site", "Ares Vallis, Mars"],
      ["Mass", "10.6 kg"],
      ["Mission length", "83 days after a seven-day plan"],
      ["Distance traveled", "About 100 meters"]
    ],
    source: { name: "NASA Science: Mars Pathfinder and Sojourner", url: "https://science.nasa.gov/mission/mars-pathfinder/" },
    quiz: [
      ["What was Sojourner?", "The first robotic rover on Mars", "A Moon telescope", "A Saturn orbiter", "A crew capsule"],
      ["When did Sojourner land on Mars?", "July 4, 1997", "July 20, 1969", "May 25, 2008", "April 19, 2021"],
      ["How long did Sojourner operate?", "83 days", "Seven minutes", "One year", "Ten years"],
      ["About how far did it travel?", "About 100 meters", "45 kilometers", "One million kilometers", "It never moved"],
      ["What was its landing site called?", "Ares Vallis", "Jezero Crater", "Gusev Crater", "Utopia Planitia"],
      ["What did Sojourner study?", "Rocks, soil, atmosphere and weather", "Saturn's rings", "Exoplanets", "The lunar far side"]
    ]
  },
  {
    id: "spirit",
    name: "Spirit",
    kind: "Mars rover",
    years: "2004-2010",
    world: "Mars",
    image: "assets/missions/spirit.svg",
    summary: "Spirit was a golf-cart-sized rover that found strong evidence that Mars was once much wetter. It drove 7.73 kilometers before its mission ended.",
    story: [
      "Spirit landed in Gusev Crater in January 2004. Scientists chose the site because it looked like a place where water may have collected long ago.",
      "The rover was designed for a much shorter mission, yet it explored for more than six years and drove 4.8 miles, or 7.73 kilometers.",
      "Spirit found minerals and rock chemistry pointing to warmer, wetter ancient environments. It fell silent in 2010 after becoming stuck in soft soil."
    ],
    facts: [
      ["Landing site", "Gusev Crater, Mars"],
      ["Operating time", "More than six years"],
      ["Distance driven", "7.73 kilometers"],
      ["Main science result", "Evidence that Mars was once much wetter"],
      ["Mission end", "Contact efforts ended in 2011 after Spirit went silent in 2010"]
    ],
    source: { name: "NASA Science: Spirit", url: "https://science.nasa.gov/mission/mer-spirit/" },
    quiz: [
      ["Where did Spirit land?", "Gusev Crater", "Olympus Mons", "Vastitas Borealis", "Tycho Crater"],
      ["How far did Spirit drive?", "7.73 kilometers", "100 meters", "45.16 kilometers", "It stayed on the lander"],
      ["What major clue did Spirit find?", "Mars was once wetter", "Mars has oceans today", "Mars has no rocks", "Mars is made of ice only"],
      ["How long did Spirit operate?", "More than six years", "Seven days", "Two weeks", "Fifty years"],
      ["What ended Spirit's mission?", "It became stuck and stopped communicating", "It flew back to Earth", "Its astronauts returned", "It ran out of rocket fuel"],
      ["What was Spirit's twin rover?", "Opportunity", "Sojourner", "Phoenix", "Curiosity"]
    ]
  },
  {
    id: "opportunity",
    name: "Opportunity",
    kind: "Mars rover",
    years: "2004-2018",
    world: "Mars",
    image: "assets/missions/opportunity.svg",
    summary: "Opportunity explored Mars for almost 15 years and drove 45.16 kilometers, a record that lasted until Perseverance passed it in 2026.",
    story: [
      "Opportunity landed at Meridiani Planum in January 2004, soon after its twin Spirit. Its landing area showed signs of ancient water.",
      "The rover found tiny hematite spheres nicknamed blueberries and studied more than 100 impact craters. Its discoveries showed that Mars once had water-related environments.",
      "A planet-wide dust storm covered its solar panels in June 2018. Opportunity stopped communicating after driving 28.06 miles, or 45.16 kilometers."
    ],
    facts: [
      ["Landing site", "Meridiani Planum, Mars"],
      ["Operating time", "Almost 15 years"],
      ["Distance driven", "45.16 kilometers"],
      ["Famous evidence", "Hematite spheres nicknamed blueberries"],
      ["Mission end", "Stopped communicating after a planet-wide dust storm in 2018"]
    ],
    source: { name: "NASA Science: Opportunity", url: "https://science.nasa.gov/mission/mer-opportunity/" },
    quiz: [
      ["Where did Opportunity land?", "Meridiani Planum", "Gusev Crater", "Ares Vallis", "Fra Mauro"],
      ["How far did Opportunity drive?", "45.16 kilometers", "7.73 kilometers", "100 meters", "5 kilometers"],
      ["What were the tiny mineral spheres called?", "Blueberries", "Moonberries", "Iron stars", "Salt pearls"],
      ["What happened in June 2018?", "A planet-wide dust storm blocked sunlight", "It launched back to Earth", "It reached Saturn", "It found an ocean"],
      ["How long did Opportunity operate?", "Almost 15 years", "90 days", "One month", "Three years"],
      ["What did Opportunity study?", "Ancient water environments on Mars", "Jupiter's moons", "The Sun's core", "Earth's weather"]
    ]
  },
  {
    id: "viking-1",
    name: "Viking 1",
    kind: "Mars orbiter and lander",
    years: "1975-1982",
    world: "Mars",
    image: "assets/missions/viking-1.svg",
    summary: "Viking 1 made the first truly successful Mars landing in 1976. Its lander photographed the surface, sampled soil and ran biology experiments.",
    story: [
      "Viking 1 launched on August 20, 1975, as a paired orbiter and lander. The lander touched down in Chryse Planitia on July 20, 1976.",
      "It was the first spacecraft to operate successfully on Mars for an extended mission. The lander worked for more than six years, while the orbiter mapped Mars from above.",
      "The Viking landers photographed their surroundings, tested the atmosphere and soil, and searched for signs of life. The biology results showed unusual chemistry but no clear evidence of living microorganisms."
    ],
    facts: [
      ["Launch", "August 20, 1975"],
      ["Mars landing", "July 20, 1976, at Chryse Planitia"],
      ["Spacecraft design", "One orbiter and one lander"],
      ["Historic first", "First successful long-term Mars lander"],
      ["Biology result", "Unexpected chemistry, but no clear evidence of life"]
    ],
    source: { name: "NASA Science: Viking 1", url: "https://science.nasa.gov/mission/viking-1/" },
    quiz: [
      ["When did Viking 1 land on Mars?", "July 20, 1976", "September 3, 1976", "May 25, 2008", "July 4, 1997"],
      ["Where did Viking 1 land?", "Chryse Planitia", "Utopia Planitia", "Meridiani Planum", "Jezero Crater"],
      ["What made Viking 1 historic?", "It was the first successful long-term Mars lander", "It was the first Moon rover", "It flew to Pluto", "It discovered Earth"],
      ["What two parts did Viking 1 include?", "An orbiter and a lander", "A rover and a helicopter", "A telescope and a submarine", "Two astronauts"],
      ["What did the lander use to collect soil?", "A robotic sampling arm", "A fishing net", "A vacuum cleaner", "A magnet crane"],
      ["What did Viking's biology experiments find?", "No clear evidence of life", "Living plants", "Fossils", "Running water today"]
    ]
  },
  {
    id: "viking-2",
    name: "Viking 2",
    kind: "Mars orbiter and lander",
    years: "1975-1980",
    world: "Mars",
    image: "assets/missions/viking-2.svg",
    summary: "Viking 2 landed in Utopia Planitia on September 3, 1976. Together, the Viking orbiters mapped about 97 percent of Mars.",
    story: [
      "Viking 2 launched on September 9, 1975, and its lander reached Utopia Planitia on September 3, 1976, thousands of kilometers from Viking 1.",
      "The two Viking orbiters returned 52,663 images and mapped about 97 percent of the Martian surface at 300-meter resolution. The landers returned 4,500 photos from the surface.",
      "Viking 2's lander operated until April 11, 1980. Like Viking 1, it carried cameras, a sampling arm, weather instruments and a biological laboratory."
    ],
    facts: [
      ["Launch", "September 9, 1975"],
      ["Mars landing", "September 3, 1976, at Utopia Planitia"],
      ["Combined orbiter images", "52,663 images"],
      ["Surface mapping", "About 97 percent of Mars"],
      ["Lander communications ended", "April 11, 1980"]
    ],
    source: { name: "NASA Science: Viking 2", url: "https://science.nasa.gov/mission/viking-2/" },
    quiz: [
      ["Where did Viking 2 land?", "Utopia Planitia", "Chryse Planitia", "Ares Vallis", "Gusev Crater"],
      ["When did it land?", "September 3, 1976", "July 20, 1976", "November 26, 2018", "March 6, 2009"],
      ["How much of Mars did the Viking orbiters map?", "About 97 percent", "About 7 percent", "Only the poles", "None"],
      ["How many surface photos did the two landers return?", "4,500", "45", "450,000", "One"],
      ["When did Viking 2's lander stop communicating?", "April 11, 1980", "June 10, 2018", "December 15, 2022", "January 18, 2024"],
      ["What did Viking 2 carry?", "A lander and an orbiter", "A helicopter only", "A crew cabin", "A rover garage"]
    ]
  },
  {
    id: "phoenix",
    name: "Phoenix Mars Lander",
    kind: "Mars lander",
    years: "2007-2008",
    world: "Mars",
    image: "assets/missions/phoenix.svg",
    summary: "Phoenix landed near the Martian north pole in 2008 and studied ice, soil and weather at the ice-soil boundary.",
    story: [
      "Phoenix launched on August 4, 2007, and landed in Vastitas Borealis on May 25, 2008. It was the first successful stationary soft landing on Mars since Viking 2.",
      "During descent, the Mars Reconnaissance Orbiter photographed Phoenix hanging beneath its parachute, the first time one spacecraft photographed another during a planetary landing.",
      "The lander used a robotic arm, tiny ovens and a portable laboratory to study soil and water ice. It ended its mission on November 2, 2008, when polar winter reduced sunlight."
    ],
    facts: [
      ["Launch", "August 4, 2007"],
      ["Landing", "May 25, 2008"],
      ["Landing site", "Vastitas Borealis, the Martian arctic plains"],
      ["Main science", "Water ice, soil chemistry and habitability"],
      ["Mission end", "November 2, 2008"]
    ],
    source: { name: "NASA Science: Mars Phoenix", url: "https://science.nasa.gov/mission/mars-phoenix/" },
    quiz: [
      ["Where did Phoenix land?", "Vastitas Borealis", "Gusev Crater", "Elysium Planitia", "Chryse Planitia"],
      ["When did Phoenix land?", "May 25, 2008", "July 20, 1976", "November 26, 2018", "February 18, 2021"],
      ["What was Phoenix designed to study?", "Martian arctic ice and soil", "Jupiter's atmosphere", "Moon rocks", "Distant stars"],
      ["Which spacecraft photographed Phoenix under its parachute?", "Mars Reconnaissance Orbiter", "Viking 2", "Kepler", "Pioneer 10"],
      ["What tool collected soil samples?", "A robotic arm", "A harpoon", "A drill truck", "A net"],
      ["Why did the mission end?", "Polar winter reduced sunlight", "It returned home", "It flew away", "It ran out of astronauts"]
    ]
  },
  {
    id: "insight",
    name: "InSight",
    kind: "Mars lander",
    years: "2018-2022",
    world: "Mars",
    image: "assets/missions/insight.svg",
    summary: "InSight was a Mars lander that listened for marsquakes and measured the planet's interior, weather and magnetic environment.",
    story: [
      "InSight launched on May 5, 2018, and landed in Elysium Planitia on November 26, 2018. Its goal was to study the inside of Mars rather than its scenery.",
      "The lander used a robotic arm to place a seismometer and a heat-flow probe on the ground. It measured more than 1,300 seismic events.",
      "Dust slowly covered its solar panels, reducing power. The mission ended in December 2022, leaving the lander and instruments on Mars."
    ],
    facts: [
      ["Full name", "Interior Exploration using Seismic Investigations, Geodesy and Heat Transport"],
      ["Landing site", "Elysium Planitia, Mars"],
      ["Main instrument", "A seismometer called SEIS"],
      ["Seismic detections", "More than 1,300 events"],
      ["Mission end", "December 15, 2022"]
    ],
    source: { name: "NASA Science: InSight", url: "https://science.nasa.gov/mission/insight/" },
    quiz: [
      ["What did InSight mainly study?", "The inside of Mars", "Saturn's rings", "Earth's oceans", "Exoplanet atmospheres"],
      ["Where did InSight land?", "Elysium Planitia", "Vastitas Borealis", "Utopia Planitia", "Ares Vallis"],
      ["What was SEIS?", "A seismometer", "A camera", "A rocket", "A rover"],
      ["How many seismic events did InSight measure?", "More than 1,300", "Three", "None", "One million"],
      ["What reduced InSight's power?", "Dust on its solar panels", "A flood", "A broken wheel", "A lost antenna"],
      ["When did the mission end?", "December 15, 2022", "November 2, 2008", "April 11, 1980", "March 10, 1998"]
    ]
  },
  {
    id: "ingenuity",
    name: "Ingenuity",
    kind: "Mars helicopter",
    years: "2021-2024",
    world: "Mars",
    image: "assets/missions/ingenuity.svg",
    summary: "Ingenuity made the first powered, controlled flight on another planet and completed 72 flights above Mars.",
    story: [
      "Ingenuity rode to Mars beneath the Perseverance rover and flew for the first time on April 19, 2021, in Jezero Crater.",
      "The helicopter was designed as a short technology demonstration with no more than five test flights. Instead, it completed 72 flights and later helped scout terrain for rover drivers.",
      "Its final flight was on January 18, 2024, and NASA announced the end of the mission on January 25, 2024, after rotor damage prevented further flight."
    ],
    facts: [
      ["First flight", "April 19, 2021"],
      ["Total flights", "72"],
      ["Location", "Jezero Crater, Mars"],
      ["Original plan", "Up to five test flights"],
      ["Mission end announced", "January 25, 2024"]
    ],
    source: { name: "NASA Science: Ingenuity Mars Helicopter", url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/" },
    quiz: [
      ["What was Ingenuity's biggest first?", "Powered controlled flight on another planet", "First ocean landing", "First crew on Mars", "First telescope in space"],
      ["When was its first flight?", "April 19, 2021", "July 4, 1997", "May 25, 2008", "February 14, 2000"],
      ["How many flights did it complete?", "72", "5", "12", "100"],
      ["Where did it fly?", "Jezero Crater", "Chryse Planitia", "Hadley Rille", "Vastitas Borealis"],
      ["How many test flights were originally planned?", "Up to five", "Exactly 72", "One hundred", "None"],
      ["Why did flights stop?", "Rotor damage", "It flew to Earth", "It ran out of maps", "It landed on the Moon"]
    ]
  },
  {
    id: "dawn",
    name: "Dawn",
    kind: "Asteroid belt orbiter",
    years: "2007-2018",
    world: "Vesta and Ceres",
    image: "assets/missions/dawn.svg",
    summary: "Dawn used ion propulsion to orbit asteroid Vesta and dwarf planet Ceres, becoming the first spacecraft to orbit two extraterrestrial targets.",
    story: [
      "Dawn launched on September 27, 2007, and used efficient ion propulsion to travel through the main asteroid belt between Mars and Jupiter.",
      "It orbited Vesta in 2011 and 2012, then arrived at Ceres in 2015. The mission compared a rocky protoplanet with an icy dwarf planet to learn about the early solar system.",
      "When Dawn ran out of hydrazine fuel in 2018, it could no longer point its antenna. The spacecraft remains in orbit around Ceres."
    ],
    facts: [
      ["Launch", "September 27, 2007"],
      ["Targets", "Vesta and Ceres"],
      ["Propulsion", "Ion propulsion"],
      ["Historic achievement", "First spacecraft to orbit two extraterrestrial targets"],
      ["Mission end", "November 1, 2018"]
    ],
    source: { name: "NASA Science: Dawn", url: "https://science.nasa.gov/mission/dawn/" },
    quiz: [
      ["Which two worlds did Dawn orbit?", "Vesta and Ceres", "Mars and Earth", "Jupiter and Saturn", "Eros and the Moon"],
      ["What kind of propulsion did Dawn use?", "Ion propulsion", "Sails", "Steam", "A helicopter rotor"],
      ["What made Dawn's journey historic?", "It orbited two extraterrestrial targets", "It carried astronauts", "It landed on every planet", "It discovered the Moon"],
      ["Where is Dawn now?", "In orbit around Ceres", "On Mars", "Back on Earth", "Inside Jupiter"],
      ["When was Dawn launched?", "September 27, 2007", "March 6, 2009", "February 17, 1996", "April 6, 1973"],
      ["What did Dawn help scientists study?", "Early solar system history", "Earth's weather", "Human spaceflight", "Black holes only"]
    ]
  },
  {
    id: "near-shoemaker",
    name: "NEAR Shoemaker",
    kind: "Asteroid orbiter and lander",
    years: "1996-2001",
    world: "Asteroid Eros",
    image: "assets/missions/near-shoemaker.svg",
    summary: "NEAR Shoemaker was the first spacecraft to orbit an asteroid and the first to land on one. It survived on Eros for about two weeks.",
    story: [
      "NEAR launched on February 17, 1996. After flying past asteroid Mathilde and swinging by Earth, it entered orbit around Eros on February 14, 2000.",
      "The spacecraft mapped Eros for almost a year and was renamed NEAR Shoemaker in honor of geologist Eugene Shoemaker.",
      "On February 12, 2001, controllers guided it to the surface even though it was not designed as a lander. It kept sending data for about two weeks."
    ],
    facts: [
      ["Launch", "February 17, 1996"],
      ["Orbit around Eros", "February 14, 2000"],
      ["Landing", "February 12, 2001"],
      ["Historic firsts", "First spacecraft to orbit and land on an asteroid"],
      ["Final contact", "February 28, 2001"]
    ],
    source: { name: "NASA Science: NEAR Shoemaker", url: "https://science.nasa.gov/mission/near-shoemaker/" },
    quiz: [
      ["Which asteroid did NEAR Shoemaker explore?", "Eros", "Ceres", "Vesta", "Bennu"],
      ["When did it enter orbit around Eros?", "February 14, 2000", "July 4, 1997", "March 6, 2009", "September 1, 1979"],
      ["What surprising thing happened on February 12, 2001?", "It landed on Eros", "It returned to Earth", "It reached Saturn", "It became a rover"],
      ["Was NEAR Shoemaker designed as a lander?", "No", "Yes, from the start", "Only for oceans", "Only for Mars"],
      ["How long did it send data after landing?", "About two weeks", "Ten years", "One minute", "Until 2018"],
      ["What were its two historic firsts?", "First to orbit and land on an asteroid", "First to fly and swim", "First to orbit Jupiter", "First to land on the Sun"]
    ]
  },
  {
    id: "pioneer-10",
    name: "Pioneer 10",
    kind: "Deep-space probe",
    years: "1972-2003",
    world: "Jupiter flyby",
    image: "assets/missions/pioneer-10.svg",
    summary: "Pioneer 10 was the first spacecraft to cross the asteroid belt and fly past Jupiter. It later became the first human-made object beyond Neptune's orbit.",
    story: [
      "Pioneer 10 launched on March 2, 1972, and crossed the asteroid belt on its way to Jupiter.",
      "It flew by Jupiter on December 4, 1973, taking direct measurements and close-up images that helped engineers design later missions to the outer planets.",
      "The spacecraft kept traveling outward and sent its last faint signal in January 2003 from about 12.23 billion kilometers away. It carries a plaque with a message from Earth."
    ],
    facts: [
      ["Launch", "March 2, 1972"],
      ["Jupiter flyby", "December 4, 1973"],
      ["Major first", "First spacecraft to fly through the asteroid belt and past Jupiter"],
      ["Last signal", "January 2003"],
      ["Distance at last signal", "About 12.23 billion kilometers"]
    ],
    source: { name: "NASA Science: Pioneer 10", url: "https://science.nasa.gov/mission/pioneer-10/" },
    quiz: [
      ["When was Pioneer 10 launched?", "March 2, 1972", "April 6, 1973", "September 27, 2007", "March 6, 2009"],
      ["What did Pioneer 10 cross before Jupiter?", "The asteroid belt", "The Moon's ocean", "Saturn's rings", "Earth's atmosphere"],
      ["When was its Jupiter flyby?", "December 4, 1973", "September 1, 1979", "February 14, 2000", "July 20, 1976"],
      ["When did Earth receive its last signal?", "January 2003", "September 1995", "November 2018", "January 2024"],
      ["What message did it carry?", "A plaque from Earth", "A library of books", "A radio station", "A seed capsule"],
      ["Why was Pioneer 10 important?", "It opened the way to the outer planets", "It landed on the Moon", "It discovered Mars", "It was the first telescope"]
    ]
  },
  {
    id: "pioneer-11",
    name: "Pioneer 11",
    kind: "Deep-space probe",
    years: "1973-1995",
    world: "Jupiter and Saturn",
    image: "assets/missions/pioneer-11.svg",
    summary: "Pioneer 11 followed Pioneer 10 past Jupiter and became the first spacecraft to study Saturn up close.",
    story: [
      "Pioneer 11 launched on April 6, 1973. It flew past Jupiter in December 1974 and used the planet's gravity to aim toward Saturn.",
      "On September 1, 1979, it made the first close flyby of Saturn, passing within about 21,000 kilometers of the planet and discovering a new ring and moons.",
      "The last contact arrived in September 1995. Pioneer 11 is now heading out of the solar system and also carries a plaque with a message from Earth."
    ],
    facts: [
      ["Launch", "April 6, 1973"],
      ["Jupiter flyby", "December 3, 1974"],
      ["Saturn flyby", "September 1, 1979"],
      ["Historic first", "First spacecraft to study Saturn up close"],
      ["Last contact", "September 30, 1995"]
    ],
    source: { name: "NASA Science: Pioneer 11", url: "https://science.nasa.gov/mission/pioneer-11/" },
    quiz: [
      ["Which planet did Pioneer 11 study first?", "Jupiter", "Saturn", "Mars", "Mercury"],
      ["When did it fly by Saturn?", "September 1, 1979", "December 3, 1974", "March 2, 1972", "April 19, 2021"],
      ["What was Pioneer 11 the first to study up close?", "Saturn", "The Moon", "A comet", "Eros"],
      ["When was the last contact?", "September 1995", "January 2003", "October 2018", "June 2018"],
      ["What did Pioneer 11 carry like Pioneer 10?", "A plaque", "A rover", "A greenhouse", "A submarine"],
      ["How did it reach Saturn?", "Jupiter's gravity helped aim it", "It used a road", "It was towed", "It teleported"]
    ]
  },
  {
    id: "kepler",
    name: "Kepler Space Telescope",
    kind: "Planet-hunting telescope",
    years: "2009-2018",
    world: "Deep space",
    image: "assets/missions/kepler.svg",
    summary: "Kepler searched for planets around other stars by watching for tiny dips in starlight. It showed that planets outnumber stars in our galaxy.",
    story: [
      "Kepler launched on March 6, 2009, and stared at a crowded patch of the Milky Way to look for transits: tiny dips when planets cross in front of their stars.",
      "During its main mission and the extended K2 mission, Kepler observed more than half a million stars and enabled the discovery of more than 2,600 planets.",
      "The spacecraft ran out of fuel and was retired on October 30, 2018. It remains in a safe orbit around the Sun, trailing Earth."
    ],
    facts: [
      ["Launch", "March 6, 2009"],
      ["Planet-hunting method", "Watching for transit dips in starlight"],
      ["Stars observed", "More than half a million"],
      ["Planet discoveries enabled", "More than 2,600"],
      ["Retired", "October 30, 2018"]
    ],
    source: { name: "NASA Science: Kepler / K2", url: "https://science.nasa.gov/mission/kepler/" },
    quiz: [
      ["What kind of mission was Kepler?", "A planet-hunting space telescope", "A Moon rover", "A Mars helicopter", "A crew capsule"],
      ["How did Kepler find planets?", "By watching tiny dips in starlight", "By listening to radio songs", "By digging soil", "By landing on stars"],
      ["When was Kepler launched?", "March 6, 2009", "February 17, 1996", "August 4, 2007", "May 5, 2018"],
      ["How many stars did it observe?", "More than half a million", "Only eight", "One hundred", "None"],
      ["What big idea did Kepler prove?", "Planets outnumber stars", "Stars are planets", "Every planet has rings", "Space has no planets"],
      ["When was Kepler retired?", "October 30, 2018", "January 25, 2024", "November 1, 2018", "September 30, 1995"]
    ]
  }
];

export const planetFacts = [
  ["Mercury", "Mercury is the smallest planet in our solar system and the closest to the Sun."],
  ["Venus", "Venus is wrapped in thick clouds and is the hottest planet in our solar system."],
  ["Earth", "Earth is the only world known to support life, with oceans, land and a protective atmosphere."],
  ["Mars", "Mars is a cold desert world with volcanoes, canyons, polar ice and many landed robots."],
  ["Jupiter", "Jupiter is the largest planet and a gas giant with a giant storm called the Great Red Spot."],
  ["Saturn", "Saturn is famous for its bright ring system made mostly of ice and rock pieces."],
  ["Uranus", "Uranus rotates on its side and has a pale blue-green atmosphere."],
  ["Neptune", "Neptune is the most distant major planet and has extremely fast winds."],
  ["Moon", "The Moon is Earth's natural satellite and the place where Apollo astronauts left landers, rovers and science stations."],
  ["Ceres", "Ceres is a dwarf planet in the asteroid belt that Dawn explored."],
  ["Vesta", "Vesta is a large asteroid in the main belt that Dawn orbited before traveling to Ceres."],
  ["Eros", "Eros is a near-Earth asteroid that NEAR Shoemaker orbited and landed on."]
];

export const sources = missions.map(({ name, source }) => ({ name, source }));
