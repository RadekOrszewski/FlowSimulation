/*
 * Kanban Flow Game — player avatars.
 *
 * An original set of illustrated heads (no third-party characters), drawn as
 * inline SVG so they need no image files and stay sharp at any size.
 * Each avatar is a small recipe: skin, hair style and colour, beard,
 * headgear / theme and a background colour.
 *
 *   Avatars.list            ordered array of { id, name: {en, pl} }
 *   Avatars.svg(id, px)     SVG markup for one avatar
 *   Avatars.has(id)         true if the id exists
 */
(function () {
  var SKIN = ['#f9d9bd', '#efc19b', '#d79d68', '#a8703f', '#6e4527'];
  var HAIR = {
    black: '#2b2118', brown: '#6b3e1f', blonde: '#e3b448', red: '#c2491d',
    grey: '#b9b4ac', pink: '#ff7eb6', white: '#f1efe9'
  };
  var INK = '#16213e';

  // id, en, pl, recipe
  var DEFS = [
    ['ninja-red', 'Red ninja', 'Czerwony ninja', { theme: 'ninja', tc: '#d63c3c', skin: 1, bg: '#ffe3e3' }],
    ['ninja-green', 'Green ninja', 'Zielony ninja', { theme: 'ninja', tc: '#2f9e44', skin: 3, bg: '#d3f9d8' }],
    ['ninja-blue', 'Blue ninja', 'Niebieski ninja', { theme: 'ninja', tc: '#1c7ed6', skin: 0, bg: '#d0ebff' }],
    ['ninja-black', 'Shadow ninja', 'Ninja cienia', { theme: 'ninja', tc: '#212529', skin: 4, bg: '#fff3bf' }],
    ['astronaut', 'Astronaut', 'Astronauta', { skin: 1, hair: 'short', hc: 'brown', theme: 'space', shirt: '#f1f3f5', bg: '#dbe4ff' }],
    ['astronaut-2', 'Space pilot', 'Pilotka kosmiczna', { skin: 3, hair: 'bun', hc: 'black', theme: 'space', shirt: '#f1f3f5', bg: '#e5dbff' }],
    ['wizard', 'Wizard', 'Czarodziej', { skin: 0, beard: 'grey', theme: 'wizard', tc: '#5f3dc4', shirt: '#5f3dc4', bg: '#e5dbff' }],
    ['sorceress', 'Sorceress', 'Czarodziejka', { skin: 2, hair: 'long', hc: 'black', theme: 'wizard', tc: '#0c8599', shirt: '#0c8599', bg: '#c5f6fa' }],
    ['pirate', 'Pirate captain', 'Kapitan pirat', { skin: 1, beard: 'red', theme: 'pirate', tc: '#c92a2a', shirt: '#343a40', bg: '#fff4e6' }],
    ['pirate-2', 'Pirate', 'Piratka', { skin: 4, hair: 'long', hc: 'black', theme: 'pirate', tc: '#1971c2', shirt: '#e8590c', bg: '#ffe8cc' }],
    ['knight', 'Knight', 'Rycerz', { theme: 'knight', shirt: '#868e96', bg: '#e9ecef' }],
    ['queen', 'Queen', 'Królowa', { skin: 0, hair: 'long', hc: 'blonde', theme: 'crown', shirt: '#c2255c', bg: '#ffdeeb' }],
    ['king', 'King', 'Król', { skin: 4, hair: 'short', hc: 'black', beard: 'black', theme: 'crown', shirt: '#1864ab', bg: '#d0ebff' }],
    ['robot', 'Robot', 'Robot', { theme: 'robot', shirt: '#495057', bg: '#e3fafc' }],
    ['alien', 'Alien', 'Kosmita', { theme: 'alien', shirt: '#5c940d', bg: '#e9fac8' }],
    ['viking', 'Viking', 'Wiking', { skin: 1, beard: 'blonde', theme: 'viking', shirt: '#7c4a1e', bg: '#fff3bf' }],
    ['explorer', 'Explorer', 'Odkrywczyni', { skin: 2, hair: 'ponytail', hc: 'brown', theme: 'explorer', shirt: '#82a33f', bg: '#f4fce3' }],
    ['chef', 'Chef', 'Kucharz', { skin: 3, hair: 'short', hc: 'black', theme: 'chef', shirt: '#f8f9fa', bg: '#ffe8cc' }],
    ['dj', 'DJ', 'DJ', { skin: 2, hair: 'afro', hc: 'black', theme: 'headphones', tc: '#e64980', shirt: '#212529', bg: '#ffdeeb' }],
    ['skater', 'Skater', 'Skater', { skin: 1, hair: 'short', hc: 'red', theme: 'cap', tc: '#1c7ed6', shirt: '#1c7ed6', bg: '#d0ebff' }],
    ['gardener', 'Gardener', 'Ogrodniczka', { skin: 0, hair: 'pigtails', hc: 'brown', theme: 'flower', shirt: '#40c057', bg: '#d3f9d8' }],
    ['scientist', 'Scientist', 'Naukowiec', { skin: 0, hair: 'short', hc: 'grey', theme: 'glasses', shirt: '#f8f9fa', bg: '#e7f5ff' }],
    ['punk', 'Punk', 'Punkówa', { skin: 2, hair: 'mohawk', hc: 'pink', shirt: '#212529', bg: '#f3d9fa' }],
    ['athlete', 'Athlete', 'Sportsmenka', { skin: 4, hair: 'bob', hc: 'black', theme: 'headband', tc: '#f59f00', shirt: '#f59f00', bg: '#fff3bf' }],
    ['student', 'Student', 'Studentka', { skin: 3, hair: 'long', hc: 'brown', theme: 'glasses', shirt: '#7048e8', bg: '#e5dbff' }],
    ['hiker', 'Hiker', 'Turysta', { skin: 1, hair: 'short', hc: 'blonde', theme: 'beanie', tc: '#e03131', shirt: '#2b8a3e', bg: '#ebfbee' }],
    ['grandpa', 'Grandpa', 'Dziadek', { skin: 2, beard: 'grey', theme: 'glasses', shirt: '#a61e4d', bg: '#fff0f6' }],
    ['curly', 'Curly', 'Loczek', { skin: 0, hair: 'afro', hc: 'red', shirt: '#0ca678', bg: '#e6fcf5' }],
    ['bookworm', 'Bookworm', 'Mól książkowy', { skin: 1, hair: 'bun', hc: 'brown', glasses: 'round', gc: '#7c4a1e', shirt: '#0c8599', bg: '#e3fafc' }],
    ['developer', 'Developer', 'Programista', { skin: 3, hair: 'short', hc: 'black', glasses: 'square', theme: 'headphones', tc: '#4c6ef5', shirt: '#343a40', bg: '#dbe4ff' }],
    ['sunny', 'Sunny', 'Słoneczna', { skin: 2, hair: 'afro', hc: 'brown', glasses: 'sun', shirt: '#f76707', bg: '#fff4e6' }],
    ['professor', 'Professor', 'Profesor', { skin: 4, hair: 'short', hc: 'grey', beard: 'grey', glasses: 'square', gc: '#16213e', shirt: '#5c7cfa', bg: '#edf2ff' }],
    ['designer', 'Designer', 'Projektantka', { skin: 0, hair: 'bob', hc: 'pink', glasses: 'cat', gc: '#e03131', shirt: '#212529', bg: '#fff0f6' }],
    ['coach', 'Coach', 'Trener', { skin: 1, hair: 'short', hc: 'brown', glasses: 'sun', theme: 'cap', tc: '#2f9e44', shirt: '#2f9e44', bg: '#ebfbee' }],
    ['grandma', 'Grandma', 'Babcia', { skin: 1, hair: 'bun', hc: 'grey', glasses: 'round', gc: '#ae3ec9', shirt: '#ae3ec9', bg: '#f8f0fc' }],
    ['artist', 'Artist', 'Artystka', { skin: 4, hair: 'long', hc: 'black', glasses: 'round', gc: '#f59f00', theme: 'beanie', tc: '#7048e8', shirt: '#f59f00', bg: '#f3f0ff' }]
  ];

  var byId = {};
  var list = DEFS.map(function (d) { byId[d[0]] = d[3]; return { id: d[0], name: { en: d[1], pl: d[2] } }; });

  // Head centre (32,31), radius 15. Background circle radius 32.
  var SHOULDERS = 'M12,57 C16,46 48,46 52,57 A32,32 0 0 1 12,57 Z';
  function hairBack(st, c) {
    switch (st) {
      case 'long': return '<path d="M15,31 C15,10 49,10 49,31 L50,52 C44,55 20,55 14,52 Z" fill="' + c + '"/>';
      case 'bob': return '<path d="M15,31 C15,11 49,11 49,31 L48,43 L16,43 Z" fill="' + c + '"/>';
      case 'afro': return '<circle cx="32" cy="26" r="21" fill="' + c + '"/>';
      case 'bun': return '<circle cx="32" cy="13" r="6.5" fill="' + c + '"/>';
      case 'ponytail': return '<ellipse cx="49" cy="36" rx="5" ry="10" fill="' + c + '" transform="rotate(-15 49 36)"/>';
      case 'pigtails': return '<circle cx="14" cy="36" r="5.5" fill="' + c + '"/><circle cx="50" cy="36" r="5.5" fill="' + c + '"/>';
      default: return '';
    }
  }
  function hairFront(st, c) {
    switch (st) {
      case 'short': case 'long': case 'bob': case 'bun': case 'ponytail': case 'pigtails':
        return '<path d="M16.5,30 C15.5,12 48.5,12 47.5,30 C44,22 36,20.5 30,22 C25,23 19,25 16.5,30 Z" fill="' + c + '"/>';
      case 'afro':
        return '<path d="M17,28 C17,14 47,14 47,28 C42,22 22,22 17,28 Z" fill="' + c + '"/>';
      case 'mohawk':
        return '<path d="M28,24 L27,8 L32,12 L35,6 L37,13 L39,9 L37,24 Z" fill="' + c + '"/>';
      default: return '';
    }
  }
  function face(eyesOnly) {
    var s = '<circle cx="26.5" cy="31.5" r="1.9" fill="' + INK + '"/><circle cx="37.5" cy="31.5" r="1.9" fill="' + INK + '"/>';
    if (!eyesOnly) s += '<path d="M27.5,37 Q32,41 36.5,37" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/>';
    return s;
  }
  function beard(c) {
    return '<path d="M17.5,31 C17,49 47,49 46.5,31 C44,39 40,40.5 32,40.5 C24,40.5 20,39 17.5,31 Z" fill="' + c + '"/>' +
      '<path d="M28,38 Q32,40.5 36,38" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round"/>';
  }
  function head(skin) { return '<circle cx="32" cy="31" r="15" fill="' + skin + '"/>'; }

  function theme(r, skin) {
    var tc = r.tc || INK;
    switch (r.theme) {
      case 'ninja':
        return '<circle cx="32" cy="31" r="15.5" fill="' + tc + '"/>' +
          '<rect x="18" y="26.5" width="28" height="10" rx="5" fill="' + skin + '"/>' + face(true) +
          '<path d="M46,27 L54,22 L52,29 Z M46,31 L55,33 L49,36 Z" fill="' + tc + '"/>' +
          '<path d="M20,22 Q32,17 44,22" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>';
      case 'space':
        return '<circle cx="32" cy="31" r="20" fill="#cfe8ff" fill-opacity=".35" stroke="#dee2e6" stroke-width="3"/>' +
          '<path d="M20,20 Q25,14 32,13" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' +
          '<rect x="19" y="49" width="26" height="5" rx="2.5" fill="#adb5bd"/>';
      case 'wizard':
        return '<path d="M16,21 L48,21 L38,1 Q36,-1 34,2 Z" fill="' + tc + '"/>' +
          '<ellipse cx="32" cy="21" rx="20" ry="4" fill="' + tc + '"/>' +
          '<path d="M33,9 l1.3,2.7 3,.4 -2.2,2 .5,3 -2.6,-1.4 -2.6,1.4 .5,-3 -2.2,-2 3,-.4 Z" fill="#ffd43b"/>';
      case 'pirate':
        return '<path d="M16.5,28 C15.5,11 48.5,11 47.5,28 Z" fill="' + tc + '"/>' +
          '<circle cx="24" cy="20" r="1.4" fill="#fff"/><circle cx="31" cy="17" r="1.4" fill="#fff"/><circle cx="39" cy="19" r="1.4" fill="#fff"/>' +
          '<path d="M47,24 L55,21 L53,28 Z" fill="' + tc + '"/>' +
          '<path d="M18,26 L46,35" stroke="' + INK + '" stroke-width="1.2"/><circle cx="37.5" cy="31.5" r="3.6" fill="' + INK + '"/>';
      case 'knight':
        return '<circle cx="32" cy="31" r="16" fill="#adb5bd"/><path d="M16,31 C16,14 48,14 48,31" fill="#ced4da"/>' +
          '<rect x="19" y="29" width="26" height="4.5" rx="2" fill="' + INK + '"/>' +
          '<path d="M32,15 L32,47" stroke="#868e96" stroke-width="1.5"/>' +
          '<path d="M31,15 C28,6 36,2 40,4 C36,6 35,10 34,15 Z" fill="#e03131"/>';
      case 'crown':
        return '<path d="M20,20 L20,9 L26,15 L32,7 L38,15 L44,9 L44,20 Z" fill="#fab005" stroke="#e67700" stroke-width="1"/>' +
          '<circle cx="32" cy="16" r="1.6" fill="#e03131"/>';
      case 'viking':
        return '<path d="M17,25 C17,10 47,10 47,25 Z" fill="#adb5bd"/><rect x="16" y="23" width="32" height="4" rx="2" fill="#868e96"/>' +
          '<path d="M18,20 C11,18 9,11 11,6 C13,12 16,14 21,15 Z M46,20 C53,18 55,11 53,6 C51,12 48,14 43,15 Z" fill="#f8f0e3" stroke="#d8c8a8" stroke-width="1"/>';
      case 'explorer':
        return '<ellipse cx="32" cy="21" rx="22" ry="4.5" fill="#c69c6d"/><path d="M21,21 C21,9 43,9 43,21 Z" fill="#d9b382"/>' +
          '<rect x="21" y="17" width="22" height="3" fill="#8c6239"/>';
      case 'chef':
        return '<rect x="20" y="15" width="24" height="7" rx="1" fill="#fff" stroke="#dee2e6"/>' +
          '<circle cx="24" cy="11" r="6" fill="#fff"/><circle cx="32" cy="8" r="7" fill="#fff"/><circle cx="40" cy="11" r="6" fill="#fff"/>';
      case 'headphones':
        return '<path d="M15,32 C15,8 49,8 49,32" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
          '<rect x="11" y="27" width="7" height="12" rx="3" fill="' + tc + '"/><rect x="46" y="27" width="7" height="12" rx="3" fill="' + tc + '"/>';
      case 'cap':
        return '<path d="M16.5,25 C16.5,10 47.5,10 47.5,25 Z" fill="' + tc + '"/><path d="M30,24 L56,24 Q54,28 44,28 L30,27 Z" fill="' + tc + '" stroke="' + INK + '" stroke-opacity=".25"/>' +
          '<circle cx="32" cy="12" r="1.5" fill="' + INK + '" fill-opacity=".4"/>';
      case 'flower':
        return '<g transform="translate(44 18)"><circle cx="0" cy="-4" r="3" fill="#ff8787"/><circle cx="4" cy="0" r="3" fill="#ff8787"/><circle cx="0" cy="4" r="3" fill="#ff8787"/><circle cx="-4" cy="0" r="3" fill="#ff8787"/><circle r="2.3" fill="#ffd43b"/></g>';
      case 'glasses':
        return '<circle cx="26.5" cy="31.5" r="4.3" fill="#fff" fill-opacity=".25" stroke="' + INK + '" stroke-width="1.6"/>' +
          '<circle cx="37.5" cy="31.5" r="4.3" fill="#fff" fill-opacity=".25" stroke="' + INK + '" stroke-width="1.6"/><path d="M30.8,31 L33.2,31" stroke="' + INK + '" stroke-width="1.6"/>';
      case 'headband':
        return '<path d="M17,25 Q32,19 47,25 L47,29 Q32,23 17,29 Z" fill="' + tc + '"/>';
      case 'beanie':
        return '<path d="M16.5,26 C15.5,9 48.5,9 47.5,26 Z" fill="' + tc + '"/><rect x="15.5" y="23" width="33" height="5" rx="2.5" fill="' + tc + '" stroke="#fff" stroke-opacity=".35"/>' +
          '<circle cx="32" cy="8" r="4" fill="#fff"/>';
      default: return '';
    }
  }

  // Glasses, worn on top of any hairstyle or theme. gc = frame colour.
  function glasses(style, gc) {
    var c = gc || INK;
    var bridge = '<path d="M30.8,31.2 Q32,30.2 33.2,31.2" fill="none" stroke="' + c + '" stroke-width="1.5"/>' +
      '<path d="M22,30.5 L17.5,29.5 M42,30.5 L46.5,29.5" stroke="' + c + '" stroke-width="1.4"/>';
    switch (style) {
      case 'square':
        return '<rect x="22" y="28" width="8.8" height="7" rx="1.6" fill="#fff" fill-opacity=".25" stroke="' + c + '" stroke-width="1.6"/>' +
          '<rect x="33.2" y="28" width="8.8" height="7" rx="1.6" fill="#fff" fill-opacity=".25" stroke="' + c + '" stroke-width="1.6"/>' + bridge;
      case 'sun':
        return '<rect x="21.5" y="28" width="9.5" height="7" rx="3" fill="' + INK + '" stroke="' + INK + '" stroke-width="1"/>' +
          '<rect x="33" y="28" width="9.5" height="7" rx="3" fill="' + INK + '" stroke="' + INK + '" stroke-width="1"/>' +
          '<path d="M23.5,30 L26,29.5 M35,30 L37.5,29.5" stroke="#fff" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/>' +
          '<path d="M30.8,31 L33.2,31" stroke="' + INK + '" stroke-width="1.5"/><path d="M21.5,30 L17.5,29.5 M42.5,30 L46.5,29.5" stroke="' + INK + '" stroke-width="1.4"/>';
      case 'cat':
        return '<path d="M21.5,29 Q26,27.5 30.8,29 L30,33.5 Q26.5,36 23,33.5 Z" fill="#fff" fill-opacity=".25" stroke="' + c + '" stroke-width="1.7" stroke-linejoin="round"/>' +
          '<path d="M42.5,29 Q38,27.5 33.2,29 L34,33.5 Q37.5,36 41,33.5 Z" fill="#fff" fill-opacity=".25" stroke="' + c + '" stroke-width="1.7" stroke-linejoin="round"/>' +
          '<path d="M21.5,29 L19.5,27.2 M42.5,29 L44.5,27.2" stroke="' + c + '" stroke-width="1.7" stroke-linecap="round"/>' +
          '<path d="M30.8,30 Q32,29.2 33.2,30" fill="none" stroke="' + c + '" stroke-width="1.5"/>';
      default: // round
        return '<circle cx="26.5" cy="31.5" r="4.4" fill="#fff" fill-opacity=".25" stroke="' + c + '" stroke-width="1.6"/>' +
          '<circle cx="37.5" cy="31.5" r="4.4" fill="#fff" fill-opacity=".25" stroke="' + c + '" stroke-width="1.6"/>' + bridge;
    }
  }

  var BEARD = { grey: HAIR.grey, red: HAIR.red, blonde: HAIR.blonde, black: HAIR.black, white: HAIR.white, brown: HAIR.brown };

  function svg(id, px) {
    var r = byId[id] || byId[list[0].id];
    var size = px || 40;
    var skin = SKIN[r.skin || 0];
    var hc = HAIR[r.hc] || HAIR.brown;
    var s = '<svg class="avatar" width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="32" fill="' + r.bg + '"/>' +
      '<path d="' + SHOULDERS + '" fill="' + (r.shirt || r.tc || '#495057') + '"/>';
    if (r.theme === 'robot') {
      return s + '<path d="M32,16 L32,9" stroke="#868e96" stroke-width="2"/><circle cx="32" cy="8" r="3" fill="#ff6b6b"/>' +
        '<rect x="18" y="16" width="28" height="28" rx="6" fill="#ced4da" stroke="#868e96" stroke-width="1.5"/>' +
        '<rect x="22" y="24" width="7" height="6" rx="1.5" fill="#22b8cf"/><rect x="35" y="24" width="7" height="6" rx="1.5" fill="#22b8cf"/>' +
        '<path d="M24,37 h16 M27,35 v4 M32,35 v4 M37,35 v4" stroke="#495057" stroke-width="1.4"/>' +
        '<rect x="14" y="26" width="4" height="9" rx="1.5" fill="#868e96"/><rect x="46" y="26" width="4" height="9" rx="1.5" fill="#868e96"/></svg>';
    }
    if (r.theme === 'alien') {
      return s + '<path d="M24,18 L19,7 M40,18 L45,7" stroke="#74b816" stroke-width="2"/><circle cx="19" cy="7" r="3" fill="#a9e34b"/><circle cx="45" cy="7" r="3" fill="#a9e34b"/>' +
        '<ellipse cx="32" cy="31" rx="15" ry="16" fill="#a9e34b"/>' +
        '<ellipse cx="25.5" cy="30" rx="4" ry="5.5" fill="' + INK + '"/><ellipse cx="38.5" cy="30" rx="4" ry="5.5" fill="' + INK + '"/>' +
        '<circle cx="26.5" cy="28" r="1.3" fill="#fff"/><circle cx="39.5" cy="28" r="1.3" fill="#fff"/>' +
        '<path d="M28.5,39 Q32,41.5 35.5,39" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/></svg>';
    }
    if (r.theme === 'knight') return s + theme(r, skin) + '</svg>';
    s += hairBack(r.hair, hc) + head(skin);
    if (r.theme === 'ninja') return s + theme(r, skin) + '</svg>';
    s += face(false);
    if (r.beard) s += beard(BEARD[r.beard] || HAIR.brown);
    if (r.glasses) s += glasses(r.glasses, r.gc);
    s += hairFront(r.hair, hc) + theme(r, skin);
    return s + '</svg>';
  }

  window.Avatars = {
    list: list,
    has: function (id) { return !!byId[id]; },
    svg: svg
  };
})();
