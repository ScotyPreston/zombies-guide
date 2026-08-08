// All games and their zombies maps.
// Each map: id (used for its page file at maps/<id>.html when built), name, note (optional), built (page exists yet?)
const GAMES = [
  {
    id: "bo1",
    name: "Black Ops 1",
    year: "2010",
    accent: "#7a8c4f",
    accent2: "#c4d69a",
    tagline: "Where the Aether story took off",
    maps: [
      { id: "ascension", name: "Ascension" },
      { id: "cotd", name: "Call of the Dead", built: true },
      { id: "shangrila", name: "Shangri-La" },
      { id: "moon", name: "Moon", note: "Samantha Says tracker", built: true }
    ]
  },
  {
    id: "bo2",
    name: "Black Ops 2",
    year: "2012",
    accent: "#d4762c",
    accent2: "#ffb36b",
    tagline: "Victis, Mob of the Dead & Origins",
    maps: [
      { id: "tranzit", name: "TranZit", note: "2 main EEs: Richtofen / Maxis" },
      { id: "dierise", name: "Die Rise", note: "2 main EEs: Richtofen / Maxis" },
      { id: "motd", name: "Mob of the Dead", note: "Pop Goes the Weasel", built: true },
      { id: "buried", name: "Buried", note: "2 main EEs: Richtofen / Maxis" },
      { id: "origins", name: "Origins", note: "4 staffs + red dig sites", built: true }
    ]
  },
  {
    id: "bo3",
    name: "Black Ops 3",
    year: "2015",
    accent: "#b32424",
    accent2: "#ff7b6b",
    tagline: "The end of the Aether saga",
    maps: [
      { id: "soe", name: "Shadows of Evil", note: "4 rituals + Shadow Man", built: true },
      { id: "de", name: "Der Eisendrache", note: "4 bow upgrades", built: true },
      { id: "zetsubou", name: "Zetsubou No Shima", note: "Plants tab", built: true },
      { id: "gorod", name: "Gorod Krovi", note: "Valve solver", built: true },
      { id: "revelations", name: "Revelations", note: "The Aether finale", built: true }
    ]
  },
  {
    id: "bo4",
    name: "Black Ops 4",
    year: "2018",
    accent: "#2c9d8f",
    accent2: "#7be0d3",
    tagline: "Chaos story & Aether finale",
    maps: [
      { id: "voyage", name: "Voyage of Despair" },
      { id: "ix", name: "IX", note: "The arena", built: true },
      { id: "botd", name: "Blood of the Dead" },
      { id: "classified", name: "Classified" },
      { id: "dotn", name: "Dead of the Night", note: "The haunted manor", built: true },
      { id: "ancient-evil", name: "Ancient Evil" },
      { id: "alpha-omega", name: "Alpha Omega" },
      { id: "tag", name: "Tag der Toten" }
    ]
  },
  {
    id: "aw",
    name: "Advanced Warfare",
    year: "2014",
    accent: "#5ba53a",
    accent2: "#b5e88a",
    tagline: "Exo Zombies",
    maps: [
      { id: "outbreak-aw", name: "Outbreak" },
      { id: "infection", name: "Infection" },
      { id: "carrier", name: "Carrier" },
      { id: "descent", name: "Descent" }
    ]
  },
  {
    id: "iw",
    name: "Infinite Warfare",
    year: "2016",
    accent: "#a83af0",
    accent2: "#3af0c8",
    tagline: "Willard Wyler's horror flicks",
    maps: [
      { id: "spaceland", name: "Zombies in Spaceland", note: "Simon Says + Souvenir Coins", built: true},
      { id: "rave", name: "Rave in the Redwoods", note: "Memory Charms + Totem Gems", built: true },
      { id: "shaolin", name: "Shaolin Shuffle", note: "Chi styles + Rat King", built: true },
      { id: "radioactive", name: "Attack of the Radioactive Thing", note: "Chemical solver", built: true },
      { id: "beast", name: "The Beast from Beyond", note: "Venom X/Y/Z", built: true }
    ]
  }
];
