// ── DATA ──────────────────────────────────────────────────────────
const ALERTS = [
  {id:1,title:'Flood — Patna District',loc:'Bihar · 12km radius',time:'2m ago',sev:'critical',type:'flood'},
  {id:2,title:'Fire — Surat Textile Market',loc:'Gujarat · Industrial Zone',time:'8m ago',sev:'critical',type:'fire'},
  {id:3,title:'Medical Shortage — Jaipur',loc:'Rajasthan · District 4',time:'15m ago',sev:'high',type:'medical'},
  {id:4,title:'Landslide — Uttarakhand NH7',loc:'Uttarakhand · Highway',time:'23m ago',sev:'high',type:'flood'},
  {id:5,title:'Cyclone Warning — Odisha Coast',loc:'Odisha · Coastal Belt',time:'31m ago',sev:'medium',type:'flood'},
  {id:6,title:'Heatwave — Vidarbha Region',loc:'Maharashtra · 6 districts',time:'1h ago',sev:'medium',type:'medical'},
  {id:7,title:'Gas Leak — Chennai Industrial',loc:'Tamil Nadu · Zone 3',time:'2h ago',sev:'high',type:'fire'},
];

const RESOURCES = [
  {name:'Water Bottles',cat:'food',icon:'💧',qty:8400,unit:'litres',loc:'Delhi Warehouse 3',status:'ok'},
  {name:'First Aid Kits',cat:'medical',icon:'🩺',qty:320,unit:'units',loc:'Mumbai Medical Hub',status:'ok'},
  {name:'Relief Tents',cat:'shelter',icon:'⛺',qty:180,unit:'units',loc:'Patna Relief Camp',status:'low'},
  {name:'Rescue Boats',cat:'rescue',icon:'🚤',qty:12,unit:'boats',loc:'Bhubaneswar Depot',status:'critical'},
  {name:'Food Packets',cat:'food',icon:'🍱',qty:15200,unit:'packets',loc:'Jaipur Distribution',status:'ok'},
  {name:'Oxygen Cylinders',cat:'medical',icon:'🫁',qty:45,unit:'cylinders',loc:'Chennai Hospital',status:'critical'},
  {name:'Blankets',cat:'shelter',icon:'🛏️',qty:2100,unit:'pieces',loc:'Lucknow Store',status:'ok'},
  {name:'Search Lights',cat:'rescue',icon:'🔦',qty:88,unit:'units',loc:'Dehradun Base',status:'low'},
];

const VOLUNTEERS = [
  {name:'Arjun Sharma',loc:'Delhi',pts:2840,tasks:127,avatar:'AS'},
  {name:'Priya Mehta',loc:'Mumbai',pts:2610,tasks:118,avatar:'PM'},
  {name:'Rahul Nair',loc:'Kerala',pts:2390,tasks:104,avatar:'RN'},
  {name:'Sunita Rao',loc:'Hyderabad',pts:2105,tasks:95,avatar:'SR'},
  {name:'Vikram Singh',loc:'Jaipur',pts:1980,tasks:89,avatar:'VS'},
  {name:'Anika Patel',loc:'Ahmedabad',pts:1745,tasks:78,avatar:'AP'},
];

const ACTIVITY = [
  {text:'Arjun Sharma completed Task #2847 — Water distribution Patna',time:'2m ago',color:'#2ed573'},
  {text:'New crisis zone registered — Cyclone warning Odisha coast',time:'8m ago',color:'#FF6B35'},
  {text:'500 food packets dispatched to Uttarakhand relief camp',time:'15m ago',color:'#1e90ff'},
  {text:'Priya Mehta verified 12 resource deliveries — Trust Score updated',time:'22m ago',color:'#a855f7'},
  {text:'Medical team deployed to Jaipur District 4',time:'34m ago',color:'#2ed573'},
  {text:'Blockchain ledger entry #8821 locked — Surat fire response',time:'51m ago',color:'#ffa502'},
  {text:'Voice-to-Task: 3 tasks auto-generated from field report',time:'1h ago',color:'#a855f7'},
];

const HOTSPOTS = [
  {cx:200,cy:150,r:18,sev:'critical',type:'flood',label:'Delhi'},
  {cx:155,cy:258,r:22,sev:'critical',type:'fire',label:'Mumbai'},
  {cx:300,cy:288,r:16,sev:'high',type:'flood',label:'Kolkata'},
  {cx:237,cy:383,r:14,sev:'high',type:'medical',label:'Chennai'},
  {cx:211,cy:312,r:12,sev:'medium',type:'medical',label:'Hyd'},
  {cx:170,cy:220,r:15,sev:'high',type:'flood',label:'Ahmd'},
  {cx:245,cy:110,r:10,sev:'medium',type:'fire',label:'Dehra'},
];

const SEV_COLORS = {critical:'#ff4757',high:'#FF6B35',medium:'#ffa502'};
const VOICE_SCENARIOS = {
  'Flood in Patna — 200 families displaced, need food and water urgently':[
    {p:'CRITICAL',text:'Deploy emergency water tankers (10,000L) to Patna North',cat:'Logistics'},
    {p:'HIGH',text:'Set up temporary shelter for 200+ displaced families',cat:'Shelter'},
    {p:'HIGH',text:'Coordinate food packet distribution — 800 units required',cat:'Food'},
    {p:'MEDIUM',text:'Medical screening camp for displaced population',cat:'Medical'},
  ],
  'Medical camp needed at Jaipur district 4, running low on medicines and bandages':[
    {p:'CRITICAL',text:'Emergency medicine resupply to Jaipur District 4 clinic',cat:'Medical'},
    {p:'HIGH',text:'Deploy 2 paramedic teams with full trauma kits',cat:'Medical'},
    {p:'MEDIUM',text:'Inventory audit — bandages and antiseptics priority',cat:'Logistics'},
  ],
  'Fire at Surat textile market, rescue team required, 50 trapped workers':[
    {p:'CRITICAL',text:'Dispatch fire rescue team — 50 workers trapped',cat:'Rescue'},
    {p:'CRITICAL',text:'Coordinate with local fire brigade — Surat Zone 2',cat:'Rescue'},
    {p:'HIGH',text:'Ambulances on standby — anticipated casualties',cat:'Medical'},
    {p:'HIGH',text:'Evacuate 200m radius of textile market',cat:'Evacuation'},
  ],
};

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderAlerts();
  renderHotspots('all');
  renderResources('all','');
  renderLeaderboard();
  renderActivity();
  startClock();
  startLiveCounters();
});

// ── CLOCK ──────────────────────────────────────────────────────────
function startClock() {
  const el = document.getElementById('timeDisplay');
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }
  tick(); setInterval(tick,1000);
}

// ── LIVE COUNTERS ──────────────────────────────────────────────────
function startLiveCounters() {
  setInterval(()=>{
    const delta = Math.random()<0.5?1:-1;
    const v = parseInt(document.getElementById('volCount').textContent.replace(',',''))+delta;
    document.getElementById('volCount').textContent = v.toLocaleString();
  },4000);
}

// ── TAB SWITCHING ──────────────────────────────────────────────────
const TAB_TITLES = {
  dashboard:{title:'Seva Dashboard',sub:'Real-time crisis heatmap powered by Maps JS API'},
  registry:{title:'Resource Registry',sub:'Track and manage crisis resources across India'},
  voice:{title:'Voice-to-Task AI',sub:'Gemini Multimodal converts speech to actionable tasks'},
  sevaai:{title:'SevaGrid AI Command Center',sub:'Local Brain + Gemini Flash-Lite — minimum network, maximum accuracy'},
  ledger:{title:'Trust Ledger',sub:'Blockchain-inspired volunteer accountability system'},
};
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(a=>a.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('pageTitle').textContent = TAB_TITLES[tab].title;
  document.getElementById('pageSubtitle').textContent = TAB_TITLES[tab].sub;
}

// ── MAP ──────────────────────────────────────────────────────────
function renderHotspots(filter) {
  const g = document.getElementById('hotspots');
  g.innerHTML = '';
  HOTSPOTS.filter(h=>filter==='all'||h.type===filter).forEach(h=>{
    const color = SEV_COLORS[h.sev];
    g.innerHTML += `
      <circle cx="${h.cx}" cy="${h.cy}" r="${h.r+8}" fill="${color}" opacity="0.15"/>
      <circle cx="${h.cx}" cy="${h.cy}" r="${h.r}" fill="${color}" opacity="0.7" filter="url(#glow)" class="hotspot-pulse"/>
      <circle cx="${h.cx}" cy="${h.cy}" r="4" fill="white" opacity="0.9"/>
    `;
  });
}
function filterMap(type) {
  document.querySelectorAll('.card-actions .chip').forEach(c=>c.classList.remove('active'));
  event.target.classList.add('active');
  renderHotspots(type);
}

// ── ALERTS ──────────────────────────────────────────────────────────
function renderAlerts() {
  document.getElementById('alertsList').innerHTML = ALERTS.map(a=>`
    <div class="alert-item">
      <div class="alert-top">
        <span class="alert-sev ${a.sev}"></span>
        <span class="alert-title">${a.title}</span>
        <span class="alert-time">${a.time}</span>
      </div>
      <div class="alert-loc">📍 ${a.loc}</div>
    </div>
  `).join('');
}

// ── RESOURCES ──────────────────────────────────────────────────────
function renderResources(cat, query) {
  const data = RESOURCES.filter(r=>(cat==='all'||r.cat===cat)&&r.name.toLowerCase().includes(query.toLowerCase()));
  document.getElementById('resourceGrid').innerHTML = data.map(r=>`
    <div class="resource-card">
      <div class="rc-header">
        <div class="rc-icon">${r.icon}</div>
        <div>
          <div class="rc-name">${r.name}</div>
          <div class="rc-cat">${r.cat}</div>
        </div>
      </div>
      <div class="rc-stats">
        <div class="rc-stat"><div class="rc-stat-val">${r.qty.toLocaleString()}</div><div class="rc-stat-lab">${r.unit}</div></div>
        <div class="rc-stat"><div class="rc-stat-val" style="font-size:11px;margin-top:2px">${r.loc}</div><div class="rc-stat-lab">Location</div></div>
      </div>
      <div class="rc-status ${r.status}">${r.status==='ok'?'✓ Sufficient':r.status==='low'?'⚠ Running Low':'✕ Critical'}</div>
    </div>
  `).join('');
}
function filterResources() {
  renderResources(document.getElementById('categoryFilter').value, document.getElementById('resourceSearch').value);
}
function openAddResource() { document.getElementById('addResourceModal').classList.add('open'); }
function closeModal() { document.getElementById('addResourceModal').classList.remove('open'); }
function addResource() {
  const name = document.getElementById('resName').value.trim();
  const cat = document.getElementById('resCat').value;
  const qty = parseInt(document.getElementById('resQty').value)||0;
  const loc = document.getElementById('resLoc').value.trim();
  if(!name||!loc) return;
  RESOURCES.unshift({name,cat,icon:'📦',qty,unit:'units',loc,status:'ok'});
  closeModal();
  filterResources();
  document.getElementById('resName').value='';
  document.getElementById('resQty').value='';
  document.getElementById('resLoc').value='';
}

// ── VOICE ──────────────────────────────────────────────────────────
let listening = false;
function toggleVoice() {
  listening = !listening;
  const btn = document.getElementById('micBtn');
  const status = document.getElementById('voiceStatus');
  const rings = document.querySelectorAll('.viz-ring');
  btn.classList.toggle('listening', listening);
  rings.forEach(r=>r.classList.toggle('active', listening));
  status.textContent = listening ? '🎙️ Listening... speak now' : 'Tap to speak a crisis update';
  if(!listening) {
    status.textContent = 'Processing with Gemini...';
    setTimeout(()=>{ status.textContent = 'Tap to speak a crisis update'; }, 1500);
  }
}
async function simulateVoice(text) {
  const transcript = document.getElementById('transcriptBox');
  const tasks      = document.getElementById('generatedTasks');
  const status     = document.getElementById('voiceStatus');
  transcript.innerHTML = `<div class="transcript-text">"${text}"</div>`;
  tasks.innerHTML      = '<div class="transcript-placeholder">⚡ SevaGrid AI processing...</div>';
  status.textContent   = '🧠 Analysing with SevaGrid AI...';

  const result = await window.SevaAI.analyzeVoice(text, RESOURCES);
  const pColors = {CRITICAL:'#ff4757',HIGH:'#FF6B35',MEDIUM:'#ffa502'};
  const srcBadge = result.source === 'gemini'
    ? '<span style="color:#a855f7;font-size:10px;">[✨ Gemini]</span>'
    : '<span style="color:#2ed573;font-size:10px;">[🧠 Local]</span>';

  tasks.innerHTML = result.tasks.map(t => `
    <div class="task-item">
      <span class="task-priority" style="background:${pColors[t.p]};box-shadow:0 0 6px ${pColors[t.p]}60"></span>
      <div>
        <div class="task-text">${t.icon || ''} ${t.text}</div>
        <div class="task-meta">${t.p} · ${t.cat} · ${srcBadge}</div>
      </div>
    </div>
  `).join('');

  if (result.resourceMatches?.length) {
    tasks.innerHTML += `<div class="task-resource-hint">📌 Relevant resources: ${result.resourceMatches.map(r=>`<strong>${r.name}</strong> (${r.status})`).join(', ')}</div>`;
  }
  status.textContent = `✅ ${result.tasks.length} tasks generated · Source: ${result.source}`;
  aiNetworkCounter(result.source);
}

// ── LEADERBOARD ──────────────────────────────────────────────────────
function renderLeaderboard() {
  const ranks = ['🥇','🥈','🥉'];
  const rankClass = ['gold','silver','bronze'];
  document.getElementById('leaderboardList').innerHTML = VOLUNTEERS.map((v,i)=>`
    <div class="lb-item">
      <div class="lb-rank ${rankClass[i]||''}">${i<3?ranks[i]:i+1}</div>
      <div class="lb-avatar">${v.avatar}</div>
      <div class="lb-info">
        <div class="lb-name">${v.name}</div>
        <div class="lb-loc">📍 ${v.loc} · ${v.tasks} tasks</div>
      </div>
      <div>
        <div class="lb-points">${v.pts.toLocaleString()}</div>
        <div class="lb-pts-label">Seva Pts</div>
      </div>
    </div>
  `).join('');
}

// ── ACTIVITY ──────────────────────────────────────────────────────
function renderActivity() {
  document.getElementById('activityLog').innerHTML = ACTIVITY.map(a=>`
    <div class="activity-item">
      <span class="act-dot" style="background:${a.color};box-shadow:0 0 6px ${a.color}70"></span>
      <div>
        <div class="act-text">${a.text}</div>
        <div class="act-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

// ── AI TAB ────────────────────────────────────────────────────────
let _networkCalls = 0;
let _cacheHits    = 0;

function aiNetworkCounter(source) {
  if (source === 'gemini') { _networkCalls++; document.getElementById('aiNetworkCalls').textContent = _networkCalls; }
  else                     { _cacheHits++;    document.getElementById('aiCacheHits').textContent    = _cacheHits;    }
}

// ── API Key Modal ─────────────────────────────────────────────────
function openKeyModal()  { document.getElementById('apiKeyModal').classList.add('open'); }
function closeKeyModal() { document.getElementById('apiKeyModal').classList.remove('open'); }
function dismissKeyBar() {
  document.getElementById('aiKeyBar').style.display = 'none';
  updateAiModePill();
}
function saveApiKey() {
  const k = document.getElementById('geminiKeyInput').value.trim();
  if (!k) return;
  window.SevaAI.gemini.setKey(k);
  closeKeyModal();
  document.getElementById('aiKeyBar').style.display = 'none';
  updateAiModePill();
  refreshBrief();
  renderRiskZones();
}
function updateAiModePill() {
  const pill = document.getElementById('aiModePill');
  if (window.SevaAI.gemini.hasKey()) {
    pill.textContent = '⚡ Hybrid Mode (Local + Gemini)';
    pill.style.background = 'rgba(168,85,247,0.2)';
    pill.style.borderColor = 'rgba(168,85,247,0.5)';
  } else {
    pill.textContent = '🧠 Local Brain Active';
  }
}

// ── Crisis Intelligence Brief ─────────────────────────────────────
async function refreshBrief() {
  const el = document.getElementById('aiBriefContent');
  el.innerHTML = '<div class="ai-brief-loading">🧠 Analysing situation...</div>';
  const brief = await window.SevaAI.getCrisisBrief(ALERTS, RESOURCES);
  const riskColor = { CRITICAL: '#ff4757', HIGH: '#FF6B35', MEDIUM: '#ffa502' }[brief.overallRisk] || '#ffa502';
  document.getElementById('aiRiskPill').textContent = `Risk Level: ${brief.overallRisk}`;
  document.getElementById('aiRiskPill').style.color = riskColor;

  el.innerHTML = `
    <div class="brief-risk" style="color:${riskColor}">
      <span class="brief-risk-dot" style="background:${riskColor}"></span>
      Overall: ${brief.overallRisk}
    </div>
    <div class="brief-narrative">${brief.narrative}</div>
    <div class="brief-priorities">
      ${brief.priorities.map(p => `<div class="brief-priority-item">▸ ${p}</div>`).join('')}
    </div>
    <div class="brief-counts">
      <span class="brief-badge critical">${brief.bySev.critical} Critical</span>
      <span class="brief-badge high">${brief.bySev.high} High</span>
      <span class="brief-badge medium">${brief.bySev.medium} Medium</span>
    </div>
  `;
}

// ── Risk Zones ────────────────────────────────────────────────────
async function renderRiskZones() {
  const el = document.getElementById('aiRiskZones');
  el.innerHTML = '<div class="ai-brief-loading">Scoring zones...</div>';
  const scores = await Promise.all(
    HOTSPOTS.map(h => window.SevaAI.scoreZone(h, RESOURCES))
  );
  scores.sort((a, b) => b.score - a.score);
  el.innerHTML = scores.map(s => {
    const color = s.score >= 70 ? '#ff4757' : s.score >= 50 ? '#FF6B35' : '#ffa502';
    const pct   = s.score;
    return `
      <div class="risk-zone-item">
        <div class="rz-header">
          <span class="rz-label">${s.label}</span>
          <span class="rz-score" style="color:${color}">${s.score}/100</span>
        </div>
        <div class="rz-bar-track"><div class="rz-bar-fill" style="width:${pct}%;background:${color}"></div></div>
        <div class="rz-reasoning">${s.reasoning}</div>
      </div>
    `;
  }).join('');
}

// ── Resource Optimizer ────────────────────────────────────────────
async function runOptimizer() {
  const el = document.getElementById('aiOptOutput');
  el.innerHTML = '<div class="ai-brief-loading">🧠 Optimising allocations...</div>';
  const recs = await window.SevaAI.optimizeResources(ALERTS, RESOURCES);
  el.innerHTML = recs.map(r => {
    if (r.geminiAdvice) return `<div class="opt-gemini-note">✨ ${r.geminiAdvice}</div>`;
    return `
      <div class="opt-rec-item">
        <div class="opt-rec-alert">🚨 ${r.alert}</div>
        ${r.suggested.map(s => `
          <div class="opt-rec-supply">
            → Send <strong>${s.qty} ${s.unit}</strong> of ${s.name}
            from ${s.from}
            <span class="opt-urgency ${s.urgency}">${s.urgency}</span>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

// ── AI Chat ───────────────────────────────────────────────────────
function _buildContext() {
  const alertSummary    = `${ALERTS.length} active alerts. Critical: ${ALERTS.filter(a=>a.sev==='critical').map(a=>a.title).join(', ')}.`;
  const resourceSummary = `Resources critical: ${RESOURCES.filter(r=>r.status==='critical').map(r=>r.name).join(', ')}.`;
  const criticalResources = RESOURCES.filter(r=>r.status==='critical').map(r=>r.name).join(', ');
  return { alertSummary, resourceSummary, criticalResources };
}

function appendChatMsg(role, text, source) {
  const box = document.getElementById('aiChatMessages');
  const src  = source === 'gemini' ? ' <span style="color:#a855f7;font-size:10px">[✨ Gemini]</span>' : ' <span style="color:#2ed573;font-size:10px">[🧠 Local]</span>';
  const bubble = document.createElement('div');
  bubble.className = `ai-msg ${role}`;
  bubble.innerHTML = role === 'assistant'
    ? `<div class="ai-msg-avatar">🧠</div><div class="ai-msg-bubble">${text}${src}</div>`
    : `<div class="ai-msg-bubble user-bubble">${text}</div>`;
  box.appendChild(bubble);
  box.scrollTop = box.scrollHeight;
}

function appendTypingIndicator() {
  const box = document.getElementById('aiChatMessages');
  const el  = document.createElement('div');
  el.className = 'ai-msg assistant'; el.id = 'typingIndicator';
  el.innerHTML = '<div class="ai-msg-avatar">🧠</div><div class="ai-msg-bubble ai-typing"><span></span><span></span><span></span></div>';
  box.appendChild(el); box.scrollTop = box.scrollHeight;
}
function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function sendAiChat() {
  const input = document.getElementById('aiChatInput');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  document.getElementById('aiSendBtn').disabled = true;
  appendChatMsg('user', msg, '');
  appendTypingIndicator();
  const reply = await window.SevaAI.chat(msg, _buildContext());
  removeTypingIndicator();
  appendChatMsg('assistant', reply.text, reply.source);
  aiNetworkCounter(reply.source);
  document.getElementById('aiSendBtn').disabled = false;
  input.focus();
}

function aiQuickPrompt(text) {
  document.getElementById('aiChatInput').value = text;
  sendAiChat();
}

// ── Init AI tab when first visited ───────────────────────────────
let _aiTabInited = false;
const _origSwitchTab = switchTab;
window.switchTab = function(tab) {
  _origSwitchTab(tab);
  if (tab === 'sevaai' && !_aiTabInited) {
    _aiTabInited = true;
    refreshBrief();
    renderRiskZones();
    if (!window.SevaAI.gemini.hasKey()) {
      document.getElementById('aiKeyBar').style.display = 'flex';
    }
  }
};
