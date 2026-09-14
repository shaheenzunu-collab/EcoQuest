// ============================================================
// 🌍 ECOQUEST — CLEAN FINAL SCRIPT.JS
// Learn • Decide • Build a Greener Community
// ============================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwLX2ntMnAVxVQSZiUDIjMoTxyfwnhAD_m14PswfKkhJ68SOUxR9XGTDHIL84MUXrQ/exec";
// ============================================================
// 🎮 GAME STATE 
// ============================================================
let budget = 100;
let wellBeing = 50;
let currentLevel = 1;

let energyScore = 0;
let transportScore = 0;
let waterScore = 0;
let wasteScore = 0;
let greenScore = 0;

let xp = 0;
let streak = 0;
let bestStreak = 0;
let achievements = [];
let decisionHistory = [];

let soundEnabled = true;
let loadingTimer = null;
let issueChartInstance = null;
let concernChartInstance = null;
let actionChartInstance = null;

// ============================================================
// 🏅 BADGES
// ============================================================
const badgeData = {
    energy: { name: "Energy Saver", icon: "⚡", description: "Made a smart energy decision." },
    transport: { name: "Green Commuter", icon: "🚲", description: "Supported cleaner transportation." },
    water: { name: "Water Guardian", icon: "💧", description: "Protected an important natural resource." },
    waste: { name: "Waste Warrior", icon: "♻️", description: "Made a responsible waste decision." },
    green: { name: "Green Guardian", icon: "🌳", description: "Helped create a greener community." },
    champion: { name: "Eco Champion", icon: "🏆", description: "Achieved a 3-decision streak." }
};

// ============================================================
// 📚 LEARNING CONTENT
// ============================================================
const learningContent = {
    energy: {
        intro: "Energy choices affect pollution, climate change and the cost of running a community.",
        facts: [
            "LED bulbs generally use much less electricity than traditional incandescent bulbs.",
            "Solar panels convert sunlight directly into electricity.",
            "Energy-efficient appliances can reduce unnecessary electricity consumption."
        ],
        actions: [
            "Switch off unused lights and appliances.",
            "Use LED bulbs.",
            "Choose energy-efficient appliances.",
            "Consider renewable energy where practical."
        ]
    },
    transport: {
        intro: "Transportation choices influence air pollution, greenhouse-gas emissions and community health.",
        facts: [
            "Walking and cycling produce no tailpipe emissions.",
            "Public transportation can move many passengers using shared infrastructure.",
            "Cycling infrastructure can encourage cleaner short-distance travel."
        ],
        actions: [
            "Walk for short trips.",
            "Use public transportation.",
            "Cycle when possible.",
            "Share rides when practical."
        ]
    },
    water: {
        intro: "Water is a limited resource. Saving water also reduces the energy needed to pump, treat and transport it.",
        facts: [
            "Leaking taps and pipes can waste significant amounts of water.",
            "Rainwater harvesting can help collect water for suitable non-drinking uses.",
            "Water conservation reduces pressure on freshwater resources."
        ],
        actions: [
            "Close taps properly.",
            "Repair leaks.",
            "Avoid unnecessary water use.",
            "Support rainwater harvesting."
        ]
    },
    waste: {
        intro: "How waste is handled affects pollution, recycling and the amount of waste sent to disposal sites.",
        facts: [
            "Source segregation makes recycling and recovery easier.",
            "Organic waste in landfills can produce methane as it decomposes.",
            "Composting can turn suitable organic waste into useful material."
        ],
        actions: [
            "Separate wet and dry waste.",
            "Reuse items where possible.",
            "Recycle suitable materials.",
            "Compost organic waste when possible."
        ]
    },
    green: {
        intro: "Trees and green spaces can provide shade, recreation, habitat and cooling benefits in urban areas.",
        facts: [
            "Trees provide shade and can help reduce local heat.",
            "Green spaces provide areas for recreation and community activities.",
            "Urban vegetation can support biodiversity."
        ],
        actions: [
            "Plant suitable trees.",
            "Protect existing trees.",
            "Keep public green spaces clean.",
            "Support community gardens and parks."
        ]
    }
};

const decisionLearning = {
    energy: {
        A: { impact: "Provides additional electricity capacity but relies on fossil fuel and can increase environmental pressure.", example: "Many communities are reducing dependence on coal while increasing renewable-energy capacity.", fact: "Burning fossil fuels releases greenhouse gases and air pollutants.", action: "Reduce unnecessary electricity use and choose efficient appliances." },
        B: { impact: "Reduces electricity consumption while improving energy efficiency.", example: "Energy-efficiency programs are commonly used to reduce electricity demand.", fact: "Efficient lighting and appliances can reduce electricity consumption.", action: "Replace frequently used inefficient bulbs with LEDs." },
        C: { impact: "Provides renewable electricity and can reduce dependence on fossil-fuel generation.", example: "Community solar projects allow groups of people to benefit from shared solar generation.", fact: "Solar photovoltaic systems generate electricity from sunlight without burning fuel during operation.", action: "Learn about rooftop or community solar options in your area." }
    },
    transport: {
        A: { impact: "More roads may improve vehicle movement in some situations but can encourage greater dependence on private vehicles.", example: "Cities around the world are investing in public transport and active mobility alongside road infrastructure.", fact: "Private vehicles can produce significant emissions when used for daily travel.", action: "Use public transport for suitable journeys." },
        B: { impact: "Better public transportation can reduce dependence on individual vehicles.", example: "Cities such as Singapore and London have extensive public transportation networks.", fact: "Public transport can carry many passengers using shared infrastructure.", action: "Try public transport for your next suitable trip." },
        C: { impact: "Combining public transport with cycling provides multiple low-emission travel options.", example: "Cycling-friendly cities such as Amsterdam have developed extensive cycling infrastructure.", fact: "Walking and cycling have no tailpipe emissions.", action: "Walk or cycle for short-distance journeys whenever practical." }
    },
    water: {
        A: { impact: "Increasing supply can help meet demand but does not directly reduce unnecessary water consumption.", example: "Water-stressed communities increasingly combine supply management with conservation.", fact: "Freshwater resources require careful management because availability varies by location.", action: "Identify places at home where water may be unnecessarily wasted." },
        B: { impact: "Water-saving practices reduce demand and help protect freshwater resources.", example: "Water conservation programs are used in many cities facing water shortages.", fact: "Saving water also saves energy used for pumping and treatment.", action: "Repair leaking taps and avoid leaving water running unnecessarily." },
        C: { impact: "Rainwater harvesting can supplement water resources for suitable uses.", example: "Rainwater harvesting is used in many parts of India and other water-stressed regions.", fact: "Collected rainwater can be useful for appropriate non-drinking purposes.", action: "Learn whether rainwater harvesting is practical for your building." }
    },
    waste: {
        A: { impact: "Continuing existing disposal practices can increase the amount of waste requiring final disposal.", example: "Communities are increasingly focusing on waste reduction, recycling and recovery.", fact: "Organic waste disposed in landfills can produce methane as it decomposes.", action: "Start separating recyclable and organic waste at home." },
        B: { impact: "Segregating waste at source makes recycling and further treatment easier.", example: "Source segregation is an important part of organized municipal waste-management systems.", fact: "Mixed waste can make recovery of recyclable materials more difficult.", action: "Keep wet and dry waste in separate containers." },
        C: { impact: "Combining segregation, recycling and composting reduces the amount of waste sent for final disposal.", example: "Some communities use integrated systems combining recycling and composting.", fact: "Composting can convert suitable organic waste into useful organic material.", action: "Compost suitable kitchen waste if you have access to a safe composting system." }
    },
    green: {
        A: { impact: "Construction may provide economic or housing benefits but can reduce available green space if poorly planned.", example: "Urban planning increasingly considers both development and preservation of green areas.", fact: "Removing vegetation can increase exposure to heat and reduce habitat.", action: "Protect existing trees and green spaces around your community." },
        B: { impact: "Planting suitable trees can improve shade, biodiversity and the appearance of the community.", example: "Many cities conduct tree-planting and urban forestry programs.", fact: "Trees can provide shade and cool their surroundings through evapotranspiration.", action: "Plant or care for a suitable tree where permission and conditions allow." },
        C: { impact: "A community green park provides recreation, vegetation and potential cooling benefits.", example: "Cities around the world maintain public parks as part of urban planning.", fact: "Urban green spaces can support recreation, cooling and biodiversity.", action: "Participate in keeping local parks and green spaces clean." }
    }
};

// ============================================================
// 🎮 LEVEL DATA
// ============================================================
const levels = {
    1: {
        category: "energy", title: "⚡ Level 1: Energy Crisis",
        description: "Electricity demand has increased and pollution levels are rising in your community.",
        choices: [
            { label: "A", title: "Build a Fossil Fuel Plant", cost: 10, score: 5, wellbeing: 5 },
            { label: "B", title: "Introduce Energy-Efficient Appliances", cost: 20, score: 12, wellbeing: 8 },
            { label: "C", title: "Build a Community Solar Project", cost: 35, score: 20, wellbeing: 10 }
        ]
    },
    2: {
        category: "transport", title: "🚲 Level 2: Transportation Challenge",
        description: "Traffic is increasing, air quality is getting worse and residents need reliable transportation.",
        choices: [
            { label: "A", title: "Build More Roads", cost: 20, score: 3, wellbeing: 0 },
            { label: "B", title: "Improve Public Transportation", cost: 25, score: 15, wellbeing: 8 },
            { label: "C", title: "Public Transport + Cycling Network", cost: 30, score: 20, wellbeing: 10 }
        ]
    },
    3: {
        category: "water", title: "💧 Level 3: Water Challenge",
        description: "Water demand is increasing and the community needs a reliable way to conserve its water resources.",
        choices: [
            { label: "A", title: "Increase Water Supply", cost: 15, score: 3, wellbeing: 0 },
            { label: "B", title: "Introduce Water-Saving Practices", cost: 20, score: 12, wellbeing: 5 },
            { label: "C", title: "Build Rainwater Harvesting Systems", cost: 30, score: 20, wellbeing: 8 }
        ]
    },
    4: {
        category: "waste", title: "♻️ Level 4: Waste Challenge",
        description: "The amount of waste produced by the community is increasing and disposal capacity is becoming limited.",
        choices: [
            { label: "A", title: "Continue Current Disposal Methods", cost: 5, score: 2, wellbeing: 0 },
            { label: "B", title: "Introduce Waste Segregation", cost: 15, score: 12, wellbeing: 5 },
            { label: "C", title: "Segregation + Recycling + Composting", cost: 25, score: 20, wellbeing: 8 }
        ]
    },
    5: {
        category: "green", title: "🌳 Level 5: Green Community",
        description: "Your community wants development, but residents also need trees, parks and healthy public spaces.",
        choices: [
            { label: "A", title: "Construct More Buildings", cost: 10, score: 2, wellbeing: 0 },
            { label: "B", title: "Plant Trees", cost: 20, score: 14, wellbeing: 7 },
            { label: "C", title: "Create a Community Green Park", cost: 30, score: 20, wellbeing: 12 }
        ]
    }
};

// ============================================================
// 🚀 INITIALIZATION
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    injectStyles();
    createLoadingOverlay();
    createSoundButton();
    updateStats();
});

// ============================================================
// 📊 STATS
// ============================================================
function calculateEcoScore() {
    return energyScore + transportScore + waterScore + wasteScore + greenScore;
}

function updateStats() {
    document.querySelectorAll("#budget, .budget-value, [data-stat='budget']").forEach(el => el.textContent = budget);
    document.querySelectorAll("#eco-score, .eco-score-value, [data-stat='eco-score']").forEach(el => el.textContent = calculateEcoScore());
    document.querySelectorAll("#well-being, #wellBeing, .wellbeing-value, [data-stat='wellBeing']").forEach(el => el.textContent = wellBeing);
    document.querySelectorAll("#currentLevel, .level-value, [data-stat='level']").forEach(el => el.textContent = currentLevel);
}

function getEcoRank(score) {
    if (score >= 80) return { title: "Eco Champion", icon: "🏆", message: "Excellent! Your decisions created a highly sustainable community." };
    if (score >= 60) return { title: "Green Thinker", icon: "🌱", message: "Great work! Your community is moving toward a greener future." };
    if (score >= 40) return { title: "Needs Improvement", icon: "🌤️", message: "You made some positive choices, but there is still room for improvement." };
    return { title: "Community at Risk", icon: "⚠️", message: "Your community needs stronger environmental decisions." };
}

// ============================================================
// ⏳ LOADING — FIXED
// ============================================================
function createLoadingOverlay() {
    if (document.querySelector(".eco-loading")) return;
    const overlay = document.createElement("div");
    overlay.className = "eco-loading";
    overlay.innerHTML = `
        <div class="eco-loading-box">
            <div class="eco-loading-icon">🌍</div>
            <div class="eco-spinner"></div>
            <h3>Building a greener future...</h3>
            <p>Please wait</p>
        </div>`;
    document.body.appendChild(overlay);
}

function showLoading(duration = 500) {
    const overlay = document.querySelector(".eco-loading");
    if (!overlay) return Promise.resolve();
    clearTimeout(loadingTimer);
    overlay.classList.add("active");
    return new Promise(resolve => {
        loadingTimer = setTimeout(() => {
            overlay.classList.remove("active");
            resolve();
        }, duration);
    });
}

// ============================================================
// 🎬 TRANSITION
// ============================================================
function animateMissionBox() {
    const box = document.querySelector(".mission-box");
    if (!box) return;
    box.classList.remove("eco-screen-enter");
    void box.offsetWidth;
    box.classList.add("eco-screen-enter");
}

// ============================================================
// 🏠 START GAME
// ============================================================
async function startGame() {
    resetGame();
    document.getElementById("home-screen")?.classList.add("hidden");
    document.getElementById("game-screen")?.classList.remove("hidden");
    await showLoading(450);
    showEnergyLevel();
}

function resetGame() {
    budget = 100;
    wellBeing = 50;
    currentLevel = 1;
    energyScore = transportScore = waterScore = wasteScore = greenScore = 0;
    xp = 0;
    streak = 0;
    bestStreak = 0;
    achievements = [];
    decisionHistory = [];
    updateStats();
}

// ============================================================
// 📚 LEVEL RENDERING
// ============================================================
function showEnergyLevel() { renderLevel(1); }
function showTransportationLevel() { renderLevel(2); }
function showWaterLevel() { renderLevel(3); }
function showWasteLevel() { renderLevel(4); }
function showGreenLevel() { renderLevel(5); }

function renderLevel(levelNumber) {
    currentLevel = levelNumber;
    const box = document.querySelector(".mission-box");
    const level = levels[levelNumber];
    if (!box || !level) return;
    const content = learningContent[level.category];

    box.innerHTML = `
        <div class="level-top">
            <span class="level-number">LEVEL ${levelNumber} / 5</span>
            <span class="level-icon">${getCategoryIcon(level.category)}</span>
        </div>
        <h2>${level.title}</h2>
        <p class="level-description">${level.description}</p>
        <div class="knowledge-box">
            <h3>📚 What should I know?</h3>
            <p>${content.intro}</p>
            <div class="fact-list">${content.facts.map(f => `<div>📌 ${f}</div>`).join("")}</div>
        </div>
        <div class="action-box">
            <h3>🌱 What can people actually do?</h3>
            ${content.actions.map(a => `<span>✓ ${a}</span>`).join("")}
        </div>
        <h3 class="decision-heading">🏘️ What would YOU do?</h3>
        <div class="decision-grid">${createChoiceButtons(level.choices)}</div>
    `;
    animateMissionBox();
    updateStats();
}

function getCategoryIcon(category) {
    return { energy: "⚡", transport: "🚲", water: "💧", waste: "♻️", green: "🌳" }[category] || "🌍";
}

function createChoiceButtons(choices) {
    return choices.map(choice => `
        <button class="decision-card choice-button choice-${choice.label.toLowerCase()}" onclick="makeDecision('${choice.label}')">
            <div class="choice-letter">${choice.label}</div>
            <div class="choice-content"><h3>${choice.title}</h3><p>💰 Cost: ${choice.cost}</p></div>
            <span class="choice-arrow">→</span>
        </button>`).join("");
}

// ============================================================
// 🎯 DECISION
// ============================================================
function makeDecision(choice) {
    const level = levels[currentLevel];
    const selected = level?.choices.find(c => c.label === choice);
    if (!selected) return;

    if (selected.cost > budget) {
        showToast("⚠️ Not enough budget! Choose another option.");
        return;
    }

    decisionHistory.push({
        level: currentLevel,
        budget, wellBeing,
        energyScore, transportScore, waterScore, wasteScore, greenScore,
        xp, streak, bestStreak,
        achievements: [...achievements]
    });

    budget -= selected.cost;
    wellBeing += selected.wellbeing;

    const category = level.category;
    if (category === "energy") energyScore = selected.score;
    if (category === "transport") transportScore = selected.score;
    if (category === "water") waterScore = selected.score;
    if (category === "waste") wasteScore = selected.score;
    if (category === "green") greenScore = selected.score;

    unlockAchievement(category);
    const earnedXP = addXP(choice);
    updateStats();
    playSound("decision");
    showDecisionResult(choice, selected, earnedXP);
}

function addXP(choice) {
    const earned = choice === "C" ? 25 : choice === "B" ? 15 : 5;
    if (choice === "A") streak = 0; else streak++;
    xp += earned;
    bestStreak = Math.max(bestStreak, streak);
    if (streak >= 3) unlockAchievement("champion");
    return earned;
}

function unlockAchievement(id) {
    if (!badgeData[id] || achievements.includes(id)) return;
    achievements.push(id);
    showToast(`${badgeData[id].icon} Badge Unlocked: ${badgeData[id].name}`);
}

function getXPLevel() { return Math.floor(xp / 50) + 1; }

// ============================================================
// 📊 DECISION RESULT
// ============================================================
function showDecisionResult(choice, selected, earnedXP) {
    const box = document.querySelector(".mission-box");
    if (!box) return;
    const category = levels[currentLevel].category;
    const title = choice === "C" ? "🌟 Excellent Choice!" : choice === "B" ? "👍 Good Choice!" : "🤔 Interesting Choice";
    const icon = choice === "C" ? "🌟" : choice === "B" ? "👍" : "🤔";

    box.innerHTML = `
        <div class="result-screen">
            <div class="result-icon">${icon}</div>
            <h2>${title}</h2>
            <h3>${selected.title}</h3>
            <div class="result-stats">
                <div><span>💰</span><strong>${selected.cost}</strong><small>Budget Used</small></div>
                <div><span>🌱</span><strong>+${selected.score}</strong><small>Eco Score</small></div>
                <div><span>😊</span><strong>+${selected.wellbeing}</strong><small>Well-Being</small></div>
                <div><span>⭐</span><strong>+${earnedXP}</strong><small>XP</small></div>
            </div>
            ${createLearningCard(category, choice)}
            <div class="result-actions">
                <button class="eco-btn secondary-btn" onclick="undoLastDecision()">↩️ Reconsider Decision</button>
                ${currentLevel === 5
                    ? `<button class="eco-btn primary-btn" onclick="showFinalDashboard()">🏆 View Final Results</button>`
                    : `<button class="eco-btn primary-btn" onclick="nextLevel()">Continue →</button>`}
            </div>
        </div>`;

    animateMissionBox();
    if (currentLevel < 5) showLevelCelebration(currentLevel, selected.title, earnedXP);
    else playSound("success");
}

function createLearningCard(category, choice) {
    const data = decisionLearning[category]?.[choice];
    if (!data) return "";
    return `
        <div class="learning-card">
            <div class="learning-card-header"><span>💡</span><div><h3>Why was this decision important?</h3><p>Your decision has real-world environmental consequences.</p></div></div>
            <div class="learning-grid">
                <div class="learning-item"><span>🌍</span><div><strong>Environmental Impact</strong><p>${data.impact}</p></div></div>
                <div class="learning-item"><span>🏙️</span><div><strong>Real-World Example</strong><p>${data.example}</p></div></div>
                <div class="learning-item"><span>📌</span><div><strong>Did You Know?</strong><p>${data.fact}</p></div></div>
                <div class="learning-item"><span>🌱</span><div><strong>Try This in Real Life</strong><p>${data.action}</p></div></div>
            </div>
        </div>`;
}

function showLevelCelebration(level, decision, earnedXP) {
    document.querySelectorAll(".level-celebration").forEach(el => el.remove());
    const overlay = document.createElement("div");
    overlay.className = "level-celebration";
    overlay.innerHTML = `<div class="celebration-box"><div class="celebration-icon">🎉</div><h2>Level ${level} Complete!</h2><p>You chose:</p><strong>${decision}</strong><div class="celebration-xp">⭐ +${earnedXP} XP</div><button class="eco-btn primary-btn" onclick="this.closest('.level-celebration').remove()">Continue</button></div>`;
    document.body.appendChild(overlay);
}

async function nextLevel() {
    if (currentLevel >= 5) return;
    currentLevel++;
    await showLoading(450);
    renderLevel(currentLevel);
}

// ============================================================
// ↩️ UNDO — FULL STATE RESTORE
// ============================================================
function undoLastDecision() {
    if (!decisionHistory.length) {
        showToast("↩️ There is no previous decision to reconsider.");
        return;
    }
    const previous = decisionHistory.pop();
    budget = previous.budget;
    wellBeing = previous.wellBeing;
    energyScore = previous.energyScore;
    transportScore = previous.transportScore;
    waterScore = previous.waterScore;
    wasteScore = previous.wasteScore;
    greenScore = previous.greenScore;
    xp = previous.xp;
    streak = previous.streak;
    bestStreak = previous.bestStreak;
    achievements = [...previous.achievements];
    currentLevel = previous.level;
    document.querySelectorAll(".level-celebration").forEach(el => el.remove());
    renderLevel(currentLevel);
    updateStats();
    playSound("undo");
    showToast("↩️ Decision reconsidered!");
}

// ============================================================
// 🏆 FINAL ECO DASHBOARD
// ============================================================
function showFinalDashboard() {
    const box = document.querySelector(".mission-box");
    if (!box) return;
    const score = calculateEcoScore();
    const rank = getEcoRank(score);

    box.innerHTML = `
        <div class="final-dashboard">
            <div class="final-hero">
                <div class="final-trophy">${rank.icon}</div>
                <div class="final-label">ECOQUEST COMPLETE</div>
                <h1>${rank.title}</h1>
                <p>${rank.message}</p>
            </div>
            <div class="score-ring" style="--score:${score}"><div class="score-number">${score}</div><div class="score-label">ECO SCORE / 100</div></div>
            <div class="dashboard-stat-grid">
                <div class="dashboard-stat"><span>💰</span><strong>${budget}</strong><small>Remaining Budget</small></div>
                <div class="dashboard-stat"><span>😊</span><strong>${wellBeing}</strong><small>Community Well-Being</small></div>
                <div class="dashboard-stat"><span>⭐</span><strong>${xp}</strong><small>Total XP • Level ${getXPLevel()}</small></div>
                <div class="dashboard-stat"><span>🔥</span><strong>${bestStreak}</strong><small>Best Streak</small></div>
            </div>
            <h2 class="dashboard-heading">🌍 Environmental Performance</h2>
            <div class="category-dashboard">
                ${createCategoryDashboard("Energy", energyScore, "⚡")}
                ${createCategoryDashboard("Transportation", transportScore, "🚲")}
                ${createCategoryDashboard("Water", waterScore, "💧")}
                ${createCategoryDashboard("Waste", wasteScore, "♻️")}
                ${createCategoryDashboard("Green Spaces", greenScore, "🌳")}
            </div>
            <h2 class="dashboard-heading">🏅 Your Achievements</h2>
            <div class="badge-container">${achievements.length ? achievements.map(createBadgeHTML).join("") : `<p class="empty-badges">Keep playing to unlock badges!</p>`}</div>
            <div class="final-message"><h3>🌱 What did you learn?</h3><p>EcoQuest shows how everyday community decisions can affect energy, transportation, water, waste and green spaces.</p></div>
            <div class="final-actions">
                <button class="eco-btn primary-btn" onclick="showCommunitySurvey()">📊 Take Community Survey</button>
                <button class="eco-btn secondary-btn" onclick="startGame()">🔄 Play Again</button>
            </div>
        </div>`;
    animateMissionBox();
    playSound("success");
}

function createCategoryDashboard(title, score, icon) {
    const percentage = Math.round((score / 20) * 100);
    return `<div class="category-card"><div class="category-card-top"><span class="category-icon">${icon}</span><div><h3>${title}</h3><p>${score} / 20</p></div></div><div class="category-progress"><div class="category-progress-fill" style="width:${percentage}%"></div></div><span class="category-percentage">${percentage}%</span></div>`;
}

function createBadgeHTML(id) {
    const badge = badgeData[id];
    return `<div class="achievement-badge"><div class="achievement-icon">${badge.icon}</div><div><strong>${badge.name}</strong><p>${badge.description}</p></div></div>`;
}

// ============================================================
// 📋 COMMUNITY SURVEY
// ============================================================
function showCommunitySurvey() {
    const box = document.querySelector(".mission-box");
    if (!box) return;
    box.innerHTML = `
        <div class="survey-screen">
            <div class="survey-header"><span class="survey-icon">🌍</span><div><span class="survey-label">COMMUNITY SURVEY</span><h2>What does YOUR community think?</h2></div></div>
            <p class="survey-intro">Your responses will help identify environmental concerns and preferred community actions. <strong>No name, email or phone number is required.</strong></p>
            <form id="ecoSurveyForm">
                <div class="survey-question"><label>1️⃣ Which environmental issue concerns you the most?</label><select id="surveyIssue" required><option value="">Select an issue</option><option>Energy</option><option>Waste</option><option>Water</option><option>Transportation</option><option>Green Spaces</option></select></div>
                <div class="survey-question"><label>2️⃣ How concerned are you about climate change?</label><select id="surveyConcern" required><option value="">Select your concern level</option><option>Very Concerned</option><option>Somewhat Concerned</option><option>Not Very Concerned</option><option>Not Concerned</option></select></div>
                <div class="survey-question"><label>3️⃣ Which community action would you most prefer?</label><select id="surveyAction" required><option value="">Select an action</option><option>Save Energy</option><option>Reduce Waste</option><option>Save Water</option><option>Use Public Transport</option><option>Plant Trees</option></select></div>
                <button type="submit" class="eco-btn primary-btn survey-submit">🚀 Submit My Response</button>
            </form>
            <div id="surveyMessage" class="survey-message"></div>
            <button class="eco-btn secondary-btn" onclick="showSurveyResults()">📊 View Community Dashboard</button>
        </div>`;
    animateMissionBox();
    document.getElementById("ecoSurveyForm")?.addEventListener("submit", submitSurvey);
}

function submitSurvey(event) {
    event.preventDefault();
    const issue = document.getElementById("surveyIssue")?.value;
    const concern = document.getElementById("surveyConcern")?.value;
    const action = document.getElementById("surveyAction")?.value;
    if (!issue || !concern || !action) {
        showToast("⚠️ Please answer all questions.");
        return;
    }

    const response = { issue, concern, action, ecoScore: calculateEcoScore(), timestamp: new Date().toISOString() };
    const responses = JSON.parse(localStorage.getItem("ecoQuestSurvey") || "[]");
    responses.push(response);
    localStorage.setItem("ecoQuestSurvey", JSON.stringify(responses));
    sendSurveyToGoogleSheets(response);

    const message = document.getElementById("surveyMessage");
    if (message) message.innerHTML = `<div class="success-message"><span>✅</span><div><strong>Response recorded!</strong><p>Thank you for contributing to EcoQuest.</p></div></div>`;
    document.getElementById("ecoSurveyForm")?.reset();
    playSound("success");
}

function sendSurveyToGoogleSheets(response) {
    const params = new URLSearchParams({ issue: response.issue, concern: response.concern, action: response.action, ecoScore: response.ecoScore });
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    }).then(() => console.log("EcoQuest survey request completed.")).catch(err => console.error("Survey submission error:", err));
}

// ============================================================
// 📊 CENTRAL COMMUNITY DASHBOARD
// ============================================================
function showSurveyResults() {
    const box = document.querySelector(".mission-box");
    if (!box) return;
    box.innerHTML = `<div class="community-loading"><div class="community-loading-icon">🌍</div><h2>Connecting to Community Dashboard</h2><p>Collecting the latest EcoQuest survey insights...</p><div class="dashboard-loader"></div></div>`;
    animateMissionBox();
    loadCentralDashboardData();
}

function loadCentralDashboardData() {

    const callbackName = "ecoQuestDashboardCallback";

    const script = document.createElement("script");

    let finished = false;

    // Remove previous callback if it exists
    delete window[callbackName];

    window[callbackName] = function(data) {

        if (finished) return;

        finished = true;

        console.log("✅ DASHBOARD DATA RECEIVED:", data);

        delete window[callbackName];
        script.remove();

        if (!data || data.success !== true) {

            console.error("❌ DASHBOARD ERROR:", data);

            showDashboardError(
                data?.error || "Unable to load community data."
            );

            return;
        }

        console.log("🎉 Rendering dashboard...");

        renderCentralDashboard(data);
    };


    const dashboardURL =
        GOOGLE_SCRIPT_URL +
        "?action=dashboard" +
        "&callback=" +
        callbackName +
        "&t=" +
        Date.now();


    console.log(
        "🌐 DASHBOARD URL:",
        dashboardURL
    );


    script.src = dashboardURL;
    script.async = true;


    script.onerror = function() {

        if (finished) return;

        finished = true;

        delete window[callbackName];
        script.remove();

        console.error(
            "❌ GOOGLE APPS SCRIPT FAILED TO LOAD"
        );

        showDashboardError(
            "Could not connect to the Google Sheets dashboard."
        );
    };


    document.body.appendChild(script);


    setTimeout(function() {

        if (finished) return;

        finished = true;

        delete window[callbackName];
        script.remove();

        console.error(
            "⏰ DASHBOARD REQUEST TIMED OUT"
        );

        showDashboardError(
            "The dashboard took too long to respond. Please try again."
        );

    }, 15000);
}
function renderCentralDashboard(data) {
    const box = document.querySelector(".mission-box");
    if (!box) return;
    const stats = calculateCentralStats(data);

    box.innerHTML = `
        <div class="community-dashboard">
            <div class="community-dashboard-hero"><div><span class="dashboard-eyebrow">🌍 LIVE COMMUNITY INSIGHTS</span><h1>EcoQuest Community Dashboard</h1><p>Explore what participants think about environmental issues, climate change and community action.</p></div><div class="participant-counter"><span>👥</span><strong>${stats.total}</strong><small>Total Participants</small></div></div>
            <div class="live-dashboard-status"><span class="live-dot"></span><strong>Community Data Connected</strong><span>•</span><small>Data retrieved from Google Sheets</small></div>
            <div class="insight-grid">
                <div class="insight-card"><span class="insight-icon">🔎</span><small>MOST CONCERNING ISSUE</small><strong>${stats.mostIssue}</strong><p>${stats.mostIssueCount} participant${stats.mostIssueCount === 1 ? "" : "s"}</p></div>
                <div class="insight-card"><span class="insight-icon">🌱</span><small>MOST PREFERRED ACTION</small><strong>${stats.mostAction}</strong><p>${stats.mostActionCount} participant${stats.mostActionCount === 1 ? "" : "s"}</p></div>
                <div class="insight-card"><span class="insight-icon">💭</span><small>CLIMATE CONCERN</small><strong>${stats.topConcern}</strong><p>${stats.topConcernPercentage}% of participants</p></div>
                <div class="insight-card"><span class="insight-icon">📊</span><small>SURVEY RESPONSES</small><strong>${stats.total}</strong><p>Across the community</p></div>
            </div>
            <div class="dashboard-section"><div class="section-heading"><span>📈</span><div><h2>Community Insights</h2><p>Interactive visualization of recorded community responses.</p></div></div><div class="chart-grid">
                <div class="chart-card"><h3>🌍 Environmental Issues</h3><div class="chart-container"><canvas id="issueChart"></canvas></div></div>
                <div class="chart-card"><h3>💭 Climate Concern</h3><div class="chart-container"><canvas id="concernChart"></canvas></div></div>
                <div class="chart-card"><h3>🌱 Preferred Actions</h3><div class="chart-container"><canvas id="actionChart"></canvas></div></div>
            </div></div>
            <div class="dashboard-section findings-section"><div class="section-heading"><span>🔎</span><div><h2>Key Findings</h2><p>Insights derived directly from community survey responses.</p></div></div><div class="findings-list">${createKeyFindings(stats)}</div></div>
            <div class="dashboard-section recommendation-section"><div class="section-heading"><span>💡</span><div><h2>Community Recommendations</h2><p>Suggested actions based on the survey findings.</p></div></div><div class="recommendation-list">${createRecommendations(stats)}</div></div>
            <div class="data-note live-data-note"><span>☁️</span><p><strong>Centralized data:</strong> This dashboard retrieves survey responses from the EcoQuest Google Sheet. Participant names, emails and phone numbers are not collected by the survey.</p></div>
            <div class="dashboard-actions"><button class="eco-btn primary-btn" onclick="showCommunitySurvey()">📝 Add Survey Response</button><button class="eco-btn secondary-btn" onclick="loadCentralDashboardData()">🔄 Refresh Dashboard</button><button class="eco-btn secondary-btn" onclick="showFinalDashboard()">🏆 EcoQuest Results</button></div>
        </div>`;

    animateMissionBox();
    setTimeout(() => createCentralCharts(stats), 100);
}

function calculateCentralStats(data) {
    const issueCounts = data.issueCounts || {};
    const concernCounts = data.concernCounts || {};
    const actionCounts = data.actionCounts || {};
    const total = Number(data.total || 0);

    const mostCommon = counts => {
        const entries = Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]));
        return entries.length ? { name: entries[0][0], count: Number(entries[0][1]) } : { name: "No data", count: 0 };
    };

    const issue = mostCommon(issueCounts);
    const concern = mostCommon(concernCounts);
    const action = mostCommon(actionCounts);
    return {
        total, issueCounts, concernCounts, actionCounts,
        mostIssue: issue.name, mostIssueCount: issue.count,
        mostAction: action.name, mostActionCount: action.count,
        topConcern: concern.name, topConcernCount: concern.count,
        topConcernPercentage: total ? Math.round(concern.count / total * 100) : 0
    };
}

function createCentralCharts(stats) {
    if (typeof Chart === "undefined") return;
    const issueCanvas = document.getElementById("issueChart");
    const concernCanvas = document.getElementById("concernChart");
    const actionCanvas = document.getElementById("actionChart");
    if (!issueCanvas || !concernCanvas || !actionCanvas) return;

    [issueChartInstance, concernChartInstance, actionChartInstance].forEach(chart => chart?.destroy());

    issueChartInstance = new Chart(issueCanvas, {
        type: "doughnut",
        data: { labels: Object.keys(stats.issueCounts), datasets: [{ data: Object.values(stats.issueCounts), borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: c => `${c.label}: ${c.raw} (${stats.total ? Math.round(c.raw / stats.total * 100) : 0}%)` } } } }
    });

    concernChartInstance = new Chart(concernCanvas, {
        type: "bar",
        data: { labels: Object.keys(stats.concernCounts), datasets: [{ label: "Participants", data: Object.values(stats.concernCounts), borderWidth: 1 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } }
    });

    actionChartInstance = new Chart(actionCanvas, {
        type: "bar",
        data: { labels: Object.keys(stats.actionCounts), datasets: [{ label: "Participants", data: Object.values(stats.actionCounts), borderWidth: 1 }] },
        options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } }
    });
}

function createKeyFindings(stats) {
    if (!stats.total) return `<div class="finding-item"><span>!</span><div><strong>No responses yet</strong><p>Complete the community survey to generate findings.</p></div></div>`;
    return `
        <div class="finding-item"><span>1</span><div><strong>Environmental priority</strong><p><b>${stats.mostIssue}</b> was the most frequently selected concern, with ${stats.mostIssueCount} response${stats.mostIssueCount === 1 ? "" : "s"}.</p></div></div>
        <div class="finding-item"><span>2</span><div><strong>Climate concern</strong><p>The most common concern level was <b>${stats.topConcern}</b>, representing ${stats.topConcernPercentage}% of recorded responses.</p></div></div>
        <div class="finding-item"><span>3</span><div><strong>Community preference</strong><p><b>${stats.mostAction}</b> was the most frequently preferred community action, selected ${stats.mostActionCount} time${stats.mostActionCount === 1 ? "" : "s"}.</p></div></div>`;
}

function createRecommendations(stats) {
    const map = {
        Energy: ["⚡", "Energy Awareness", "Promote energy-efficient appliances, LED lighting and responsible electricity use."],
        Waste: ["♻️", "Waste Segregation", "Encourage source segregation, recycling and responsible disposal practices."],
        Water: ["💧", "Water Conservation", "Promote leak prevention, responsible water use and suitable rainwater harvesting."],
        Transportation: ["🚲", "Cleaner Mobility", "Encourage public transportation, walking, cycling and shared mobility."],
        "Green Spaces": ["🌳", "Greener Public Spaces", "Support tree care, community parks and protection of existing green spaces."]
    };
    const recommendations = [];
    if (map[stats.mostIssue]) recommendations.push(createRecommendation(...map[stats.mostIssue]));
    recommendations.push(createRecommendation("📚", "Environmental Education", "Use interactive activities such as EcoQuest to help community members understand environmental decisions."));
    recommendations.push(createRecommendation("🤝", "Community Participation", "Encourage residents to participate in practical local environmental activities."));
    return recommendations.join("");
}

function createRecommendation(icon, title, description) {
    return `<div class="recommendation-item"><span class="recommendation-icon">${icon}</span><div><strong>${title}</strong><p>${description}</p></div></div>`;
}

function showDashboardError(message) {
    const box = document.querySelector(".mission-box");
    if (!box) return;
    box.innerHTML = `<div class="empty-dashboard"><div class="empty-dashboard-icon">⚠️</div><h2>Dashboard Connection Problem</h2><p>${message}</p><div class="dashboard-error-help"><strong>Check:</strong><ul><li>Google Apps Script is deployed as a Web App</li><li>Access is set to Anyone</li><li>The Google Sheet contains the "Survey Responses" sheet</li><li>GOOGLE_SCRIPT_URL is correct</li></ul></div><button class="eco-btn primary-btn" onclick="loadCentralDashboardData()">🔄 Try Again</button><button class="eco-btn secondary-btn" onclick="showCommunitySurvey()">📝 Back to Survey</button></div>`;
    animateMissionBox();
}

// ============================================================
// 🔔 TOAST
// ============================================================
function showToast(message) {
    let toast = document.querySelector(".eco-toast");
    if (!toast) { toast = document.createElement("div"); toast.className = "eco-toast"; document.body.appendChild(toast); }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ============================================================
// 🔊 SOUND
// ============================================================
function createSoundButton() {
    if (document.querySelector(".sound-toggle")) return;
    const button = document.createElement("button");
    button.className = "sound-toggle";
    button.innerHTML = soundEnabled ? "🔊" : "🔇";
    button.title = "Toggle EcoQuest sound";
    button.onclick = () => { soundEnabled = !soundEnabled; button.innerHTML = soundEnabled ? "🔊" : "🔇"; if (soundEnabled) playSound("click"); };
    document.body.appendChild(button);
}

function playSound(type) {
    if (!soundEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        const now = ctx.currentTime;
        const tones = type === "success" ? [523, 659, 784] : type === "undo" ? [500, 350] : type === "decision" ? [440, 600] : [500];
        tones.forEach((tone, i) => osc.frequency.setValueAtTime(tone, now + i * 0.1));
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.25, tones.length * 0.1 + 0.1));
        osc.start(now);
        osc.stop(now + Math.max(0.25, tones.length * 0.1 + 0.1));
    } catch (_) {}
}

// ============================================================
// 🎨 REQUIRED POLISH CSS
// ============================================================
function injectStyles() {
    if (document.getElementById("eco-clean-script-styles")) return;
    const style = document.createElement("style");
    style.id = "eco-clean-script-styles";
    style.textContent = `
        .eco-loading{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(4,20,12,.72);backdrop-filter:blur(8px);z-index:99999;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .25s ease,visibility .25s ease}
        .eco-loading.active{opacity:1;visibility:visible;pointer-events:auto}
        .eco-loading-box{text-align:center;padding:32px;border-radius:24px;background:rgba(255,255,255,.97);box-shadow:0 25px 80px rgba(0,0,0,.25)}
        .eco-loading-icon{font-size:52px;animation:ecoEarth 1.2s infinite ease-in-out}@keyframes ecoEarth{50%{transform:scale(1.12) rotate(8deg)}}
        .eco-spinner{width:34px;height:34px;margin:15px auto;border:4px solid #dcefe4;border-top-color:#198754;border-radius:50%;animation:ecoSpin .8s linear infinite}@keyframes ecoSpin{to{transform:rotate(360deg)}}
        .eco-screen-enter{animation:ecoEnter .45s ease both}@keyframes ecoEnter{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        .sound-toggle{position:fixed;right:20px;bottom:20px;width:48px;height:48px;border:0;border-radius:50%;background:#fff;box-shadow:0 8px 25px rgba(0,0,0,.15);font-size:21px;cursor:pointer;z-index:9000}
        .eco-toast{position:fixed;left:50%;bottom:80px;transform:translate(-50%,20px);padding:13px 20px;border-radius:13px;background:#163b29;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.2);opacity:0;pointer-events:none;transition:.3s;z-index:100000}.eco-toast.show{opacity:1;transform:translate(-50%,0)}
        .learning-card{margin-top:22px;padding:20px;border-radius:18px;background:rgba(25,135,84,.06)}.learning-card-header{display:flex;gap:12px}.learning-card-header>span{font-size:28px}.learning-card-header h3{margin:0}.learning-card-header p{margin:4px 0;opacity:.65}.learning-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:15px}.learning-item{display:flex;gap:10px;padding:14px;border-radius:14px;background:#fff}.learning-item>span{font-size:22px}.learning-item strong{display:block}.learning-item p{margin:5px 0 0;line-height:1.5;opacity:.72}
        .community-loading{text-align:center;padding:50px 20px}.community-loading-icon{font-size:60px;animation:ecoEarth 1.2s infinite ease-in-out}.dashboard-loader{width:34px;height:34px;margin:18px auto;border:4px solid #dcefe4;border-top-color:#198754;border-radius:50%;animation:ecoSpin .8s linear infinite}
        .live-dashboard-status{display:flex;gap:8px;align-items:center;margin:12px 0 22px;padding:12px 15px;border-radius:14px;background:rgba(25,135,84,.07)}.live-dot{width:9px;height:9px;border-radius:50%;background:#198754;box-shadow:0 0 0 5px rgba(25,135,84,.12)}
        .score-ring{width:190px;height:190px;margin:25px auto;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle,#fff 56%,transparent 57%),conic-gradient(#198754 0deg,#198754 calc(var(--score,0)*3.6deg),#dcefe4 calc(var(--score,0)*3.6deg))}.score-number{font-size:44px;font-weight:900}.score-label{font-size:10px;font-weight:800;opacity:.55}
        @media(max-width:900px){.learning-grid{grid-template-columns:1fr}}@media(max-width:600px){.sound-toggle{right:12px;bottom:12px}}
    `;
    document.head.appendChild(style);
}


