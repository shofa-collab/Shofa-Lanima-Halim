import { MysteryRound, ScrambleWord, WheelChallenge, StoryPrompt } from '../types/game';

export const MYSTERY_ROUNDS: MysteryRound[] = [
  {
    id: 'safari_party',
    title: 'Wild Jungle Party',
    category: 'Animals & Habitats',
    imagePath: '/src/assets/images/mystery_safari_animals_1794003253155.jpg',
    fallbackGradient: 'from-emerald-500 via-green-600 to-amber-700',
    clues: [
      'Clue 1: It is a tropical habitat with tall green trees and vines.',
      'Clue 2: The King of the Jungle is laughing near a birthday cake!',
      'Clue 3: A tall animal with a long neck and a colorful toucan are celebrating.'
    ],
    answer: 'Wild Jungle Animals Party',
    points: 40
  },
  {
    id: 'space_adventure',
    title: 'Cosmic Journey',
    category: 'Science & Outer Space',
    imagePath: '/src/assets/images/mystery_space_adventure_1794003253062.jpg',
    fallbackGradient: 'from-indigo-600 via-purple-700 to-sky-500',
    clues: [
      'Clue 1: This place is far beyond planet Earth, full of glowing stars.',
      'Clue 2: A brave young explorer wearing a helmet and a white suit.',
      'Clue 3: A smiling yellow planet, rockets, and a friendly green alien flying by!'
    ],
    answer: 'Astronaut in Outer Space',
    points: 40
  },
  {
    id: 'coral_wonder',
    title: 'Under the Deep Blue Sea',
    category: 'Marine Life & Oceans',
    imagePath: '/src/assets/images/mystery_ocean_wonder_1794003253433.jpg',
    fallbackGradient: 'from-cyan-500 via-blue-600 to-teal-700',
    clues: [
      'Clue 1: A warm underwater world with colorful plants and sea anemones.',
      'Clue 2: A smart sea animal known for leaping and making clicks.',
      'Clue 3: A friendly smiling dolphin swimming with a sea turtle and orange clownfish!'
    ],
    answer: 'Dolphin & Coral Reef Friends',
    points: 40
  },
  {
    id: 'magic_castle',
    title: 'The Kingdom in the Sky',
    category: 'Storybook & Fantasy',
    imagePath: '/src/assets/images/story_magical_castle_1794003254166.jpg',
    fallbackGradient: 'from-sky-400 via-pink-400 to-amber-300',
    clues: [
      'Clue 1: A magical building floating high above the ground on a fluffy cloud.',
      'Clue 2: There is a colorful rainbow bridge leading straight to its front gate.',
      'Clue 3: Towers with colorful conical roofs, paper airplanes, and a hot air balloon!'
    ],
    answer: 'Fairytale Cloud Castle',
    points: 40
  }
];

export const SCRAMBLE_WORDS: ScrambleWord[] = [
  {
    id: 'w1',
    word: 'ADVENTURE',
    category: 'Action & Travel',
    definitionClue: 'An exciting and daring journey or experience.',
    sentenceClue: 'The students went on a jungle ______ to find hidden treasure.',
    points: 25
  },
  {
    id: 'w2',
    word: 'ELEPHANT',
    category: 'Animals',
    definitionClue: 'The largest land mammal, known for its long trunk and big ears.',
    sentenceClue: 'An ______ can spray water from its trunk to cool down.',
    points: 20
  },
  {
    id: 'w3',
    word: 'BEAUTIFUL',
    category: 'Adjectives',
    definitionClue: 'Pleasing to the senses or mind; very pretty or lovely.',
    sentenceClue: 'Look at the ______ rainbow stretching across the blue sky!',
    points: 25
  },
  {
    id: 'w4',
    word: 'ASTRONAUT',
    category: 'Professions & Space',
    definitionClue: 'A person trained to travel in a spacecraft to outer space.',
    sentenceClue: 'Neil Armstrong was the first ______ to walk on the moon.',
    points: 25
  },
  {
    id: 'w5',
    word: 'BUTTERFLY',
    category: 'Nature & Insects',
    definitionClue: 'A colorful insect with four large wings that starts as a caterpillar.',
    sentenceClue: 'The yellow ______ landed gently on the fragrant flower.',
    points: 20
  },
  {
    id: 'w6',
    word: 'DINOSAUR',
    category: 'Prehistoric Animals',
    definitionClue: 'A giant reptile that lived millions of years ago on Earth.',
    sentenceClue: 'Tyrannosaurus Rex is the most famous carnivorous ______.',
    points: 20
  },
  {
    id: 'w7',
    word: 'CHOCOLATE',
    category: 'Food & Sweets',
    definitionClue: 'A delicious sweet food made from roasted cacao seeds.',
    sentenceClue: 'We baked warm cookies filled with creamy ______ chips.',
    points: 20
  },
  {
    id: 'w8',
    word: 'VOLCANO',
    category: 'Earth Science',
    definitionClue: 'A mountain with an opening that can erupt with hot molten lava.',
    sentenceClue: 'Smoke and ash poured from the active ______ in Hawaii.',
    points: 20
  },
  {
    id: 'w9',
    word: 'TREASURE',
    category: 'Adventure & Mystery',
    definitionClue: 'A quantity of precious metals, gems, or valuable objects.',
    sentenceClue: 'The pirates buried their golden ______ chest on the secret island.',
    points: 20
  },
  {
    id: 'w10',
    word: 'CHAMPION',
    category: 'Sports & Success',
    definitionClue: 'A person or team that has defeated all rivals in a contest.',
    sentenceClue: 'Our school football team practiced hard and became the ______!',
    points: 20
  }
];

export const WHEEL_CHALLENGES: WheelChallenge[] = [
  {
    id: 'c1',
    title: 'Spell It Out!',
    type: 'spell',
    instruction: 'Spell this word aloud clearly letter by letter in 20 seconds!',
    target: 'KANGAROO',
    timeLimit: 20,
    points: 20,
    color: '#0284C7' // Azure Blue
  },
  {
    id: 'c2',
    title: 'Tongue Twister!',
    type: 'twister',
    instruction: 'Repeat this tongue twister 3 times fast without making a mistake!',
    target: '"She sells seashells by the seashore!"',
    timeLimit: 20,
    points: 30,
    color: '#E11D48' // Rose Red
  },
  {
    id: 'c3',
    title: 'Charades: Act It!',
    type: 'charade',
    instruction: 'Act out this action without speaking any words! Your team must guess it.',
    target: 'Climbing a coconut tree & dodging falling coconuts!',
    timeLimit: 30,
    points: 30,
    color: '#D97706' // Amber
  },
  {
    id: 'c4',
    title: 'Opposites Attack!',
    type: 'opposite',
    instruction: 'Say the exact opposite (antonym) for these three words in 15 seconds!',
    target: '1. GIGANTIC · 2. ANCIENT · 3. WHISPER',
    timeLimit: 15,
    points: 25,
    color: '#7C3AED' // Purple
  },
  {
    id: 'c5',
    title: 'Rhyme Time!',
    type: 'rhyme',
    instruction: 'Say 3 different English words that rhyme with the target word!',
    target: 'Target word: "BRIGHT" (e.g. night, light, flight)',
    timeLimit: 20,
    points: 25,
    color: '#059669' // Emerald
  },
  {
    id: 'c6',
    title: 'Category Blitz!',
    type: 'blitz',
    instruction: 'Rapid fire! Name 5 different items in this category before time runs out!',
    target: 'Name 5 animals that can FLY in the sky!',
    timeLimit: 20,
    points: 30,
    color: '#EA580C' // Orange
  },
  {
    id: 'c7',
    title: 'Describe in 3 Adjectives!',
    type: 'describe',
    instruction: 'Use 3 exciting English adjectives to describe this place or object!',
    target: 'A Haunted Amusement Park at Midnight',
    timeLimit: 20,
    points: 25,
    color: '#0891B2' // Cyan
  },
  {
    id: 'c8',
    title: 'Lucky Bonus Gold!',
    type: 'bonus',
    instruction: 'Congratulations! Your team just answered the secret arena bonus call!',
    target: 'Give a 5-second high five to your teammate!',
    timeLimit: 10,
    points: 50,
    color: '#CA8A04' // Gold
  }
];

export const STORY_PROMPTS: StoryPrompt[] = [
  {
    id: 's1',
    scenario: 'The Mysterious Cloud Castle Adventure',
    imagePath: '/src/assets/images/story_magical_castle_1794003254166.jpg',
    character: 'A brave junior detective with a magical magnifying glass',
    item: 'A golden flying backpack that hums funny tunes',
    location: 'A shimmering rainbow bridge high in the fluffy clouds',
    twist: 'Suddenly, all gravity reversed and the castle began to spin backwards!'
  },
  {
    id: 's2',
    scenario: 'The Secret Safari Birthday Mystery',
    imagePath: '/src/assets/images/mystery_safari_animals_1794003253155.jpg',
    character: 'A cheeky monkey who can speak human English',
    item: 'A giant birthday cake that grants one funny wish',
    location: 'The ancient singing baobab tree in the middle of the jungle',
    twist: 'Suddenly, the cake disappeared leaving glowing green footprints!'
  },
  {
    id: 's3',
    scenario: 'The Astronaut and the Lost Space Map',
    imagePath: '/src/assets/images/mystery_space_adventure_1794003253062.jpg',
    character: 'A friendly alien chef searching for the universe’s sweetest fruit',
    item: 'A floating holographic treasure map of the Milky Way',
    location: 'The rings of Saturn next to a cosmic satellite station',
    twist: 'Suddenly, a playful space comet bumped into the rocket ship!'
  }
];

export const STORY_SENTENCE_STARTERS = [
  { step: 1, starter: 'Once upon a time, there was...', tip: 'Introduce your character & where they are.' },
  { step: 2, starter: 'Every day, they used to...', tip: 'Describe their normal daily activity.' },
  { step: 3, starter: 'Until one unexpected morning...', tip: 'Introduce a surprise event or discovery!' },
  { step: 4, starter: 'Because of that, the team had to...', tip: 'Describe the action they took together.' },
  { step: 5, starter: 'Suddenly, without warning...', tip: 'Add an exciting plot twist or challenge!' },
  { step: 6, starter: 'Fortunately, they discovered that...', tip: 'Explain how they solved the problem.' },
  { step: 7, starter: 'In the end, they learned that...', tip: 'Wrap up with a fun moral or celebration!' }
];
