/* ═══════════════════════════════════════════════════════════════
   SevaGrid AI Engine  v1.0
   Architecture: Local Brain (zero-network) → Gemini Flash-Lite (fallback)
   ═══════════════════════════════════════════════════════════════ */

// ── GEMINI MICRO CLIENT ───────────────────────────────────────────
class GeminiMicro {
  constructor() {
    this.model  = 'gemini-2.0-flash-lite';
    this.base   = 'https://generativelanguage.googleapis.com/v1beta/models/';
    this.key    = sessionStorage.getItem('seva_api_key') || '';
    this._cache = new Map();
  }

  setKey(k) { this.key = k; sessionStorage.setItem('seva_api_key', k); }
  hasKey()  { return !!this.key; }

  _hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return h;
  }

  async ask(systemPrompt, userMsg, opts = {}) {
    const cacheKey = this._hash(systemPrompt + userMsg);
    if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);
    if (!this.key) return null;

    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMsg }] }],
      generationConfig: {
        temperature: opts.temp ?? 0.3,
        maxOutputTokens: opts.maxTokens ?? 512,
        responseMimeType: opts.json ? 'application/json' : 'text/plain',
      },
    };

    try {
      const res = await fetch(
        `${this.base}${this.model}:generateContent?key=${this.key}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      if (text) this._cache.set(cacheKey, text);
      return text;
    } catch (e) {
      console.warn('[GeminiMicro] Request failed:', e.message);
      return null;
    }
  }
}

// ── LOCAL CRISIS BRAIN ────────────────────────────────────────────
class SevaGridBrain {
  constructor() {
    // Expert-encoded action templates per crisis type & severity
    this._templates = {
      earthquake: {
        critical: [
          { p:'CRITICAL', text:'Deploy NDRF Urban Search & Rescue teams to collapse sites', cat:'Rescue', icon:'🏚️' },
          { p:'CRITICAL', text:'Establish medical triage — expect crush injuries & trauma', cat:'Medical', icon:'🏥' },
          { p:'CRITICAL', text:'Cut gas & electricity supply to damaged zones immediately', cat:'Infrastructure', icon:'⚡' },
          { p:'HIGH',     text:'Evacuate unstable structures within 500m of epicentre', cat:'Evacuation', icon:'📢' },
          { p:'HIGH',     text:'Deploy sniffer dogs & acoustic sensors for survivor detection', cat:'Rescue', icon:'🐕' },
          { p:'MEDIUM',   text:'Assess all bridges & highways — restrict heavy traffic', cat:'Infrastructure', icon:'🌉' },
        ],
        high: [
          { p:'HIGH',   text:'Search & rescue teams to partially collapsed buildings', cat:'Rescue', icon:'🏚️' },
          { p:'HIGH',   text:'Field hospital setup — orthopaedic & trauma surgeons needed', cat:'Medical', icon:'🏥' },
          { p:'MEDIUM', text:'Structural engineers assess building safety — red/green tagging', cat:'Assessment', icon:'🔍' },
          { p:'MEDIUM', text:'Distribute emergency water & rations to displaced families', cat:'Logistics', icon:'🍱' },
        ],
        medium: [
          { p:'MEDIUM', text:'Inspect masonry structures for cracks & instability', cat:'Assessment', icon:'🔍' },
          { p:'MEDIUM', text:'Issue aftershock advisory — keep population in open areas', cat:'Advisory', icon:'📋' },
          { p:'LOW',    text:'Activate temporary shelter at schools & community halls', cat:'Shelter', icon:'⛺' },
        ],
      },
      cyclone: {
        critical: [
          { p:'CRITICAL', text:'Immediate mass evacuation of coastal belt — 0-10km zone', cat:'Evacuation', icon:'🌀' },
          { p:'CRITICAL', text:'Activate all cyclone shelters with food & water for 72 hours', cat:'Shelter', icon:'⛺' },
          { p:'CRITICAL', text:'Secure all boats & fishing vessels at designated harbours', cat:'Infrastructure', icon:'⚓' },
          { p:'HIGH',     text:'Pre-position NDRF & SDRF teams at district HQs', cat:'Rescue', icon:'🚁' },
          { p:'HIGH',     text:'Shut down power grid in high-risk coastal districts', cat:'Infrastructure', icon:'⚡' },
          { p:'MEDIUM',   text:'Coordinate IMD updates every hour to command centre', cat:'Monitoring', icon:'📡' },
        ],
        high: [
          { p:'HIGH',   text:'Evacuate low-lying and flood-prone coastal areas', cat:'Evacuation', icon:'📢' },
          { p:'HIGH',   text:'Stock district relief warehouses with 5-day supplies', cat:'Logistics', icon:'📦' },
          { p:'MEDIUM', text:'Alert fishermen — no sea entry for 48 hours', cat:'Advisory', icon:'⚓' },
          { p:'MEDIUM', text:'Deploy emergency communication teams — satellite phones ready', cat:'Coordination', icon:'📡' },
        ],
        medium: [
          { p:'MEDIUM', text:'Issue cyclone watch advisory to coastal communities', cat:'Advisory', icon:'📋' },
          { p:'LOW',    text:'Secure loose structures & signboards in high-wind zones', cat:'Infrastructure', icon:'🔧' },
        ],
      },
      tsunami: {
        critical: [
          { p:'CRITICAL', text:'IMMEDIATE coastal evacuation — move to high ground above 30m', cat:'Evacuation', icon:'🌊' },
          { p:'CRITICAL', text:'Activate tsunami sirens & mass alert SMS system now', cat:'Warning', icon:'🚨' },
          { p:'CRITICAL', text:'Deploy coast guard for maritime rescue operations', cat:'Rescue', icon:'⚓' },
          { p:'HIGH',     text:'Establish emergency relief camps on elevated ground', cat:'Shelter', icon:'⛺' },
          { p:'HIGH',     text:'Medical teams on standby — drowning & trauma casualties', cat:'Medical', icon:'🏥' },
        ],
        high: [
          { p:'HIGH',   text:'Pre-evacuate coastal zones within 5km of shoreline', cat:'Evacuation', icon:'📢' },
          { p:'HIGH',   text:'Alert all vessels to deep water immediately', cat:'Advisory', icon:'⚓' },
          { p:'MEDIUM', text:'Monitor tide gauges — report anomalies to INCOIS', cat:'Monitoring', icon:'📊' },
        ],
        medium: [
          { p:'MEDIUM', text:'Issue tsunami watch to coastal communities', cat:'Advisory', icon:'📋' },
          { p:'LOW',    text:'Verify evacuation routes are clear & marked', cat:'Infrastructure', icon:'🗺️' },
        ],
      },
      landslide: {
        critical: [
          { p:'CRITICAL', text:'Rescue teams to debris field — survivors may be buried', cat:'Rescue', icon:'⛰️' },
          { p:'CRITICAL', text:'Close NH & SH highways through affected zone immediately', cat:'Infrastructure', icon:'🚧' },
          { p:'CRITICAL', text:'Medical airlift for critically injured — road may be blocked', cat:'Medical', icon:'🚁' },
          { p:'HIGH',     text:'Evacuate villages on unstable slopes within 2km', cat:'Evacuation', icon:'📢' },
          { p:'HIGH',     text:'Heavy machinery for debris clearance — road restoration', cat:'Rescue', icon:'🚛' },
        ],
        high: [
          { p:'HIGH',   text:'Deploy geologists to assess slope stability & risk perimeter', cat:'Assessment', icon:'🔍' },
          { p:'HIGH',   text:'Reroute traffic via alternative highway', cat:'Infrastructure', icon:'🚧' },
          { p:'MEDIUM', text:'Monitor rainfall — secondary slides risk in 24 hours', cat:'Monitoring', icon:'📊' },
        ],
        medium: [
          { p:'MEDIUM', text:'Issue red alert to villages on unstable slopes', cat:'Advisory', icon:'📋' },
          { p:'LOW',    text:'Inspect retaining walls & drainage channels', cat:'Infrastructure', icon:'🔧' },
        ],
      },
      chemical: [
        { p:'CRITICAL', text:'Evacuate 1km radius — chemical/gas exposure risk', cat:'Evacuation', icon:'☣️' },
        { p:'CRITICAL', text:'Deploy HAZMAT team in full PPE — identify substance', cat:'Hazmat', icon:'🧪' },
        { p:'CRITICAL', text:'Establish decontamination corridor at safe perimeter', cat:'Medical', icon:'🏥' },
        { p:'HIGH',     text:'Cut power & ignition sources — explosion/fire risk', cat:'Infrastructure', icon:'⚡' },
        { p:'HIGH',     text:'Oxygen & antidote supply to medical teams', cat:'Medical', icon:'💊' },
        { p:'MEDIUM',   text:'Air quality monitoring downwind — alert nearby areas', cat:'Monitoring', icon:'💨' },
      ],
      heatwave: [
        { p:'CRITICAL', text:'Open emergency cooling centres in all govt buildings', cat:'Shelter', icon:'❄️' },
        { p:'CRITICAL', text:'Mass ORS & hydration distribution to vulnerable populations', cat:'Medical', icon:'💧' },
        { p:'HIGH',     text:'Deploy mobile medical units for heat-stroke response', cat:'Medical', icon:'🚑' },
        { p:'HIGH',     text:'Reschedule outdoor construction & farm work to night shifts', cat:'Advisory', icon:'📋' },
        { p:'MEDIUM',   text:'Check on elderly, homeless & children in high-temp zones', cat:'Welfare', icon:'👴' },
      ],
      epidemic: [
        { p:'CRITICAL', text:'Activate disease surveillance & containment protocol', cat:'Medical', icon:'🔬' },
        { p:'CRITICAL', text:'Quarantine confirmed cases — contact tracing immediate', cat:'Medical', icon:'🏥' },
        { p:'HIGH',     text:'Mass prophylaxis / vaccination drive in affected district', cat:'Medical', icon:'💉' },
        { p:'HIGH',     text:'Deploy rapid response medical team from state capital', cat:'Medical', icon:'🚑' },
        { p:'MEDIUM',   text:'Safe water supply verification — check for contamination', cat:'Monitoring', icon:'💧' },
        { p:'MEDIUM',   text:'Public health advisory — symptoms, prevention, helpline', cat:'Advisory', icon:'📢' },
      ],
      collapse: [
        { p:'CRITICAL', text:'Immediate structural rescue — survivors may be trapped', cat:'Rescue', icon:'🏗️' },
        { p:'CRITICAL', text:'Secure perimeter 100m — secondary collapse risk', cat:'Safety', icon:'🚧' },
        { p:'CRITICAL', text:'Trauma medical team + ambulances to site immediately', cat:'Medical', icon:'🚑' },
        { p:'HIGH',     text:'Heavy lifting equipment for debris removal', cat:'Rescue', icon:'🚛' },
        { p:'HIGH',     text:'Structural engineer to assess remaining structure', cat:'Assessment', icon:'🔍' },
      ],
      flood: {
        critical: [
          { p:'CRITICAL', text:'Deploy emergency water rescue teams immediately', cat:'Rescue', icon:'🚤' },
          { p:'CRITICAL', text:'Issue evacuation order for low-lying zones within 5km', cat:'Evacuation', icon:'📢' },
          { p:'HIGH',     text:'Set up emergency relief camp with shelter & food', cat:'Shelter', icon:'⛺' },
          { p:'HIGH',     text:'Deploy water tankers & purification units', cat:'Logistics', icon:'💧' },
          { p:'MEDIUM',   text:'Medical screening for waterborne disease prevention', cat:'Medical', icon:'🩺' },
          { p:'MEDIUM',   text:'Coordinate with NDRF for reinforcement', cat:'Coordination', icon:'📡' },
        ],
        high: [
          { p:'HIGH',   text:'Pre-position rescue boats at flood perimeter', cat:'Rescue', icon:'🚤' },
          { p:'HIGH',   text:'Distribute emergency food & water supplies', cat:'Logistics', icon:'🍱' },
          { p:'MEDIUM', text:'Alert community volunteers for evacuation support', cat:'Coordination', icon:'👥' },
          { p:'MEDIUM', text:'Monitor river gauge levels every 30 minutes', cat:'Monitoring', icon:'📊' },
        ],
        medium: [
          { p:'MEDIUM', text:'Issue advisory notice to flood-prone households', cat:'Advisory', icon:'📋' },
          { p:'MEDIUM', text:'Inspect drainage systems and clear blockages', cat:'Infrastructure', icon:'🔧' },
          { p:'LOW',    text:'Stock relief materials at nearest depot', cat:'Logistics', icon:'📦' },
        ],
      },
      fire: {
        critical: [
          { p:'CRITICAL', text:'Dispatch fire brigade units — multiple teams required', cat:'Rescue', icon:'🚒' },
          { p:'CRITICAL', text:'Evacuate all civilians within 300m radius immediately', cat:'Evacuation', icon:'🚨' },
          { p:'CRITICAL', text:'Establish medical triage point for casualties', cat:'Medical', icon:'🏥' },
          { p:'HIGH',     text:'Cut electricity supply to affected zone', cat:'Infrastructure', icon:'⚡' },
          { p:'HIGH',     text:'Coordinate with police for crowd/traffic control', cat:'Coordination', icon:'🚔' },
          { p:'MEDIUM',   text:'Deploy hazmat unit if chemical fire suspected', cat:'Hazmat', icon:'☣️' },
        ],
        high: [
          { p:'HIGH',   text:'Deploy 2 fire units with full suppression equipment', cat:'Rescue', icon:'🚒' },
          { p:'HIGH',   text:'Evacuate adjacent structures as precaution', cat:'Evacuation', icon:'📢' },
          { p:'MEDIUM', text:'Ambulance on standby for potential casualties', cat:'Medical', icon:'🚑' },
          { p:'MEDIUM', text:'Establish command post 100m from fire perimeter', cat:'Coordination', icon:'📡' },
        ],
        medium: [
          { p:'MEDIUM', text:'Contain fire spread using firebreaks', cat:'Rescue', icon:'🔥' },
          { p:'MEDIUM', text:'Advise residents to close windows and stay indoors', cat:'Advisory', icon:'📋' },
          { p:'LOW',    text:'Air quality monitoring — smoke inhalation risk', cat:'Monitoring', icon:'💨' },
        ],
      },
      medical: {
        critical: [
          { p:'CRITICAL', text:'Emergency medicine resupply — expedite within 2 hours', cat:'Medical', icon:'💊' },
          { p:'CRITICAL', text:'Deploy mobile medical unit with ICU capability', cat:'Medical', icon:'🏥' },
          { p:'HIGH',     text:'Transfer critical patients to nearest tertiary hospital', cat:'Medical', icon:'🚑' },
          { p:'HIGH',     text:'Set up isolation zone if infectious disease suspected', cat:'Medical', icon:'🔬' },
          { p:'MEDIUM',   text:'Activate volunteer paramedic network in district', cat:'Coordination', icon:'👥' },
        ],
        high: [
          { p:'HIGH',   text:'Urgent restock: bandages, antiseptics, IV fluids', cat:'Medical', icon:'🩺' },
          { p:'HIGH',   text:'Deploy 2 paramedic teams with trauma kits', cat:'Medical', icon:'🚑' },
          { p:'MEDIUM', text:'Coordinate blood bank for emergency supply', cat:'Medical', icon:'🩸' },
          { p:'MEDIUM', text:'Contact district health officer for resource allocation', cat:'Coordination', icon:'📡' },
        ],
        medium: [
          { p:'MEDIUM', text:'Schedule medical camp for affected population', cat:'Medical', icon:'🏥' },
          { p:'MEDIUM', text:'Distribute ORS and basic medicines preventively', cat:'Medical', icon:'💊' },
          { p:'LOW',    text:'Health awareness drive in affected community', cat:'Advisory', icon:'📋' },
        ],
      },
    };


    // Risk scoring weights
    this._riskWeights = {
      severity: { critical: 40, high: 25, medium: 12, low: 4 },
      type: { earthquake:15, tsunami:15, cyclone:12, chemical:12, collapse:13, fire:10, landslide:10, flood:8, heatwave:7, epidemic:9, medical:7 },
      resourceGap: 15,
    };
  }

  // Classify free-text input into crisis type + severity
  classifyText(text) {
    const t = text.toLowerCase();
    const typeKeywords = {
      earthquake: ['earthquake','quake','tremor','seismic','richter','aftershock','bhukamp'],
      tsunami:    ['tsunami','tidal wave','sea wave','shore flooding'],
      cyclone:    ['cyclone','hurricane','typhoon','storm surge','depression','landfall','imd'],
      landslide:  ['landslide','mudslide','debris','slope','hillside collapsed','avalanche'],
      chemical:   ['gas leak','chemical','toxic','hazmat','fumes','explosion','factory leak','refinery','ammonia','chlorine'],
      heatwave:   ['heatwave','heat wave','heat stroke','sun stroke','temperature','scorching','loo wind'],
      epidemic:   ['epidemic','outbreak','disease','infection','cholera','dengue','malaria','covid','virus','contaminated water','sick village'],
      collapse:   ['collapse','building collapse','structure collapse','roof fell','wall fell','bridge collapse','dam break'],
      flood:      ['flood','inundation','drowning','waterlogged','dam overflow','river overflow','submerged'],
      fire:       ['fire','blaze','burn','flame','arson','inferno','smoke','wildfire'],
      medical:    ['medical','medicine','hospital','shortage','casualty','injured','ambulance','blood','oxygen','icu'],
    };
    const sevKeywords = {
      critical: ['critical','emergency','urgent','trapped','death','died','sos','immediate','mayday','save','help','rescue now','collapsed'],
      high:     ['high','severe','serious','hundreds','families','injured','many people','large area','block','spreading'],
      medium:   ['warning','advisory','risk','potential','low on','monitor','watch'],
    };

    let type = null, maxTypeScore = 0;
    for (const [k, words] of Object.entries(typeKeywords)) {
      const score = words.filter(w => t.includes(w)).length;
      if (score > maxTypeScore) { maxTypeScore = score; type = k; }
    }
    if (!type) type = 'medical'; // safest generic fallback

    let sev = 'medium', maxSevScore = 0;
    for (const [k, words] of Object.entries(sevKeywords)) {
      const score = words.filter(w => t.includes(w)).length;
      if (score > maxSevScore) { maxSevScore = score; sev = k; }
    }

    const nums = (text.match(/\d+/g) || []).map(Number);
    const maxNum = nums.length ? Math.max(...nums) : 0;
    if (maxNum >= 100 && sev === 'medium') sev = 'high';
    if (maxNum >= 500 && sev === 'high')   sev = 'critical';

    const confidence = Math.min(1, (maxTypeScore + maxSevScore) / 5);
    return { type, sev, confidence };
  }

  // Generate tasks from classified crisis
  generateTasks({ type, sev }) {
    const tmpl = this._templates[type];
    if (!tmpl) return [];
    // Flat array (chemical, heatwave, epidemic, collapse)
    if (Array.isArray(tmpl)) return tmpl;
    // Nested by severity
    return tmpl[sev] || tmpl.medium || [];
  }

  // Score risk for a hotspot zone
  scoreRisk(hotspot, resources) {
    const w = this._riskWeights;
    let score = w.severity[hotspot.sev] ?? 10;
    score += w.type[hotspot.type] ?? 5;

    // Resource gap bonus
    const critRes = resources.filter(r => r.status === 'critical').length;
    score += Math.min(w.resourceGap, critRes * 5);

    return Math.min(100, Math.round(score));
  }

  // Match resources to crisis needs
  matchResources(crisisType, resources) {
    const catMap = {
      earthquake: ['rescue','medical','shelter'],
      tsunami:    ['rescue','shelter','food'],
      cyclone:    ['shelter','food','rescue'],
      landslide:  ['rescue','medical'],
      chemical:   ['medical','rescue'],
      heatwave:   ['medical','food'],
      epidemic:   ['medical','food'],
      collapse:   ['rescue','medical'],
      flood:      ['rescue','shelter','food'],
      fire:       ['rescue','medical'],
      medical:    ['medical','food'],
    };
    const needed = catMap[crisisType] || ['rescue','medical'];
    return resources
      .filter(r => needed.includes(r.cat))
      .sort((a, b) => ({ critical:0, low:1, ok:2 }[a.status]??3) - ({ critical:0, low:1, ok:2 }[b.status]??3));
  }

  // Summarise active alerts into a compact intelligence brief
  buildIntelBrief(alerts, resources) {
    const bySev = { critical: 0, high: 0, medium: 0 };
    alerts.forEach(a => { if (bySev[a.sev] !== undefined) bySev[a.sev]++; });
    const critRes = resources.filter(r => r.status === 'critical');
    const lowRes  = resources.filter(r => r.status === 'low');

    const overallRisk = bySev.critical >= 2 ? 'CRITICAL' : bySev.high >= 2 ? 'HIGH' : 'MEDIUM';

    const priorities = [];
    if (bySev.critical > 0) priorities.push(`${bySev.critical} critical zone(s) need immediate response`);
    if (critRes.length > 0) priorities.push(`${critRes.map(r => r.name).join(', ')} at critical levels`);
    if (lowRes.length > 0)  priorities.push(`${lowRes.map(r => r.name).join(', ')} running low — restock`);
    if (bySev.high > 0)     priorities.push(`${bySev.high} high-severity zone(s) require rapid deployment`);

    return { overallRisk, bySev, critRes, lowRes, priorities: priorities.slice(0, 4) };
  }
}

// ── SEVA GRID AI ORCHESTRATOR ─────────────────────────────────────
class SevaGridAI {
  constructor() {
    this.brain  = new SevaGridBrain();
    this.gemini = new GeminiMicro();
    this.mode   = 'local'; // 'local' | 'hybrid'
    this._chatHistory = [];
  }

  // ── Analyse voice/text input ──────────────────────────────────
  async analyzeVoice(text, resources = []) {
    const classified = this.brain.classifyText(text);

    // High-confidence → local only
    if (classified.confidence >= 0.5 || !this.gemini.hasKey()) {
      const tasks = this.brain.generateTasks(classified);
      const matched = this.brain.matchResources(classified.type, resources);
      return {
        source: 'local',
        classification: classified,
        tasks,
        resourceMatches: matched.slice(0, 3),
      };
    }

    // Low-confidence → Gemini for precision
    const sysPrompt = `You are SevaGrid, India's crisis response AI. Classify the crisis and return JSON only.`;
    const userMsg = `Crisis:"${text.slice(0,200)}".Resources:${resources.slice(0,4).map(r=>`${r.name}(${r.status})`).join(',')}.Return:{type,sev,tasks:[{p,text,cat}]}.Max 4 tasks.`;

    const raw = await this.gemini.ask(sysPrompt, userMsg, { json: true, maxTokens: 300 });

    try {
      const parsed = JSON.parse(raw);
      return {
        source: 'gemini',
        classification: { type: parsed.type, sev: parsed.sev, confidence: 1 },
        tasks: parsed.tasks || [],
        resourceMatches: this.brain.matchResources(parsed.type || 'flood', resources).slice(0, 3),
      };
    } catch {
      // Fallback to local if Gemini response is malformed
      return {
        source: 'local',
        classification: classified,
        tasks: this.brain.generateTasks(classified),
        resourceMatches: [],
      };
    }
  }

  // ── Crisis Intelligence Brief ─────────────────────────────────
  async getCrisisBrief(alerts, resources) {
    const brief = this.brain.buildIntelBrief(alerts, resources);

    // Only call Gemini for the narrative if key is available
    if (this.gemini.hasKey()) {
      const sysPrompt = `You are SevaGrid intelligence. Give a 3-sentence field situation report. Be direct and urgent. No markdown.`;
      const userMsg   = `Alerts:${alerts.map(a=>`${a.title}(${a.sev})`).join(';')}.Critical resources:${brief.critRes.map(r=>r.name).join(',')}.Write report.`;
      const narrative = await this.gemini.ask(sysPrompt, userMsg, { maxTokens: 150, temp: 0.2 });
      brief.narrative = narrative || this._localNarrative(brief);
    } else {
      brief.narrative = this._localNarrative(brief);
    }

    return brief;
  }

  _localNarrative(brief) {
    const parts = [];
    parts.push(`Situation is ${brief.overallRisk} — ${brief.bySev.critical} critical and ${brief.bySev.high} high-severity zones active.`);
    if (brief.critRes.length) parts.push(`Resources critically low: ${brief.critRes.map(r => r.name).join(', ')} — immediate resupply required.`);
    parts.push(`Priority action: immediate deployment to critical zones with available rescue and medical assets.`);
    return parts.join(' ');
  }

  // ── Risk Score per zone ───────────────────────────────────────
  async scoreZone(hotspot, resources) {
    const score = this.brain.scoreRisk(hotspot, resources);
    let reasoning = '';

    if (this.gemini.hasKey() && score >= 60) {
      const sysPrompt = `You are a disaster risk analyst. Give 2-sentence risk assessment. Be concise.`;
      const userMsg   = `Zone:${hotspot.label},Type:${hotspot.type},Severity:${hotspot.sev},RiskScore:${score}/100.Assess.`;
      reasoning = await this.gemini.ask(sysPrompt, userMsg, { maxTokens: 100, temp: 0.2 }) || '';
    }

    if (!reasoning) {
      reasoning = `Risk score ${score}/100 based on ${hotspot.sev} severity ${hotspot.type} event. ${score >= 70 ? 'Immediate response required.' : score >= 50 ? 'Close monitoring advised.' : 'Situation under observation.'}`;
    }

    return { score, reasoning, label: hotspot.label };
  }

  // ── Resource Optimizer ────────────────────────────────────────
  async optimizeResources(alerts, resources) {
    // Local matching first
    const recommendations = alerts
      .filter(a => a.sev === 'critical' || a.sev === 'high')
      .slice(0, 3)
      .map(alert => {
        const matched = this.brain.matchResources(alert.type, resources);
        return {
          alert: alert.title,
          location: alert.loc,
          suggested: matched.slice(0, 2).map(r => ({
            name: r.name,
            qty: Math.floor(r.qty * 0.3),
            unit: r.unit,
            from: r.loc,
            urgency: r.status,
          })),
        };
      });

    // Optional Gemini narrative for complex multi-zone optimization
    if (this.gemini.hasKey() && alerts.length > 3) {
      const sysPrompt = `You are SevaGrid logistics AI. Give 2 specific resource transfer recommendations. Be precise with quantities.`;
      const userMsg   = `CriticalAlerts:${alerts.filter(a=>a.sev==='critical').map(a=>a.title).join(';')}.AvailableResources:${resources.map(r=>`${r.name}:${r.qty}${r.unit}@${r.loc}`).join(';')}.Recommend transfers.`;
      const extra = await this.gemini.ask(sysPrompt, userMsg, { maxTokens: 200, temp: 0.2 });
      if (extra) recommendations.push({ geminiAdvice: extra });
    }

    return recommendations;
  }

  // ── AI Command Chat ───────────────────────────────────────────
  async chat(userMessage, context = {}) {
    this._chatHistory.push({ role: 'user', text: userMessage });

    // Always try Gemini for chat (it's the primary use case requiring network)
    if (this.gemini.hasKey()) {
      const sysPrompt = `You are SevaGrid, India's AI crisis coordinator. You have live data: ${context.alertSummary || ''}. ${context.resourceSummary || ''}. Be precise, actionable, and brief. No lengthy preambles.`;
      const historyContext = this._chatHistory.slice(-4).map(h => `${h.role}: ${h.text}`).join('\n');
      const fullMsg = historyContext + `\nuser: ${userMessage}`;

      const reply = await this.gemini.ask(sysPrompt, fullMsg, { maxTokens: 350, temp: 0.4 });
      if (reply) {
        this._chatHistory.push({ role: 'assistant', text: reply });
        return { source: 'gemini', text: reply };
      }
    }

    // Local fallback responses for common queries
    const reply = this._localChatFallback(userMessage, context);
    this._chatHistory.push({ role: 'assistant', text: reply });
    return { source: 'local', text: reply };
  }

  _localChatFallback(msg, ctx) {
    const m = msg.toLowerCase();
    const classified = this.brain.classifyText(msg);
    const tasks = this.brain.generateTasks(classified);
    if (tasks.length) {
      const top = tasks.slice(0,3).map((t,i)=>`(${i+1}) ${t.text}`).join(' ');
      return `${classified.type.toUpperCase()} protocol [${classified.sev}]: ${top}`;
    }
    if (m.includes('resource') || m.includes('supply'))
      return `📦 Critical resources: ${ctx.criticalResources || 'Rescue Boats, Oxygen Cylinders'}. Recommend immediate transfer to active zones.`;
    if (m.includes('status') || m.includes('situation'))
      return `📊 ${ctx.alertSummary || '7 active crisis zones. Critical zones require immediate response.'}`;
    return '⚡ Local Brain active. Describe the emergency (earthquake, flood, cyclone, chemical leak, etc.) and I will generate the response protocol.';
  }

  clearChat() { this._chatHistory = []; }
}

// ── EXPORT SINGLETON ──────────────────────────────────────────────
window.SevaAI = new SevaGridAI();
console.log('[SevaGrid AI] Engine initialised — Local Brain ready. Network mode:', window.SevaAI.gemini.hasKey() ? 'Hybrid' : 'Local-only');
