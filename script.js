// TypingFlow v2 - Full Script
// CDN globals: lucide, d3, confetti

// ===================== WORD LISTS =====================
const WORDS_LIST = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at","this",
  "but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their",
  "what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just",
  "him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now",
  "look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way",
  "even","new","want","because","any","these","give","day","most","us","system","program","computer","data","function",
  "class","object","method","variable","array","string","number","boolean","return","import","export","interface",
  "component","render","state","props","async","await","promise","error","debug","deploy","server","client","request",
  "response","database","query","index","value","result","output","input","process","memory","access","update","delete",
  "create","read","write","file","path","name","type","key","list","item","user","view","page","route","style","code",
  "build","test","version","feature","review","change","fix","push","pull","merge","branch","commit","release","module"
];

const SENTENCES_LIST = [
  "The quick brown fox jumps over the lazy dog.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "In the middle of every difficulty lies opportunity.",
  "Everything you've ever wanted is on the other side of fear.",
  "Your time is limited, so don't waste it living someone else's life.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Life is what happens when you're busy making other plans.",
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Act as if what you do makes a difference. It does.",
  "With the new day comes new strength and new thoughts.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Keep your face always toward the sunshine, and shadows will fall behind you.",
  "Whether you think you can or you think you can't, you're right.",
  "Too many of us are not living our dreams because we are living our fears.",
  "I have learned over the years that when one's mind is made up, this diminishes fear.",
  "I didn't fail the test. I just found a hundred ways to do it wrong.",
  "You become what you believe. You are where you are today because of what you believed."
];

const PARAGRAPH_LIST = [
  "The art of typing is not merely about speed, but about accuracy and rhythm. As your fingers dance across the keyboard, each keystroke becomes a note in a symphony of words. Practice builds muscle memory, and muscle memory builds speed. The journey from a slow, hunt-and-peck typist to a fluent touch typist is one of patience and persistence.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using many different programming languages. Some of the most popular programming languages include Python, JavaScript, Java, and C++. Each language has its own syntax and semantics.",
  "The internet has revolutionized the way we communicate, work, and access information. What once took days or weeks can now be accomplished in seconds. The global network connects billions of devices and people, creating an unprecedented exchange of ideas, commerce, and culture across every corner of the world.",
  "Keyboards come in many varieties, from the standard membrane keyboards found in offices to the mechanical keyboards beloved by enthusiasts. The feel of each keypress, known as tactile feedback, can dramatically affect typing comfort and accuracy over long sessions. Many typists swear by specific switch types for their unique feel."
];

const NUMBERS_LIST = Array.from({ length: 200 }, () => Math.floor(Math.random() * 9999).toString());

const PUNCTUATION_WORDS = [
  "hello,","world!","it's","don't","can't","won't","I've","you're","they're","we're",
  "isn't","wasn't","shouldn't","couldn't","wouldn't","didn't","doesn't","hasn't",
  "haven't","hadn't","let's","that's","there's","here's","where's","what's","who's",
  "how's","it'd","she'd","he'd","we'd","they'd","I'd","you'd","quick,","fast!",
  "stop.","go!","yes,","no.","maybe?","always;","never:","sometimes—","often,","rarely."
];

const KEYBOARD_LAYOUT = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"]
];

// ===================== THEMES =====================
const THEMES = {
  green:  { accent: "#00ff87", dim: "rgba(0,255,135,0.15)", glow: "rgba(0,255,135,0.4)" },
  blue:   { accent: "#00c6ff", dim: "rgba(0,198,255,0.15)", glow: "rgba(0,198,255,0.4)" },
  purple: { accent: "#a855f7", dim: "rgba(168,85,247,0.15)", glow: "rgba(168,85,247,0.4)" },
  orange: { accent: "#f97316", dim: "rgba(249,115,22,0.15)", glow: "rgba(249,115,22,0.4)" },
  pink:   { accent: "#ec4899", dim: "rgba(236,72,153,0.15)", glow: "rgba(236,72,153,0.4)" },
  yellow: { accent: "#eab308", dim: "rgba(234,179,8,0.15)",  glow: "rgba(234,179,8,0.4)" },
  red:    { accent: "#ef4444", dim: "rgba(239,68,68,0.15)",  glow: "rgba(239,68,68,0.4)" },
  white:  { accent: "#f5f5f5", dim: "rgba(245,245,245,0.1)", glow: "rgba(245,245,245,0.3)" },
};

function applyTheme(name) {
  const t = THEMES[name] || THEMES.green;
  const root = document.documentElement;
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--accent-dim', t.dim);
  root.style.setProperty('--accent-glow', t.glow);
  localStorage.setItem('tf_theme', name);
}

// ===================== SOUND MANAGER =====================
class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
    this.theme = 'mechanical';
    this.audioCtx = null;
  }

  init() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playKey(type = 'default') {
    if (!this.enabled || !this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    const now = this.audioCtx.currentTime;

    const themes = {
      mechanical: {
        default: { type:'square', freq:800, endFreq:400, dur:0.04, vol:0.15 },
        space:    { type:'square', freq:300, endFreq:150, dur:0.08, vol:0.2 },
        backspace:{ type:'square', freq:500, endFreq:200, dur:0.05, vol:0.1 },
        error:    { type:'square', freq:200, endFreq:100, dur:0.1,  vol:0.2 },
      },
      soft: {
        default: { type:'sine', freq:600, endFreq:400, dur:0.06, vol:0.2 },
        space:   { type:'sine', freq:300, endFreq:200, dur:0.1,  vol:0.2 },
        backspace:{ type:'sine', freq:400, endFreq:300, dur:0.06, vol:0.15 },
        error:   { type:'sine', freq:250, endFreq:150, dur:0.1,  vol:0.2 },
      },
      typewriter: {
        default: { type:'sawtooth', freq:1200, endFreq:600, dur:0.03, vol:0.1 },
        space:   { type:'sawtooth', freq:400,  endFreq:200, dur:0.08, vol:0.2 },
        backspace:{ type:'sawtooth', freq:800, endFreq:400, dur:0.04, vol:0.1 },
        error:   { type:'sawtooth', freq:300,  endFreq:150, dur:0.1,  vol:0.2 },
      },
      beep: {
        default: { type:'sine', freq:880, endFreq:880, dur:0.05, vol:0.15 },
        space:   { type:'sine', freq:440, endFreq:440, dur:0.08, vol:0.2 },
        backspace:{ type:'sine', freq:660, endFreq:660, dur:0.05, vol:0.1 },
        error:   { type:'sine', freq:220, endFreq:220, dur:0.1,  vol:0.3 },
      },
    };

    const t = (themes[this.theme] || themes.mechanical)[type] || themes.mechanical.default;
    osc.type = t.type;
    osc.frequency.setValueAtTime(t.freq, now);
    osc.frequency.exponentialRampToValueAtTime(t.endFreq, now + t.dur);
    gain.gain.setValueAtTime(this.volume * t.vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + t.dur);
    osc.start(now);
    osc.stop(now + t.dur);
  }
}

// ===================== STORAGE MANAGER =====================
class StorageManager {
  static saveResult(result) {
    const history = JSON.parse(localStorage.getItem('tf_history') || '[]');
    history.unshift({ ...result, date: new Date().toISOString() });
    if (history.length > 100) history.pop();
    localStorage.setItem('tf_history', JSON.stringify(history));

    const pb = parseInt(localStorage.getItem('tf_pb') || '0');
    if (result.wpm > pb) localStorage.setItem('tf_pb', result.wpm);

    let xp = parseInt(localStorage.getItem('tf_xp') || '0');
    xp += result.xp;
    localStorage.setItem('tf_xp', xp.toString());

    // Streak
    let streak = parseInt(localStorage.getItem('tf_streak') || '0');
    const lastDate = localStorage.getItem('tf_last_date');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      streak = (lastDate === yesterday) ? streak + 1 : 1;
      localStorage.setItem('tf_streak', streak.toString());
      localStorage.setItem('tf_last_date', today);
    }

    // Daily tests
    let dailyTests = parseInt(localStorage.getItem('tf_daily_tests') || '0');
    const lastFull = localStorage.getItem('tf_daily_date');
    if (lastFull !== today) {
      dailyTests = 1;
      localStorage.setItem('tf_daily_date', today);
    } else {
      dailyTests++;
    }
    localStorage.setItem('tf_daily_tests', dailyTests.toString());
  }

  static getStats() {
    return {
      pb: parseInt(localStorage.getItem('tf_pb') || '0'),
      xp: parseInt(localStorage.getItem('tf_xp') || '0'),
      streak: parseInt(localStorage.getItem('tf_streak') || '0'),
      dailyTests: parseInt(localStorage.getItem('tf_daily_tests') || '0'),
      history: JSON.parse(localStorage.getItem('tf_history') || '[]'),
    };
  }

  static clearAll() {
    ['tf_history','tf_pb','tf_xp','tf_streak','tf_last_date','tf_daily_tests','tf_daily_date','tf_key_usage']
      .forEach(k => localStorage.removeItem(k));
  }
}

// ===================== TYPING ENGINE =====================
class TypingEngine {
  constructor() {
    this.state = {
      mode: 'words', timeLimit: 30, timeLeft: 30,
      isActive: false, isFinished: false,
      text: '', words: [], userInput: '', currentIndex: 0,
      correctChars: 0, wrongChars: 0, errors: 0,
      startTime: null, wpmHistory: [], rawHistory: []
    };
    this.timerInterval = null;
    this.onUpdate = null;
    this.onFinish = null;
    this.stopOnError = false;
    this.blindMode = false;
  }

  reset(mode, timeLimit) {
    if (mode !== undefined) this.state.mode = mode;
    if (timeLimit !== undefined) this.state.timeLimit = timeLimit;
    this.state.timeLeft = this.state.timeLimit;
    this.state.isActive = false;
    this.state.isFinished = false;
    this.state.userInput = '';
    this.state.currentIndex = 0;
    this.state.correctChars = 0;
    this.state.wrongChars = 0;
    this.state.errors = 0;
    this.state.startTime = null;
    this.state.wpmHistory = [];
    this.state.rawHistory = [];
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.state.mode !== 'custom') this.generateText();
    if (this.onUpdate) this.onUpdate(this.state);
  }

  generateText() {
    let text = '';
    if (this.state.mode === 'words') {
      const shuffled = [...WORDS_LIST].sort(() => Math.random() - 0.5);
      text = shuffled.slice(0, 120).join(' ');
    } else if (this.state.mode === 'sentences') {
      const shuffled = [...SENTENCES_LIST].sort(() => Math.random() - 0.5);
      text = shuffled.slice(0, 6).join(' ');
    } else if (this.state.mode === 'paragraphs') {
      const shuffled = [...PARAGRAPH_LIST].sort(() => Math.random() - 0.5);
      text = shuffled.slice(0, 2).join(' ');
    } else if (this.state.mode === 'numbers') {
      const nums = Array.from({ length: 80 }, () => Math.floor(Math.random() * 9999).toString());
      text = nums.join(' ');
    } else if (this.state.mode === 'punctuation') {
      const shuffled = [...WORDS_LIST, ...PUNCTUATION_WORDS].sort(() => Math.random() - 0.5);
      text = shuffled.slice(0, 100).join(' ');
    }
    this.state.text = text;
  }

  start() {
    if (this.state.isActive) return;
    this.state.isActive = true;
    this.state.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.state.timeLeft = Math.max(0, this.state.timeLeft - 1);
      const elapsed = (Date.now() - this.state.startTime) / 60000;
      const wpm = Math.round((this.state.correctChars / 5) / elapsed) || 0;
      const raw = Math.round(((this.state.correctChars + this.state.wrongChars) / 5) / elapsed) || 0;
      this.state.wpmHistory.push({ time: this.state.timeLimit - this.state.timeLeft, value: wpm });
      this.state.rawHistory.push({ time: this.state.timeLimit - this.state.timeLeft, value: raw });
      if (this.state.timeLeft <= 0) this.finish();
      else if (this.onUpdate) this.onUpdate(this.state);
    }, 1000);
  }

  handleInput(char) {
    if (this.state.isFinished) return;
    if (!this.state.isActive) this.start();
    const target = this.state.text[this.state.currentIndex];
    if (!target) return;

    // Track key usage
    const ku = JSON.parse(localStorage.getItem('tf_key_usage') || '{}');
    ku[char.toLowerCase()] = (ku[char.toLowerCase()] || 0) + 1;
    localStorage.setItem('tf_key_usage', JSON.stringify(ku));

    const isCorrect = char === target;
    if (isCorrect) {
      this.state.correctChars++;
    } else {
      this.state.wrongChars++;
      this.state.errors++;
      if (this.stopOnError) return; // don't advance
    }

    this.state.userInput += char;
    this.state.currentIndex++;

    if (this.state.currentIndex >= this.state.text.length) this.finish();
    else if (this.onUpdate) this.onUpdate(this.state);
  }

  handleBackspace(ctrlHeld) {
    if (this.state.isFinished || this.state.currentIndex === 0) return;
    if (ctrlHeld) {
      // Delete whole word back
      let i = this.state.currentIndex - 1;
      while (i > 0 && this.state.text[i - 1] !== ' ') i--;
      const removed = this.state.userInput.slice(i);
      removed.split('').forEach(c => {
        const t = this.state.text[i + removed.indexOf(c)];
        if (c === t) this.state.correctChars = Math.max(0, this.state.correctChars - 1);
        else this.state.wrongChars = Math.max(0, this.state.wrongChars - 1);
      });
      this.state.userInput = this.state.userInput.slice(0, i);
      this.state.currentIndex = i;
    } else {
      const prev = this.state.userInput[this.state.currentIndex - 1];
      const target = this.state.text[this.state.currentIndex - 1];
      if (prev === target) this.state.correctChars = Math.max(0, this.state.correctChars - 1);
      else this.state.wrongChars = Math.max(0, this.state.wrongChars - 1);
      this.state.userInput = this.state.userInput.slice(0, -1);
      this.state.currentIndex--;
    }
    if (this.onUpdate) this.onUpdate(this.state);
  }

  finish() {
    if (this.state.isFinished) return;
    this.state.isActive = false;
    this.state.isFinished = true;
    clearInterval(this.timerInterval);
    const elapsedSeconds = (Date.now() - this.state.startTime) / 1000;
    const elapsedMinutes = elapsedSeconds / 60;
    const wpm = Math.round((this.state.correctChars / 5) / elapsedMinutes) || 0;
    const raw = Math.round(((this.state.correctChars + this.state.wrongChars) / 5) / elapsedMinutes) || 0;
    const cpm = Math.round(this.state.correctChars / elapsedMinutes) || 0;
    const total = this.state.correctChars + this.state.wrongChars;
    const accuracy = total > 0 ? Math.round((this.state.correctChars / total) * 100) : 100;
    const xp = Math.round(wpm * (accuracy / 100) * (elapsedSeconds / 10));
    const result = {
      wpm, raw, cpm, accuracy,
      errors: this.state.errors,
      time: Math.round(elapsedSeconds),
      chars: this.state.correctChars,
      xp, wpmHistory: this.state.wpmHistory, rawHistory: this.state.rawHistory
    };
    StorageManager.saveResult(result);
    if (this.onFinish) this.onFinish(result);
  }
}

// ===================== UI CONTROLLER =====================
class UIController {
  constructor(engine, sound) {
    this.engine = engine;
    this.sound = sound;
    this.smoothCaret = true;
    this.blindMode = false;
    this.caretPos = { x: 0, y: 0 };
    this.init();
  }

  init() {
    lucide.createIcons();
    this.loadSettings();
    this.renderKeyboard();
    this.setupEventListeners();
    this.loadUserData();
    this.engine.onUpdate = s => this.updateUI(s);
    this.engine.onFinish = r => this.showResults(r);
    this.engine.reset();
    document.getElementById('typing-input').focus();
  }

  loadSettings() {
    const theme = localStorage.getItem('tf_theme') || 'green';
    applyTheme(theme);
    document.querySelectorAll('.theme-btn').forEach(b => {
      b.classList.toggle('active-theme', b.dataset.theme === theme);
    });

    const fontSize = localStorage.getItem('tf_font_size') || '21';
    document.getElementById('typing-container').style.fontSize = fontSize + 'px';
    document.getElementById('font-size-slider').value = fontSize;
    document.getElementById('font-size-value').textContent = fontSize + 'px';
  }

  loadUserData() {
    const stats = StorageManager.getStats();
    document.getElementById('streak-count').textContent = stats.streak;
    const level = Math.floor(Math.sqrt(stats.xp / 100)) + 1;
    document.getElementById('user-level').textContent = `Lvl ${level}`;
    document.getElementById('daily-goal').textContent = `${Math.min(stats.dailyTests, 5)}/5`;
    if (stats.dailyTests >= 5) document.getElementById('daily-goal').style.color = 'var(--accent)';
    document.getElementById('pb-footer').textContent = `PB: ${stats.pb} WPM`;
  }

  renderKeyboard() {
    const kb = document.getElementById('visual-keyboard');
    if (!kb) return;
    const ku = JSON.parse(localStorage.getItem('tf_key_usage') || '{}');
    const maxU = Math.max(...Object.values(ku), 1);

    const rows = [
      ["q","w","e","r","t","y","u","i","o","p"],
      ["a","s","d","f","g","h","j","k","l"],
      ["z","x","c","v","b","n","m"],
      [" ","Backspace"]
    ];

    kb.innerHTML = rows.map(row => `
      <div class="flex justify-center gap-1">
        ${row.map(k => {
          const cls = k === ' ' ? 'key key-space' : k === 'Backspace' ? 'key key-backspace' : k === 'Enter' ? 'key key-enter' : 'key';
          const u = ku[k.toLowerCase()] || 0;
          const intensity = u / maxU;
          const style = intensity > 0.05 ? `style="background:rgba(0,255,135,${intensity*0.25}); color: rgba(0,255,135,${0.4 + intensity*0.6});"` : '';
          const label = k === ' ' ? 'Space' : k;
          return `<div class="${cls}" data-key="${k}" ${style}>${label}</div>`;
        }).join('')}
      </div>
    `).join('');
  }

  setupEventListeners() {
    const input = document.getElementById('typing-input');

    // Main typing handler
    input.addEventListener('keydown', e => {
      this.sound.init();

      if (e.key === 'Escape') { this.engine.reset(); return; }
      if (e.key === 'Tab') { e.preventDefault(); input.focus(); return; }

      if (e.key === 'Backspace') {
        e.preventDefault();
        this.sound.playKey('backspace');
        this.engine.handleBackspace(e.ctrlKey || e.metaKey);
        this.highlightKey('Backspace');
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        const type = e.key === ' ' ? 'space' : 'default';
        this.sound.playKey(type);
        this.engine.handleInput(e.key);
        this.highlightKey(e.key);
      }
    });

    // Focus management
    input.addEventListener('blur', () => {
      if (!this.engine.state.isFinished) {
        document.getElementById('focus-overlay').classList.remove('opacity-0', 'pointer-events-none');
      }
    });
    document.getElementById('focus-overlay').addEventListener('click', () => {
      input.focus();
      document.getElementById('focus-overlay').classList.add('opacity-0', 'pointer-events-none');
    });
    document.getElementById('typing-container').addEventListener('click', () => {
      input.focus();
      document.getElementById('focus-overlay').classList.add('opacity-0', 'pointer-events-none');
    });

    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.engine.reset(btn.dataset.mode);
        input.focus();
      });
    });

    // Time buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.time === 'custom') {
          const val = parseInt(prompt('Custom time (seconds):', '45'));
          if (!isNaN(val) && val > 0) {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            btn.textContent = val + 's';
            this.engine.reset(null, val);
          }
          return;
        }
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.engine.reset(null, parseInt(btn.dataset.time));
        input.focus();
      });
    });

    // Settings
    document.getElementById('settings-btn').addEventListener('click', () => {
      document.getElementById('settings-drawer').classList.remove('translate-x-full');
    });
    document.getElementById('close-settings-btn').addEventListener('click', () => {
      document.getElementById('settings-drawer').classList.add('translate-x-full');
    });

    // Sound
    document.getElementById('sound-toggle').addEventListener('change', e => {
      this.sound.enabled = e.target.checked;
      if (this.sound.enabled) this.sound.init();
    });
    document.getElementById('volume-slider').addEventListener('input', e => {
      this.sound.volume = e.target.value / 100;
      document.getElementById('volume-value').textContent = e.target.value + '%';
    });
    document.getElementById('sound-theme').addEventListener('change', e => {
      this.sound.theme = e.target.value;
    });

    // Theme
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active-theme'));
        btn.classList.add('active-theme');
        applyTheme(btn.dataset.theme);
        this.renderKeyboard();
      });
    });

    // Font size
    document.getElementById('font-size-slider').addEventListener('input', e => {
      document.getElementById('typing-container').style.fontSize = e.target.value + 'px';
      document.getElementById('font-size-value').textContent = e.target.value + 'px';
      localStorage.setItem('tf_font_size', e.target.value);
    });

    // Smooth caret
    document.getElementById('smooth-caret-toggle').addEventListener('change', e => {
      this.smoothCaret = e.target.checked;
    });

    // Stop on error
    document.getElementById('stop-on-error-toggle').addEventListener('change', e => {
      this.engine.stopOnError = e.target.checked;
    });

    // Blind mode
    document.getElementById('blind-mode-toggle').addEventListener('change', e => {
      this.blindMode = e.target.checked;
      this.engine.blindMode = e.target.checked;
      this.updateUI(this.engine.state);
    });

    // Zen mode
    document.getElementById('zen-mode-toggle').addEventListener('change', e => {
      const els = ['main-header','config-bar','visual-keyboard','main-footer'];
      els.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = e.target.checked ? '0' : '';
        if (el) el.style.pointerEvents = e.target.checked ? 'none' : '';
      });
    });

    // Show keyboard
    document.getElementById('show-keyboard-toggle').addEventListener('change', e => {
      const kb = document.getElementById('visual-keyboard');
      if (kb) kb.style.display = e.target.checked ? '' : 'none';
    });

    // Custom text
    document.getElementById('apply-custom-text').addEventListener('click', () => {
      const text = document.getElementById('custom-text-input').value.trim();
      if (text) {
        this.engine.state.mode = 'custom';
        this.engine.state.text = text;
        this.engine.reset('custom');
        document.getElementById('settings-drawer').classList.add('translate-x-full');
        input.focus();
      }
    });

    // Reset stats
    document.getElementById('reset-stats-btn').addEventListener('click', () => {
      if (confirm('Reset all stats? This cannot be undone.')) {
        StorageManager.clearAll();
        this.loadUserData();
        this.renderKeyboard();
      }
    });

    // Results
    document.getElementById('restart-btn').addEventListener('click', () => {
      document.getElementById('results-modal').classList.add('hidden', 'opacity-0');
      this.engine.reset();
      input.focus();
    });
    document.getElementById('close-results-btn').addEventListener('click', () => {
      document.getElementById('results-modal').classList.add('hidden', 'opacity-0');
    });

    // Share
    document.getElementById('share-btn').addEventListener('click', () => {
      const wpm = document.getElementById('result-wpm').textContent;
      const acc = document.getElementById('result-accuracy').textContent;
      const text = `TypingFlow: ${wpm} WPM | ${acc} accuracy — can you beat me? 🚀`;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('share-btn');
        btn.innerHTML = '<i data-lucide="check" class="w-5 h-5" style="color:var(--accent)"></i>';
        lucide.createIcons();
        setTimeout(() => { btn.innerHTML = '<i data-lucide="share-2" class="w-5 h-5"></i>'; lucide.createIcons(); }, 2000);
      });
    });

    // Tweet
    document.getElementById('tweet-btn').addEventListener('click', () => {
      const wpm = document.getElementById('result-wpm').textContent;
      const acc = document.getElementById('result-accuracy').textContent;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just typed ${wpm} WPM with ${acc} accuracy on TypingFlow! 🚀 #typing #typingtest`)}`;
      window.open(url, '_blank');
    });

    // History
    document.getElementById('history-btn').addEventListener('click', () => {
      this.renderHistory();
      const modal = document.getElementById('history-modal');
      modal.classList.remove('hidden');
      setTimeout(() => modal.classList.remove('opacity-0'), 10);
    });
    document.getElementById('close-history-btn').addEventListener('click', () => {
      const modal = document.getElementById('history-modal');
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    });
    document.getElementById('clear-history-btn').addEventListener('click', () => {
      if (confirm('Clear all history?')) {
        localStorage.removeItem('tf_history');
        this.renderHistory();
      }
    });
  }

  highlightKey(key) {
    const k = key === ' ' ? ' ' : key.toLowerCase();
    const el = document.querySelector(`.key[data-key="${k}"]`) || document.querySelector(`.key[data-key="${key}"]`);
    if (el) {
      el.classList.add('active');
      clearTimeout(el._timer);
      el._timer = setTimeout(() => el.classList.remove('active'), 120);
    }
  }

  updateUI(state) {
    const container = document.getElementById('typing-container');

    // Render chars
    container.innerHTML = state.text.split('').map((char, i) => {
      let cls = 'char-pending';
      if (!this.blindMode && i < state.currentIndex) {
        cls = state.userInput[i] === char ? 'char-correct' : 'char-wrong';
      }
      if (i === state.currentIndex) {
        cls = (this.smoothCaret ? 'caret-smooth ' : '') + 'caret-char';
        if (this.blindMode) cls += ' char-pending';
      }
      const display = char === ' ' ? '&nbsp;' : char;
      return `<span class="${cls}">${display}</span>`;
    }).join('');

    // Scroll current char into view
    const caretEl = container.querySelector('.caret-char');
    if (caretEl) {
      const containerRect = container.getBoundingClientRect();
      const caretRect = caretEl.getBoundingClientRect();
      if (caretRect.bottom > containerRect.bottom - 30 || caretRect.top < containerRect.top) {
        caretEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }

    // Live stats
    if (state.isActive) {
      document.getElementById('live-stats').style.opacity = '1';
      const elapsed = (Date.now() - state.startTime) / 60000;
      const wpm = Math.round((state.correctChars / 5) / elapsed) || 0;
      const raw = Math.round(((state.correctChars + state.wrongChars) / 5) / elapsed) || 0;
      const total = state.correctChars + state.wrongChars;
      const acc = total > 0 ? Math.round((state.correctChars / total) * 100) : 100;

      document.getElementById('live-wpm').textContent = wpm;
      document.getElementById('live-raw').textContent = raw;
      document.getElementById('live-accuracy').textContent = acc + '%';
      document.getElementById('live-errors').textContent = state.errors;
      document.getElementById('live-timer').textContent = state.timeLeft;

      const circ = 2 * Math.PI * 20;
      const offset = circ - (state.timeLeft / state.timeLimit) * circ;
      document.getElementById('timer-circle').style.strokeDashoffset = offset;

      const progress = (state.currentIndex / state.text.length) * 100;
      document.getElementById('progress-bar').style.width = Math.min(progress, 100) + '%';
    } else if (!state.isFinished) {
      document.getElementById('live-stats').style.opacity = '0';
      document.getElementById('progress-bar').style.width = '0%';
      document.getElementById('timer-circle').style.strokeDashoffset = '0';
      document.getElementById('live-timer').textContent = state.timeLeft;
    }
  }

  showResults(result) {
    const stats = StorageManager.getStats();
    const isPB = result.wpm >= stats.pb;

    document.getElementById('result-wpm').textContent = result.wpm;
    document.getElementById('result-raw').textContent = result.raw;
    document.getElementById('result-accuracy').textContent = result.accuracy + '%';
    document.getElementById('result-errors').textContent = result.errors;
    document.getElementById('result-cpm').textContent = result.cpm;
    document.getElementById('result-chars').textContent = result.chars;
    document.getElementById('result-time').textContent = result.time + 's';
    document.getElementById('result-xp').textContent = '+' + result.xp;
    document.getElementById('result-pb').textContent = stats.pb + ' WPM';
    document.getElementById('result-date').textContent = new Date().toLocaleString();

    const modal = document.getElementById('results-modal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);

    this.renderChart(result.wpmHistory, result.rawHistory);
    this.renderLeaderboard();
    this.loadUserData();
    this.renderKeyboard();

    if (isPB) {
      document.getElementById('result-pb').classList.add('new-pb');
      setTimeout(() => document.getElementById('result-pb').classList.remove('new-pb'), 4000);
    }

    if (result.wpm > 30) {
      confetti({
        particleCount: result.wpm > 80 ? 250 : 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: [getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(), '#ffffff', '#00c6ff']
      });
    }
  }

  renderLeaderboard() {
    const { history } = StorageManager.getStats();
    const top5 = [...history].sort((a, b) => b.wpm - a.wpm).slice(0, 5);
    document.getElementById('leaderboard').innerHTML = top5.length === 0
      ? '<p class="text-neutral-600 text-sm">No history yet.</p>'
      : top5.map((r, i) => `
        <div class="flex justify-between items-center p-3 rounded-xl bg-white/3 border border-white/5">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-neutral-600 w-5">#${i+1}</span>
            <span class="font-bold text-lg" style="color:var(--accent)">${r.wpm}</span>
            <span class="text-xs text-neutral-500">WPM</span>
          </div>
          <div class="flex gap-3 text-xs text-neutral-500">
            <span>${r.accuracy}% acc</span>
            <span>${r.raw} raw</span>
            <span>${new Date(r.date).toLocaleDateString()}</span>
          </div>
        </div>`).join('');
  }

  renderHistory() {
    const { history } = StorageManager.getStats();
    document.getElementById('history-list').innerHTML = history.length === 0
      ? '<p class="text-neutral-600 text-sm text-center py-4">No history yet. Complete a test to see results here.</p>'
      : history.slice(0, 50).map((r, i) => `
        <div class="flex justify-between items-center p-3 rounded-xl bg-white/3 border border-white/5 text-sm">
          <div class="flex items-center gap-3">
            <span class="font-bold text-base" style="color:var(--accent)">${r.wpm} WPM</span>
            <span class="text-neutral-500">${r.accuracy}% acc</span>
            <span class="text-neutral-600">${r.raw} raw</span>
          </div>
          <div class="text-xs text-neutral-600">${new Date(r.date).toLocaleString()}</div>
        </div>`).join('');
  }

  renderChart(wpmData, rawData) {
    const container = document.getElementById('wpm-chart-container');
    const W = container.clientWidth || 400;
    const H = 128;
    const m = { t: 10, r: 10, b: 28, l: 36 };
    const w = W - m.l - m.r;
    const h = H - m.t - m.b;

    d3.select('#wpm-chart').selectAll('*').remove();
    const svg = d3.select('#wpm-chart')
      .attr('width', W).attr('height', H)
      .append('g').attr('transform', `translate(${m.l},${m.t})`);

    const allVals = [...wpmData, ...rawData].map(d => d.value);
    const maxTime = d3.max(wpmData, d => d.time) || 1;
    const maxVal = d3.max(allVals) * 1.2 || 100;

    const x = d3.scaleLinear().domain([0, maxTime]).range([0, w]);
    const y = d3.scaleLinear().domain([0, maxVal]).range([h, 0]);

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00ff87';

    // Area fill
    const area = d3.area().x(d => x(d.time)).y0(h).y1(d => y(d.value)).curve(d3.curveMonotoneX);
    svg.append('path').datum(wpmData).attr('fill', accent).attr('opacity', 0.1).attr('d', area);

    // Lines
    const line = d3.line().x(d => x(d.time)).y(d => y(d.value)).curve(d3.curveMonotoneX);
    svg.append('path').datum(rawData).attr('fill','none').attr('stroke','#444').attr('stroke-width',1.5).attr('stroke-dasharray','4,3').attr('d', line);
    svg.append('path').datum(wpmData).attr('fill','none').attr('stroke',accent).attr('stroke-width',2.5).attr('d', line);

    // Axes
    svg.append('g').attr('transform',`translate(0,${h})`).call(d3.axisBottom(x).ticks(5).tickFormat(d=>`${d}s`))
      .selectAll('text,line,path').attr('stroke','#333').attr('fill','#555').attr('font-size','10');
    svg.append('g').call(d3.axisLeft(y).ticks(4))
      .selectAll('text,line,path').attr('stroke','#333').attr('fill','#555').attr('font-size','10');
  }
}

// ===================== INIT =====================
window.addEventListener('DOMContentLoaded', () => {
  const sound = new SoundManager();
  const engine = new TypingEngine();
  const ui = new UIController(engine, sound);

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('✅ Offline ready'))
      .catch(e => console.warn('SW:', e));
  }

  // Prevent accidental page leave during test
  window.addEventListener('beforeunload', e => {
    if (engine.state.isActive) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
});
