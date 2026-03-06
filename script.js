// Using CDN globals: lucide, d3, confetti

// --- Constants & Assets ---
const WORDS_LIST = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "is", "am", "are", "was", "were", "been", "being", "has", "had", "did", "does", "done", "doing", "said", "says", "going", "went", "gone", "comes", "came", "looks", "looked", "thinks", "thought", "takes", "took", "taken", "gives", "gave", "given", "find", "found", "tell", "told", "ask", "asked", "seem", "seemed", "feel", "felt", "try", "tried", "leave", "left", "call", "called"
];

const SENTENCES_LIST = [
  "The quick brown fox jumps over the lazy dog.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "In the middle of every difficulty lies opportunity.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you've ever wanted is on the other side of fear.",
  "Your time is limited, so don't waste it living someone else's life.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "Life is what happens when you're busy making other plans.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall."
];

const KEYBOARD_LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", " ", "Backspace", "Enter"]
];

// --- Sound System ---
class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
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

    if (type === 'space') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gain.gain.setValueAtTime(this.volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'backspace') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'enter') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + Math.random() * 100, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  }
}

// --- Persistence ---
class StorageManager {
  static saveResult(result) {
    const history = JSON.parse(localStorage.getItem('typing_history') || '[]');
    history.push({ ...result, date: new Date().toISOString() });
    localStorage.setItem('typing_history', JSON.stringify(history));
    
    const pb = localStorage.getItem('personal_best') || 0;
    if (result.wpm > pb) {
      localStorage.setItem('personal_best', result.wpm);
    }

    // Update XP and Level
    let xp = parseInt(localStorage.getItem('user_xp') || '0');
    xp += result.xp;
    localStorage.setItem('user_xp', xp.toString());
    
    // Streak logic
    let streak = parseInt(localStorage.getItem('user_streak') || '0');
    const lastDate = localStorage.getItem('last_test_date');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      streak++;
      localStorage.setItem('user_streak', streak.toString());
      localStorage.setItem('last_test_date', today);
    }
    // Daily challenge logic
    let dailyTests = parseInt(localStorage.getItem('daily_tests') || '0');
    const lastTestDate = localStorage.getItem('last_test_date_full');
    const todayFull = new Date().toDateString();
    if (lastTestDate !== todayFull) {
      dailyTests = 1;
      localStorage.setItem('last_test_date_full', todayFull);
    } else {
      dailyTests++;
    }
    localStorage.setItem('daily_tests', dailyTests.toString());
  }

  static getStats() {
    return {
      pb: localStorage.getItem('personal_best') || 0,
      xp: parseInt(localStorage.getItem('user_xp') || '0'),
      streak: parseInt(localStorage.getItem('user_streak') || '0'),
      dailyTests: parseInt(localStorage.getItem('daily_tests') || '0'),
      history: JSON.parse(localStorage.getItem('typing_history') || '[]')
    };
  }
}

// --- Typing Engine ---
class TypingEngine {
  constructor() {
    this.state = {
      mode: 'words',
      timeLimit: 30,
      timeLeft: 30,
      isActive: false,
      isFinished: false,
      text: '',
      userInput: '',
      currentIndex: 0,
      errors: 0,
      startTime: null,
      wpmHistory: []
    };
    
    this.timerInterval = null;
    this.onUpdate = null;
    this.onFinish = null;
  }

  reset(mode, timeLimit) {
    this.state.mode = mode || this.state.mode;
    this.state.timeLimit = timeLimit || this.state.timeLimit;
    this.state.timeLeft = this.state.timeLimit;
    this.state.isActive = false;
    this.state.isFinished = false;
    this.state.userInput = '';
    this.state.currentIndex = 0;
    this.state.errors = 0;
    this.state.startTime = null;
    this.state.wpmHistory = [];
    this.generateText();
    
    const container = document.getElementById('typing-container');
    if (container) {
      container.classList.remove('opacity-0', 'scale-95', 'blur-md');
    }
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.onUpdate) this.onUpdate(this.state);
  }

  generateText() {
    if (this.state.mode === 'words') {
      const shuffled = [...WORDS_LIST].sort(() => 0.5 - Math.random());
      this.state.text = shuffled.slice(0, 100).join(' ');
    } else if (this.state.mode === 'sentences') {
      const shuffled = [...SENTENCES_LIST].sort(() => 0.5 - Math.random());
      this.state.text = shuffled.slice(0, 5).join(' ');
    } else if (this.state.mode === 'custom') {
      // Custom text is handled by setting this.state.text directly
    } else {
      const shuffled = [...SENTENCES_LIST].sort(() => 0.5 - Math.random());
      this.state.text = shuffled.slice(0, 10).join(' ');
    }
  }

  start() {
    if (this.state.isActive) return;
    this.state.isActive = true;
    this.state.startTime = Date.now();
    
    this.timerInterval = setInterval(() => {
      this.state.timeLeft--;
      
      const elapsedMinutes = (Date.now() - this.state.startTime) / 60000;
      const wpm = Math.round((this.state.userInput.length / 5) / elapsedMinutes) || 0;
      this.state.wpmHistory.push({ time: this.state.timeLimit - this.state.timeLeft, value: wpm });

      if (this.state.timeLeft <= 0) {
        this.finish();
      }
      if (this.onUpdate) this.onUpdate(this.state);
    }, 1000);
  }

  handleInput(char) {
    if (this.state.isFinished) return;
    if (!this.state.isActive) this.start();

    const targetChar = this.state.text[this.state.currentIndex];
    
    // Track key usage
    const keyUsage = JSON.parse(localStorage.getItem('key_usage') || '{}');
    keyUsage[char.toLowerCase()] = (keyUsage[char.toLowerCase()] || 0) + 1;
    localStorage.setItem('key_usage', JSON.stringify(keyUsage));

    if (char !== targetChar) {
      this.state.errors++;
    }
    
    this.state.userInput += char;
    this.state.currentIndex++;

    if (this.state.currentIndex >= this.state.text.length) {
      this.finish();
    }

    if (this.onUpdate) this.onUpdate(this.state);
  }

  handleBackspace() {
    if (this.state.currentIndex > 0 && !this.state.isFinished) {
      this.state.userInput = this.state.userInput.slice(0, -1);
      this.state.currentIndex--;
      if (this.onUpdate) this.onUpdate(this.state);
    }
  }

  finish() {
    if (this.state.isFinished) return;
    this.state.isActive = false;
    this.state.isFinished = true;
    clearInterval(this.timerInterval);
    
    document.getElementById('typing-container').classList.add('opacity-0', 'scale-95', 'blur-md');
    
    const elapsedSeconds = (Date.now() - this.state.startTime) / 1000;
    const elapsedMinutes = elapsedSeconds / 60;
    const wpm = Math.round((this.state.userInput.length / 5) / elapsedMinutes) || 0;
    const cpm = Math.round(this.state.userInput.length / elapsedMinutes) || 0;
    const accuracy = Math.round(((this.state.userInput.length - this.state.errors) / this.state.userInput.length) * 100) || 0;
    const xp = Math.round(wpm * (accuracy / 100) * (elapsedSeconds / 10));

    const result = {
      wpm,
      cpm,
      accuracy,
      errors: this.state.errors,
      time: Math.round(elapsedSeconds),
      chars: this.state.userInput.length,
      xp,
      wpmHistory: this.state.wpmHistory
    };

    StorageManager.saveResult(result);
    if (this.onFinish) this.onFinish(result);
  }
}

// --- UI Controller ---
class UIController {
  constructor(engine, sound) {
    this.engine = engine;
    this.sound = sound;
    this.elements = {
      typingContainer: document.getElementById('typing-container'),
      typingInput: document.getElementById('typing-input'),
      liveWpm: document.getElementById('live-wpm'),
      liveAccuracy: document.getElementById('live-accuracy'),
      liveTimer: document.getElementById('live-timer'),
      liveStats: document.getElementById('live-stats'),
      progressBar: document.getElementById('progress-bar'),
      resultsModal: document.getElementById('results-modal'),
      settingsDrawer: document.getElementById('settings-drawer'),
      visualKeyboard: document.getElementById('visual-keyboard'),
      focusOverlay: document.getElementById('focus-overlay'),
      streakCount: document.getElementById('streak-count'),
      userLevel: document.getElementById('user-level')
    };

    this.init();
  }

  init() {
    lucide.createIcons();

    this.renderKeyboard();
    this.setupEventListeners();
    this.loadUserData();
    
    this.engine.onUpdate = (state) => this.updateUI(state);
    this.engine.onFinish = (result) => this.showResults(result);
    
    this.engine.reset();
    this.elements.typingInput.focus();
  }

  loadUserData() {
    const stats = StorageManager.getStats();
    this.elements.streakCount.textContent = stats.streak;
    const level = Math.floor(Math.sqrt(stats.xp / 100)) + 1;
    this.elements.userLevel.textContent = `Lvl ${level}`;
    
    const dailyGoalEl = document.getElementById('daily-goal');
    if (dailyGoalEl) {
      dailyGoalEl.textContent = `${stats.dailyTests}/5`;
      if (stats.dailyTests >= 5) {
        dailyGoalEl.classList.add('text-emerald-500');
      }
    }
  }

  renderKeyboard() {
    const keyUsage = JSON.parse(localStorage.getItem('key_usage') || '{}');
    const maxUsage = Math.max(...Object.values(keyUsage), 1);

    this.elements.visualKeyboard.innerHTML = KEYBOARD_LAYOUT.map(row => `
      <div class="flex justify-center gap-1">
        ${row.map(key => {
          let width = 'w-10';
          if (key === ' ') width = 'w-48';
          if (key === 'Backspace') width = 'w-20';
          if (key === 'Enter') width = 'w-20';
          
          const usage = keyUsage[key.toLowerCase()] || 0;
          const intensity = usage / maxUsage;
          const bgStyle = intensity > 0 ? `style="background-color: rgba(16, 185, 129, ${intensity * 0.3})"` : '';
          
          return `<div class="key ${width} h-10 flex items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700 text-[10px] font-bold uppercase transition-all duration-100" data-key="${key}" ${bgStyle}>${key === ' ' ? 'Space' : key}</div>`;
        }).join('')}
      </div>
    `).join('');
  }

  setupEventListeners() {
    this.elements.typingInput.addEventListener('keydown', (e) => {
      this.sound.init(); // ensure AudioContext is ready on first interaction
      if (e.key === 'Escape') {
        this.engine.reset();
        return;
      }
      
      if (e.key === 'Backspace') {
        this.sound.playKey('backspace');
        this.engine.handleBackspace();
        this.highlightKey('Backspace');
        return;
      }

      if (e.key === 'Enter') {
        this.sound.playKey('enter');
        this.highlightKey('Enter');
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        this.elements.typingInput.focus();
        return;
      }

      if (e.key.length === 1) {
        const type = e.key === ' ' ? 'space' : 'default';
        this.sound.playKey(type);
        this.engine.handleInput(e.key);
        this.highlightKey(e.key);
      }
    });

    this.elements.typingInput.addEventListener('blur', () => {
      if (!this.engine.state.isFinished) {
        this.elements.focusOverlay.classList.remove('opacity-0', 'pointer-events-none');
      }
    });
    
    this.elements.focusOverlay.addEventListener('click', () => {
      this.elements.typingInput.focus();
      this.elements.focusOverlay.classList.add('opacity-0', 'pointer-events-none');
    });

    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active', 'text-emerald-500'));
        btn.classList.add('active', 'text-emerald-500');
        this.engine.reset(btn.dataset.mode);
      });
    });

    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.time === 'custom') {
          const val = parseInt(prompt('Enter custom time in seconds:', '45'));
          if (!isNaN(val) && val > 0) {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active', 'text-emerald-500'));
            btn.classList.add('active', 'text-emerald-500');
            btn.textContent = `${val}s`;
            this.engine.reset(null, val);
          }
          return;
        }
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active', 'text-emerald-500'));
        btn.classList.add('active', 'text-emerald-500');
        this.engine.reset(null, parseInt(btn.dataset.time));
      });
    });

    document.getElementById('settings-btn').addEventListener('click', () => {
      this.elements.settingsDrawer.classList.remove('translate-x-full');
    });
    document.getElementById('close-settings-btn').addEventListener('click', () => {
      this.elements.settingsDrawer.classList.add('translate-x-full');
    });

    document.getElementById('sound-toggle').addEventListener('change', (e) => {
      this.sound.enabled = e.target.checked;
      if (this.sound.enabled) this.sound.init();
    });

    document.getElementById('volume-slider').addEventListener('input', (e) => {
      this.sound.volume = e.target.value / 100;
      document.getElementById('volume-value').textContent = `${e.target.value}%`;
    });

    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('ring-2', 'ring-emerald-500'));
        btn.classList.add('ring-2', 'ring-emerald-500');
        
        const theme = btn.dataset.theme;
        document.body.className = 'font-sans selection:bg-emerald-500/30 transition-colors duration-500';
        
        if (theme === 'light') {
          document.body.classList.add('bg-neutral-100', 'text-neutral-900');
          document.getElementById('typing-container').classList.replace('text-neutral-600', 'text-neutral-400');
        } else if (theme === 'emerald') {
          document.body.classList.add('bg-emerald-950', 'text-emerald-100');
        } else {
          document.body.classList.add('bg-neutral-950', 'text-neutral-200');
        }
      });
    });

    document.getElementById('font-family').addEventListener('change', (e) => {
      this.elements.typingContainer.className = `${e.target.value} text-2xl sm:text-3xl leading-relaxed text-neutral-600 break-words select-none transition-all duration-300`;
    });

    document.getElementById('font-size-slider').addEventListener('input', (e) => {
      this.elements.typingContainer.style.fontSize = `${e.target.value}px`;
      document.getElementById('font-size-value').textContent = `${e.target.value}px`;
    });

    document.getElementById('apply-custom-text').addEventListener('click', () => {
      const text = document.getElementById('custom-text-input').value.trim();
      if (text) {
        this.engine.state.mode = 'custom';
        this.engine.state.text = text; // set text first
        this.engine.reset('custom'); // reset will not overwrite text in custom mode
        this.elements.settingsDrawer.classList.add('translate-x-full');
      }
    });

    document.getElementById('zen-mode-toggle').addEventListener('change', (e) => {
      const header = document.querySelector('header');
      const config = document.getElementById('config-bar');
      const keyboard = document.getElementById('visual-keyboard');
      const footer = document.querySelector('footer');
      
      if (e.target.checked) {
        [header, config, keyboard, footer].forEach(el => el.classList.add('opacity-0', 'pointer-events-none'));
      } else {
        [header, config, keyboard, footer].forEach(el => el.classList.remove('opacity-0', 'pointer-events-none'));
      }
    });

    document.getElementById('focus-mode-toggle').addEventListener('change', (e) => {
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      const config = document.getElementById('config-bar');
      
      if (e.target.checked) {
        [header, footer, config].forEach(el => el.classList.add('opacity-20'));
      } else {
        [header, footer, config].forEach(el => el.classList.remove('opacity-20'));
      }
    });

    document.getElementById('share-btn').addEventListener('click', () => {
      const stats = this.engine.state.isFinished ? this.engine.state : null; // Simplified for demo
      const text = `TypingFlow Result: ${document.getElementById('result-wpm').textContent} WPM | ${document.getElementById('result-accuracy').textContent} Accuracy. Can you beat me?`;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('share-btn');
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" class="w-5 h-5 text-emerald-500"></i>';
        setTimeout(() => btn.innerHTML = originalIcon, 2000);
      });
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      this.elements.resultsModal.classList.add('hidden', 'opacity-0');
      this.engine.reset();
      this.elements.typingInput.focus();
    });
    
    document.getElementById('close-results-btn').addEventListener('click', () => {
      this.elements.resultsModal.classList.add('hidden', 'opacity-0');
    });
  }

  highlightKey(key) {
    const keyStr = key === ' ' ? ' ' : key.toLowerCase();
    const keyEl = document.querySelector(`.key[data-key="${keyStr}"]`) || document.querySelector(`.key[data-key="${key}"]`);
    if (keyEl) {
      keyEl.classList.add('bg-emerald-500', 'text-neutral-950', 'scale-95', 'shadow-[0_0_15px_rgba(16,185,129,0.5)]');
      setTimeout(() => keyEl.classList.remove('bg-emerald-500', 'text-neutral-950', 'scale-95', 'shadow-[0_0_15px_rgba(16,185,129,0.5)]'), 100);
    }
  }

  updateUI(state) {
    this.elements.typingContainer.innerHTML = state.text.split('').map((char, i) => {
      let status = 'text-neutral-600';
      if (i < state.currentIndex) {
        status = state.userInput[i] === char ? 'text-neutral-200' : 'text-red-500 border-b-2 border-red-500';
      } else if (i === state.currentIndex) {
        status = 'text-emerald-500 border-l-2 border-emerald-500 animate-pulse';
      }
      return `<span class="${status}">${char}</span>`;
    }).join('');

    if (state.isActive) {
      this.elements.liveStats.classList.remove('opacity-0');
      const elapsedMinutes = (Date.now() - state.startTime) / 60000;
      const wpm = Math.round((state.userInput.length / 5) / elapsedMinutes) || 0;
      const accuracy = Math.round(((state.userInput.length - state.errors) / state.userInput.length) * 100) || 100;
      
      this.elements.liveWpm.textContent = wpm;
      this.elements.liveAccuracy.textContent = `${accuracy}%`;
      this.elements.liveTimer.textContent = state.timeLeft;
      
      const timerCircle = document.getElementById('timer-circle');
      if (timerCircle) {
        const circumference = 2 * Math.PI * 20;
        const offset = circumference - (state.timeLeft / state.timeLimit) * circumference;
        timerCircle.style.strokeDashoffset = offset;
      }
      
      const progress = (state.currentIndex / state.text.length) * 100;
      this.elements.progressBar.style.width = `${progress}%`;
    } else {
      this.elements.liveStats.classList.add('opacity-0');
      this.elements.progressBar.style.width = '0%';
    }
  }

  showResults(result) {
    document.getElementById('result-wpm').textContent = result.wpm;
    document.getElementById('result-cpm').textContent = result.cpm;
    document.getElementById('result-accuracy').textContent = `${result.accuracy}%`;
    document.getElementById('result-errors').textContent = result.errors;
    document.getElementById('result-time').textContent = `${result.time}s`;
    document.getElementById('result-chars').textContent = result.chars;
    document.getElementById('result-date').textContent = new Date().toLocaleDateString();
    document.getElementById('result-xp').textContent = `+${result.xp}`;
    
    const stats = StorageManager.getStats();
    document.getElementById('result-pb').textContent = `${stats.pb} WPM`;

    this.elements.resultsModal.classList.remove('hidden');
    setTimeout(() => this.elements.resultsModal.classList.remove('opacity-0'), 10);

    this.renderChart(result.wpmHistory);
    this.renderLeaderboard();
    this.loadUserData();
    this.renderKeyboard();
    
    if (result.wpm > 40) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669']
      });
    }
  }

  renderLeaderboard() {
    const stats = StorageManager.getStats();
    const top5 = stats.history
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 5);
    
    const container = document.getElementById('leaderboard');
    if (container) {
      container.innerHTML = top5.map((res, i) => `
        <div class="flex justify-between items-center p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-neutral-500 w-4">#${i + 1}</span>
            <span class="font-bold text-neutral-200">${res.wpm} WPM</span>
          </div>
          <div class="flex items-center gap-4 text-xs text-neutral-500">
            <span>${res.accuracy}% Acc</span>
            <span>${new Date(res.date).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('');
    }
  }

  renderChart(data) {
    const container = document.getElementById('wpm-chart-container');
    const width = container.clientWidth;
    const height = 180;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    d3.select("#wpm-chart").selectAll("*").remove();
    
    const svg = d3.select("#wpm-chart")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.time) || 1])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.2 || 100])
      .range([height - margin.top - margin.bottom, 0]);

    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 3)
      .attr("d", line);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}s`))
      .attr("color", "#525252");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#525252");
  }
}

// --- Initialization ---
window.addEventListener('DOMContentLoaded', () => {
  const sound = new SoundManager();
  const engine = new TypingEngine();
  const ui = new UIController(engine, sound);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('✅ Service Worker registered - offline ready!'))
      .catch((err) => console.warn('SW registration failed:', err));
  }
});