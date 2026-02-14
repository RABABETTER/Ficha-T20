// --- CONFIGURAÇÃO ---
// Defina como TRUE para rodar no GitHub Pages sem configurar banco de dados real
const USE_OFFLINE_MODE = true; 

// --- DADOS PADRÃO (FALLBACK) ---
const DEFAULT_RACES = [ { "id": "r1", "name": "Anão", "source": "T20 - Livro Básico - Jogo do Ano", "bonuses": "CON: 2, SAB: 1, DES: -1", "attributeChoices": 0, "attributeBonus": 0, "attributeRestrictions": "", "tipoCriatura": "Humanoide", "tamanho": "Médio", "ataquesNaturais": "", "abilities": "Conhecimento das Rochas, Devagar e Sempre, Duro como Pedra, Tradição de Heredrimm" } ];
const DEFAULT_ORIGINS = [ { "id": "o1", "name": "Acólito", "items": "Símbolo sagrado, Traje de sacerdote", "power": "Membro da Igreja", "source": "T20 - Livro Básico - Jogo do Ano", "numBeneficios": 2, "benefits_skills": "Vontade, Religião", "benefits_powers": "Curandeiro, Medicina" } ];
const DEFAULT_DIVINITIES = [ { "id": "d1", "name": "Aharadak", "canalizarEnergia": "Negativa", "armaPreferida": "Corrente de espinhos", "powers": "Afinidade com a Tormenta, Êxtase da Loucura, Percepção Temporal, Rejeição Divina, Corromper Equipamento, Espalhar a Corrupção, Júbilo na Dor, Mediador da Tempestade", "obrigaçõesRestricoes": "No início de qualquer cena de ação, role 1d6. Com um resultado ímpar, você fica fascinado na primeira rodada, perdido em devaneios sobre a futilidade da vida (mesmo que seja imune a esta condição).", "source": "T20 - Livro Básico - Jogo do Ano" } ];
const DEFAULT_POWERS = [ {"id": "p1", "name": "Acuidade com Arma", "type": "Combate", "prerequisites": "Des 1", "description": "Usa Destreza em vez de Força para ataques e danos com armas leves ou de arremesso."} ];
const DEFAULT_CLASSES = [
    { "id": "c1", "name": "Arcanista", "pvInicial": 8, "pvPerLevel": 2, "pmPerLevel": 6, "periciasDeClasse": "Misticismo, Vontade", "numPericiasAdicionais": 2, "periciasAdicionais": "Conhecimento, Diplomacia, Enganação, Guerra, Iniciativa, Intimidação, Intuição, Investigação, Nobreza, Ofício, Percepção", "levelAbilities": "1: Caminho do Arcanista, 1: Magias (1º Círculo), 2: Poder de Arcanista, 3: Poder de Arcanista, 4: Poder de Arcanista, 5: Magias (2º Círculo), 5: Poder de Arcanista, 6: Poder de Arcanista, 7: Poder de Arcanista, 8: Poder de Arcanista, 9: Magias (3º Círculo), 9: Poder de Arcanista, 10: Poder de Arcanista, 11: Poder de Arcanista, 12: Poder de Arcanista, 13: Magias (4º Círculo), 13: Poder de Arcanista, 14: Poder de Arcanista, 15: Poder de Arcanista, 16: Poder de Arcanista, 17: Magias (5º Círculo), 17: Poder de Arcanista, 18: Poder de Arcanista, 19: Poder de Arcanista, 20: Alta Arcana, 20: Poder de Arcanista", "effects": "num_poderes_concedidos: 1", "choices": JSON.stringify([ { "level": 1, "key": "caminho_arcanista", "label": "Caminho do Arcanista", "type": "select", "options": [ {"value": "bruxo", "label": "Bruxo", "description": "Você se aprofunda em magias que amaldiçoam e debilitam seus inimigos. Seu atributo-chave para magias é Carisma.", "effects": "attribute_magic: CAR"}, {"value": "feiticeiro", "label": "Feiticeiro", "description": "Seu poder mágico é inato. Você lança magias de forma intuitiva e poderosa. Seu atributo-chave para magias é Carisma.", "effects": "attribute_magic: CAR"}, {"value": "mago", "label": "Mago", "description": "Você é um estudioso da magia, aprendendo através de tomos e pergaminhos. Seu atributo-chave para magias é Inteligência.", "effects": "attribute_magic: INT"} ] } ]), "source": "T20 - Livro Básico - Jogo do Ano" },
    { "id": "c2", "name": "Bucaneiro", "pvInicial": 16, "pvPerLevel": 4, "pmPerLevel": 3, "periciasDeClasse": "Luta ou Pontaria, Reflexos", "numPericiasAdicionais": 4, "periciasAdicionais": "Acrobacia, Atletismo, Atuação, Enganação, Fortitude, Furtividade, Iniciativa, Intimidação, Jogatina, Luta, Ofício, Percepção, Pilotagem, Pontaria", "levelAbilities": "1: Audácia, 1: Insolência, 2: Evasão, 2: Poder de Bucaneiro, 3: Esquiva Sagaz, 3: Poder de Bucaneiro, 4: Poder de Bucaneiro, 5: Panache, 5: Poder de Bucaneiro, 6: Poder de Bucaneiro, 7: Esquiva Sagaz, 7: Poder de Bucaneiro, 8: Poder de Bucaneiro, 9: Poder de Bucaneiro, 10: Evasão Aprimorada, 10: Poder de Bucaneiro, 11: Esquiva Sagaz, 11: Poder de Bucaneiro, 12: Poder de Bucaneiro, 13: Poder de Bucaneiro, 14: Poder de Bucaneiro, 15: Esquiva Sagaz, 15: Poder de Bucaneiro, 16: Poder de Bucaneiro, 17: Poder de Bucaneiro, 18: Poder de Bucaneiro, 19: Esquiva Sagaz, 19: Poder de Bucaneiro, 20: Sorte de Nimb, 20: Poder de Bucaneiro", "source": "T20 - Livro Básico - Jogo do Ano" }
];
const DEFAULT_ITEMS = [];
const DEFAULT_WEAPONS = [];
const DEFAULT_ARMORS = [];
const DEFAULT_SPELLS = [];

// --- FIREBASE IMPORTS (Mantidos para não quebrar referências, mas não usados no modo offline) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, addDoc, setDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Tenta inicializar o Firebase, se falhar, ativa modo offline silenciosamente
let app, db, auth;
try {
    const finalFirebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : { apiKey: "dummy" }; // Config falsa para não quebrar o import
    if (!USE_OFFLINE_MODE) {
        app = initializeApp(finalFirebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
    }
} catch (e) {
    console.log("Modo Offline Ativado (Firebase não configurado).");
}

// --- STATE & CONFIG ---
const state = {
    races: [], classes: [], origins: [], divinities: [], powers: [], items: [], weapons: [], armors: [], spells: [],
    userId: USE_OFFLINE_MODE ? 'offline-user' : null,
    allowedSources: ["Todos"],
    showTechnicalModifierNames: false,
    currentCharacter: { race: null, class: null, origin: null, divinity: null, level: 1, baseAttributes: { FOR:0, DES:0, CON:0, INT:0, SAB:0, CAR:0 }, pointBuyTotal: 10, chosenAttributes: {}, chosenClassSkills: {}, chosenClassFixedSkills: {}, chosenOriginBenefits: {}, chosenDivinityPowers: {}, classChoices: {}, trainedSkills: [], learnedSpells: [], currentHP: 0, currentPM: 0, spellAttribute: 'INT', skillAttributes: {}, defenseAttribute: 'DES', equippedArmor: null, equippedShield: null, generalChoices: {}, activeConditions: [] }
};

const collections = {
    races: `races`, classes: `classes`, origins: `origins`, divinities: `divinities`,
    powers: `powers`, items: `items`, weapons: `weapons`, armors: `armors`, spells: `spells`,
};

const SKILL_DEFAULT_ATTR = { Acrobacia: 'DES', Adestramento: 'CAR', Atletismo: 'FOR', Atuação: 'CAR', Cavalgar: 'DES', Conhecimento: 'INT', Cura: 'SAB', Diplomacia: 'CAR', Enganação: 'CAR', Fortitude: 'CON', Furtividade: 'DES', Guerra: 'INT', Iniciativa: 'DES', Intimidação: 'CAR', Intuição: 'SAB', Investigação: 'INT', Jogatina: 'CAR', Ladinagem: 'DES', Luta: 'FOR', Misticismo: 'INT', Nobreza: 'INT', Ofício: 'INT', Percepção: 'SAB', Pilotagem: 'DES', Pontaria: 'DES', Reflexos: 'DES', Religião: 'SAB', Sobrevivência: 'SAB', Vontade: 'SAB' };
const ALL_ATTRIBUTES = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];
const SOURCES = ["Todos", "T20 - Livro Básico - Jogo do Ano", "T20 - Deuses de Arton", "T20 - Heróis de Arton", "T20 - Ameaças de Arton", "T20 - Atlas de Arton", "Jornadas Heroicas", "T20 - Guia de NPCS", "Dragão Brasil", "A Lenda de Ruff Ghanor", "Homebrews"];
const POINT_BUY_COST = { '-1': -1, '0': 0, '1': 1, '2': 2, '3': 4, '4': 7 };

let FIXED_MODIFIERS = [
    { key: "bonus_ataque_corpoacorpo", name: "Bônus em Ataques Corpo a Corpo", value: 0, category: 'Combate' },
    { key: "bonus_ataque_adistancia", name: "Bônus em Ataques à Distância", value: 0, category: 'Combate' },
    { key: "bonus_dano_corpoacorpo", name: "Bônus em Dano Corpo a Corpo", value: 0, category: 'Combate' },
    { key: "bonus_dano_adistancia", name: "Bônus em Dano à Distância", value: 0, category: 'Combate' },
    ...ALL_ATTRIBUTES.map(attr => ({ key: `soma_${attr.toLowerCase()}_dano_corpoacorpo`, name: `Soma ${capitalize(attr.toLowerCase())} no Dano Corpo a Corpo`, value: 0, category: 'Combate', isBool: true})),
    ...ALL_ATTRIBUTES.map(attr => ({ key: `soma_${attr.toLowerCase()}_dano_distancia`, name: `Soma ${capitalize(attr.toLowerCase())} no Dano à Distância`, value: 0, category: 'Combate', isBool: true})),
    { key: "aumento_passo_dano_geral", name: "Aumento de Passo de Dano (Geral)", value: 0, category: 'Combate'},
    { key: "aumento_passo_dano_arremesso", name: "Aumento de Passo (Arremesso)", value: 0, category: 'Combate' },
    { key: "aumento_passo_dano_fogo", name: "Aumento de Passo (Arma de Fogo)", value: 0, category: 'Combate' },
    { key: "bonus_ataque_machados_martelos", name: "Bônus de Ataque (Machados/Martelos)", value: 0, category: 'Combate' },
    { key: "bonus_ataque_armas_especificas", name: "Bônus de Ataque (Armas Específicas)", value: 0, category: 'Combate' },
    { key: "bonus_dano_armas_especificas", name: "Bônus de Dano (Armas Específicas)", value: 0, category: 'Combate' },
    { key: "aumento_multiplicador_critico", name: "Aumento no Multiplicador de Crítico", value: 0, category: 'Combate'},
    { key: "aumento_margem_ameaca", name: "Aumento na Margem de Ameaça", value: 0, category: 'Combate'},
    { key: "ignora_rd", name: "Ignora Redução de Dano", value: 0, category: 'Combate'},
    { key: "bonus_armadura", name: "Outros Bônus na Defesa", value: 0, category: 'Defesa e Resistências'},
    { key: "penalidade_armadura_outros", name: "Outras Penalidades de Armadura", value: 0, category: 'Defesa e Resistências'},
    ...ALL_ATTRIBUTES.map(attr => ({ key: `soma_${attr.toLowerCase()}_na_defesa`, name: `Soma ${capitalize(attr.toLowerCase())} na Defesa`, value: 0, category: 'Defesa e Resistências', isBool: true})),
    { key: "rd_total", name: "Resistência a Dano Total", value: 0, category: 'Defesa e Resistências' },
    { key: "rd_fisico", name: "Resistência a Dano Físico", value: 0, category: 'Defesa e Resistências' },
    { key: "res_acido", name: "Resistência a Ácido", value: 0, category: 'Defesa e Resistências' }, { key: "res_corte", name: "Resistência a Corte", value: 0, category: 'Defesa e Resistências' }, { key: "res_eletricidade", name: "Resistência a Eletricidade", value: 0, category: 'Defesa e Resistências' }, { key: "res_essencia", name: "Resistência a Essência", value: 0, category: 'Defesa e Resistências' }, { key: "res_fogo", name: "Resistência a Fogo", value: 0, category: 'Defesa e Resistências' }, { key: "res_frio", name: "Resistência a Frio", value: 0, category: 'Defesa e Resistências' }, { key: "res_impacto", name: "Resistência a Impacto", value: 0, category: 'Defesa e Resistências' }, { key: "res_luz", name: "Resistência a Luz", value: 0, category: 'Defesa e Resistências' }, { key: "res_mental", name: "Resistência a Mental", value: 0, category: 'Defesa e Resistências' }, { key: "res_perfuracao", name: "Resistência a Perfuração", value: 0, category: 'Defesa e Resistências' }, { key: "res_trevas", name: "Resistência a Trevas", value: 0, category: 'Defesa e Resistências' }, { key: "res_veneno", name: "Resistência a Veneno", value: 0, category: 'Defesa e Resistências' },
    { key: "vul_acido", name: "Vulnerabilidade a Ácido", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_corte", name: "Vulnerabilidade a Corte", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_eletricidade", name: "Vulnerabilidade a Eletricidade", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_essencia", name: "Vulnerabilidade a Essência", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_fogo", name: "Vulnerabilidade a Fogo", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_frio", name: "Vulnerabilidade a Frio", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_impacto", name: "Vulnerabilidade a Impacto", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_luz", name: "Vulnerabilidade a Luz", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_mental", name: "Vulnerabilidade a Mental", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_perfuracao", name: "Vulnerabilidade a Perfuração", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_trevas", name: "Vulnerabilidade a Trevas", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "vul_veneno", name: "Vulnerabilidade a Veneno", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "imune_doenca", name: "Imunidade a Doença", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true}, { key: "imune_fadiga", name: "Imunidade a Fadiga", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true}, { key: "imune_veneno", name: "Imunidade a Veneno", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true}, { key: "imune_sangramento", name: "Imunidade a Sangramento", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true}, { key: "imune_fogo", name: "Imunidade a Fogo", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "imune_frio", name: "Imunidade a Frio", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "imune_acido", name: "Imunidade a Ácido", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true }, { key: "imune_eletricidade", name: "Imunidade a Eletricidade", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "PV_adc", name: "Vida Adicional", value: 0, category: 'Recursos' }, { key: "PV_adc_nivel", name: "Vida por Nível", value: 0, category: 'Recursos' }, { key: "PV_adc_impar", name: "Vida por Nível Ímpar", value: 0, category: 'Recursos' },
    ...ALL_ATTRIBUTES.map(attr => ({ key: `soma_${attr.toLowerCase()}_pv_total`, name: `Soma ${capitalize(attr.toLowerCase())} nos PV Totais`, value: 0, category: 'Recursos', isBool: true})),
    { key: "PM_adc", name: "Mana Adicional", value: 0, category: 'Recursos' }, { key: "PM_adc_nivel", name: "Mana por Nível", value: 0, category: 'Recursos' }, { key: "PM_adc_impar", name: "Mana por Nível Ímpar", value: 0, category: 'Recursos' },
    ...ALL_ATTRIBUTES.map(attr => ({ key: `soma_${attr.toLowerCase()}_pm_total`, name: `Soma ${capitalize(attr.toLowerCase())} nos PM Totais`, value: 0, category: 'Recursos', isBool: true})),
    { key: "deslocamento", name: "Bônus de Deslocamento", value: 0, category: 'Movimento' }, { key: "deslocamento_escalada", name: "Deslocamento de Escalada", value: 0, category: 'Movimento' }, { key: "deslocamento_natacao", name: "Deslocamento de Natação", value: 0, category: 'Movimento' }, { key: "imune_penalidade_desloc_armadura", name: "Imune a Penalidade de Deslocamento por Armadura", value: 0, category: 'Movimento', isBool: true },
    { key: "per_apren", name: "Perícias Adicionais para Treinar", value: 0, category: 'Outros' }, { key: "num_poderes_concedidos", name: "Número de Poderes Concedidos", value: 0, category: 'Outros' }, { key: "bonus_cd", name: "Bônus em CD de Magia", value: 0, category: 'Outros' }, { key: "aumento_limite_carga", name: "Aumento de Limite de Carga", value: 0, category: 'Outros' }, { key: "melhora_condicao_descanso", name: "Melhora na Condição de Descanso", value: 0, category: 'Outros' }, { key: "reducao_custo_magia_repetida", name: "Redução de Custo por Magia Repetida", value: 0, category: 'Outros' }, { key: "poderes_divindade", name: "Poderes Concedidos pela Divindade", value: 0, category: 'Outros' },
    { key: "bonus_ataque_armas_simples", name: "Bônus de Ataque (Armas Simples)", value: 0, category: 'Proficiências' }, { key: "bonus_ataque_armas_marciais", name: "Bônus de Ataque (Armas Marciais)", value: 0, category: 'Proficiências' }, { key: "bonus_ataque_armas_exoticas", name: "Bônus de Ataque (Armas Exóticas)", value: 0, category: 'Proficiências' }, { key: "bonus_ataque_armas_fogo", name: "Bônus de Ataque (Armas de Fogo)", value: 0, category: 'Proficiências' }, { key: "reducao_penalidade_armaduras_leves", name: "Redução Penalidade (Armaduras Leves)", value: 0, category: 'Proficiências' }, { key: "reducao_penalidade_armaduras_pesadas", name: "Redução Penalidade (Armaduras Pesadas)", value: 0, category: 'Proficiências' }, { key: "reducao_penalidade_escudos", name: "Redução Penalidade (Escudos)", value: 0, category: 'Proficiências' },
];
Object.keys(SKILL_DEFAULT_ATTR).forEach(skill => {
    FIXED_MODIFIERS.push({key: `bonus_pericia_${skill}`, name: `Bônus em ${skill}`, value: 0, category: 'Perícias'});
});

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    if (USE_OFFLINE_MODE) {
        initializeAppListeners();
    } else {
        auth.onAuthStateChanged(user => { 
            if (user && !state.userId) { 
                state.userId = user.uid; 
                initializeAppListeners(); 
            } 
        });
        // Tenta login anônimo se configurado
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { 
            signInWithCustomToken(auth, __initial_auth_token).catch(() => signInAnonymously(auth)); 
        } else { 
            signInAnonymously(auth); 
        }
    }
});

function initializeAppListeners() {
    setupTabNavigation();
    setupDataSubscriptions();
    setupModalControls();
    setupAdminButtonListeners();
    setupCharacterSheetListeners();
    setupAdminEventListeners(); 
    renderAllowedSourcesFilter();
    setupPointBuyCalculator();
}

// --- DATA FETCHING & SEEDING ---
function setupDataSubscriptions() {
    if (USE_OFFLINE_MODE) {
        // Load Mock Data
        state.races = DEFAULT_RACES;
        state.classes = DEFAULT_CLASSES;
        state.origins = DEFAULT_ORIGINS;
        state.divinities = DEFAULT_DIVINITIES;
        state.powers = DEFAULT_POWERS;
        state.items = DEFAULT_ITEMS;
        state.weapons = DEFAULT_WEAPONS;
        state.armors = DEFAULT_ARMORS;
        state.spells = DEFAULT_SPELLS;

        // Trigger Initial Renders
        orchestrateSheetUpdate({ resetHPPM: true, updateChoicesUI: true });
        // Trigger Initial Renders
        if (typeof window.renderRacesList === 'function') window.renderRacesList();
        if (typeof window.renderClassesList === 'function') window.renderClassesList();
        if (typeof window.renderOriginsList === 'function') window.renderOriginsList();
        if (typeof window.renderDivinitiesList === 'function') window.renderDivinitiesList();
        if (typeof window.renderPowersList === 'function') window.renderPowersList();
        if (typeof window.renderItemsList === 'function') window.renderItemsList();
        if (typeof window.renderWeaponsList === 'function') window.renderWeaponsList();
        if (typeof window.renderArmorsList === 'function') window.renderArmorsList();
        if (typeof window.renderSpellsList === 'function') window.renderSpellsList();

        if (typeof window.populateRaceSelect === 'function') window.populateRaceSelect();
        if (typeof window.populateClassLvl1Select === 'function') window.populateClassLvl1Select();
        if (typeof window.populateOriginSelect === 'function') window.populateOriginSelect();
        if (typeof window.populateDivinitySelect === 'function') window.populateDivinitySelect();

        populateEquipmentSelects();

        // Hide Loading
        document.getElementById('loading').classList.add('hidden'); 
        document.getElementById('app-content').classList.remove('hidden'); 
    } else {
        // Original Firebase Logic (mantido para referência ou uso futuro)
        const dataTypes = Object.keys(collections);
        let loadedCount = 0;
        const checkAllDataLoaded = () => { 
            if (++loadedCount === dataTypes.length) { 
                document.getElementById('loading').classList.add('hidden'); 
                document.getElementById('app-content').classList.remove('hidden'); 
                populateEquipmentSelects(); 
                orchestrateSheetUpdate({ resetHPPM: true, updateChoicesUI: true }); 
            }
        };
        
        dataTypes.forEach(type => onSnapshot(collection(db, collections[type]), (snapshot) => {
            state[type] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (type === 'powers') {
                const firestorePowerNames = new Set(state.powers.map(p => p.name));
                const powersToAdd = DEFAULT_POWERS.filter(dp => !firestorePowerNames.has(dp.name));
                state.powers.push(...powersToAdd);
            }
            state[type].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            window[`render${capitalize(type)}List`]?.();
            if (['races', 'classes', 'origins', 'divinities'].includes(type)) {
                window[`populate${capitalize(type.slice(0, -1))}Select`]?.();
            }
            checkAllDataLoaded();
        }, (error) => console.error(`Erro ao buscar ${type}:`, error)));
    }
}

// --- ORQUESTRADOR DE ATUALIZAÇÃO ---
function orchestrateSheetUpdate(options = {}) {
    const { resetHPPM = false, updateChoicesUI = false, only = [] } = options;
    if (!state.userId) return;

    const stats = calculateCharacterStats();
    const shouldUpdate = (section) => only.length === 0 || only.includes(section);

    if (updateChoicesUI) renderChoiceUI(stats);
    if (shouldUpdate('summary')) renderSummarySection(stats);
    if (shouldUpdate('divinity')) renderDivinitySection(stats);
    if (shouldUpdate('attributes')) renderAttributesSection(stats);
    if (shouldUpdate('resources')) renderResourcesSection(stats, resetHPPM);
    if (shouldUpdate('defense')) renderDefenseSection(stats);
    if (shouldUpdate('magic')) renderMagicSection(stats);
    if (shouldUpdate('learnedSpells')) renderLearnedSpells();
    if (shouldUpdate('conditions')) renderConditionsSection(stats);
    if (shouldUpdate('skills')) renderSkillsSection(stats);
    if (shouldUpdate('abilities')) renderAbilitiesAndItemsSection(stats);
    if (shouldUpdate('modifiers')) renderGlobalModifiersSection(stats);
}

// --- LÓGICA DE CÁLCULO ---
function calculateCharacterStats() {
    const char = state.currentCharacter;
    const { race, level, classChoices, divinity, origin, chosenAttributes, chosenOriginBenefits, chosenClassSkills } = char;

    const finalAttributes = { ...char.baseAttributes };
    const attributeSources = ALL_ATTRIBUTES.reduce((acc, key) => ({ ...acc, [key]: [{source: 'Base', value: finalAttributes[key]}]}), {});
    const globalModifiers = FIXED_MODIFIERS.reduce((acc, mod) => ({ ...acc, [mod.key]: 0 }), {});
    const modifierSources = FIXED_MODIFIERS.reduce((acc, mod) => ({ ...acc, [mod.key]: [] }), {});
    // Apply Conditions
    if (char.activeConditions) {
        char.activeConditions.forEach(condId => {
            const cond = CONDITIONS.find(c => c.id === condId);
            if (cond && cond.effects) {
                Object.entries(cond.effects).forEach(([effKey, val]) => {
                    if (effKey === 'bonus_pericia_all') {
                        Object.keys(SKILL_DEFAULT_ATTR).forEach(skill => {
                            const key = `bonus_pericia_${skill}`;
                            if(globalModifiers[key] !== undefined) {
                                globalModifiers[key] += val;
                                modifierSources[key].push(`Condição (${cond.name}): ${val}`);
                            }
                        });
                    } else if (effKey === 'bonus_pericia_all_no_attack') {
                        Object.keys(SKILL_DEFAULT_ATTR).forEach(skill => {
                            if (skill !== 'Luta' && skill !== 'Pontaria') {
                                const key = `bonus_pericia_${skill}`;
                                if(globalModifiers[key] !== undefined) {
                                    globalModifiers[key] += val;
                                    modifierSources[key].push(`Condição (${cond.name}): ${val}`);
                                }
                            }
                        });
                    } else if (globalModifiers[effKey] !== undefined) {
                        globalModifiers[effKey] += val;
                        modifierSources[effKey].push(`Condição (${cond.name}): ${val}`);
                    }
                });
            }
        });
    }

    if (race) {
        if (race.bonuses) {
            race.bonuses.split(',').forEach(b => {
                const [key, valStr] = b.split(':').map(s => s.trim());
                const val = parseInt(valStr);
                const upperKey = key.toUpperCase();
                if (finalAttributes[upperKey] !== undefined) {
                    finalAttributes[upperKey] += val;
                    attributeSources[upperKey].push({source: 'Raça (Fixo)', value: val});
                }
            });
        }
        if (race.attributeBonus > 0 && chosenAttributes) {
            Object.values(chosenAttributes).forEach(attrName => {
                if (attrName && finalAttributes[attrName] !== undefined) {
                    finalAttributes[attrName] += race.attributeBonus;
                    attributeSources[attrName].push({source: 'Raça (Escolha)', value: race.attributeBonus});
                }
            });
        }
        if (race.effects) {
            race.effects.split(',').forEach(eff => {
                const [key, valStr] = eff.split(':').map(s => s.trim());
                if (key && valStr) {
                    const val = parseInt(valStr);
                    if (globalModifiers[key] !== undefined) {
                        globalModifiers[key] += val;
                        modifierSources[key].push(`Raça (${race.name}): ${val >= 0 ? '+' : ''}${val}`);
                    }
                }
            });
        }
    }
    
    const classLevels = {};
    for (let i = 1; i <= level; i++) {
        const classId = classChoices[i] || classChoices[1];
        if (classId) classLevels[classId] = (classLevels[classId] || 0) + 1;
    }

    Object.keys(classLevels).forEach(classId => {
        const charClass = state.classes.find(c => c.id === classId);
        if (charClass?.effects) {
            charClass.effects.split(',').forEach(eff => {
                const [key, valStr] = eff.split(':').map(s => s.trim());
                if (key && valStr) {
                    const val = parseInt(valStr);
                    if (globalModifiers[key] !== undefined) {
                        globalModifiers[key] += val;
                        modifierSources[key].push(`Classe (${charClass.name}): ${val >= 0 ? '+' : ''}${val}`);
                    }
                }
            });
        }
    });

    const originBenefitPowers = new Set(origin?.power ? [origin.power.trim()] : []);
    const originBenefitSkills = new Set();
    Object.values(chosenOriginBenefits).forEach(benefit => {
        if (benefit) {
            const [type, value] = benefit.split(':');
            if (type === 'skill') originBenefitSkills.add(value);
            else if (type === 'power') originBenefitPowers.add(value);
        }
    });
    
    const allPowers = new Set(originBenefitPowers);
    Object.values(char.chosenDivinityPowers).forEach(p => p && allPowers.add(p));

    allPowers.forEach(powerName => {
        const power = state.powers.find(p => p.name === powerName);
        if (power?.effects) {
            power.effects.split(',').forEach(eff => {
                const [key, val] = eff.split(':').map(s => s.trim());
                const upperKey = key.toUpperCase(), parsedVal = parseInt(val);
                const modKey = `bonus_pericia_${key}`;
                if (finalAttributes[upperKey] !== undefined) {
                    finalAttributes[upperKey] += parsedVal;
                    attributeSources[upperKey].push({source: power.name, value: parsedVal});
                } else if (FIXED_MODIFIERS.find(m => m.key === modKey)) {
                    globalModifiers[modKey] += parsedVal;
                    modifierSources[modKey].push(`${power.name}: ${parsedVal >= 0 ? '+' : ''}${parsedVal}`);
                } else if (globalModifiers[key] !== undefined) {
                    globalModifiers[key] += parsedVal;
                    modifierSources[key].push(`${power.name}: ${parsedVal >= 0 ? '+' : ''}${parsedVal}`);
                }
            });
        }
    });

    let totalHP = 0, totalPM = 0;
    // Process General Choices (Class Paths, etc.)
    if (char.generalChoices) {
        Object.entries(char.generalChoices).forEach(([key, val]) => {
            Object.keys(classLevels).forEach(classId => {
                const cls = state.classes.find(c => c.id === classId);
                if (cls && cls.choices) {
                    try {
                        const choicesDef = JSON.parse(cls.choices);
                        choicesDef.forEach(cDef => {
                            if (`class_${cDef.key}` === key || `class_${cDef.key}` === key.replace('class_', '')) {
                                const option = cDef.options.find(o => o.value === val);
                                if (option && option.effects) {
                                    option.effects.split(',').forEach(eff => {
                                        const [effKey, effVal] = eff.split(':').map(s => s.trim());
                                        if (effKey === 'attribute_magic') {
                                            char.spellAttribute = effVal;
                                        } else if (globalModifiers[effKey] !== undefined) {
                                            const v = parseInt(effVal);
                                            globalModifiers[effKey] += v;
                                            modifierSources[effKey].push(`${option.label}: ${v}`);
                                        }
                                    });
                                }
                            }
                        });
                    } catch (e) {}
                }
            });
        });
    }
    const level1Class = state.classes.find(c => c.id === classChoices[1]);
    if (level1Class) {
        totalHP += level1Class.pvInicial + (finalAttributes.CON || 0);

        // PM Logic: Initial PM + Attribute Key (Default INT if not specified, but usually Class has key attribute.
        // T20 JdA: "PM Iniciais: X + mod. atributo chave".
        // Current system stores spellAttribute in char.spellAttribute (default INT).
        // Let's use that for now.
        const pmAttrKey = char.spellAttribute || 'INT';
        const pmAttrVal = finalAttributes[pmAttrKey] || 0;
        totalPM += level1Class.pmPerLevel + pmAttrVal;

        for (let i = 2; i <= level; i++) {
            const levelIClass = state.classes.find(c => c.id === (classChoices[i] || classChoices[1]));
            if (levelIClass) {
                totalHP += levelIClass.pvPerLevel + (finalAttributes.CON || 0);
                totalPM += levelIClass.pmPerLevel;
            }
        }
    }
    totalHP += (globalModifiers.PV_adc || 0) + (level * (globalModifiers.PV_adc_nivel || 0)) + (Math.ceil(level/2) * (globalModifiers.PV_adc_impar || 0));
    ALL_ATTRIBUTES.forEach(attr => { if(globalModifiers[`soma_${attr.toLowerCase()}_pv_total`]) totalHP += (finalAttributes[attr] || 0); });
    totalPM += (globalModifiers.PM_adc || 0) + (level * (globalModifiers.PM_adc_nivel || 0)) + (Math.ceil(level/2) * (globalModifiers.PM_adc_impar || 0));
    ALL_ATTRIBUTES.forEach(attr => { if(globalModifiers[`soma_${attr.toLowerCase()}_pm_total`]) totalPM += (finalAttributes[attr] || 0); });
    
    return {
        char, race, origin, divinity, classLevels,
        finalAttributes, attributeSources, globalModifiers, modifierSources,
        totalHP, totalPM, originBenefitSkills, allPowers, level1Class
    };
}

// --- FUNÇÕES DE RENDERIZAÇÃO E UI ---

function renderChoiceUI(stats) {
    const { race, origin, divinity, globalModifiers, char } = stats;
    handleChoiceUI(race);
    handleClassSkillChoiceUI(char.class);
    handleOriginChoiceUI(origin);
    handleDivinityPowerChoiceUI(divinity, globalModifiers);
}

function renderSummarySection(stats) {
    const { race, origin, classLevels } = stats;
    document.getElementById('summary-display').innerHTML = `
        <div><span class="text-sm font-medium text-gray-400">Personagem:</span> <span class="font-semibold">${document.getElementById('char-name').value || '...'}</span></div>
        <div><span class="text-sm font-medium text-gray-400">Jogador:</span> <span class="font-semibold">${document.getElementById('player-name').value || '...'}</span></div>
        <div><span class="text-sm font-medium text-gray-400">Raça:</span> <span class="font-semibold">${race?.name || '...'}</span></div>
        <div><span class="text-sm font-medium text-gray-400">Origem:</span> <span class="font-semibold">${origin?.name || '...'}</span></div>
    `;
    document.getElementById('class-summary-display').textContent = Object.entries(classLevels).map(([classId, lvl]) => `${state.classes.find(c => c.id === classId)?.name || ''} ${lvl}`).join(' / ');
}

function renderDivinitySection(stats) {
    const { divinity } = stats;
    const section = document.getElementById('divinity-details-section');
    if (divinity) {
        document.getElementById('divinity-details-container').innerHTML = `
            <div><strong class="text-gray-400">Arma Preferida:</strong> ${divinity.armaPreferida || 'Nenhuma'}</div>
            <div><strong class="text-gray-400">Canaliza Energia:</strong> ${divinity.canalizarEnergia || 'Qualquer'}</div>
            <div class="mt-2"><strong class="text-gray-400">Obrigações & Restrições:</strong><p class="text-gray-300 whitespace-pre-wrap">${divinity.obrigaçõesRestricoes || 'Nenhuma'}</p></div>
        `;
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
    }
}

function renderAttributesSection(stats) {
    const { finalAttributes, attributeSources } = stats;
    if (!document.getElementById('attributes-display').innerHTML) {
        document.getElementById('attributes-display').innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            ${ALL_ATTRIBUTES.map(key => `<div class="text-center glass-effect p-3 cursor-pointer attribute-card" data-attr="${key}"><div class="text-sm font-bold text-red-400">${key}</div><div id="attr-value-${key}" class="text-4xl font-light my-2"></div><div id="attr-details-${key}" class="details-section"><div class="glass-effect p-2 text-left text-xs space-y-1 mt-2"><div id="attr-total-detail-${key}" class="font-bold text-base text-center mb-2"></div><div id="attr-sources-detail-${key}"></div></div></div></div>`).join('')}
        </div>`;
    }
    Object.entries(finalAttributes).forEach(([key, val]) => {
        const totalValue = val || 0;
        document.getElementById(`attr-value-${key}`).textContent = totalValue >= 0 ? `+${totalValue}` : totalValue;
        document.getElementById(`attr-total-detail-${key}`).textContent = `Atributo: ${totalValue}`;
        document.getElementById(`attr-sources-detail-${key}`).innerHTML = attributeSources[key].map(s => `<div class="flex justify-between"><span>${s.source}</span><span>${s.value >= 0 ? '+' : ''}${s.value}</span></div>`).join('');
    });
}

function renderResourcesSection(stats, resetCurrentHPPM) {
    const { totalHP, totalPM, globalModifiers, char, level1Class, finalAttributes } = stats;

    if (resetCurrentHPPM) {
        state.currentCharacter.currentHP = totalHP;
        state.currentCharacter.currentPM = totalPM;
    }

    const hpSources = [];
    if (level1Class) {
        const base = level1Class.pvInicial;
        const con = finalAttributes.CON || 0;
        hpSources.push(`Classe (${level1Class.name}): ${base}`);
        hpSources.push(`Constituição (Nv 1): ${con >= 0 ? '+' : ''}${con}`);
    }

    const levels = char.level - 1;
    if (levels > 0) {
         let levelSum = 0;
         for (let i = 2; i <= char.level; i++) {
            const classId = char.classChoices[i] || char.classChoices[1];
            const cls = state.classes.find(c => c.id === classId);
            if (cls) levelSum += cls.pvPerLevel;
         }
         hpSources.push(`Níveis (2-${char.level}): +${levelSum}`);
         const conSum = (finalAttributes.CON || 0) * levels;
         hpSources.push(`Constituição (2-${char.level}): ${conSum >= 0 ? '+' : ''}${conSum}`);
    }

    if (globalModifiers.PV_adc) hpSources.push(`Bônus Fixo: +${globalModifiers.PV_adc}`);
    if (globalModifiers.PV_adc_nivel) hpSources.push(`Por Nível: +${globalModifiers.PV_adc_nivel * char.level}`);
    if (globalModifiers.PV_adc_impar) hpSources.push(`Níveis Ímpares: +${globalModifiers.PV_adc_impar * Math.ceil(char.level/2)}`);

    const resourcesHtml = `
        <div class="group relative">
            <div class="flex justify-between items-baseline text-sm mb-1">
                <span class="font-semibold text-red-400 cursor-help border-b border-dashed border-red-900">Pontos de Vida (PV)</span>
                <span class="flex items-center">vida atual <input type="number" id="current-hp" class="w-12 text-center bg-transparent border-b border-gray-600 focus:outline-none mx-1" value="${state.currentCharacter.currentHP}"> / <span id="max-hp" class="ml-1">${totalHP}</span></span>
            </div>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 bg-black border border-gray-600 p-2 rounded text-xs whitespace-nowrap mb-1 z-50">
                <div class="font-bold mb-1">Origem dos PV</div>
                ${hpSources.map(s => `<div>${s}</div>`).join('')}
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2.5"><div id="hp-bar" class="bg-red-600 h-2.5 rounded-full"></div></div>
        </div>
        <div class="mt-4 group relative">
             <div class="flex justify-between items-baseline text-sm mb-1">
                <span class="font-semibold text-blue-400 cursor-help border-b border-dashed border-blue-900">Pontos de Mana (PM)</span>
                <span class="flex items-center">mana atual <input type="number" id="current-pm" class="w-12 text-center bg-transparent border-b border-gray-600 focus:outline-none mx-1" value="${state.currentCharacter.currentPM}"> / <span id="max-pm" class="ml-1">${totalPM}</span></span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2.5"><div id="pm-bar" class="bg-blue-600 h-2.5 rounded-full"></div></div>
        </div>`;

    document.getElementById('resources-display').innerHTML = resourcesHtml;
    updateResourceBars();
}

function renderAbilitiesAndItemsSection(stats) {
    const { race, allPowers, level1Class, char, origin } = stats;
    let abilitiesHtml = '';
    const addAbility = (source, ability) => { if(ability?.trim()) abilitiesHtml += `<div class="py-1"><strong class="text-red-400">${source}:</strong> ${ability.trim()}</div>`; };
    if (race?.abilities) race.abilities.split(',').forEach(ab => addAbility('Raça', ab));
    if (race?.ataquesNaturais) race.ataquesNaturais.split('\n').forEach(ab => addAbility('Ataque Natural', ab));
    allPowers.forEach(powerName => addAbility('Poder', powerName));
    if (level1Class?.levelAbilities) level1Class.levelAbilities.split(',').forEach(entry => { const [lvlStr, ability] = entry.split(':'); if (char.level >= parseInt(lvlStr)) addAbility(`Classe Nv ${lvlStr}`, ability); });
    document.getElementById('abilities-display').innerHTML = abilitiesHtml || '<p class="text-gray-400">Nenhuma habilidade selecionada.</p>';
    document.getElementById('items-display').innerHTML = origin?.items?.replace(/,/g, '<br>') || '<p class="text-gray-400">Nenhum item de origem.</p>';
}

// --- MANIPULAÇÃO DE DADOS E EVENTOS ---
function setupTabNavigation() {
    const nav = document.querySelector('header nav');
    nav.addEventListener('click', (e) => {
        const button = e.target.closest('.tab-button');
        if (!button) return;
        const activeTab = button.id.replace('tab-', '');
        ['criacao', 'ficha', 'modificadores', 'admin'].forEach(tab => {
            document.getElementById(`tab-${tab}`).classList.toggle('active', tab === activeTab);
            document.getElementById(`view-${tab}`).classList.toggle('hidden', tab !== activeTab);
        });
    });
}

let currentEdit = null;
function setupModalControls() {
    const modal = document.getElementById('generic-modal');
    modal.addEventListener('click', (e) => { if (e.target.id === 'generic-modal' || e.target.id === 'modal-close-btn' || e.target.id === 'modal-cancel-btn') closeModal(); });
    document.getElementById('modal-save-btn').addEventListener('click', handleSave);
}

function openModal(title, content, data = null) {
    const modal = document.getElementById('generic-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = content;
    currentEdit = data;
    
    const saveBtn = document.getElementById('modal-save-btn');
    saveBtn.style.display = data?.isAction ? 'none' : 'inline-flex';
    document.getElementById('modal-cancel-btn').textContent = data?.isAction ? 'Fechar' : 'Cancelar';
    
    saveBtn.textContent = data?.isDelete ? 'Excluir' : 'Salvar';
    saveBtn.classList.toggle('btn-primary', !data?.isDelete);
    saveBtn.classList.toggle('bg-red-600', data?.isDelete);

    if (data?.id && !data.isDelete) {
        const item = state[data.type].find(i => i.id === data.id);
        if (item) {
            Object.keys(item).forEach(key => {
                const input = modal.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') input.checked = !!item[key];
                    else input.value = item[key];
                }
            });
        }
    }
    modal.classList.remove('hidden');
}

function closeModal() { document.getElementById('generic-modal').classList.add('hidden'); }

async function handleSave() {
    if (!currentEdit) return;
    const { type, id, isDelete } = currentEdit;

    // Em modo offline, atualiza apenas o estado local
    if (USE_OFFLINE_MODE) {
        if (isDelete) {
            state[type] = state[type].filter(i => i.id !== id);
        } else {
            const form = document.querySelector('#generic-modal form');
            if (form && form.checkValidity()) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                delete data.source_homebrew; // Limpeza
                Object.keys(data).forEach(key => { if (!isNaN(data[key]) && data[key]?.trim() !== '' && typeof data[key] !== 'boolean') data[key] = Number(data[key]); });
                
                if (id) {
                    const index = state[type].findIndex(i => i.id === id);
                    if (index !== -1) state[type][index] = { ...state[type][index], ...data };
                } else {
                    data.id = 'mock_' + Date.now();
                    state[type].push(data);
                }
            }
        }
        // Atualiza listas e ficha
        window[`render${capitalize(type)}List`]?.();
        if (['races', 'classes', 'origins', 'divinities'].includes(type)) {
            window[`populate${capitalize(type.slice(0, -1))}Select`]?.();
        }
        orchestrateSheetUpdate();
        closeModal();
        return;
    }

    // ... (código Firebase original para handleSave omitido, mas seria aqui)
    // Como estamos focando no offline, o bloco acima resolve.
}

function handleEditClick(button) {
    const { type, id } = button.dataset;
    const formFunctions = { races: getRaceFormHtml, classes: getClassFormHtml, origins: getOriginFormHtml, divinities: getDivinityFormHtml, powers: getPowerFormHtml, items: getItemFormHtml, weapons: getWeaponFormHtml, armors: getArmorFormHtml, spells: getSpellFormHtml };
    const singularNames = { races: 'Raça', classes: 'Classe', origins: 'Origem', divinities: 'Divindade', powers: 'Poder/Habilidade', items: 'Item', weapons: 'Arma', armors: 'Armadura/Escudo', spells: 'Magia' };
    const formHtmlFunction = formFunctions[type];
    if (formHtmlFunction) openModal(`Editar ${singularNames[type]}`, formHtmlFunction(), { type, id });
}

async function handleDeleteClick(button) {
    const { type, id } = button.dataset;
    const item = state[type].find(i => i.id === id);
    openModal(`Confirmar Exclusão`, `<p>Excluir "${item?.name || ''}"?</p>`, { type, id, isDelete: true });
}

function setupAdminEventListeners() {
    const adminView = document.getElementById('view-admin');
    adminView.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        if (editBtn) handleEditClick(editBtn);
        else if (deleteBtn) handleDeleteClick(deleteBtn);
    });
    document.getElementById('admin-search-input').addEventListener('input', () => {
        Object.keys(collections).forEach(type => window[`render${capitalize(type)}List`]?.());
    });
}

function setupAdminButtonListeners() {
    document.getElementById('add-race-btn').addEventListener('click', () => openModal('Adicionar Raça', getRaceFormHtml(), {type: 'races'}));
    document.getElementById('add-class-btn').addEventListener('click', () => openModal('Adicionar Classe', getClassFormHtml(), {type: 'classes'}));
    document.getElementById('add-origin-btn').addEventListener('click', () => openModal('Adicionar Origem', getOriginFormHtml(), {type: 'origins'}));
    document.getElementById('add-divinity-btn').addEventListener('click', () => openModal('Adicionar Divindade', getDivinityFormHtml(), {type: 'divinities'}));
    document.getElementById('add-power-btn').addEventListener('click', () => openModal('Adicionar Poder/Habilidade', getPowerFormHtml(), {type: 'powers'}));
    document.getElementById('add-item-btn').addEventListener('click', () => openModal('Adicionar Item Geral', getItemFormHtml(), { type: 'items' }));
    document.getElementById('add-weapon-btn').addEventListener('click', () => openModal('Adicionar Arma', getWeaponFormHtml(), { type: 'weapons' }));
    document.getElementById('add-armor-btn').addEventListener('click', () => openModal('Adicionar Armadura/Escudo', getArmorFormHtml(), { type: 'armors' }));
    document.getElementById('add-spell-btn').addEventListener('click', () => openModal('Adicionar Magia', getSpellFormHtml(), { type: 'spells' }));
}

function setupCharacterSheetListeners() {
    document.getElementById('select-race').addEventListener('change', e => updateCharacter('race', e.target.value));
    document.getElementById('select-origin').addEventListener('change', e => updateCharacter('origin', e.target.value));
    document.getElementById('select-divinity').addEventListener('change', e => updateCharacter('divinity', e.target.value));
    document.getElementById('select-class-lvl1').addEventListener('change', e => updateCharacter('class', e.target.value));
    
    document.getElementById('char-level').addEventListener('change', e => { 
        state.currentCharacter.level = parseInt(e.target.value) || 1; 
        orchestrateSheetUpdate({ updateChoicesUI: true, resetHPPM: true });
    });
    
    const fichaView = document.getElementById('view-ficha');
    fichaView.addEventListener('input', (e) => {
        if(e.target.id === 'current-hp') {
            state.currentCharacter.currentHP = parseInt(e.target.value) || 0;
            updateResourceBars();
        }
        if(e.target.id === 'current-pm') {
            state.currentCharacter.currentPM = parseInt(e.target.value) || 0;
            updateResourceBars();
        }
    });
    
    fichaView.addEventListener('change', e => {
        const targetId = e.target.id;
        if (targetId === 'defense-attribute-select') {
            state.currentCharacter.defenseAttribute = e.target.value;
            orchestrateSheetUpdate({ only: ['defense'] });
        } else if (targetId === 'select-armor' || targetId === 'select-shield') {
            state.currentCharacter.equippedArmor = document.getElementById('select-armor').value;
            state.currentCharacter.equippedShield = document.getElementById('select-shield').value;
            orchestrateSheetUpdate({ only: ['defense'] });
        } else if (targetId === 'spell-attribute-select') {
            state.currentCharacter.spellAttribute = e.target.value;
            orchestrateSheetUpdate({ only: ['magic'] });
        }
    });
    
    fichaView.addEventListener('click', e => {
        const detailsButton = e.target.closest('.details-toggle-btn');
        const attributeCard = e.target.closest('.attribute-card');
        
        if(detailsButton) {
            const targetId = detailsButton.dataset.target;
            document.getElementById(targetId)?.classList.toggle('open');
        } else if(attributeCard) {
            const key = attributeCard.dataset.attr;
            document.getElementById(`attr-details-${key}`)?.classList.toggle('open');
        } else if(e.target.id === 'learn-spell-btn') {
            openLearnSpellModal();
        }
    });

    document.getElementById('modifier-name-toggle').addEventListener('change', e => {
        state.showTechnicalModifierNames = e.target.checked;
        orchestrateSheetUpdate({ only: ['modifiers'] });
    });
    document.getElementById('modifier-search-input').addEventListener('input', () => orchestrateSheetUpdate({ only: ['modifiers'] }));
}

function updateCharacter(type, id) {
    const plural = type === 'class' ? 'classes' : `${type}s`;
    const selectedItem = state[plural]?.find(item => item.id === id) || null;
    
    if (state.currentCharacter[type]?.id === selectedItem?.id) return;

    state.currentCharacter[type] = selectedItem;
    
    // Centralize resetting choices here
    if (type === 'race') { 
        state.currentCharacter.chosenAttributes = {}; 
    }
    if (type === 'class') {
        state.currentCharacter.classChoices[1] = id;
        state.currentCharacter.chosenClassSkills = {};
        state.currentCharacter.chosenClassFixedSkills = {};
    }
    if (type === 'origin') {
        state.currentCharacter.chosenOriginBenefits = {};
    }
    if (type === 'divinity') {
        state.currentCharacter.chosenDivinityPowers = {};
    }
    
    orchestrateSheetUpdate({ resetHPPM: true, updateChoicesUI: true });
}

// --- FUNÇÕES DE HELPERS (UI) ---

function renderList(type, singular, fields) {
    const listEl = document.getElementById(`${type}-list`);
    if (!listEl) return;
    const searchTerm = document.getElementById('admin-search-input')?.value.toLowerCase() || '';
    const filteredData = state[type]
        .filter(item => state.allowedSources.includes("Todos") || state.allowedSources.includes(item.source) || (!item.source && state.allowedSources.includes("T20 - Livro Básico - Jogo do Ano")))
        .filter(item => !searchTerm || fields.some(f => item[f] && item[f].toString().toLowerCase().includes(searchTerm)));

    listEl.innerHTML = filteredData.length === 0
        ? `<div class="border-2 border-dashed border-gray-700 p-4 text-center rounded-lg"><p class="text-gray-400">Nenhum(a) ${singular.toLowerCase()} encontrado(a).</p></div>`
        : filteredData.map(item => `
            <div class="glass-effect p-3 rounded-md flex justify-between items-center text-sm">
                <div>${fields.map(f => `<span class="font-semibold">${item[f]||''}</span>`).join(' - ')}</div>
                <div>
                    <button class="edit-btn text-yellow-400 hover:text-yellow-300" data-type="${type}" data-id="${item.id}">Editar</button>
                    <button class="delete-btn text-red-500 hover:text-red-400 ml-2" data-type="${type}" data-id="${item.id}">Excluir</button>
                </div>
            </div>`).join('');
}

function renderSpellsList() {
    const searchTerm = document.getElementById('admin-search-input')?.value.toLowerCase() || '';
    for (let i = 1; i <= 5; i++) {
        const listEl = document.getElementById(`spells-circle-${i}-list`);
        if (listEl) listEl.innerHTML = '';
    }
    const filteredData = state.spells
        .filter(item => state.allowedSources.includes("Todos") || state.allowedSources.includes(item.source) || (!item.source && state.allowedSources.includes("T20 - Livro Básico - Jogo do Ano")))
        .filter(item => !searchTerm || item.name.toLowerCase().includes(searchTerm) || (item.escola && item.escola.toLowerCase().includes(searchTerm)));

    if (filteredData.length === 0 && searchTerm) {
        document.getElementById('spells-circle-1-list').innerHTML = `<p class="text-gray-400">Nenhuma magia encontrada.</p>`;
        return;
    }

    filteredData.forEach(item => {
        const listEl = document.getElementById(`spells-circle-${item.circulo}-list`);
        if (listEl) {
            listEl.innerHTML += `
                <div class="glass-effect p-3 rounded-md text-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">${item.name || ''}</span>
                        <div>
                            <button class="edit-btn text-yellow-400" data-type="spells" data-id="${item.id}">Editar</button>
                            <button class="delete-btn text-red-500 ml-2" data-type="spells" data-id="${item.id}">Excluir</button>
                        </div>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">${item.escola || ''} - ${item.classificacao || ''}</div>
                </div>`;
        }
    });

    for (let i = 1; i <= 5; i++) {
        const listEl = document.getElementById(`spells-circle-${i}-list`);
        if(listEl) {
            if(searchTerm && listEl.innerHTML.trim() !== '') listEl.closest('details').open = true;
            if(!listEl.innerHTML) listEl.innerHTML = `<p class="text-xs text-gray-500">Nenhuma magia deste círculo.</p>`;
        }
    }
}

function renderAllowedSourcesFilter() {
    const container = document.getElementById('allowed-sources-filter');
    container.innerHTML = SOURCES.map(source => `
        <label class="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" class="form-checkbox source-filter-checkbox bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500 rounded" value="${source}" ${state.allowedSources.includes(source) ? 'checked' : ''}>
            <span>${source}</span>
        </label>
    `).join('');
    container.querySelectorAll('.source-filter-checkbox').forEach(box => {
        box.addEventListener('change', () => {
            const selected = Array.from(container.querySelectorAll('.source-filter-checkbox:checked')).map(cb => cb.value);
            state.allowedSources = selected.length > 0 ? selected : ["Todos"];
            Object.keys(collections).forEach(type => {
                window[`render${capitalize(type)}List`]?.();
                window[`populate${capitalize(type)}Select`]?.();
            });
            populateEquipmentSelects();
            orchestrateSheetUpdate({ resetHPPM: false, updateChoicesUI: true });
        });
    });
}

function populateSelect(selectId, dataArray, selectedId) {
    const selectEl = document.getElementById(selectId);
    if (!selectEl) return;
    const options = (dataArray || []).filter(item => state.allowedSources.includes("Todos") || state.allowedSources.includes(item.source) || (!item.source && state.allowedSources.includes("T20 - Livro Básico - Jogo do Ano"))).map(item => `<option value="${item.id}" ${item.id === selectedId ? 'selected' : ''}>${item.name}</option>`).join('');
    selectEl.innerHTML = `<option value="">Selecione</option>${options}`;
}
window.populateRaceSelect = () => populateSelect('select-race', state.races, state.currentCharacter.race?.id);
window.populateOriginSelect = () => populateSelect('select-origin', state.origins, state.currentCharacter.origin?.id);
window.populateDivinitySelect = () => populateSelect('select-divinity', state.divinities, state.currentCharacter.divinity?.id);
window.populateClassLvl1Select = () => populateSelect('select-class-lvl1', state.classes, state.currentCharacter.class?.id);

function populateEquipmentSelects() {
    const armorSelect = document.getElementById('select-armor');
    const shieldSelect = document.getElementById('select-shield');
    if (!armorSelect || !shieldSelect) return;
    const armorsAndShields = state.armors.filter(item => state.allowedSources.includes("Todos") || state.allowedSources.includes(item.source) || (!item.source && state.allowedSources.includes("T20 - Livro Básico - Jogo do Ano")));
    const armorOptions = armorsAndShields.filter(a => a.proficiencia === 'Armaduras Leves' || a.proficiencia === 'Armaduras Pesadas').map(item => `<option value="${item.id}">${item.name}</option>`).join('');
    const shieldOptions = armorsAndShields.filter(a => a.proficiencia === 'Escudos').map(item => `<option value="${item.id}">${item.name}</option>`).join('');
    armorSelect.innerHTML = `<option value="">Nenhuma</option>${armorOptions}`;
    shieldSelect.innerHTML = `<option value="">Nenhum</option>${shieldOptions}`;
}

// --- UTILITY & REST OF FUNCTIONS ---
// (The remaining helper functions like handle...ChoiceUI, renderChoiceSelectors, renderGenericChoicesForType, etc.
//  are assumed to be here. Due to length constraints, ensure they are included in the final file as in previous attempts.)

function handleChoiceUI(race) {
    const container = document.getElementById('race-choice-container');
    container.innerHTML = '';
    document.getElementById('race-choice-section').classList.add('hidden');
    if (!race) return;
    const restrictions = race.attributeRestrictions?.split(',').map(r => r.trim().toUpperCase()) || [];
    const attributeOptions = ALL_ATTRIBUTES.filter(attr => !restrictions.includes(attr));
    renderChoiceSelectors({
        sectionId: 'race-choice-section', containerId: 'race-choice-container', choiceCount: race.attributeChoices || 0,
        availableOptions: attributeOptions, storageObject: state.currentCharacter.chosenAttributes, labelPrefix: 'Atributo', onchangeCallback: orchestrateSheetUpdate
    });
    renderGenericChoicesForType('race', race);
}

function handleClassSkillChoiceUI(charClass) {
    const mainContainer = document.getElementById('class-choice-container');
    mainContainer.innerHTML = '';
    const section = document.getElementById('class-choice-section');
    section.classList.add('hidden');
    if (!charClass) return;
    let hasContent = false;
    if (charClass.periciasDeClasse) {
        const mandatoryParts = charClass.periciasDeClasse.split(',').map(p => p.trim());
        mandatoryParts.forEach((part, index) => {
            if (part.includes(' ou ')) {
                hasContent = true;
                const options = part.split(' ou ').map(o => o.trim());
                const choiceWrapper = document.createElement('div');
                choiceWrapper.innerHTML = `<h4 class="text-md font-semibold text-red-300 mb-2">Escolha de Perícia Obrigatória</h4>`;
                const select = document.createElement('select');
                select.className = 'form-select w-full';
                select.dataset.choiceIndex = index;
                let optionsHtml = `<option value="">Selecione uma perícia...</option>`;
                options.forEach(opt => {
                    const isSelected = state.currentCharacter.chosenClassFixedSkills[index] === opt;
                    optionsHtml += `<option value="${opt}" ${isSelected ? 'selected' : ''}>${opt}</option>`;
                });
                select.innerHTML = optionsHtml;
                select.addEventListener('change', (e) => {
                    state.currentCharacter.chosenClassFixedSkills[e.target.dataset.choiceIndex] = e.target.value;
                    orchestrateSheetUpdate();
                });
                choiceWrapper.appendChild(select);
                mainContainer.appendChild(choiceWrapper);
            }
        });
    }
    const additionalCount = charClass.numPericiasAdicionais || 0;
    const additionalOptions = charClass.periciasAdicionais?.split(',').map(s => s.trim()) || [];
    if (additionalCount > 0 && additionalOptions.length > 0) {
        if (mainContainer.innerHTML.trim() !== '') mainContainer.appendChild(document.createElement('hr')).className = 'my-4 border-gray-600';
        const additionalWrapper = document.createElement('div');
        additionalWrapper.innerHTML = `<h4 class="text-md font-semibold text-red-300 mb-2">Escolha de Perícias Adicionais</h4>`;
        const additionalContainer = document.createElement('div');
        additionalContainer.id = 'class-additional-skill-container';
        additionalContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        additionalWrapper.appendChild(additionalContainer);
        mainContainer.appendChild(additionalWrapper);
        renderChoiceSelectors({
            sectionId: 'class-choice-section', containerId: 'class-additional-skill-container', choiceCount: additionalCount,
            availableOptions: additionalOptions, storageObject: state.currentCharacter.chosenClassSkills, labelPrefix: 'Perícia', onchangeCallback: orchestrateSheetUpdate
        });
        hasContent = true;
    }
    renderGenericChoicesForType('class', charClass);
    if (charClass.choices) hasContent = true;
    if (hasContent) section.classList.remove('hidden');
}

function handleOriginChoiceUI(origin) {
    const container = document.getElementById('origin-choice-container');
    container.innerHTML = '';
    document.getElementById('origin-choice-section').classList.add('hidden');
    if (!origin) return;
    const count = origin.numBeneficios || 2;
    const skillOptions = origin.benefits_skills?.split(',').map(s => s.trim()).filter(s => s) || [];
    const powerOptions = origin.benefits_powers?.split(',').map(p => p.trim()).filter(p => p) || [];
    const availableOptions = [];
    if (skillOptions.length > 0) availableOptions.push({ groupLabel: "Perícias", options: skillOptions.map(opt => ({ value: `skill:${opt}`, label: opt })) });
    if (powerOptions.length > 0) availableOptions.push({ groupLabel: "Poderes", options: powerOptions.map(opt => ({ value: `power:${opt}`, label: opt })) });
    renderChoiceSelectors({
        sectionId: 'origin-choice-section', containerId: 'origin-choice-container', choiceCount: count,
        availableOptions: availableOptions, storageObject: state.currentCharacter.chosenOriginBenefits, labelPrefix: 'Benefício', onchangeCallback: orchestrateSheetUpdate
    });
    renderGenericChoicesForType('origin', origin);
}

function handleDivinityPowerChoiceUI(divinity, globalModifiers) {
    const container = document.getElementById('divinity-choice-container');
    container.innerHTML = '';
    document.getElementById('divinity-choice-section').classList.add('hidden');
    if (!divinity) return;
    const count = globalModifiers.num_poderes_concedidos || 0;
    const availableOptions = divinity.powers?.split(',').map(p => p.trim()).filter(p => p) || [];
    renderChoiceSelectors({
        sectionId: 'divinity-choice-section', containerId: 'divinity-choice-container', choiceCount: count,
        availableOptions: availableOptions, storageObject: state.currentCharacter.chosenDivinityPowers, labelPrefix: 'Poder Concedido', onchangeCallback: orchestrateSheetUpdate
    });
    renderGenericChoicesForType('divinity', divinity);
}

function renderChoiceSelectors({ sectionId, containerId, choiceCount, availableOptions, storageObject, labelPrefix, onchangeCallback }) {
    const section = document.getElementById(sectionId);
    const container = document.getElementById(containerId);
    if (!choiceCount || choiceCount === 0 || !availableOptions || availableOptions.length === 0) return;
    section.classList.remove('hidden');
    const currentlySelectedValues = Object.values(storageObject).filter(v => v);
    for (let i = 0; i < choiceCount; i++) {
        const selectWrapper = document.createElement('div');
        const select = document.createElement('select');
        select.className = 'form-select w-full';
        select.dataset.choiceIndex = i;
        const thisChoiceValue = storageObject[i] || "";
        let optionsHtml = `<option value="">${labelPrefix} ${i + 1}</option>`;
        const buildOptions = (opts) => opts.forEach(opt => {
            const isSelected = thisChoiceValue === opt.value;
            const isDisabled = currentlySelectedValues.includes(opt.value) && !isSelected;
            optionsHtml += `<option value="${opt.value}" ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}>${opt.label || opt}</option>`;
        });
        if (availableOptions[0]?.groupLabel) {
            availableOptions.forEach(group => { optionsHtml += `<optgroup label="${group.groupLabel}">`; buildOptions(group.options); optionsHtml += `</optgroup>`; });
        } else { buildOptions(availableOptions); }
        select.innerHTML = optionsHtml;
        select.addEventListener('change', (e) => { storageObject[e.target.dataset.choiceIndex] = e.target.value; onchangeCallback(); });
        selectWrapper.appendChild(select);
        container.appendChild(selectWrapper);
    }
}

function renderGenericChoicesForType(type, source) {
    const container = document.getElementById(`${type}-choice-container`);
    if (!source?.choices || !container) return;
    let choices;
    try { choices = typeof source.choices === 'string' ? JSON.parse(source.choices) : source.choices; } catch (e) { return; }
    if (!Array.isArray(choices)) return;
    const { level, generalChoices } = state.currentCharacter;
    let choicesHtml = '';
    choices.forEach(choice => {
        if (level >= choice.level) {
            const choiceKey = `${type}_${choice.key}`;
            choicesHtml += `<div><h4 class="text-md font-semibold text-red-300 mb-2">${choice.label}</h4><div class="space-y-2">`;
            if (choice.type === 'select') {
                choicesHtml += `<select data-choice-key="${choiceKey}" class="form-select w-full general-choice-select"><option value="">Selecione...</option>`;
                choice.options.forEach(opt => { const isSelected = generalChoices[choiceKey] === opt.value; choicesHtml += `<option value="${opt.value}" ${isSelected ? 'selected' : ''}>${opt.label}</option>`; });
                choicesHtml += `</select>`;
            }
            choicesHtml += `</div></div>`;
        }
    });
    if (choicesHtml.trim() !== '') {
        container.innerHTML += choicesHtml;
        container.closest('.glass-effect').classList.remove('hidden');
        container.querySelectorAll('.general-choice-select').forEach(select => {
            const key = select.dataset.choiceKey;
            if (!select.onchange) select.addEventListener('change', e => { state.currentCharacter.generalChoices[key] = e.target.value; orchestrateSheetUpdate(); });
        });
    }
}

// --- UI HELPERS ---
window.renderRacesList = () => renderList('races', 'Raça', ['name']);
window.renderClassesList = () => renderList('classes', 'Classe', ['name']);
window.renderOriginsList = () => renderList('origins', 'Origem', ['name']);
window.renderDivinitiesList = () => renderList('divinities', 'Divindade', ['name']);
window.renderPowersList = () => renderList('powers', 'Poder', ['name', 'type']);
window.renderItemsList = () => renderList('items', 'Item', ['name', 'tipo']);
window.renderWeaponsList = () => renderList('weapons', 'Arma', ['name', 'proficiencia']);
window.renderArmorsList = () => renderList('armors', 'Armadura/Escudo', ['name', 'proficiencia']);
window.renderSpellsList = renderSpellsList;

function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }


function setupPointBuyCalculator() {
    const container = document.getElementById('point-buy-calculator');
    const totalInput = document.getElementById('point-buy-total');
    const remainingSpan = document.getElementById('point-buy-remaining');

    if (!container || !totalInput || !remainingSpan) return;

    function renderCalculator() {
        let currentCost = 0;
        const attributes = state.currentCharacter.baseAttributes;

        // Calculate current cost
        Object.values(attributes).forEach(val => {
            const cost = POINT_BUY_COST[val.toString()] || 0;
            currentCost += cost;
        });

        const totalPoints = parseInt(totalInput.value) || 10;
        const remaining = totalPoints - currentCost;

        remainingSpan.textContent = remaining;
        remainingSpan.className = remaining < 0 ? 'font-bold text-lg text-red-500' : 'font-bold text-lg text-green-500';
        state.currentCharacter.pointBuyTotal = totalPoints;

        container.innerHTML = ALL_ATTRIBUTES.map(attr => {
            const val = attributes[attr];
            const cost = POINT_BUY_COST[val.toString()] || 0;

            const canIncrease = val < 4;
            const canDecrease = val > -1;

            return `
            <div class="flex justify-between items-center glass-effect p-2 rounded">
                <span class="font-bold w-8">${attr}</span>
                <div class="flex items-center space-x-3">
                    <button class="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center ${!canDecrease ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick="updateAttribute('${attr}', ${val - 1})" ${!canDecrease ? 'disabled' : ''}>-</button>
                    <span class="w-8 text-center font-semibold ${val < 0 ? 'text-red-400' : 'text-white'}">${val}</span>
                    <button class="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center ${!canIncrease ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick="updateAttribute('${attr}', ${val + 1})" ${!canIncrease ? 'disabled' : ''}>+</button>
                </div>
                <span class="text-xs text-gray-400 w-12 text-right">Custo: ${cost}</span>
            </div>
            `;
        }).join('');
    }

    window.updateAttribute = (attr, newVal) => {
        if (newVal < -1 || newVal > 4) return;
        state.currentCharacter.baseAttributes[attr] = newVal;
        renderCalculator();
        orchestrateSheetUpdate({ only: ['attributes', 'resources', 'defense', 'skills', 'magic', 'modifiers'] });
    };

    totalInput.addEventListener('change', renderCalculator);
    renderCalculator();
}

function updateResourceBars() {
    const { currentHP, currentPM } = state.currentCharacter;
    const maxHP = parseInt(document.getElementById('max-hp')?.textContent) || 1;
    const maxPM = parseInt(document.getElementById('max-pm')?.textContent) || 1;

    const hpPercent = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
    const pmPercent = Math.max(0, Math.min(100, (currentPM / maxPM) * 100));

    const hpBar = document.getElementById('hp-bar');
    const pmBar = document.getElementById('pm-bar');

    if(hpBar) hpBar.style.width = `${hpPercent}%`;
    if(pmBar) pmBar.style.width = `${pmPercent}%`;
}

function renderDefenseSection(stats) {
    const { finalAttributes, globalModifiers, char, modifierSources } = stats;
    const desMod = finalAttributes['DES'] || 0;
    const armorId = char.equippedArmor;
    const shieldId = char.equippedShield;
    const armor = state.armors.find(a => a.id === armorId);
    const shield = state.armors.find(a => a.id === shieldId);

    let defense = 10;
    let explanation = `Base: 10`;
    let sources = [{source: 'Base', value: 10}];

    // Armor & Dexterity Limit
    let armorBonus = 0;
    let maxDex = 999;

    if (armor) {
        armorBonus = parseInt(armor.bonus) || 0;
        defense += armorBonus;
        explanation += `<br>Armadura (${armor.name}): +${armorBonus}`;
        sources.push({source: `Armadura (${armor.name})`, value: armorBonus});

        if (armor.proficiencia === 'Armaduras Pesadas') maxDex = 0; // T20 Rule: Heavy armor usually denies DEX to Defense, or strict limit. Actually T20 JdA p. 104: "Heavy Armor: you apply NO Dex bonus to Defense".
        // Need to check specific armor "max dex" property if implemented, but usually Heavy = 0, Light = unlimited (but some have limits).
        // Let's assume the armor object has 'penalidade' and 'bonus'. The rule for Heavy Armor is simple.
        // For this implementation, we will check if proficiencia is 'Armaduras Pesadas'.
    }

    // Apply DEX (limited by armor)
    let dexToApply = desMod;
    if (maxDex === 0) dexToApply = 0; // Heavy armor

    // Check for "Armor of the Knight" or similar powers that allow DEX in heavy armor? For now, standard rules.

    if (dexToApply !== 0) {
        defense += dexToApply;
        explanation += `<br>Destreza: ${dexToApply >= 0 ? '+' : ''}${dexToApply}`;
        sources.push({source: 'Destreza', value: dexToApply});
    }

    if (shield) {
        const shieldBonus = parseInt(shield.bonus) || 0;
        defense += shieldBonus;
        explanation += `<br>Escudo (${shield.name}): +${shieldBonus}`;
        sources.push({source: `Escudo (${shield.name})`, value: shieldBonus});
    }

    // Other modifiers
    if(globalModifiers.bonus_armadura) {
        defense += globalModifiers.bonus_armadura;
        explanation += `<br>Outros: ${globalModifiers.bonus_armadura}`;
        sources.push({source: 'Outros Modificadores', value: globalModifiers.bonus_armadura});
    }
    ALL_ATTRIBUTES.forEach(attr => {
        const modKey = `soma_${attr.toLowerCase()}_na_defesa`;
        if(globalModifiers[modKey]) {
            defense += finalAttributes[attr];
            sources.push({source: `Soma ${attr} na Defesa`, value: finalAttributes[attr]});
        }
    });

    const displayEl = document.getElementById('defense-display');
    if (displayEl) {
        displayEl.innerHTML = `
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-semibold text-red-400">Defesa</h3><div class="text-3xl font-bold">${defense}</div></div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300">Armadura</label>
                        <select id="select-armor" class="form-select mt-1 block w-full text-sm bg-gray-800 border-gray-600 text-white"></select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300">Escudo</label>
                        <select id="select-shield" class="form-select mt-1 block w-full text-sm bg-gray-800 border-gray-600 text-white"></select>
                    </div>
                </div>
                <div class="text-xs text-gray-400 glass-effect p-2 rounded">
                    <strong>Detalhes:</strong>
                    ${sources.map(s => `<div>${s.source}: ${s.value >= 0 ? '+' : ''}${s.value}</div>`).join('')}
                </div>
            </div>
        `;
        populateEquipmentSelects(); // Re-populate to keep selection? No, this resets selection if we are not careful.
        // Wait, populateEquipmentSelects clears the innerHTML. We should populate FIRST then set value.
        // Actually populateEquipmentSelects is global and targets the IDs.
        // We just re-created the IDs. So we need to call populate and then set values.

        populateEquipmentSelects();
        document.getElementById('select-armor').value = char.equippedArmor || "";
        document.getElementById('select-shield').value = char.equippedShield || "";
    }
}

function renderMagicSection(stats) {
    const { finalAttributes, globalModifiers, char } = stats;
    const attrKey = char.spellAttribute || 'INT';
    const attrVal = finalAttributes[attrKey] || 0;
    const cd = 10 + Math.floor(char.level / 2) + attrVal + (globalModifiers.bonus_cd || 0);

    const displayEl = document.getElementById('spell-cd-display');
    if (displayEl) {
        displayEl.innerHTML = `
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-semibold text-red-400">Magia</h3></div>
            <div class="glass-effect p-3 rounded flex justify-between items-center mb-3">
                <span class="font-bold">CD das Magias</span>
                <span class="text-2xl font-bold text-blue-400">${cd}</span>
            </div>
            <div class="mb-3">
                 <label class="block text-sm font-medium text-gray-300">Atributo-Chave</label>
                 <select id="spell-attribute-select" class="form-select mt-1 block w-full text-sm">
                    ${ALL_ATTRIBUTES.map(a => `<option value="${a}" ${a === attrKey ? 'selected' : ''}>${a}</option>`).join('')}
                 </select>
            </div>
            <div class="text-xs text-gray-400">
                Base (10) + 1/2 Nível (${Math.floor(char.level/2)}) + Atributo (${attrVal}) + Outros (${globalModifiers.bonus_cd || 0})
            </div>
        `;
    }
}

function renderLearnedSpells() {
    const list = document.getElementById('learned-spells-display');
    if (!list) return;
    const spells = state.currentCharacter.learnedSpells || [];

    if (spells.length === 0) {
        list.innerHTML = `
            <div class="text-center py-4">
                <p class="text-gray-400 mb-2">Nenhuma magia aprendida.</p>
                <button id="learn-spell-btn" class="btn-primary px-3 py-1 rounded text-sm">Aprender Magia</button>
            </div>
        `;
    } else {
        list.innerHTML = `
            <div class="flex justify-end mb-2"><button id="learn-spell-btn" class="btn-primary px-3 py-1 rounded text-sm">+ Aprender</button></div>
            <div class="space-y-2">
                ${spells.map(spellId => {
                    const spell = state.spells.find(s => s.id === spellId);
                    return spell ? `<div class="glass-effect p-2 rounded flex justify-between items-center text-sm"><span>${spell.name} (${spell.circulo}º C)</span><button onclick="forgetSpell('${spellId}')" class="text-red-500 hover:text-red-300">&times;</button></div>` : '';
                }).join('')}
            </div>
        `;
    }
}

window.forgetSpell = (spellId) => {
    state.currentCharacter.learnedSpells = state.currentCharacter.learnedSpells.filter(id => id !== spellId);
    orchestrateSheetUpdate({ only: ['learnedSpells'] });
};

function openLearnSpellModal() {
    const allSpells = state.spells.filter(s => state.allowedSources.includes("Todos") || state.allowedSources.includes(s.source) || (!s.source && state.allowedSources.includes("T20 - Livro Básico - Jogo do Ano")));
    // Filter by class circles if implemented, for now show all sorted by circle
    allSpells.sort((a, b) => a.circulo - b.circulo || a.name.localeCompare(b.name));

    const content = `
        <div class="space-y-4">
            <input type="text" id="spell-search-modal" placeholder="Buscar magia..." class="form-input w-full mb-2" onkeyup="filterModalSpells()">
            <div id="modal-spells-list" class="max-h-96 overflow-y-auto space-y-2">
                ${allSpells.map(spell => {
                    const isLearned = state.currentCharacter.learnedSpells.includes(spell.id);
                    return `
                    <div class="glass-effect p-2 rounded flex justify-between items-center spell-item" data-name="${spell.name.toLowerCase()}">
                        <div>
                            <div class="font-bold text-white">${spell.name}</div>
                            <div class="text-xs text-gray-400">${spell.circulo}º Círculo - ${spell.escola}</div>
                        </div>
                        <button onclick="toggleLearnSpell('${spell.id}')" class="px-3 py-1 rounded text-xs ${isLearned ? 'bg-red-900 text-red-200' : 'bg-green-700 text-white'}">
                            ${isLearned ? 'Esquecer' : 'Aprender'}
                        </button>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;

    openModal('Aprender Magias', content, { isAction: true }); // isAction hides Save button

    window.filterModalSpells = () => {
        const term = document.getElementById('spell-search-modal').value.toLowerCase();
        document.querySelectorAll('.spell-item').forEach(el => {
            el.style.display = el.dataset.name.includes(term) ? 'flex' : 'none';
        });
    };

    window.toggleLearnSpell = (id) => {
        const idx = state.currentCharacter.learnedSpells.indexOf(id);
        if (idx >= 0) state.currentCharacter.learnedSpells.splice(idx, 1);
        else state.currentCharacter.learnedSpells.push(id);
        orchestrateSheetUpdate({ only: ['learnedSpells'] });
        openLearnSpellModal(); // Refresh modal
    };
}

function renderSkillsSection(stats) {
    const { finalAttributes, char, originBenefitSkills, level1Class, classLevels, modifierSources, globalModifiers } = stats;
    const list = document.getElementById('skills-list');
    const counter = document.getElementById('skills-counter');
    if (!list) return;

    // Calculate Trained Skills Limit
    let trainedCount = 0;
    let maxTrained = 0;

    // Logic for max trained: Class Base + INT mod.
    // However, T20 JdA has fixed skills + choices.
    // The "trainedSkills" array in state tracks *user chosen* skills (from INT or other sources like "Perícia Adicional").
    // The "chosenClassSkills" and "chosenOriginBenefits" track those specific choices.
    // We need to merge all sources to know what is trained.

    const trainedSet = new Set();

    // 1. Class Fixed
    if (level1Class?.periciasDeClasse) {
        level1Class.periciasDeClasse.split(',').forEach(p => {
             const clean = p.trim();
             if (!clean.includes(' ou ')) trainedSet.add(clean);
        });
    }
    Object.values(char.chosenClassFixedSkills).forEach(s => s && trainedSet.add(s));

    // 2. Class Choices (Adicionais)
    Object.values(char.chosenClassSkills).forEach(s => s && trainedSet.add(s));

    // 3. Origin
    originBenefitSkills.forEach(s => trainedSet.add(s));

    // 4. Intelligence Bonus
    // User can select INT mod skills. We store them in char.trainedSkills (generic pool).
    // The limit is INT mod.
    const intMod = finalAttributes['INT'] || 0;
    const intSkillsLimit = Math.max(0, intMod);
    // Also "Perícia Adicional" powers add to this limit or separate? Usually separate.
    // For simplicity, let's treat char.trainedSkills as the pool for INT skills + Extra.

    const extraSkillsLimit = (globalModifiers.per_apren || 0);
    const totalGenericSlots = intSkillsLimit + extraSkillsLimit;

    // 5. Apply User Generic Choices
    char.trainedSkills.forEach(s => trainedSet.add(s));

    // Render Logic
    const skillKeys = Object.keys(SKILL_DEFAULT_ATTR).sort();

    list.innerHTML = skillKeys.map(skill => {
        const attr = SKILL_DEFAULT_ATTR[skill];
        const attrVal = finalAttributes[attr] || 0;
        const isTrained = trainedSet.has(skill);
        const levelBonus = Math.floor(char.level / 2);
        const trainingBonus = isTrained ? (char.level >= 7 ? 4 : 2) : 0; // +2 até nv 6, +4 nv 7+
        const itemBonus = 0; // To do: implement item bonuses check
        const otherBonus = (globalModifiers[`bonus_pericia_${skill}`] || 0);

        // Armor Penalty
        let penalty = 0;
        const armor = state.armors.find(a => a.id === char.equippedArmor);
        const shield = state.armors.find(a => a.id === char.equippedShield);

        if (['ACR', 'FUR', 'LAD'].includes(skill.substring(0, 3).toUpperCase())) { // Perícias afetadas por carga/armadura. T20: Acrobacia, Furtividade, Ladinagem usually.
            // Check actual T20 list: Acrobacia, Furtividade, Ladinagem.
             if (skill === 'Acrobacia' || skill === 'Furtividade' || skill === 'Ladinagem') {
                 if (armor) penalty += (parseInt(armor.penalidade) || 0);
                 if (shield) penalty += (parseInt(shield.penalidade) || 0);
             }
        }

        // Reduce penalty features
        if (armor && armor.proficiencia === 'Armaduras Leves') penalty += (globalModifiers.reducao_penalidade_armaduras_leves || 0);
        if (armor && armor.proficiencia === 'Armaduras Pesadas') penalty += (globalModifiers.reducao_penalidade_armaduras_pesadas || 0);
        if (shield) penalty += (globalModifiers.reducao_penalidade_escudos || 0);
        if (penalty > 0) penalty = 0; // Penalty is negative number usually in DB, but here let's assume property is negative.
        // If property is stored as positive (e.g. 2 means -2), we subtract.
        // Let's assume standard input: "Penalidade: 2" means -2 check.

        // Let's recalculate penalty with correct sign
        let totalPenalty = 0;
        if (skill === 'Acrobacia' || skill === 'Furtividade' || skill === 'Ladinagem') {
             if (armor) totalPenalty -= Math.abs(parseInt(armor.penalidade) || 0);
             if (shield) totalPenalty -= Math.abs(parseInt(shield.penalidade) || 0);
        }
        // Apply reductions (which are positive numbers reducing the penalty magnitude)
        // Wait, T20 reductions usually say "reduz a penalidade em 2". So -5 becomes -3.
        if (totalPenalty < 0) {
             let reduction = 0;
             if (armor && armor.proficiencia === 'Armaduras Leves') reduction += (globalModifiers.reducao_penalidade_armaduras_leves || 0);
             if (armor && armor.proficiencia === 'Armaduras Pesadas') reduction += (globalModifiers.reducao_penalidade_armaduras_pesadas || 0);
             if (shield) reduction += (globalModifiers.reducao_penalidade_escudos || 0);
             totalPenalty = Math.min(0, totalPenalty + reduction);
        }

        const total = levelBonus + attrVal + trainingBonus + otherBonus + totalPenalty;

        // Tooltip Sources
        const sources = [
            `1/2 Nível: +${levelBonus}`,
            `Atributo (${attr}): ${attrVal >= 0 ? '+' : ''}${attrVal}`,
            isTrained ? `Treino: +${trainingBonus}` : null,
            otherBonus ? `Outros: ${otherBonus >= 0 ? '+' : ''}${otherBonus}` : null,
            totalPenalty ? `Penalidade: ${totalPenalty}` : null
        ].filter(x => x).join('<br>');

        // Checkbox logic: Can we train this skill?
        // Only if we have generic slots remaining AND it is not already trained by fixed sources.
        const isFixedTrained = trainedSet.has(skill) && !char.trainedSkills.includes(skill);
        const isGenericTrained = char.trainedSkills.includes(skill);

        return `
            <div class="grid grid-cols-12 gap-2 items-center text-sm glass-effect p-2 rounded group relative">
                <div class="col-span-1 text-center">
                    <input type="checkbox" class="form-checkbox text-red-500 bg-gray-700 border-gray-600 rounded"
                        ${isTrained ? 'checked' : ''}
                        ${isFixedTrained ? 'disabled opacity-50' : ''}
                        onchange="toggleSkillTraining('${skill}', this.checked)">
                </div>
                <div class="col-span-3 font-semibold relative">
                    ${skill} ${totalPenalty < 0 ? '<span class="text-red-500 text-xs">*</span>' : ''}
                    <div class="hidden group-hover:block absolute z-10 left-0 bottom-full bg-black border border-gray-600 p-2 rounded text-xs whitespace-nowrap mb-1">
                        ${sources}
                    </div>
                </div>
                <div class="col-span-1 text-center font-bold text-lg text-white">${total >= 0 ? '+' : ''}${total}</div>
                <div class="col-span-2 text-center text-gray-400 text-xs">${attr}</div>
                <div class="col-span-1 text-center text-gray-400 text-xs">${attrVal}</div>
                <div class="col-span-2 text-center text-gray-400 text-xs">${trainingBonus}</div>
                <div class="col-span-2 text-center text-gray-400 text-xs">${otherBonus + totalPenalty}</div>
            </div>
        `;
    }).join('');

    // Update Counter
    const usedSlots = char.trainedSkills.length;
    counter.textContent = `Treinadas (Int/Extra): ${usedSlots} / ${totalGenericSlots}`;
    counter.className = usedSlots > totalGenericSlots ? 'text-red-500 text-sm font-semibold' : 'text-sm font-semibold text-green-400';

    window.toggleSkillTraining = (skill, isChecked) => {
        if (isChecked) {
            if (!state.currentCharacter.trainedSkills.includes(skill)) {
                state.currentCharacter.trainedSkills.push(skill);
            }
        } else {
            state.currentCharacter.trainedSkills = state.currentCharacter.trainedSkills.filter(s => s !== skill);
        }
        orchestrateSheetUpdate({ only: ['skills'] });
    };
}

function renderGlobalModifiersSection(stats) {
    const { modifierSources, globalModifiers } = stats;
    const container = document.getElementById('global-modifiers-display');
    if (!container) return;

    const searchTerm = document.getElementById('modifier-search-input')?.value.toLowerCase();

    // Flatten and display
    const activeMods = Object.entries(modifierSources).filter(([key, sources]) => {
         const val = globalModifiers[key];
         // Show if value is not 0 OR sources exist (some bools might be 0 but present)
         // Actually bools are 0 or 1.
         return (val !== 0 && val !== undefined) || sources.length > 0;
    });

    if (activeMods.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Nenhum modificador ativo.</p>';
        return;
    }

    container.innerHTML = activeMods.map(([key, sources]) => {
        const def = FIXED_MODIFIERS.find(m => m.key === key);
        const name = def ? def.name : key;
        const val = globalModifiers[key];

        if (searchTerm && !name.toLowerCase().includes(searchTerm) && !key.toLowerCase().includes(searchTerm)) return '';

        return `
            <div class="glass-effect p-3 rounded">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-red-300">${name} <span class="text-xs text-gray-500 font-normal">(${state.showTechnicalModifierNames ? key : def?.category || 'Geral'})</span></span>
                    <span class="text-xl font-bold">${val}</span>
                </div>
                <div class="text-xs text-gray-400 pl-2 border-l-2 border-gray-700 space-y-1">
                    ${sources.map(s => `<div>${s}</div>`).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// --- HELPER FUNCTIONS FOR FORMS (ADMIN) ---

function getRaceFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div><label class="block text-sm">Bônus de Atributos (Ex: CON: 2, FOR: 1)</label><input name="bonuses" class="form-input w-full"></div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Escolhas de Atributo (Qtd)</label><input name="attributeChoices" type="number" class="form-input w-full"></div>
            <div><label class="block text-sm">Bônus da Escolha</label><input name="attributeBonus" type="number" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Restrições de Escolha (Ex: INT, CAR)</label><input name="attributeRestrictions" class="form-input w-full"></div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Tipo</label><input name="tipoCriatura" class="form-input w-full"></div>
            <div><label class="block text-sm">Tamanho</label><input name="tamanho" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Habilidades (Nomes sep. por vírgula)</label><textarea name="abilities" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Ataques Naturais</label><textarea name="ataquesNaturais" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Efeitos Técnicos (Ex: deslocamento: 3, PV_adc_nivel: 1)</label><textarea name="effects" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

function getClassFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div class="grid grid-cols-3 gap-4">
            <div><label class="block text-sm">PV Inicial</label><input name="pvInicial" type="number" class="form-input w-full"></div>
            <div><label class="block text-sm">PV/Nível</label><input name="pvPerLevel" type="number" class="form-input w-full"></div>
            <div><label class="block text-sm">PM/Nível</label><input name="pmPerLevel" type="number" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Perícias de Classe (Obrigatórias/Opções)</label><input name="periciasDeClasse" class="form-input w-full"></div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Qtd Adicional</label><input name="numPericiasAdicionais" type="number" class="form-input w-full"></div>
            <div><label class="block text-sm">Lista Adicional</label><input name="periciasAdicionais" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Habilidades por Nível (Ex: 1: Ataque Furtivo)</label><textarea name="levelAbilities" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Efeitos Técnicos</label><textarea name="effects" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">JSON de Escolhas</label><textarea name="choices" class="form-input w-full h-20 font-mono text-xs"></textarea></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

function getOriginFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div><label class="block text-sm">Itens</label><input name="items" class="form-input w-full"></div>
        <div><label class="block text-sm">Poder Único</label><input name="power" class="form-input w-full"></div>
        <div><label class="block text-sm">Num. Benefícios</label><input name="numBeneficios" type="number" class="form-input w-full"></div>
        <div><label class="block text-sm">Benefícios: Perícias</label><input name="benefits_skills" class="form-input w-full"></div>
        <div><label class="block text-sm">Benefícios: Poderes</label><input name="benefits_powers" class="form-input w-full"></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

function getDivinityFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Canalizar</label><input name="canalizarEnergia" class="form-input w-full"></div>
            <div><label class="block text-sm">Arma Preferida</label><input name="armaPreferida" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Poderes Concedidos (Sep. por vírgula)</label><textarea name="powers" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Obrigações e Restrições</label><textarea name="obrigaçõesRestricoes" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

function getPowerFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Tipo (Combate, Destino...)</label><input name="type" class="form-input w-full"></div>
            <div><label class="block text-sm">Pré-requisitos</label><input name="prerequisites" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Descrição</label><textarea name="description" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Efeitos Técnicos (Ex: bonus_ataque: 1)</label><textarea name="effects" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

function getItemFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Tipo (Geral, Alquimia...)</label><input name="tipo" class="form-input w-full"></div>
            <div><label class="block text-sm">Preço (T$)</label><input name="preco" class="form-input w-full"></div>
            <div><label class="block text-sm">Espaço</label><input name="espaco" type="number" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Descrição</label><textarea name="description" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

function getWeaponFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Proficiência (Simples, Marcial...)</label><input name="proficiencia" class="form-input w-full"></div>
            <div><label class="block text-sm">Dano</label><input name="dano" class="form-input w-full"></div>
            <div><label class="block text-sm">Crítico</label><input name="critico" class="form-input w-full"></div>
            <div><label class="block text-sm">Alcance</label><input name="alcance" class="form-input w-full"></div>
            <div><label class="block text-sm">Tipo de Dano</label><input name="tipoDano" class="form-input w-full"></div>
            <div><label class="block text-sm">Espaço</label><input name="espaco" type="number" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Descrição</label><textarea name="description" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

function getArmorFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Tipo (Leve, Pesada, Escudo)</label><input name="proficiencia" class="form-input w-full"></div>
            <div><label class="block text-sm">Bônus na Defesa</label><input name="bonus" type="number" class="form-input w-full"></div>
            <div><label class="block text-sm">Penalidade de Armadura</label><input name="penalidade" type="number" class="form-input w-full"></div>
            <div><label class="block text-sm">Espaço</label><input name="espaco" type="number" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Descrição</label><textarea name="description" class="form-input w-full h-20"></textarea></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

function getSpellFormHtml() {
    return `
    <form class="space-y-4">
        <div><label class="block text-sm">Nome</label><input name="name" class="form-input w-full" required></div>
        <div class="grid grid-cols-3 gap-4">
            <div><label class="block text-sm">Círculo</label><input name="circulo" type="number" class="form-input w-full"></div>
            <div class="col-span-2"><label class="block text-sm">Escola</label><input name="escola" class="form-input w-full"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Execução</label><input name="execucao" class="form-input w-full"></div>
            <div><label class="block text-sm">Alcance</label><input name="alcance" class="form-input w-full"></div>
            <div><label class="block text-sm">Alvo/Área</label><input name="alvoArea" class="form-input w-full"></div>
            <div><label class="block text-sm">Duração</label><input name="duracao" class="form-input w-full"></div>
        </div>
        <div><label class="block text-sm">Resistência</label><input name="resistencia" class="form-input w-full"></div>
        <div><label class="block text-sm">Descrição Curta</label><textarea name="descricaoCurta" class="form-input w-full h-10"></textarea></div>
        <div><label class="block text-sm">Descrição Completa</label><textarea name="description" class="form-input w-full h-32"></textarea></div>
        <div><label class="block text-sm">Fonte</label><input name="source" class="form-input w-full" list="source-list"></div>
    </form>`;
}

window.populateEquipmentSelects = populateEquipmentSelects;


const CONDITIONS = [
    { id: 'abalado', name: 'Abalado', description: '-2 em testes de perícia.', effects: { bonus_pericia_all: -2 } },
    { id: 'abracado', name: 'Abraçado', description: '-2 na Defesa.', effects: { bonus_armadura: -2 } }, // Simplification
    { id: 'agarrado', name: 'Agarrado', description: '-2 em ataques, -2 na Defesa, Deslocamento 0.', effects: { bonus_ataque_corpoacorpo: -2, bonus_ataque_adistancia: -2, bonus_armadura: -2, deslocamento: -999 } },
    { id: 'alquebrado', name: 'Alquebrado', description: 'Custo de PM +1.', effects: { custo_pm: 1 } }, // Need to implement PM cost logic? Or just display.
    { id: 'atordoado', name: 'Atordoado', description: 'Incapaz de agir. -5 na Defesa.', effects: { bonus_armadura: -5 } },
    { id: 'caido', name: 'Caído', description: '-5 em ataques corpo a corpo, -5 na Defesa contra corpo a corpo (+5 contra distancia).', effects: { bonus_ataque_corpoacorpo: -5, bonus_armadura: -5 } }, // Simplified
    { id: 'cego', name: 'Cego', description: 'Desprevenido (-5 Defesa), -5 em perícias de Força/Destreza.', effects: { bonus_armadura: -5, bonus_pericia_FOR: -5, bonus_pericia_DES: -5 } }, // Custom logic needed for "Attribute Skills"
    { id: 'confuso', name: 'Confuso', description: 'Comportamento aleatório.', effects: {} },
    { id: 'debilitado', name: 'Debilitado', description: '-2 em testes de atributo e perícia (exceto ataque).', effects: { bonus_pericia_all_no_attack: -2, bonus_atributo_all: -2 } },
    { id: 'desprevenido', name: 'Desprevenido', description: '-5 na Defesa e Reflexos.', effects: { bonus_armadura: -5, bonus_pericia_Reflexos: -5 } },
    { id: 'doente', name: 'Doente', description: 'Varia.', effects: {} },
    { id: 'enjoado', name: 'Enjoado', description: 'Apenas uma ação padrão ou movimento.', effects: {} },
    { id: 'envenenado', name: 'Envenenado', description: 'Varia.', effects: {} },
    { id: 'exausto', name: 'Exausto', description: '-2 em testes, metade do deslocamento.', effects: { bonus_pericia_all: -2, deslocamento_multiplier: 0.5 } },
    { id: 'fascinado', name: 'Fascinado', description: '-5 em Percepção.', effects: { bonus_pericia_Percepção: -5 } },
    { id: 'fraco', name: 'Fraco', description: '-2 em testes de atributo e perícia físicos.', effects: { bonus_pericia_FOR: -2, bonus_pericia_DES: -2, bonus_pericia_CON: -2 } },
    { id: 'frustrado', name: 'Frustrado', description: '-2 em testes de atributo e perícia mentais.', effects: { bonus_pericia_INT: -2, bonus_pericia_SAB: -2, bonus_pericia_CAR: -2 } },
    { id: 'imovel', name: 'Imóvel', description: 'Deslocamento 0. -5 Defesa.', effects: { deslocamento: -999, bonus_armadura: -5 } },
    { id: 'inconsciente', name: 'Inconsciente', description: 'Indefeso.', effects: { bonus_armadura: -10 } }, // Rough approx
    { id: 'indefeso', name: 'Indefeso', description: '-10 na Defesa (cai a 0 se <10?).', effects: { bonus_armadura: -10 } },
    { id: 'lento', name: 'Lento', description: 'Metade do deslocamento, -2 Reflexos.', effects: { deslocamento_multiplier: 0.5, bonus_pericia_Reflexos: -2 } },
    { id: 'ofuscado', name: 'Ofuscado', description: '-2 em ataques e Percepção.', effects: { bonus_ataque_corpoacorpo: -2, bonus_ataque_adistancia: -2, bonus_pericia_Percepção: -2 } },
    { id: 'paralisado', name: 'Paralisado', description: 'Imóvel e Indefeso.', effects: { deslocamento: -999, bonus_armadura: -10 } },
    { id: 'pasmo', name: 'Pasmo', description: 'Não pode agir.', effects: {} },
    { id: 'petrificado', name: 'Petrificado', description: 'Inconsciente + RD 10/8.', effects: { bonus_armadura: -10, rd_total: 8 } },
    { id: 'sangrando', name: 'Sangrando', description: 'Perde PV no início do turno.', effects: {} },
    { id: 'surdo', name: 'Surdo', description: '-5 em Iniciativa, Percepção. Testes de Vontade para magias.', effects: { bonus_pericia_Iniciativa: -5, bonus_pericia_Percepção: -5 } },
    { id: 'surpreendido', name: 'Surpreendido', description: 'Desprevenido (-5 Defesa).', effects: { bonus_armadura: -5 } },
    { id: 'vulneravel', name: 'Vulnerável', description: '-2 na Defesa.', effects: { bonus_armadura: -2 } }
];

function renderConditionsSection(stats) {
    const { char } = stats;
    const active = char.activeConditions || [];

    // Create UI container if missing (append to Ficha view)
    let container = document.getElementById('conditions-section');
    if (!container) {
        const parent = document.getElementById('view-ficha');
        const div = document.createElement('div');
        div.id = 'conditions-section';
        div.className = 'glass-effect p-6 mt-6';
        div.innerHTML = `<h3 class="text-lg font-semibold text-red-400 mb-4">Condições & Efeitos</h3><div id="conditions-list" class="flex flex-wrap gap-2"></div>`;
        // Insert before skills or somewhere appropriate. Let's append for now or insert before skills.
        // The skills section is deep inside. Let's just append to view-ficha.
        parent.insertBefore(div, parent.querySelector('#skills-header')?.closest('.glass-effect') || null);
        container = div;
    }

    const list = document.getElementById('conditions-list');
    list.innerHTML = CONDITIONS.map(cond => {
        const isActive = active.includes(cond.id);
        return `
            <button onclick="toggleCondition('${cond.id}')"
                class="px-3 py-1 rounded border text-sm transition-colors ${isActive ? 'bg-red-900 border-red-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'}"
                title="${cond.description}">
                ${cond.name}
            </button>
        `;
    }).join('');

    window.toggleCondition = (id) => {
        const idx = state.currentCharacter.activeConditions.indexOf(id);
        if (idx >= 0) state.currentCharacter.activeConditions.splice(idx, 1);
        else state.currentCharacter.activeConditions.push(id);
        orchestrateSheetUpdate();
    };
}
