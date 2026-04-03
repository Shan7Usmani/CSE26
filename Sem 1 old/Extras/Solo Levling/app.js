// --- Core state ---
const initialState = {
  name: "Takhiro",
  level: 1,
  exp: 0,
  expToLevel: 100,
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  stats: { str: 10, agi: 8, int: 7, luk: 5 },
  statPoints: 0,
  skills: [],
  quests: [],
  inventory: [],
  gold: 0,
  enemy: { name: "Slime", level: 1, hp: 30, maxHp: 30 },
  selected: { skillId: null, questId: null, itemId: null },
};

const STATE_KEY = "awakened-system-state";
let state = loadState() || initialState;

// --- Utilities ---
function saveState(){ localStorage.setItem(STATE_KEY, JSON.stringify(state)); }
function loadState(){ try{ return JSON.parse(localStorage.getItem(STATE_KEY)); }catch{ return null; } }
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function rng(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
function timestamp(){ return new Date().toLocaleTimeString(); }
function log(msg){
  const logEl = document.getElementById("log");
  const entry = document.createElement("div");
  entry.className = "entry";
  entry.innerHTML = `<span class="time">[${timestamp()}]</span><span class="msg">${msg}</span>`;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

// --- DOM refs ---
const refs = {
  playerName: document.getElementById("playerName"),
  level: document.getElementById("level"),
  expText: document.getElementById("expText"),
  expBar: document.getElementById("expBar"),
  hp: document.getElementById("hp"),
  maxHp: document.getElementById("maxHp"),
  mp: document.getElementById("mp"),
  maxMp: document.getElementById("maxMp"),
  str: document.getElementById("str"),
  agi: document.getElementById("agi"),
  int: document.getElementById("int"),
  luk: document.getElementById("luk"),
  statPoints: document.getElementById("statPoints"),
  skillsList: document.getElementById("skillsList"),
  questsList: document.getElementById("questsList"),
  inventoryList: document.getElementById("inventoryList"),
  enemyName: document.getElementById("enemyName"),
  enemyLevel: document.getElementById("enemyLevel"),
  enemyHpText: document.getElementById("enemyHpText"),
  enemyHpBar: document.getElementById("enemyHpBar"),
  resetBtn: document.getElementById("resetBtn"),
  attackBtn: document.getElementById("attackBtn"),
  healBtn: document.getElementById("healBtn"),
  spawnBtn: document.getElementById("spawnBtn"),
  learnSkillBtn: document.getElementById("learnSkillBtn"),
  useSkillBtn: document.getElementById("useSkillBtn"),
  newQuestBtn: document.getElementById("newQuestBtn"),
  completeQuestBtn: document.getElementById("completeQuestBtn"),
  lootBtn: document.getElementById("lootBtn"),
  equipBtn: document.getElementById("equipBtn"),
  sellBtn: document.getElementById("sellBtn"),
};

// --- Rendering ---
function render(){
  refs.playerName.textContent = state.name;
  refs.level.textContent = state.level;
  refs.expText.textContent = `${state.exp} / ${state.expToLevel}`;
  refs.expBar.style.width = `${Math.min(100, (state.exp / state.expToLevel) * 100)}%`;

  refs.hp.textContent = state.hp;
  refs.maxHp.textContent = state.maxHp;
  refs.mp.textContent = state.mp;
  refs.maxMp.textContent = state.maxMp;

  refs.str.textContent = state.stats.str;
  refs.agi.textContent = state.stats.agi;
  refs.int.textContent = state.stats.int;
  refs.luk.textContent = state.stats.luk;

  refs.statPoints.textContent = state.statPoints;

  // Skills
  refs.skillsList.innerHTML = "";
  state.skills.forEach(skill => {
    const li = document.createElement("li");
    li.dataset.id = skill.id;
    if (state.selected.skillId === skill.id) li.classList.add("selected");
    li.innerHTML = `
      <div>
        <strong>${skill.name}</strong>
        <div style="color:#a1a7b3;font-size:12px">Type: ${skill.type} • Power: ${skill.power} • Cost: ${skill.cost} MP</div>
      </div>
      <div>Lv.${skill.level}</div>
    `;
    li.addEventListener("click", () => {
      state.selected.skillId = skill.id;
      render();
    });
    refs.skillsList.appendChild(li);
  });

  // Quests
  refs.questsList.innerHTML = "";
  state.quests.forEach(q => {
    const li = document.createElement("li");
    li.dataset.id = q.id;
    if (state.selected.questId === q.id) li.classList.add("selected");
    li.innerHTML = `
      <div>
        <strong>${q.title}</strong>
        <div style="color:#a1a7b3;font-size:12px">Req: ${q.requirement} • Reward: ${q.reward.exp} EXP, ${q.reward.gold} Gold</div>
      </div>
      <div>${q.done ? "Done" : "Active"}</div>
    `;
    li.addEventListener("click", () => {
      state.selected.questId = q.id;
      render();
    });
    refs.questsList.appendChild(li);
  });

  // Inventory
  refs.inventoryList.innerHTML = "";
  state.inventory.forEach(item => {
    const li = document.createElement("li");
    li.dataset.id = item.id;
    if (state.selected.itemId === item.id) li.classList.add("selected");
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div style="color:#a1a7b3;font-size:12px">${item.slot} • +${item.stat}+${item.amount}</div>
      </div>
      <div>${item.equipped ? "Equipped" : ""}</div>
    `;
    li.addEventListener("click", () => {
      state.selected.itemId = item.id;
      render();
    });
    refs.inventoryList.appendChild(li);
  });

  // Enemy
  refs.enemyName.textContent = state.enemy.name;
  refs.enemyLevel.textContent = state.enemy.level;
  refs.enemyHpText.textContent = `${state.enemy.hp} / ${state.enemy.maxHp}`;
  refs.enemyHpBar.style.width = `${(state.enemy.hp / state.enemy.maxHp) * 100}%`;

  saveState();
}

// --- Mechanics ---
function gainExp(amount){
  state.exp += amount;
  log(`Gained ${amount} EXP.`);
  while (state.exp >= state.expToLevel){
    state.exp -= state.expToLevel;
    levelUp();
  }
}

function levelUp(){
  state.level += 1;
  const hpGain = 10 + Math.floor(state.stats.str * 0.8);
  const mpGain = 5 + Math.floor(state.stats.int * 0.6);
  state.maxHp += hpGain; state.hp = state.maxHp;
  state.maxMp += mpGain; state.mp = state.maxMp;
  state.statPoints += 3;
  state.expToLevel = Math.floor(state.expToLevel * 1.15);
  log(`Level up! Reached Lv.${state.level}. +${hpGain} Max HP, +${mpGain} Max MP, +3 Stat Points.`);
}

function allocateStat(which){
  if (state.statPoints <= 0) return log("No stat points available.");
  state.stats[which] += 1;
  state.statPoints -= 1;
  if (which === "str") state.maxHp += 2;
  if (which === "int") state.maxMp += 2;
  log(`Allocated 1 point to ${which.toUpperCase()}.`);
}

function rollDamage(){
  const base = state.stats.str * 2 + rng(1, 6);
  const critChance = Math.min(50, state.stats.luk * 1.5);
  const isCrit = Math.random() * 100 < critChance;
  const agiMod = 1 + state.stats.agi / 100;
  const dmg = Math.floor(base * agiMod) * (isCrit ? 2 : 1);
  return { dmg, isCrit };
}

function attack(){
  if (state.enemy.hp <= 0) return log("Enemy already defeated.");
  const { dmg, isCrit } = rollDamage();
  state.enemy.hp = clamp(state.enemy.hp - dmg, 0, state.enemy.maxHp);
  log(`You attack for ${dmg} damage${isCrit ? " (CRIT!)" : ""}.`);
  if (state.enemy.hp <= 0){
    const expReward = 30 + state.enemy.level * 10;
    const goldReward = 15 + state.enemy.level * 5;
    log(`Enemy defeated! +${expReward} EXP, +${goldReward} Gold.`);
    state.gold += goldReward;
    gainExp(expReward);
    maybeDropLoot();
    spawnEnemy(state.enemy.level + 1);
  } else {
    enemyCounter();
  }
}

function enemyCounter(){
  const enemyDmg = rng(4, 10) + Math.floor(state.enemy.level * 1.2);
  state.hp = clamp(state.hp - enemyDmg, 0, state.maxHp);
  log(`Enemy hits you for ${enemyDmg}.`);
  if (state.hp <= 0){
    log("You fainted. Restoring to half HP.");
    state.hp = Math.floor(state.maxHp * 0.5);
  }
}

function heal(){
  const cost = 15;
  if (state.mp < cost) return log("Not enough MP to Heal.");
  const amount = 20 + state.stats.int * 2;
  state.mp -= cost;
  state.hp = clamp(state.hp + amount, 0, state.maxHp);
  log(`Casted Heal: +${amount} HP (-${cost} MP).`);
}

function spawnEnemy(targetLevel){
  const level = Math.max(1, targetLevel);
  const maxHp = 20 + level * 12;
  const names = ["Slime","Goblin","Skeleton","Wolf","Imp","Bandit","Orc","Golem","Wraith","Drake"];
  const name = names[rng(0, names.length - 1)];
  state.enemy = { name, level, hp: maxHp, maxHp };
  log(`A ${name} (Lv.${level}) appeared.`);
}

function maybeDropLoot(){
  if (Math.random() < 0.6){
    const slots = ["Weapon","Armor","Ring","Amulet"];
    const stats = ["str","agi","int","luk"];
    const slot = slots[rng(0, slots.length - 1)];
    const stat = stats[rng(0, stats.length - 1)];
    const amount = rng(1, 4);
    const item = {
      id: crypto.randomUUID(),
      name: `${slot} of ${stat.toUpperCase()} +${amount}`,
      slot, stat, amount, equipped: false
    };
    state.inventory.push(item);
    log(`Looted: ${item.name}.`);
  }
}

function equipSelected(){
  const item = state.inventory.find(i => i.id === state.selected.itemId);
  if (!item) return log("No item selected.");
  // Unequip same slot
  state.inventory.forEach(i => {
    if (i.slot === item.slot && i.equipped){
      i.equipped = false;
      state.stats[i.stat] = Math.max(0, state.stats[i.stat] - i.amount);
    }
  });
  item.equipped = true;
  state.stats[item.stat] += item.amount;
  log(`Equipped ${item.name}.`);
}

function sellSelected(){
  const idx = state.inventory.findIndex(i => i.id === state.selected.itemId);
  if (idx === -1) return log("No item selected.");
  const item = state.inventory[idx];
  const value = 20 + item.amount * 10;
  state.gold += value;
  state.inventory.splice(idx, 1);
  log(`Sold ${item.name} for ${value} Gold.`);
}

function loot(){
  maybeDropLoot();
}

const SKILL_POOL = [
  { name: "Shadow Step", type: "buff", basePower: 0, cost: 12 },
  { name: "Mana Burst", type: "attack", basePower: 22, cost: 18 },
  { name: "Piercing Strike", type: "attack", basePower: 18, cost: 10 },
  { name: "Blessing", type: "heal", basePower: 28, cost: 20 },
  { name: "Intimidate", type: "debuff", basePower: 0, cost: 8 },
];

function learnRandomSkill(){
  const base = SKILL_POOL[rng(0, SKILL_POOL.length - 1)];
  const skill = {
    id: crypto.randomUUID(),
    name: base.name,
    type: base.type,
    power: base.basePower + rng(0, 6),
    cost: base.cost,
    level: 1
  };
  state.skills.push(skill);
  log(`Learned skill: ${skill.name}.`);
}

function useSelectedSkill(){
  const skill = state.skills.find(s => s.id === state.selected.skillId);
  if (!skill) return log("No skill selected.");
  if (state.mp < skill.cost) return log("Not enough MP.");
  state.mp -= skill.cost;

  if (skill.type === "attack"){
    const bonus = skill.power + state.stats.int;
    const dmg = Math.floor(bonus * (1 + state.level * 0.05));
    state.enemy.hp = clamp(state.enemy.hp - dmg, 0, state.enemy.maxHp);
    log(`${skill.name} dealt ${dmg} damage!`);
    if (state.enemy.hp <= 0){
      const expReward = 30 + state.enemy.level * 10;
      const goldReward = 15 + state.enemy.level * 5;
      log(`Enemy defeated! +${expReward} EXP, +${goldReward} Gold.`);
      state.gold += goldReward;
      gainExp(expReward);
      maybeDropLoot();
      spawnEnemy(state.enemy.level + 1);
    } else {
      enemyCounter();
    }
  } else if (skill.type === "heal"){
    const healAmt = Math.floor(skill.power * (1 + state.stats.int / 20));
    state.hp = clamp(state.hp + healAmt, 0, state.maxHp);
    log(`${skill.name} restored ${healAmt} HP.`);
  } else if (skill.type === "buff"){
    const agiBoost = Math.floor(1 + skill.power / 15);
    state.stats.agi += agiBoost;
    log(`${skill.name} increased AGI by ${agiBoost} for this session.`);
  } else if (skill.type === "debuff"){
    const cut = Math.floor(1 + skill.power / 20);
    state.enemy.level = Math.max(1, state.enemy.level - cut);
    log(`${skill.name} reduced enemy level by ${cut}.`);
  }
  skill.level += 1;
}

function generateQuest(){
  const types = [
    () => ({ title: "Clear the Goblin Den", requirement: `Defeat ${rng(3,6)} enemies`, count: 0, target: rng(3,6) }),
    () => ({ title: "Collect Mana Shards", requirement: `Loot ${rng(2,5)} items`, count: 0, target: rng(2,5) }),
    () => ({ title: "Train Your Body", requirement: `Allocate ${rng(2,4)} stat points`, count: 0, target: rng(2,4) }),
  ];
  const base = types[rng(0, types.length - 1)]();
  const quest = {
    id: crypto.randomUUID(),
    title: base.title,
    requirement: base.requirement,
    progress: { count: base.count, target: base.target },
    reward: { exp: rng(50,120), gold: rng(40,90) },
    done: false
  };
  state.quests.push(quest);
  log(`New quest: ${quest.title}.`);
}

function completeSelectedQuest(){
  const q = state.quests.find(q => q.id === state.selected.questId);
  if (!q) return log("No quest selected.");
  if (!q.done) return log("Quest not completed yet.");
  gainExp(q.reward.exp);
  state.gold += q.reward.gold;
  log(`Quest completed: +${q.reward.exp} EXP, +${q.reward.gold} Gold.`);
  // Remove quest after completion
  state.quests = state.quests.filter(x => x.id !== q.id);
  state.selected.questId = null;
}

// Hook quest progress into actions
function tickQuestProgress(type){
  state.quests.forEach(q => {
    if (q.done) return;
    if (type === "enemyDefeated" && q.title.includes("Clear")){
      q.progress.count += 1;
    } else if (type === "looted" && q.title.includes("Collect")){
      q.progress.count += 1;
    } else if (type === "allocated" && q.title.includes("Train")){
      q.progress.count += 1;
    }
    if (q.progress.count >= q.progress.target){
      q.done = true;
      log(`Quest ready to turn in: ${q.title}.`);
    }
  });
}

// --- Events ---
refs.resetBtn.addEventListener("click", () => {
  if (!confirm("Reset progress?")) return;
  state = JSON.parse(JSON.stringify(initialState));
  saveState(); render(); log("Progress reset.");
});

document.querySelectorAll(".stat-alloc .btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const which = btn.dataset.alloc;
    const before = state.statPoints;
    allocateStat(which);
    if (state.statPoints !== before) tickQuestProgress("allocated");
    render();
  });
});

refs.attackBtn.addEventListener("click", () => { attack(); render(); });
refs.healBtn.addEventListener("click", () => { heal(); render(); });
refs.spawnBtn.addEventListener("click", () => { spawnEnemy(state.enemy.level + 1); render(); });

refs.learnSkillBtn.addEventListener("click", () => { learnRandomSkill(); render(); });
refs.useSkillBtn.addEventListener("click", () => { useSelectedSkill(); render(); });

refs.newQuestBtn.addEventListener("click", () => { generateQuest(); render(); });
refs.completeQuestBtn.addEventListener("click", () => { completeSelectedQuest(); render(); });

refs.lootBtn.addEventListener("click", () => { loot(); tickQuestProgress("looted"); render(); });
refs.equipBtn.addEventListener("click", () => { equipSelected(); render(); });
refs.sellBtn.addEventListener("click", () => { sellSelected(); render(); });

// Enemy defeat hook via polling log not necessary—integrate inside attack/useSelectedSkill:
const _origAttack = attack;
attack = function(){
  _origAttack();
  // If enemy died, increment quest progress
  if (state.enemy.hp === state.enemy.maxHp && state.enemy.level > 1) {
    // spawnEnemy sets new enemy; detect previous death in logs
    tickQuestProgress("enemyDefeated");
  }
};

// Initial spawn and render
if (!state.enemy || !state.enemy.name) spawnEnemy(1);
render();
log("System online. Welcome, Hunter.");