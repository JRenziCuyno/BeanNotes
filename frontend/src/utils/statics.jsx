export const API_BASE = 'http://localhost:5000';
export const API_URL = '/notes';

export const pastelPalettes = [
  { from: '#FFDFD3', to: '#FFC1E3', text: '#1F2937' },
  { from: '#D8FFF2', to: '#BFF1E1', text: '#064E3B' },
  { from: '#EAD7FF', to: '#D6BEEB', text: '#3C1361' },
  { from: '#DFF6FF', to: '#C8E6FF', text: '#083344' },
  { from: '#FFF7D9', to: '#FFE6A7', text: '#4A2F00' },
  { from: '#FFEFE6', to: '#FFD3C4', text: '#4B1A00' },
  { from: '#E6FFF2', to: '#CFFFE0', text: '#004D40' },
  { from: '#FFEAF6', to: '#FFD9F0', text: '#2C0F1E' }
]; 

export const getPalette = (index = 0) => pastelPalettes[index % pastelPalettes.length];
export const PURPOSES = ['all', 'school', 'personal', 'home'];

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRandomQuote = () => {
    const quotes = [
    'Productivity is never an accident. It is always the result of a commitment to excellence.',
    'The way to get started is to quit talking and begin doing.',
    'Innovation distinguishes between a leader and a follower.',
    "Your limitation—it's only your imagination.",
    'Great things never come from comfort zones.',
    'Dream it. Wish it. Do it.',
    "Success doesn\'t just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't stop when you're tired. Stop when you're done.",
    'Wake up with determination. Go to bed with satisfaction.',
    'Do something today that your future self will thank you for.',
    'Little things make big days.',
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it.",
    "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    'The key to success is to focus on goals, not obstacles.',
    'Dream bigger. Do bigger.',
    "Don't be afraid to give up the good to go for the great.",
    'The only impossible journey is the one you never begin.',
    'In the middle of difficulty lies opportunity.',
    'Small progress is still progress.',
    'Discipline is the bridge between goals and accomplishment.',
    'Push yourself, because no one else is going to do it for you.',
    "Success is the sum of small efforts repeated day in and day out.",
    'Fall seven times and stand up eight.',
    'Big journeys begin with small steps.',
    'Every day is a chance to get better.',
    'If you want it, work for it.',
    'Consistency is what transforms average into excellence.',
    "Don't limit your challenges. Challenge your limits.",
    "Nothing will work unless you do.",
    'Perseverance is not a long race; it\'s many short races one after the other.',
    "When you feel like quitting, remember why you started.",
    'Energy and persistence conquer all things.',
    "If it doesn\'t challenge you, it won\'t change you.",
    'Your future is created by what you do today, not tomorrow.',
    'The secret of getting ahead is getting started.',
    'Do it with passion or not at all.',
    'Winners are not people who never fail, but people who never quit.',
    'Stay positive, work hard, make it happen.',
    "Opportunities don't happen. You create them.",
    "Success usually comes to those who are too busy to be looking for it.",
    "Don\'t be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    'What you do today can improve all your tomorrows.',
    'Act as if what you do makes a difference. It does.',
    'Motivation gets you going, but discipline keeps you growing.',
    'The secret of change is to focus all your energy not on fighting the old, but on building the new.',
    'Your only limit is you.',
    'Success is not for the lazy.'
  ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  };