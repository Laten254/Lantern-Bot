// config.js
function bool(v, d=false) {
  if (v === undefined) return d;
  return v === 'true' || v === '1';
}

module.exports = {
  BOT_NAME: process.env.BOT_NAME || 'Lantern-Bot',
  PREFIX: process.env.PREFIX || '.',
  MODE: process.env.MODE || 'public', // public | private
  OWNER_NUMBERS: (process.env.OWNERS || '').split(',').map(s => s.trim()).filter(Boolean),

  // Feature toggles
  ANTI_DELETE: bool(process.env.ANTI_DELETE, true),
  ANTI_CALL: bool(process.env.ANTI_CALL, true),
  AUTO_READ: bool(process.env.AUTO_READ, false),
  AUTO_REACT: bool(process.env.AUTO_REACT, false),
  FAKE_TYPING: bool(process.env.FAKE_TYPING, true),
  FAKE_RECORDING: bool(process.env.FAKE_RECORDING, true),
  DOWNLOADERS: bool(process.env.DOWNLOADERS, true),
  AI: bool(process.env.AI, true),

  // AI / misc
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',

  // Runtime
  SESSION_DIR: process.env.SESSION_DIR || './session',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PORT: Number(process.env.PORT || 3000),
};
