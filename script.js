// --- INÍCIO DO SCRIPT ---
// Seu script JavaScript permanece o mesmo, pois as mudanças são visuais.
// Nenhuma alteração de lógica é necessária.
// --- FIM DO SCRIPT ---

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, addDoc, setDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const finalFirebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};
const appId = 'meu-app-t20';

const app = initializeApp(finalFirebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const state = {
    races: [], classes: [], origins: [], divinities: [], powers: [], items: [], weapons: [], armors: [], spells: [],
    userId: null,
    allowedSources: ["Todos"],
    showTechnicalModifierNames: false,
    currentCharacter: { race: null, class: null, origin: null, divinity: null, level: 1, baseAttributes: { FOR:0, DES:0, CON:0, INT:0, SAB:0, CAR:0 }, pointBuyTotal: 10, chosenAttributes: {}, chosenClassSkills: {}, chosenClassFixedSkills: {}, chosenOriginBenefits: {}, chosenDivinityPowers: {}, classChoices: {}, trainedSkills: [], learnedSpells: [], currentHP: 0, currentPM: 0, spellAttribute: 'INT', skillAttributes: {}, defenseAttribute: 'DES', equippedArmor: null, equippedShield: null, generalChoices: {} }
};

const collections = {
    races: `artifacts/${appId}/public/data/races`,
    classes: `artifacts/${appId}/public/data/classes`,
    origins: `artifacts/${appId}/public/data/origins`,
    divinities: `artifacts/${appId}/public/data/divinities`,
    powers: `artifacts/${appId}/public/data/powers`,
    items: `artifacts/${appId}/public/data/items`,
    weapons: `artifacts/${appId}/public/data/weapons`,
    armors: `artifacts/${appId}/public/data/armors`,
    spells: `artifacts/${appId}/public/data/spells`,
};

const SKILL_DEFAULT_ATTR = { Acrobacia: 'DES', Adestramento: 'CAR', Atletismo: 'FOR', Atuação: 'CAR', Cavalgar: 'DES', Conhecimento: 'INT', Cura: 'SAB', Diplomacia: 'CAR', Enganação: 'CAR', Fortitude: 'CON', Furtividade: 'DES', Guerra: 'INT', Iniciativa: 'DES', Intimidação: 'CAR', Intuição: 'SAB', Investigação: 'INT', Jogatina: 'CAR', Ladinagem: 'DES', Luta: 'FOR', Misticismo: 'INT', Nobreza: 'INT', Ofício: 'INT', Percepção: 'SAB', Pilotagem: 'DES', Pontaria: 'DES', Reflexos: 'DES', Religião: 'SAB', Sobrevivência: 'SAB', Vontade: 'SAB' };
const ALL_ATTRIBUTES = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];

let FIXED_MODIFIERS = [
    // Categoria: Combate
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
    
    // Categoria: Defesa e Resistências
    { key: "bonus_armadura", name: "Outros Bônus na Defesa", value: 0, category: 'Defesa e Resistências'},
    { key: "penalidade_armadura_outros", name: "Outras Penalidades de Armadura", value: 0, category: 'Defesa e Resistências'},
    ...ALL_ATTRIBUTES.map(attr => ({ key: `soma_${attr.toLowerCase()}_na_defesa`, name: `Soma ${capitalize(attr.toLowerCase())} na Defesa`, value: 0, category: 'Defesa e Resistências', isBool: true})),
    { key: "rd_total", name: "Resistência a Dano Total", value: 0, category: 'Defesa e Resistências' },
    { key: "rd_fisico", name: "Resistência a Dano Físico", value: 0, category: 'Defesa e Resistências' },
    { key: "res_acido", name: "Resistência a Ácido", value: 0, category: 'Defesa e Resistências' },
    { key: "res_corte", name: "Resistência a Corte", value: 0, category: 'Defesa e Resistências' },
    { key: "res_eletricidade", name: "Resistência a Eletricidade", value: 0, category: 'Defesa e Resistências' },
    { key: "res_essencia", name: "Resistência a Essência", value: 0, category: 'Defesa e Resistências' },
    { key: "res_fogo", name: "Resistência a Fogo", value: 0, category: 'Defesa e Resistências' },
    { key: "res_frio", name: "Resistência a Frio", value: 0, category: 'Defesa e Resistências' },
    { key: "res_impacto", name: "Resistência a Impacto", value: 0, category: 'Defesa e Resistências' },
    { key: "res_luz", name: "Resistência a Luz", value: 0, category: 'Defesa e Resistências' },
    { key: "res_mental", name: "Resistência a Mental", value: 0, category: 'Defesa e Resistências' },
    { key: "res_perfuracao", name: "Resistência a Perfuração", value: 0, category: 'Defesa e Resistências' },
    { key: "res_trevas", name: "Resistência a Trevas", value: 0, category: 'Defesa e Resistências' },
    { key: "res_veneno", name: "Resistência a Veneno", value: 0, category: 'Defesa e Resistências' },
    
    // Categoria: Vulnerabilidades e Imunidades
    { key: "vul_acido", name: "Vulnerabilidade a Ácido", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_corte", name: "Vulnerabilidade a Corte", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_eletricidade", name: "Vulnerabilidade a Eletricidade", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_essencia", name: "Vulnerabilidade a Essência", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_fogo", name: "Vulnerabilidade a Fogo", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_frio", name: "Vulnerabilidade a Frio", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_impacto", name: "Vulnerabilidade a Impacto", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_luz", name: "Vulnerabilidade a Luz", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_mental", name: "Vulnerabilidade a Mental", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_perfuracao", name: "Vulnerabilidade a Perfuração", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_trevas", name: "Vulnerabilidade a Trevas", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "vul_veneno", name: "Vulnerabilidade a Veneno", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "imune_doenca", name: "Imunidade a Doença", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true},
    { key: "imune_fadiga", name: "Imunidade a Fadiga", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true},
    { key: "imune_veneno", name: "Imunidade a Veneno", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true},
    { key: "imune_sangramento", name: "Imunidade a Sangramento", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true},
    { key: "imune_fogo", name: "Imunidade a Fogo", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "imune_frio", name: "Imunidade a Frio", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "imune_acido", name: "Imunidade a Ácido", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },
    { key: "imune_eletricidade", name: "Imunidade a Eletricidade", value: 0, category: 'Vulnerabilidades e Imunidades', isBool: true },

    // Categoria: Recursos
    { key: "PV_adc", name: "Vida Adicional", value: 0, category: 'Recursos' },
    { key: "PV_adc_nivel", name: "Vida por Nível", value: 0, category: 'Recursos' },
    { key: "PV_adc_impar", name: "Vida por Nível Ímpar", value: 0, category: 'Recursos' },
    ...ALL_ATTRIBUTES.map(attr => ({ key: `soma_${attr.toLowerCase()}_pv_total`, name: `Soma ${capitalize(attr.toLowerCase())} nos PV Totais`, value: 0, category: 'Recursos', isBool: true})),
    { key: "PM_adc", name: "Mana Adicional", value: 0, category: 'Recursos' },
    { key: "PM_adc_nivel", name: "Mana por Nível", value: 0, category: 'Recursos' },
    { key: "PM_adc_impar", name: "Mana por Nível Ímpar", value: 0, category: 'Recursos' },
    ...ALL_ATTRIBUTES.map(attr => ({ key: `soma_${attr.toLowerCase()}_pm_total`, name: `Soma ${capitalize(attr.toLowerCase())} nos PM Totais`, value: 0, category: 'Recursos', isBool: true})),

    // Categoria: Movimento
    { key: "deslocamento", name: "Bônus de Deslocamento", value: 0, category: 'Movimento' },
    { key: "deslocamento_escalada", name: "Deslocamento de Escalada", value: 0, category: 'Movimento' },
    { key: "deslocamento_natacao", name: "Deslocamento de Natação", value: 0, category: 'Movimento' },
    { key: "imune_penalidade_desloc_armadura", name: "Imune a Penalidade de Deslocamento por Armadura", value: 0, category: 'Movimento', isBool: true },
    
    // Categoria: Outros
    { key: "per_apren", name: "Perícias Adicionais para Treinar", value: 0, category: 'Outros' },
    { key: "num_poderes_concedidos", name: "Número de Poderes Concedidos", value: 0, category: 'Outros' },
    { key: "bonus_cd", name: "Bônus em CD de Magia", value: 0, category: 'Outros' },
    { key: "aumento_limite_carga", name: "Aumento de Limite de Carga", value: 0, category: 'Outros' },
    { key: "melhora_condicao_descanso", name: "Melhora na Condição de Descanso", value: 0, category: 'Outros' },
    { key: "reducao_custo_magia_repetida", name: "Redução de Custo por Magia Repetida", value: 0, category: 'Outros' },
    { key: "poderes_divindade", name: "Poderes Concedidos pela Divindade", value: 0, category: 'Outros' },
    
    // Categoria: Proficiências
    { key: "bonus_ataque_armas_simples", name: "Bônus de Ataque (Armas Simples)", value: 0, category: 'Proficiências' },
    { key: "bonus_ataque_armas_marciais", name: "Bônus de Ataque (Armas Marciais)", value: 0, category: 'Proficiências' },
    { key: "bonus_ataque_armas_exoticas", name: "Bônus de Ataque (Armas Exóticas)", value: 0, category: 'Proficiências' },
    { key: "bonus_ataque_armas_fogo", name: "Bônus de Ataque (Armas de Fogo)", value: 0, category: 'Proficiências' },
    { key: "reducao_penalidade_armaduras_leves", name: "Redução Penalidade (Armaduras Leves)", value: 0, category: 'Proficiências' },
    { key: "reducao_penalidade_armaduras_pesadas", name: "Redução Penalidade (Armaduras Pesadas)", value: 0, category: 'Proficiências' },
    { key: "reducao_penalidade_escudos", name: "Redução Penalidade (Escudos)", value: 0, category: 'Proficiências' },
];
Object.keys(SKILL_DEFAULT_ATTR).forEach(skill => {
    FIXED_MODIFIERS.push({key: `bonus_pericia_${skill}`, name: `Bônus em ${skill}`, value: 0, category: 'Perícias'});
});

const SOURCES = ["Todos", "T20 - Livro Básico - Jogo do Ano", "T20 - Deuses de Arton", "T20 - Heróis de Arton", "T20 - Ameaças de Arton", "T20 - Atlas de Arton", "Jornadas Heroicas", "T20 - Guia de NPCS", "Dragão Brasil", "A Lenda de Ruff Ghanor", "Homebrews"];
const POINT_BUY_COST = { '-1': -1, '0': 0, '1': 1, '2': 2, '3': 4, '4': 7 };

const DEFAULT_RACES = [
    { "name": "Anão", "source": "T20 - Livro Básico - Jogo do Ano", "bonuses": "CON: 2, SAB: 1, DES: -1", "attributeChoices": 0, "attributeBonus": 0, "attributeRestrictions": "", "tipoCriatura": "Humanoide", "tamanho": "Médio", "ataquesNaturais": "", "abilities": "Conhecimento das Rochas, Devagar e Sempre, Duro como Pedra, Tradição de Heredrimm" },
];

const DEFAULT_ORIGINS = [
    { "name": "Acólito", "items": "Símbolo sagrado, Traje de sacerdote", "power": "Membro da Igreja", "source": "T20 - Livro Básico - Jogo do Ano", "numBeneficios": 2, "benefits_skills": "Vontade, Religião", "benefits_powers": "Curandeiro, Medicina" },
];

const DEFAULT_DIVINITIES = [
    { "name": "Aharadak", "canalizarEnergia": "Negativa", "armaPreferida": "Corrente de espinhos", "powers": "Afinidade com a Tormenta, Êxtase da Loucura, Percepção Temporal, Rejeição Divina, Corromper Equipamento, Espalhar a Corrupção, Júbilo na Dor, Mediador da Tempestade", "obrigaçõesRestricoes": "No início de qualquer cena de ação, role 1d6. Com um resultado ímpar, você fica fascinado na primeira rodada, perdido em devaneios sobre a futilidade da vida (mesmo que seja imune a esta condição).", "source": "T20 - Livro Básico - Jogo do Ano" },
];

const DEFAULT_CLASSES = [
     { 
        "name": "Arcanista", 
        "pvInicial": 8, "pvPerLevel": 2, "pmPerLevel": 6, 
        "periciasDeClasse": "Misticismo, Vontade", "numPericiasAdicionais": 2, 
        "periciasAdicionais": "Conhecimento, Diplomacia, Enganação, Guerra, Iniciativa, Intimidação, Intuição, Investigação, Nobreza, Ofício, Percepção", 
        "levelAbilities": "1: Caminho do Arcanista, 1: Magias (1º Círculo), 2: Poder de Arcanista, 3: Poder de Arcanista, 4: Poder de Arcanista, 5: Magias (2º Círculo), 5: Poder de Arcanista, 6: Poder de Arcanista, 7: Poder de Arcanista, 8: Poder de Arcanista, 9: Magias (3º Círculo), 9: Poder de Arcanista, 10: Poder de Arcanista, 11: Poder de Arcanista, 12: Poder de Arcanista, 13: Magias (4º Círculo), 13: Poder de Arcanista, 14: Poder de Arcanista, 15: Poder de Arcanista, 16: Poder de Arcanista, 17: Magias (5º Círculo), 17: Poder de Arcanista, 18: Poder de Arcanista, 19: Poder de Arcanista, 20: Alta Arcana, 20: Poder de Arcanista", 
        "effects": "num_poderes_concedidos: 1",
        "choices": JSON.stringify([
            {
                "level": 1,
                "key": "caminho_arcanista",
                "label": "Caminho do Arcanista",
                "type": "select",
                "options": [
                    {"value": "bruxo", "label": "Bruxo", "description": "Você se aprofunda em magias que amaldiçoam e debilitam seus inimigos. Seu atributo-chave para magias é Carisma.", "effects": ""},
                    {"value": "feiticeiro", "label": "Feiticeiro", "description": "Seu poder mágico é inato. Você lança magias de forma intuitiva e poderosa. Seu atributo-chave para magias é Carisma.", "effects": ""},
                    {"value": "mago", "label": "Mago", "description": "Você é um estudioso da magia, aprendendo através de tomos e pergaminhos. Seu atributo-chave para magias é Inteligência.", "effects": ""}
                ]
            }
        ]),
        "source": "T20 - Livro Básico - Jogo do Ano" 
    },
    {
        "name": "Bucaneiro",
        "pvInicial": 16,
        "pvPerLevel": 4,
        "pmPerLevel": 3,
        "periciasDeClasse": "Luta ou Pontaria, Reflexos",
        "numPericiasAdicionais": 4,
        "periciasAdicionais": "Acrobacia, Atletismo, Atuação, Enganação, Fortitude, Furtividade, Iniciativa, Intimidação, Jogatina, Luta, Ofício, Percepção, Pilotagem, Pontaria",
        "levelAbilities": "1: Audácia, 1: Insolência, 2: Evasão, 2: Poder de Bucaneiro, 3: Esquiva Sagaz, 3: Poder de Bucaneiro, 4: Poder de Bucaneiro, 5: Panache, 5: Poder de Bucaneiro, 6: Poder de Bucaneiro, 7: Esquiva Sagaz, 7: Poder de Bucaneiro, 8: Poder de Bucaneiro, 9: Poder de Bucaneiro, 10: Evasão Aprimorada, 10: Poder de Bucaneiro, 11: Esquiva Sagaz, 11: Poder de Bucaneiro, 12: Poder de Bucaneiro, 13: Poder de Bucaneiro, 14: Poder de Bucaneiro, 15: Esquiva Sagaz, 15: Poder de Bucaneiro, 16: Poder de Bucaneiro, 17: Poder de Bucaneiro, 18: Poder de Bucaneiro, 19: Esquiva Sagaz, 19: Poder de Bucaneiro, 20: Sorte de Nimb, 20: Poder de Bucaneiro",
        "source": "T20 - Livro Básico - Jogo do Ano"
    },
];

const DEFAULT_POWERS = [
    {"name": "Acuidade com Arma", "type": "Combate", "prerequisites": "Des 1", "description": "Usa Destreza em vez de Força para ataques e danos com armas leves ou de arremesso."},
];

document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => { if (user && !state.userId) { state.userId = user.uid; initializeAppListeners(); } });
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { signInWithCustomToken(auth, __initial_auth_token).catch(() => signInAnonymously(auth)); } 
    else { signInAnonymously(auth); }
});

function initializeAppListeners() {
    setupTabNavigation();
    setupDataSubscriptions();
    setupModalControls();
    setupAdminButtonListeners();
    setupCharacterSheetListeners();
    renderAllowedSourcesFilter();
    setupPointBuyCalculator();
    document.getElementById('modifier-search-input').addEventListener('input', () => recalculateSheet());
    document.getElementById('admin-search-input').addEventListener('input', () => {
        window.renderRacesList();
        window.renderClassesList();
        window.renderOriginsList();
        window.renderDivinitiesList();
        window.renderPowersList();
        window.renderItemsList();
        window.renderWeaponsList();
        window.renderArmorsList();
        window.renderSpellsList();
    });
}

function setupTabNavigation() {
    const tabs = { criacao: {btn: document.getElementById('tab-criacao'), view: document.getElementById('view-criacao')}, ficha: { btn: document.getElementById('tab-ficha'), view: document.getElementById('view-ficha') }, modificadores: { btn: document.getElementById('tab-modificadores'), view: document.getElementById('view-modificadores') }, admin: { btn: document.getElementById('tab-admin'), view: document.getElementById('view-admin') } };
    const switchTab = (activeTab) => Object.keys(tabs).forEach(key => { tabs[key].btn.classList.toggle('active', key === activeTab); tabs[key].view.classList.toggle('hidden', key !== activeTab); });
    Object.keys(tabs).forEach(key => tabs[key].btn.addEventListener('click', () => switchTab(key)));
}

async function seedInitialData() {
    const dataToSeed = [
        { name: 'races', data: DEFAULT_RACES, collectionPath: collections.races },
        { name: 'classes', data: DEFAULT_CLASSES, collectionPath: collections.classes },
        { name: 'origins', data: DEFAULT_ORIGINS, collectionPath: collections.origins },
        { name: 'divinities', data: DEFAULT_DIVINITIES, collectionPath: collections.divinities }
    ];

    for (const seed of dataToSeed) {
        const collectionRef = collection(db, seed.collectionPath);
        try {
            const snapshot = await getDocs(collectionRef);
            if (snapshot.empty) {
                console.log(`A coleção de ${seed.name} está vazia. Cadastrando dados padrão...`);
                for (const itemData of seed.data) {
                    await addDoc(collectionRef, itemData);
                }
                console.log(`${capitalize(seed.name)} padrão cadastrados com sucesso.`);
            }
        } catch (error) {
            console.error(`Erro ao verificar ou cadastrar ${seed.name} padrão: `, error);
        }
    }
}

function setupDataSubscriptions() {
    seedInitialData(); // Seed default data if necessary
    const dataTypes = Object.keys(collections);
    let loadedCount = 0;
    const checkAllDataLoaded = () => { if (++loadedCount === dataTypes.length) { document.getElementById('loading').classList.add('hidden'); document.getElementById('app-content').classList.remove('hidden'); populateEquipmentSelects(); recalculateSheet(true, true); }};
    
    dataTypes.forEach(type => onSnapshot(collection(db, collections[type]), (snapshot) => {
        state[type] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (type === 'powers') {
            const firestorePowerNames = new Set(state.powers.map(p => p.name));
            const powersToAdd = DEFAULT_POWERS.filter(dp => !firestorePowerNames.has(dp.name));
            state.powers.push(...powersToAdd);
        }
        
        state[type].sort((a, b) => (a.name || a.displayName).localeCompare(b.name || b.displayName));
        
        window[`render${capitalize(type)}List`]?.();
        
        // Explicit calls based on the collection type
        if (type === 'races') window.populateRaceSelect();
        if (type === 'classes') window.populateClassLvl1Select();
        if (type === 'origins') window.populateOriginSelect();
        if (type === 'divinities') window.populateDivinitySelect();
        
        checkAllDataLoaded();
    }, (error) => console.error(`Erro ao buscar ${type}:`, error)));
}

window.renderRacesList = () => renderList('races', 'Raça', ['name']);
window.renderClassesList = () => renderList('classes', 'Classe', ['name']);
window.renderOriginsList = () => renderList('origins', 'Origem', ['name']);
window.renderDivinitiesList = () => renderList('divinities', 'Divindade', ['name']);
window.renderPowersList = () => renderList('powers', 'Poder ou Habilidade', ['name', 'type']);
window.renderItemsList = () => renderList('items', 'Item Geral', ['name', 'tipo']);
window.renderWeaponsList = () => renderList('weapons', 'Arma', ['name', 'proficiencia']);
window.renderArmorsList = () => renderList('armors', 'Armadura/Escudo', ['name', 'proficiencia']);

function renderList(type, singular, fields) {
    const listEl = document.getElementById(`${type}-list`);
    if (!listEl) return;
    const searchTerm = document.getElementById('admin-search-input')?.value.toLowerCase() || '';

    const highlight = (text) => {
        if (!searchTerm || !text) return text;
        const regex = new RegExp(searchTerm, 'gi');
        return text.toString().replace(regex, match => `<span class="bg-yellow-500 text-black rounded">${match}</span>`);
    };

    let filteredData = state[type]
        .filter(item => state.allowedSources.includes("Todos") || state.allowedSources.includes(item.source) || (!item.source && state.allowedSources.includes("T20 - Livro Básico - Jogo do Ano")));

    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            fields.some(f => item[f] && item[f].toString().toLowerCase().includes(searchTerm))
        );
    }

    listEl.innerHTML = (filteredData.length === 0) 
        ? `<div class="border-2 border-dashed border-gray-700 p-4 text-center rounded-lg"><p class="text-gray-400">Nenhum(a) ${singular.toLowerCase()} encontrado(a).</p></div>`
        : filteredData.map(item => `
            <div class="glass-effect p-3 flex justify-between items-center text-sm">
                <div>
                    ${fields.map(f => `<span class="font-semibold">${highlight(item[f]||'')}</span>`).join(' - ')}
                </div>
                <div>
                    <button class="edit-btn text-yellow-400 hover:text-yellow-300" data-type="${type}" data-id="${item.id}">Editar</button>
                    <button class="delete-btn text-red-500 hover:text-red-400 ml-2" data-type="${type}" data-id="${item.id}">Excluir</button>
                </div>
            </div>
        `).join('');

    listEl.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEditClick));
    listEl.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteClick));
}

window.renderSpellsList = () => {
    const searchTerm = document.getElementById('admin-search-input')?.value.toLowerCase() || '';
    const highlight = (text) => {
        if (!searchTerm || !text) return text;
        const regex = new RegExp(searchTerm, 'gi');
        return text.toString().replace(regex, match => `<span class="bg-yellow-500 text-black rounded">${match}</span>`);
    };

    for (let i = 1; i <= 5; i++) {
        const listEl = document.getElementById(`spells-circle-${i}-list`);
        if (listEl) listEl.innerHTML = '';
    }

    let filteredData = state.spells
        .filter(item => state.allowedSources.includes("Todos") || state.allowedSources.includes(item.source) || (!item.source && state.allowedSources.includes("T20 - Livro Básico - Jogo do Ano")));

    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            (item.escola && item.escola.toLowerCase().includes(searchTerm)) ||
            (item.classificacao && item.classificacao.toLowerCase().includes(searchTerm))
        );
    }

    if (filteredData.length === 0) {
        const firstList = document.getElementById('spells-circle-1-list');
        if(firstList && searchTerm) firstList.innerHTML = `<div class="border-2 border-dashed border-gray-700 p-4 text-center rounded-lg"><p class="text-gray-400">Nenhuma magia encontrada.</p></div>`;
        return;
    }

    filteredData.forEach(item => {
        const listEl = document.getElementById(`spells-circle-${item.circulo}-list`);
        if (listEl) {
            const itemHtml = `
            <div class="glass-effect p-3 text-sm">
                <div class="flex justify-between items-center">
                    <span class="font-semibold">${highlight(item.name || '')}</span>
                    <div>
                        <button class="edit-btn text-yellow-400" data-type="spells" data-id="${item.id}">Editar</button>
                        <button class="delete-btn text-red-500 ml-2" data-type="spells" data-id="${item.id}">Excluir</button>
                    </div>
                </div>
                <div class="text-xs text-gray-400 mt-1">
                    ${highlight(item.escola || '')} - ${highlight(item.classificacao || '')}
                </div>
            </div>`;
            listEl.innerHTML += itemHtml;
        }
    });

    for (let i = 1; i <= 5; i++) {
        const listEl = document.getElementById(`spells-circle-${i}-list`);
        if (listEl) {
            // Open details if it has search results
            if(searchTerm && listEl.innerHTML.trim() !== '') {
                listEl.closest('details').open = true;
            }

            if(!listEl.innerHTML) listEl.innerHTML = `<p class="text-xs text-gray-500">Nenhuma magia deste círculo.</p>`
            listEl.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEditClick));
            listEl.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteClick));
        }
    }
};

function populateSelect(selectId, dataArray, selectedId) {
    const selectEl = document.getElementById(selectId);
    if (!selectEl) return;
    
    const options = (dataArray || [])
        .filter(item => state.allowedSources.includes("Todos") || state.allowedSources.includes(item.source) || (!item.source && state.allowedSources.includes("T20 - Livro Básico - Jogo do Ano")))
        .map(item => `<option value="${item.id}" ${item.id === selectedId ? 'selected' : ''}>${item.name}</option>`)
        .join('');
        
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


const modal = document.getElementById('generic-modal');
let currentEdit = null;
function setupModalControls() {
    modal.addEventListener('click', (e) => { if (e.target.id === 'generic-modal' || e.target.id ==='modal-close-btn' || e.target.id === 'modal-cancel-btn') closeModal(); });
    document.getElementById('modal-save-btn').addEventListener('click', handleSave);
}
function openModal(title, content, data = null) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = content;
    currentEdit = data;
    
    const saveBtn = document.getElementById('modal-save-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    saveBtn.style.display = data?.isAction ? 'none' : 'inline-flex';
    cancelBtn.textContent = data?.isAction ? 'Fechar' : 'Cancelar';
    
    saveBtn.textContent = data?.isDelete ? 'Excluir' : 'Salvar';
    saveBtn.classList.toggle('bg-red-600', data?.isDelete);
    saveBtn.classList.toggle('btn-primary', !data?.isDelete);

    if (data?.id && !data.isDelete) { 
        const item = state[data.type].find(i => i.id === data.id); 
        if (item) {
            Object.keys(item).forEach(key => { 
                const input = modal.querySelector(`[name="${key}"]`); 
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = !!item[key];
                    } else {
                        input.value = item[key];
                    }
                     // Trigger change events for conditional logic
                    if (input.onchange) {
                        input.onchange();
                    }
                }
            });
            if (item.source) {
                const sourceSelect = modal.querySelector('select[name="source"]');
                const homebrewInput = modal.querySelector('#homebrew-source-input');
                const isOfficialSource = SOURCES.slice(1).includes(item.source);
                
                sourceSelect.value = isOfficialSource ? item.source : 'Homebrews';
                if(homebrewInput) {
                    homebrewInput.style.display = isOfficialSource ? 'none' : 'block';
                    homebrewInput.value = isOfficialSource ? '' : item.source;
                }
            }
        }
    }
    modal.classList.remove('hidden');
}
function closeModal() { modal.classList.add('hidden'); }

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

function handleEditClick(e) {
    const { type, id } = e.target.dataset;
    const formFunctions = {
        races: getRaceFormHtml,
        classes: getClassFormHtml,
        origins: getOriginFormHtml,
        divinities: getDivinityFormHtml,
        powers: getPowerFormHtml,
        items: getItemFormHtml,
        weapons: getWeaponFormHtml,
        armors: getArmorFormHtml,
        spells: getSpellFormHtml
    };
    const singularNames = {
        races: 'Raça',
        classes: 'Classe',
        origins: 'Origem',
        divinities: 'Divindade',
        powers: 'Poder/Habilidade',
        items: 'Item',
        weapons: 'Arma',
        armors: 'Armadura/Escudo',
        spells: 'Magia'
    };

    const formHtmlFunction = formFunctions[type];
    const singularName = singularNames[type] || 'Item';

    if (formHtmlFunction) {
        openModal(`Editar ${singularName}`, formHtmlFunction(), { type, id });
    } else {
        console.error("Nenhuma função de formulário encontrada para o tipo:", type);
    }
}

async function handleDeleteClick(e) {
    const { type, id } = e.target.dataset;
    const item = state[type].find(i => i.id === id);
    openModal(`Confirmar Exclusão`, `<p>Excluir "${item.name || item.displayName}"?</p>`, { type, id, isDelete: true });
}
async function handleSave() {
    if (currentEdit?.isDelete) { await deleteDoc(doc(db, collections[currentEdit.type], currentEdit.id)); closeModal(); return; }
    const form = modal.querySelector('form');
    if (!form || !form.checkValidity()) { form?.reportValidity(); return; }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.source === 'Homebrews' && data.source_homebrew) {
        data.source = data.source_homebrew;
    }
    delete data.source_homebrew;

    Object.keys(data).forEach(key => { if (!isNaN(data[key]) && data[key]?.trim() !== '' && typeof data[key] !== 'boolean') data[key] = Number(data[key]) });
    if (currentEdit.id) { await setDoc(doc(db, collections[currentEdit.type], currentEdit.id), data); } 
    else { await addDoc(collection(db, collections[currentEdit.type]), data); }
    closeModal();
}

const getSourceFieldHtml = () => `<div class="col-span-2 mt-4"><label class="block"><span class="text-gray-300">Fonte</span><select name="source" class="form-select mt-1 block w-full" onchange="document.getElementById('homebrew-source-input').style.display = this.value === 'Homebrews' ? 'block' : 'none'; if(this.value !== 'Homebrews') { document.getElementById('homebrew-source-input').value = ''; }">${SOURCES.slice(1).map(s => `<option value="${s}">${s}</option>`).join('')}</select></label><input name="source_homebrew" id="homebrew-source-input" type="text" placeholder="Digite a fonte Homebrew" class="form-input mt-2 block w-full" style="display:none;"></div>`;
const getRaceFormHtml = () => `<form><label class="block"><span class="text-gray-300">Nome</span><input name="name" type="text" class="form-input mt-1 block w-full" required></label><div class="grid grid-cols-2 gap-4 mt-4"><label class="block"><span class="text-gray-300">Tipo de Criatura</span><input name="tipoCriatura" type="text" class="form-input mt-1 block w-full" placeholder="Ex: Humanoide, Monstro"></label><label class="block"><span class="text-gray-300">Tamanho</span><select name="tamanho" class="form-select mt-1 block w-full"><option value="Pequeno">Pequeno</option><option value="Médio" selected>Médio</option><option value="Grande">Grande</option></select></label></div><label class="block mt-4"><span class="text-gray-300">Bônus Fixos (ex: CON: 2, SAB: -1)</span><input name="bonuses" type="text" class="form-input mt-1 block w-full"></label><div class="grid grid-cols-3 gap-4 mt-4"><label class="block"><span class="text-gray-300">Nº Escolhas Atr.</span><input name="attributeChoices" type="number" min="0" value="0" class="form-input mt-1 block w-full"></label><label class="block"><span class="text-gray-300">Bônus</span><input name="attributeBonus" type="number" value="0" class="form-input mt-1 block w-full"></label><label class="block"><span class="text-gray-300">Restrições</span><input name="attributeRestrictions" type="text" placeholder="ex: CAR" class="form-input mt-1 block w-full"></label></div><label class="block mt-4"><span class="text-gray-300">Ataques Naturais (ex: Mordida: 1d6 Perf. x2)</span><textarea name="ataquesNaturais" class="form-textarea mt-1 block w-full" placeholder="Um por linha..."></textarea></label><label class="block mt-4"><span class="text-gray-300">Habilidades</span><textarea name="abilities" class="form-textarea mt-1 block w-full"></textarea></label><label class="block mt-4"><span class="text-gray-300">Efeitos (ex: num_poderes_concedidos: 1)</span><input name="effects" class="form-input mt-1 block w-full" placeholder="num_poderes_concedidos: 1, per_apren: 2"></label><label class="block mt-4 col-span-2"><span class="text-gray-300">Escolhas (JSON)</span><textarea name="choices" class="form-textarea mt-1 block w-full font-mono text-xs" rows="5" placeholder='[{"level": 1, "key": "minha_escolha", "label": "Minha Escolha", "type": "select", "options": [{"value": "opt1", "label": "Opção 1"}]}]'></textarea></label>${getSourceFieldHtml()}</form>`;
const getClassFormHtml = () => `<form class="grid grid-cols-2 gap-4"><label class="block col-span-2"><span class="text-gray-300">Nome</span><input name="name" type="text" class="form-input mt-1 block w-full" required></label><label class="block"><span class="text-gray-300">PV Inicial</span><input name="pvInicial" type="number" min="0" class="form-input mt-1 block w-full" required></label><label class="block"><span class="text-gray-300">PV/Nível</span><input name="pvPerLevel" type="number" min="0" class="form-input mt-1 block w-full" required></label><label class="block"><span class="text-gray-300">PM/Nível</span><input name="pmPerLevel" type="number" min="0" class="form-input mt-1 block w-full" required></label><label class="block"><span class="text-gray-300">Nº perícias adicionais</span><input name="numPericiasAdicionais" type="number" min="0" class="form-input mt-1 block w-full" required></label><label class="block col-span-2"><span class="text-gray-300">Perícias de classe (iniciais, separadas por vírgula)</span><textarea name="periciasDeClasse" class="form-textarea mt-1 block w-full"></textarea></label><label class="block col-span-2"><span class="text-gray-300">Perícias adicionais (para escolha, separadas por vírgula)</span><textarea name="periciasAdicionais" class="form-textarea mt-1 block w-full"></textarea></label><label class="block col-span-2"><span class="text-gray-300">Habilidades de Nível (ex: 1: Ataque Especial)</span><textarea name="levelAbilities" class="form-textarea mt-1 block w-full"></textarea></label><label class="block mt-4 col-span-2"><span class="text-gray-300">Efeitos (ex: num_poderes_concedidos: 1)</span><input name="effects" class="form-input mt-1 block w-full" placeholder="num_poderes_concedidos: 1"></label><label class="block col-span-2"><span class="text-gray-300">Escolhas (JSON)</span><textarea name="choices" class="form-textarea mt-1 block w-full font-mono text-xs" rows="5" placeholder='[{"level": 1, "key": "minha_escolha", "label": "Minha Escolha", "type": "select", "options": [{"value": "opt1", "label": "Opção 1"}]}]'></textarea></label>${getSourceFieldHtml()}</form>`;
const getOriginFormHtml = () => `<form><label class="block"><span class="text-gray-300">Nome</span><input name="name" type="text" class="form-input mt-1 block w-full" required></label><label class="block mt-4"><span class="text-gray-300">Itens Iniciais</span><textarea name="items" class="form-textarea mt-1 block w-full"></textarea></label><label class="block mt-4"><span class="text-gray-300">Poder Fixo (Opcional)</span><input name="power" type="text" class="form-input mt-1 block w-full" placeholder="Nome exato do poder"></label><hr class="my-4 border-gray-600"><h4 class="text-md font-semibold text-red-300">Benefícios à Escolha</h4><label class="block mt-2"><span class="text-gray-300">Número de Benefícios para Escolher</span><input name="numBeneficios" type="number" value="2" min="0" class="form-input mt-1 block w-full"></label><label class="block mt-4"><span class="text-gray-300">Perícias Ofertadas (separadas por vírgula)</span><textarea name="benefits_skills" class="form-textarea mt-1 block w-full"></textarea></label><label class="block mt-4"><span class="text-gray-300">Poderes Ofertados (separadas por vírgula)</span><textarea name="benefits_powers" class="form-textarea mt-1 block w-full"></textarea></label><label class="block mt-4 col-span-2"><span class="text-gray-300">Escolhas (JSON)</span><textarea name="choices" class="form-textarea mt-1 block w-full font-mono text-xs" rows="5" placeholder='[{"level": 1, "key": "minha_escolha", "label": "Minha Escolha", "type": "select", "options": [{"value": "opt1", "label": "Opção 1"}]}]'></textarea></label>${getSourceFieldHtml()}</form>`;
const getDivinityFormHtml = () => `
  <form>
    <label class="block">
      <span class="text-gray-300">Nome</span>
      <input name="name" type="text" class="form-input mt-1 block w-full" required>
    </label>
    <div class="grid grid-cols-2 gap-4 mt-4">
        <label class="block">
            <span class="text-gray-300">Arma Preferida</span>
            <input name="armaPreferida" type="text" class="form-input mt-1 block w-full">
        </label>
        <label class="block">
            <span class="text-gray-300">Canalizar Energia</span>
            <select name="canalizarEnergia" class="form-select mt-1 block w-full">
                <option value="Qualquer">Qualquer</option>
                <option value="Positiva">Positiva</option>
                <option value="Negativa">Negativa</option>
            </select>
        </label>
    </div>
    <label class="block mt-4">
      <span class="text-gray-300">Poderes Concedidos (nomes separados por vírgula)</span>
      <textarea name="powers" class="form-textarea mt-1 block w-full"></textarea>
    </label>
    <label class="block mt-4">
      <span class="text-gray-300">Obrigações & Restrições</span>
      <textarea name="obrigaçõesRestricoes" class="form-textarea mt-1 block w-full"></textarea>
    </label>
     <label class="block mt-4 col-span-2"><span class="text-gray-300">Escolhas (JSON)</span><textarea name="choices" class="form-textarea mt-1 block w-full font-mono text-xs" rows="5" placeholder='[{"level": 1, "key": "minha_escolha", "label": "Minha Escolha", "type": "select", "options": [{"value": "opt1", "label": "Opção 1"}]}]'></textarea></label>
    ${getSourceFieldHtml()}
  </form>
`;
const getPowerFormHtml = () => `<form><div class="grid grid-cols-2 gap-4"><label class="block"><span class="text-gray-300">Nome</span><input name="name" type="text" class="form-input mt-1 block w-full" required></label><label class="block"><span class="text-gray-300">Tipo</span><select name="type" class="form-select mt-1 block w-full"><option value="Geral">Poder Geral</option><option value="Classe">Poder de Classe</option><option value="Divindade">Poder Concedido</option><option value="Raça">Poder de Raça</option><option value="Origem">Poder de Origem</option><option value="Magia">Magia</option></select></label><label class="block"><span class="text-gray-300">Nível Mínimo</span><input name="minLevel" type="number" value="1" min="1" class="form-input mt-1 block w-full"></label><label class="block"><span class="text-gray-300">Máx. Escolhas</span><input name="maxUses" type="number" value="1" min="1" class="form-input mt-1 block w-full"></label></div><label class="block mt-4"><span class="text-gray-300">Restrição de Classe (Nome Exato)</span><input name="classRestriction" type="text" class="form-input mt-1 block w-full"></label><label class="block mt-4"><span class="text-gray-300">Pré-requisitos (Texto informativo)</span><input name="prerequisites" type="text" class="form-input mt-1 block w-full"></label><label class="block mt-4"><span class="text-gray-300">Efeitos (ex: FOR: 1, Luta: 2, PV_adc: 10, PM_adc_nivel: 1)</span><input name="effects" type="text" class="form-input mt-1 block w-full"></label><label class="block mt-4"><span class="text-gray-300">Descrição</span><textarea name="description" class="form-textarea mt-1 block w-full"></textarea></label>${getSourceFieldHtml()}</form>`;
const getItemFormHtml = () => `
    <form class="space-y-4">
        <label class="block"><span class="text-gray-300">Nome</span><input name="name" type="text" class="form-input mt-1 block w-full" required></label>
        <div>
            <label class="block"><span class="text-gray-300">Tipo</span>
                <select name="tipo" class="form-select mt-1 block w-full" onchange="document.getElementById('item-alquimico-details').style.display = this.value === 'Alquímico' ? 'block' : 'none'">
                    <option value="Equipamento de Aventura">Equipamento de Aventura</option>
                    <option value="Ferramenta">Ferramenta</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Esotérico">Esotérico</option>
                    <option value="Alquímico">Alquímico</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Animais">Animais</option>
                    <option value="Veículos">Veículos</option>
                    <option value="Serviços">Serviços</option>
                </select>
            </label>
            <div id="item-alquimico-details" class="mt-2 pl-4 border-l-2 border-gray-600" style="display:none;">
                <label class="block"><span class="text-gray-300">Subtipo Alquímico</span>
                    <select name="subtipo_alquimico" class="form-select mt-1 block w-full">
                        <option value="Preparados">Preparados</option>
                        <option value="Catalisadores">Catalisadores</option>
                        <option value="Alquímicos">Alquímicos</option>
                    </select>
                </label>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="block"><span class="text-gray-300">Espaço</span><input name="espaco" type="number" value="1" min="0" class="form-input mt-1 block w-full"></label>
            <label class="block"><span class="text-gray-300">Preço</span><input name="preco" type="number" value="0" min="0" class="form-input mt-1 block w-full"></label>
        </div>
        <label class="block"><span class="text-gray-300">Descrição</span><textarea name="descricao" class="form-textarea mt-1 block w-full" rows="2"></textarea></label>
        <label class="block"><span class="text-gray-300">Habilidades</span><textarea name="habilidades" class="form-textarea mt-1 block w-full" rows="2"></textarea></label>
        ${getSourceFieldHtml()}
    </form>
`;
const getWeaponFormHtml = () => `
    <form class="space-y-4">
        <label class="block"><span class="text-gray-300">Nome</span><input name="name" type="text" class="form-input mt-1 block w-full" required></label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="block"><span class="text-gray-300">Proficiência</span>
                <select name="proficiencia" class="form-select mt-1 block w-full">
                    <option value="Armas Simples">Armas Simples</option>
                    <option value="Armas Marciais">Armas Marciais</option>
                    <option value="Armas Exóticas">Armas Exóticas</option>
                    <option value="Armas de Fogo">Armas de Fogo</option>
                </select>
            </label>
            <label class="block"><span class="text-gray-300">Empunhadura</span>
                <select name="empunhadura" class="form-select mt-1 block w-full">
                    <option value="Leve">Leve</option>
                    <option value="Uma mão">Uma mão</option>
                    <option value="Duas mãos">Duas mãos</option>
                </select>
            </label>
        </div>
        <div>
            <label class="block"><span class="text-gray-300">Propósito</span>
                <select name="proposito" class="form-select mt-1 block w-full" onchange="document.getElementById('weapon-proposito-distancia-details').style.display = this.value === 'Ataque a Distância' ? 'block' : 'none'">
                    <option value="Corpo a Corpo">Corpo a Corpo</option>
                    <option value="Ataque a Distância">Ataque a Distância</option>
                </select>
            </label>
            <div id="weapon-proposito-distancia-details" class="mt-2 pl-4 border-l-2 border-gray-600" style="display:none;">
                <label class="block"><span class="text-gray-300">Tipo de Ataque a Distância</span>
                    <select name="tipo_distancia" class="form-select mt-1 block w-full">
                        <option value="Arremesso">Arremesso</option>
                        <option value="Disparo">Disparo</option>
                    </select>
                </label>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label class="block"><span class="text-gray-300">Dano</span><input name="dano" type="text" class="form-input mt-1 block w-full" placeholder="ex: 1d8"></label>
            <label class="block"><span class="text-gray-300">Crítico</span><input name="critico" type="text" class="form-input mt-1 block w-full" placeholder="ex: 19/x2"></label>
            <label class="block"><span class="text-gray-300">Alcance</span><input name="alcance" type="text" class="form-input mt-1 block w-full" placeholder="ex: Curto"></label>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label class="block"><span class="text-gray-300">Tipo</span><input name="tipo" type="text" class="form-input mt-1 block w-full" placeholder="ex: C, I, P"></label>
            <label class="block"><span class="text-gray-300">Espaço</span><input name="espaco" type="number" value="1" min="0" class="form-input mt-1 block w-full"></label>
            <label class="block"><span class="text-gray-300">Preço</span><input name="preco" type="number" value="0" min="0" class="form-input mt-1 block w-full"></label>
        </div>
        <label class="block"><span class="text-gray-300">Descrição</span><textarea name="descricao" class="form-textarea mt-1 block w-full" rows="2"></textarea></label>
        <label class="block"><span class="text-gray-300">Habilidades</span><textarea name="habilidades" class="form-textarea mt-1 block w-full" rows="2"></textarea></label>
        ${getSourceFieldHtml()}
    </form>
`;
const getArmorFormHtml = () => `
    <form class="space-y-4">
        <label class="block"><span class="text-gray-300">Nome</span><input name="name" type="text" class="form-input mt-1 block w-full" required></label>
        <label class="block"><span class="text-gray-300">Proficiência</span>
            <select name="proficiencia" class="form-select mt-1 block w-full">
                <option value="Armaduras Leves">Armaduras Leves</option>
                <option value="Armaduras Pesadas">Armaduras Pesadas</option>
                <option value="Escudos">Escudos</option>
            </select>
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="block"><span class="text-gray-300">Bônus na Defesa</span><input name="bonus_defesa" type="number" value="0" class="form-input mt-1 block w-full"></label>
            <label class="block"><span class="text-gray-300">Penalidade de Armadura</span><input name="penalidade_armadura" type="number" value="0" class="form-input mt-1 block w-full"></label>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="block"><span class="text-gray-300">Espaço</span><input name="espaco" type="number" value="1" min="0" class="form-input mt-1 block w-full"></label>
            <label class="block"><span class="text-gray-300">Preço</span><input name="preco" type="number" value="0" min="0" class="form-input mt-1 block w-full"></label>
        </div>
        <label class="block"><span class="text-gray-300">Descrição</span><textarea name="descricao" class="form-textarea mt-1 block w-full" rows="2"></textarea></label>
        <label class="block"><span class="text-gray-300">Habilidades</span><textarea name="habilidades" class="form-textarea mt-1 block w-full" rows="2"></textarea></label>
        ${getSourceFieldHtml()}
    </form>
`;
const getSpellFormHtml = () => `
    <form>
        <div class="grid grid-cols-2 gap-4">
            <label class="block col-span-2"><span class="text-gray-300">Nome</span><input name="name" type="text" class="form-input mt-1 block w-full" required></label>
            <label class="block"><span class="text-gray-300">Círculo</span><input name="circulo" type="number" min="1" max="5" class="form-input mt-1 block w-full" required></label>
            <label class="block"><span class="text-gray-300">Escola</span>
                <select name="escola" class="form-select mt-1 block w-full">
                    <option value="Abjuração">Abjuração</option>
                    <option value="Adivinhação">Adivinhação</option>
                    <option value="Convocação">Convocação</option>
                    <option value="Encantamento">Encantamento</option>
                    <option value="Evocação">Evocação</option>
                    <option value="Ilusão">Ilusão</option>
                    <option value="Necromancia">Necromancia</option>
                    <option value="Transmutação">Transmutação</option>
                </select>
            </label>
            <label class="block"><span class="text-gray-300">Classificação</span>
                <select name="classificacao" class="form-select mt-1 block w-full">
                    <option value="Divina">Divina</option>
                    <option value="Arcana">Arcana</option>
                    <option value="Universal">Universal</option>
                </select>
            </label>
            <label class="block"><span class="text-gray-300">Execução</span>
                <select name="execucao" class="form-select mt-1 block w-full">
                    <option value="Ação Padrão">Ação Padrão</option>
                    <option value="Ação de Movimento">Ação de Movimento</option>
                    <option value="Ação Livre">Ação Livre</option>
                    <option value="Reação">Reação</option>
                    <option value="Ação Completa">Ação Completa</option>
                </select>
            </label>
        </div>
        <label class="block mt-4"><span class="text-gray-300">Alcance/Efeito</span><input name="alcance" type="text" class="form-input mt-1 block w-full"></label>
        <label class="block mt-4"><span class="text-gray-300">Duração</span><input name="duracao" type="text" class="form-input mt-1 block w-full"></label>
        <label class="block mt-4"><span class="text-gray-300">Resistência</span><input name="resistencia" type="text" class="form-input mt-1 block w-full"></label>
        <label class="block mt-4"><span class="text-gray-300">Descrição</span><textarea name="description" class="form-textarea mt-1 block w-full"></textarea></label>
        <label class="block mt-4"><span class="text-gray-300">Aprimoramentos</span><textarea name="aprimoramentos" class="form-textarea mt-1 block w-full"></textarea></label>
        ${getSourceFieldHtml()}
    </form>
`;

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
            recalculateSheet(false, true);
        });
    });
}

function setupCharacterSheetListeners() {
    document.getElementById('select-race').addEventListener('change', e => updateCharacter('race', e.target.value));
    document.getElementById('select-origin').addEventListener('change', e => updateCharacter('origin', e.target.value));
    document.getElementById('select-divinity').addEventListener('change', e => updateCharacter('divinity', e.target.value));
    document.getElementById('select-class-lvl1').addEventListener('change', e => updateCharacter('class', e.target.value));
    
    document.getElementById('char-level').addEventListener('change', e => { 
        state.currentCharacter.level = parseInt(e.target.value) || 1; 
        recalculateSheet(false, true); // Recalculate and update choices UI as level can unlock new abilities
    });
    
    document.getElementById('view-ficha').addEventListener('input', (e) => {
        if(e.target.id === 'current-hp') state.currentCharacter.currentHP = parseInt(e.target.value) || 0;
        if(e.target.id === 'current-pm') state.currentCharacter.currentPM = parseInt(e.target.value) || 0;
        updateResourceBars();
    });
    
     document.getElementById('view-ficha').addEventListener('change', e => {
         if (e.target.id === 'defense-attribute-select') {
             state.currentCharacter.defenseAttribute = e.target.value;
         } else if (e.target.id === 'select-armor') {
             state.currentCharacter.equippedArmor = e.target.value;
         } else if (e.target.id === 'select-shield') {
             state.currentCharacter.equippedShield = e.target.value;
         } else if (e.target.id === 'spell-attribute-select') {
            state.currentCharacter.spellAttribute = e.target.value;
         }
         recalculateSheet();
     });
    
    document.getElementById('modifier-name-toggle').addEventListener('change', e => { state.showTechnicalModifierNames = e.target.checked; recalculateSheet(); });
    
    document.getElementById('view-ficha').addEventListener('click', e => {
        const button = e.target.closest('.details-toggle-btn');
        if(button) {
            const targetId = button.dataset.target;
            const detailsSection = document.getElementById(targetId);
            if(detailsSection) detailsSection.classList.toggle('open');
        }
        const card = e.target.closest('.attribute-card');
        if(card) {
            const key = card.dataset.attr;
            document.getElementById(`attr-details-${key}`).classList.toggle('open');
        }
        if(e.target.id === 'learn-spell-btn'){
            openLearnSpellModal();
        }
    });
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
    
    recalculateSheet(true, true); // Recalculate, reset HP/PM, and update the choices UI
}

function renderChoiceSelectors({ sectionId, containerId, choiceCount, availableOptions, storageObject, labelPrefix, onchangeCallback }) {
    const section = document.getElementById(sectionId);
    const container = document.getElementById(containerId);
    
    if (!choiceCount || choiceCount === 0 || !availableOptions || availableOptions.length === 0) {
        return;
    }

    section.classList.remove('hidden');
    const currentlySelectedValues = Object.values(storageObject).filter(v => v);

    const allOriginSkills = new Set(Object.values(state.currentCharacter.chosenOriginBenefits).filter(b => b && b.startsWith('skill:')).map(b => b.split(':')[1]));
    const allClassSkills = new Set(Object.values(state.currentCharacter.chosenClassSkills).filter(Boolean));
    let classFixedSkills = new Set();
    if (state.currentCharacter.class?.periciasDeClasse) {
        state.currentCharacter.class.periciasDeClasse.split(',').forEach(s => {
            if (!s.includes(' ou ')) {
                classFixedSkills.add(s.trim());
            }
        });
    }
    Object.values(state.currentCharacter.chosenClassFixedSkills).forEach(skill => {
        if (skill) classFixedSkills.add(skill);
    });


    for (let i = 0; i < choiceCount; i++) {
        const selectWrapper = document.createElement('div');
        const select = document.createElement('select');
        select.className = 'form-select w-full';
        select.dataset.choiceIndex = i;

        const thisChoiceValue = storageObject[i] || "";

        let optionsHtml = `<option value="">${labelPrefix} ${i + 1}</option>`;

        if (availableOptions[0]?.groupLabel) { // Handle optgroups
            availableOptions.forEach(group => {
                optionsHtml += `<optgroup label="${group.groupLabel}">`;
                group.options.forEach(opt => {
                    const optValue = opt.value;
                    const optLabel = opt.label;
                    
                    const isSelectedByThisControl = thisChoiceValue === optValue;
                    const isSelectedElsewhereInGroup = currentlySelectedValues.includes(optValue) && !isSelectedByThisControl;
                    
                    let isExternallyChosen = false;
                    if (optValue.startsWith('skill:')) {
                        const skillName = optValue.split(':')[1];
                        if(classFixedSkills.has(skillName)) isExternallyChosen = true;
                        if (storageObject !== state.currentCharacter.chosenClassSkills && allClassSkills.has(skillName)) isExternallyChosen = true;
                        if (storageObject !== state.currentCharacter.chosenOriginBenefits && allOriginSkills.has(skillName)) isExternallyChosen = true;
                    }
                    const isDisabled = isSelectedElsewhereInGroup || (isExternallyChosen && !isSelectedByThisControl);

                    optionsHtml += `<option value="${optValue}" ${isSelectedByThisControl ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}>${optLabel}</option>`;
                });
                optionsHtml += `</optgroup>`;
            });
        } else { // Handle flat array of strings
            availableOptions.forEach(opt => {
                const optValue = opt;
                const optLabel = opt;

                const isSelectedByThisControl = thisChoiceValue === optValue;
                const isSelectedElsewhereInGroup = currentlySelectedValues.includes(optValue) && !isSelectedByThisControl;

                let isExternallyChosen = false;
                if (labelPrefix.includes('Perícia')) {
                    if(classFixedSkills.has(optLabel)) isExternallyChosen = true;
                     if (storageObject !== state.currentCharacter.chosenClassSkills && allClassSkills.has(optLabel)) isExternallyChosen = true;
                     if (storageObject !== state.currentCharacter.chosenOriginBenefits && allOriginSkills.has(optLabel)) isExternallyChosen = true;
                }

                const isDisabled = isSelectedElsewhereInGroup || (isExternallyChosen && !isSelectedByThisControl);

                optionsHtml += `<option value="${optValue}" ${isSelectedByThisControl ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}>${optLabel}</option>`;
            });
        }

        select.innerHTML = optionsHtml;

        select.addEventListener('change', (e) => {
            const index = e.target.dataset.choiceIndex;
            storageObject[index] = e.target.value;
            onchangeCallback(false, false); 
        });
        
        selectWrapper.appendChild(select);
        container.appendChild(selectWrapper);
    }
}

function renderGenericChoicesForType(type, source) {
    const container = document.getElementById(`${type}-choice-container`);
    if (!source?.choices || !container) return;

    let choices;
    try {
        choices = typeof source.choices === 'string' ? JSON.parse(source.choices) : source.choices;
    } catch (e) { console.error(`Error parsing 'choices' JSON for ${type}: `, source.choices); return; }

    if (!Array.isArray(choices)) return;
    
    const { level, generalChoices } = state.currentCharacter;
    let choicesHtml = '';
    const needsSeparator = container.innerHTML.trim() !== '';

    choices.forEach(choice => {
        if (level >= choice.level) {
            if (choicesHtml.trim() === '' && needsSeparator) {
                choicesHtml += `<hr class="my-4 border-gray-600">`;
            }
            const choiceKey = `${type}_${choice.key}`;
            choicesHtml += `
                <div>
                    <h4 class="text-md font-semibold text-red-300 mb-2">${choice.label}</h4>
                    <div class="space-y-2">`;

            if (choice.type === 'select') {
                choicesHtml += `<select data-choice-key="${choiceKey}" class="form-select w-full general-choice-select">`;
                choicesHtml += `<option value="">Selecione...</option>`;
                choice.options.forEach(opt => {
                    const isSelected = generalChoices[choiceKey] === opt.value;
                    choicesHtml += `<option value="${opt.value}" ${isSelected ? 'selected' : ''}>${opt.label}</option>`;
                });
                choicesHtml += `</select>`;
                const selectedOpt = choice.options.find(o => o.value === generalChoices[choiceKey]);
                if (selectedOpt?.description) {
                    choicesHtml += `<p class="text-sm text-gray-400 mt-2">${selectedOpt.description}</p>`;
                }
            }
            choicesHtml += `</div></div>`;
        }
    });

    if (choicesHtml.trim() !== '') {
        container.innerHTML += choicesHtml;
        container.closest('.glass-effect').classList.remove('hidden');
        
        container.querySelectorAll('.general-choice-select').forEach(select => {
            const key = select.dataset.choiceKey;
             if (!select.onchange) {
                 select.addEventListener('change', e => {
                     state.currentCharacter.generalChoices[key] = e.target.value;
                     recalculateSheet();
                 });
             }
        });
    }
}


function handleChoiceUI(race) {
    const container = document.getElementById('race-choice-container');
    container.innerHTML = '';
    document.getElementById('race-choice-section').classList.add('hidden');
    if (!race) return;

    const restrictions = race.attributeRestrictions?.split(',').map(r => r.trim().toUpperCase()) || [];
    const attributeOptions = ALL_ATTRIBUTES.filter(attr => !restrictions.includes(attr));
    renderChoiceSelectors({
        sectionId: 'race-choice-section',
        containerId: 'race-choice-container',
        choiceCount: race.attributeChoices || 0,
        availableOptions: attributeOptions,
        storageObject: state.currentCharacter.chosenAttributes,
        labelPrefix: 'Atributo',
        onchangeCallback: recalculateSheet
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
                    const choiceIndex = e.target.dataset.choiceIndex;
                    state.currentCharacter.chosenClassFixedSkills[choiceIndex] = e.target.value;
                    recalculateSheet();
                });
                
                choiceWrapper.appendChild(select);
                mainContainer.appendChild(choiceWrapper);
            }
        });
    }

    const additionalCount = charClass.numPericiasAdicionais || 0;
    const additionalOptions = charClass.periciasAdicionais?.split(',').map(s => s.trim()) || [];
    if (additionalCount > 0 && additionalOptions.length > 0) {
         if (mainContainer.innerHTML.trim() !== '') {
            const separator = document.createElement('hr');
            separator.className = 'my-4 border-gray-600';
            mainContainer.appendChild(separator);
        }

        const additionalWrapper = document.createElement('div');
        additionalWrapper.innerHTML = `<h4 class="text-md font-semibold text-red-300 mb-2">Escolha de Perícias Adicionais</h4>`;
        const additionalContainer = document.createElement('div');
        additionalContainer.id = 'class-additional-skill-container'; // give it a unique ID
        additionalContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        additionalWrapper.appendChild(additionalContainer);
        mainContainer.appendChild(additionalWrapper);

        renderChoiceSelectors({
            sectionId: 'class-choice-section',
            containerId: 'class-additional-skill-container',
            choiceCount: additionalCount,
            availableOptions: additionalOptions,
            storageObject: state.currentCharacter.chosenClassSkills,
            labelPrefix: 'Perícia',
            onchangeCallback: recalculateSheet
        });
        hasContent = true;
    }

    renderGenericChoicesForType('class', charClass);
    if (charClass.choices) hasContent = true;

    if (hasContent) {
        section.classList.remove('hidden');
    }
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
        sectionId: 'origin-choice-section',
        containerId: 'origin-choice-container',
        choiceCount: count,
        availableOptions: availableOptions,
        storageObject: state.currentCharacter.chosenOriginBenefits,
        labelPrefix: 'Benefício',
        onchangeCallback: recalculateSheet
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
        sectionId: 'divinity-choice-section',
        containerId: 'divinity-choice-container',
        choiceCount: count,
        availableOptions: availableOptions,
        storageObject: state.currentCharacter.chosenDivinityPowers,
        labelPrefix: 'Poder Concedido',
        onchangeCallback: recalculateSheet
    });
    renderGenericChoicesForType('divinity', divinity);
}

function recalculateSheet(resetCurrentHPPM = false, updateChoicesUI = false) {
    if (!state.userId) return;
    const { race, level, classChoices, divinity, origin, chosenAttributes, chosenOriginBenefits, chosenClassSkills, generalChoices } = state.currentCharacter;
    
    const attributes = { ...state.currentCharacter.baseAttributes };
    const attributeSources = ALL_ATTRIBUTES.reduce((acc, key) => ({ ...acc, [key]: [{source: 'Base', value: attributes[key]}]}), {});

    const globalModifiers = FIXED_MODIFIERS.reduce((acc, mod) => ({ ...acc, [mod.key]: 0 }), {});
    const modifierSources = FIXED_MODIFIERS.reduce((acc, mod) => ({ ...acc, [mod.key]: [] }), {});

    // Raça
    if (race?.bonuses) {
        race.bonuses.split(',').forEach(b => { 
            const [key, valStr] = b.split(':').map(s => s.trim()); 
            const val = parseInt(valStr);
            const upperKey = key.toUpperCase();
            if (attributes[upperKey] !== undefined) {
                attributes[upperKey] += val; 
                attributeSources[upperKey].push({source: 'Raça (Fixo)', value: val});
            }
        });
    }
    if (race?.attributeBonus > 0 && chosenAttributes) {
        Object.values(chosenAttributes).forEach(attrName => { 
            if (attrName && attributes[attrName] !== undefined) {
                attributes[attrName] += race.attributeBonus;
                attributeSources[attrName].push({source: 'Raça (Escolha)', value: race.attributeBonus});
            }
        });
    }
    if (race?.effects) {
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

    let totalPV = 0, totalPM = 0;
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
    
    const originBenefitPowers = new Set();
    const originBenefitSkills = new Set();
    if (origin?.power) {
        originBenefitPowers.add(origin.power.trim());
    }
    Object.values(chosenOriginBenefits).forEach(benefitValue => {
        if (benefitValue) {
            const [type, value] = benefitValue.split(':');
            if (type === 'skill') {
                originBenefitSkills.add(value);
            } else if (type === 'power') {
                originBenefitPowers.add(value);
            }
        }
    });

    const allPowers = new Set(originBenefitPowers);
    Object.values(state.currentCharacter.chosenDivinityPowers).forEach(powerName => {
        if (powerName) allPowers.add(powerName);
    });
    
    allPowers.forEach(powerName => {
        const power = state.powers.find(p => p.name === powerName);
        if (power?.effects) {
            power.effects.split(',').forEach(eff => {
                const [key, val] = eff.split(':').map(s => s.trim());
                const upperKey = key.toUpperCase(), parsedVal = parseInt(val);
                const modKey = `bonus_pericia_${key}`;
                if (attributes[upperKey] !== undefined) {
                    attributes[upperKey] += parsedVal;
                    attributeSources[upperKey].push({source: `${power.name}`, value: parsedVal});
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
    
    const level1Class = state.classes.find(c => c.id === classChoices[1]);
    globalModifiers.per_apren += (level1Class?.numPericiasAdicionais || 0) + (attributes.INT > 0 ? attributes.INT : 0);
    
    if (level1Class) {
        totalPV += level1Class.pvInicial + attributes.CON;
        totalPM += level1Class.pmPerLevel;
        for (let i = 2; i <= level; i++) {
            const levelIClassId = classChoices[i] || classChoices[1];
            const levelIClass = state.classes.find(c => c.id === levelIClassId);
            if (levelIClass) {
                totalPV += levelIClass.pvPerLevel + attributes.CON;
                totalPM += levelIClass.pmPerLevel;
            }
        }
    }

    totalPV += globalModifiers.PV_adc + (level * globalModifiers.PV_adc_nivel) + (Math.ceil(level/2) * globalModifiers.PV_adc_impar);
    ALL_ATTRIBUTES.forEach(attr => {
        if(globalModifiers[`soma_${attr.toLowerCase()}_pv_total`]){
            totalPV += (attributes[attr] || 0);
        }
    });
    totalPM += globalModifiers.PM_adc + (level * globalModifiers.PM_adc_nivel) + (Math.ceil(level/2) * globalModifiers.PM_adc_impar);
    ALL_ATTRIBUTES.forEach(attr => {
        if(globalModifiers[`soma_${attr.toLowerCase()}_pm_total`]){
            totalPM += (attributes[attr] || 0);
        }
    });


    if (resetCurrentHPPM) {
        state.currentCharacter.currentHP = totalPV;
        state.currentCharacter.currentPM = totalPM;
    }

    // Renderização das Seções de Escolha (Apenas quando necessário)
    if (updateChoicesUI) {
        handleChoiceUI(race);
        handleClassSkillChoiceUI(state.currentCharacter.class);
        handleOriginChoiceUI(origin);
        handleDivinityPowerChoiceUI(divinity, globalModifiers);
    }

    // Renderização da Ficha
    renderSummarySection(race, origin, classLevels);
    renderDivinitySection(divinity);
    renderAttributesSection(attributes, attributeSources);
    renderResourcesSection(totalPV, totalPM);
    renderDefenseSection(attributes, globalModifiers);
    renderMagicSection(level, attributes, globalModifiers);
    renderLearnedSpells();
    renderSkillsSection(attributes, globalModifiers, originBenefitSkills);
    renderAbilitiesAndItemsSection(race, allPowers, level1Class, level, origin);
    renderGlobalModifiersSection(globalModifiers, modifierSources);
}

function renderSummarySection(race, origin, classLevels) {
    document.getElementById('summary-display').innerHTML = `
        <div><span class="text-sm font-medium text-gray-400">Personagem:</span> <span class="font-semibold">${document.getElementById('char-name').value || '...'}</span></div>
        <div><span class="text-sm font-medium text-gray-400">Jogador:</span> <span class="font-semibold">${document.getElementById('player-name').value || '...'}</span></div>
        <div><span class="text-sm font-medium text-gray-400">Raça:</span> <span class="font-semibold">${race?.name || '...'}</span></div>
        <div><span class="text-sm font-medium text-gray-400">Origem:</span> <span class="font-semibold">${origin?.name || '...'}</span></div>
    `;
    document.getElementById('class-summary-display').textContent = Object.entries(classLevels).map(([classId, lvl]) => `${state.classes.find(c => c.id === classId)?.name || ''} ${lvl}`).join(' / ');
}

function renderDivinitySection(divinity) {
    const divinitySection = document.getElementById('divinity-details-section');
    const divinityContainer = document.getElementById('divinity-details-container');
    if (divinity) {
        divinityContainer.innerHTML = `
                                        <div><strong class="text-gray-400">Arma Preferida:</strong> ${divinity.armaPreferida || 'Nenhuma'}</div>
                                        <div><strong class="text-gray-400">Canaliza Energia:</strong> ${divinity.canalizarEnergia || 'Qualquer'}</div>
                                        <div class="mt-2"><strong class="text-gray-400">Obrigações & Restrições:</strong><p class="text-gray-300 whitespace-pre-wrap">${divinity.obrigaçõesRestricoes || 'Nenhuma'}</p></div>
        `;
        divinitySection.classList.remove('hidden');
    } else {
        divinitySection.classList.add('hidden');
    }
}

function renderAttributesSection(attributes, attributeSources) {
     document.getElementById('attributes-display').innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            ${Object.entries(attributes).map(([key, val]) => {
                const totalValue = val || 0;
                const displayValue = totalValue >= 0 ? `+${totalValue}` : totalValue;
                const sourcesDetail = attributeSources[key].map(s => `<div class="flex justify-between"><span>${s.source}</span><span>${s.value >= 0 ? '+' : ''}${s.value}</span></div>`).join('');
                return `
                     <div class="text-center glass-effect p-3 cursor-pointer attribute-card" data-attr="${key}">
                         <div class="text-sm font-bold text-red-400">${key}</div>
                         <div class="text-4xl font-light my-2">${displayValue}</div>
                         <div id="attr-details-${key}" class="details-section">
                             <div class="glass-effect p-2 text-left text-xs space-y-1 mt-2">
                                 <div class="font-bold text-base text-center mb-2">Atributo: ${totalValue}</div>
                                 ${sourcesDetail}
                             </div>
                         </div>
                     </div>
                `
            }).join('')}
        </div>
    `;
}

function renderResourcesSection(totalPV, totalPM) {
    document.getElementById('resources-display').innerHTML = `
        <div>
            <div class="flex justify-between items-baseline text-sm mb-1">
                <span class="font-semibold text-red-400">Pontos de Vida (PV)</span>
                <span class="flex items-center">
                    vida atual <input type="number" id="current-hp" value="${state.currentCharacter.currentHP}" class="w-12 text-center bg-transparent border-b border-gray-600 focus:outline-none mx-1"> 
                    / <span id="max-hp" class="ml-1">${totalPV}</span><span class="ml-1">vida máxima</span>
                </span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2.5"><div id="hp-bar" class="bg-red-600 h-2.5 rounded-full" style="width: ${Math.max(0, Math.min(100, (state.currentCharacter.currentHP / (totalPV || 1)) * 100))}%"></div></div>
        </div>
        <div>
             <div class="flex justify-between items-baseline text-sm mb-1">
                 <span class="font-semibold text-blue-400">Pontos de Mana (PM)</span>
                 <span class="flex items-center">
                     mana atual <input type="number" id="current-pm" value="${state.currentCharacter.currentPM}" class="w-12 text-center bg-transparent border-b border-gray-600 focus:outline-none mx-1"> 
                     / <span id="max-pm" class="ml-1">${totalPM}</span><span class="ml-1">mana máxima</span>
                 </span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2.5"><div id="pm-bar" class="bg-blue-600 h-2.5 rounded-full" style="width: ${Math.max(0, Math.min(100, (state.currentCharacter.currentPM / (totalPM || 1)) * 100))}%"></div></div>
        </div>
    `;
}

function renderAbilitiesAndItemsSection(race, allPowers, level1Class, level, origin){
    let abilitiesHtml = '';
    const addAbility = (source, ability) => { if(ability?.trim()) abilitiesHtml += `<div class="py-1"><strong class="text-red-400">${source}:</strong> ${ability.trim()}</div>`; };
    if (race?.abilities) race.abilities.split(',').forEach(ab => addAbility('Raça', ab));
    if (race?.ataquesNaturais) race.ataquesNaturais.split('\n').forEach(ab => addAbility('Ataque Natural', ab));
    allPowers.forEach(powerName => addAbility('Poder', powerName));
    if (level1Class?.levelAbilities) level1Class.levelAbilities.split(',').forEach(entry => { const [lvlStr, ability] = entry.split(':'); if (level >= parseInt(lvlStr)) addAbility(`Classe Nv ${lvlStr}`, ability); });
    document.getElementById('abilities-display').innerHTML = abilitiesHtml || '<p class="text-gray-400">Nenhuma habilidade selecionada.</p>';
    
    document.getElementById('items-display').innerHTML = origin?.items || '<p class="text-gray-400">Nenhum item de origem.</p>';
}

function renderGlobalModifiersSection(globalModifiers, modifierSources) {
    const searchTerm = document.getElementById('modifier-search-input')?.value.toLowerCase() || '';
    const modifiersByCat = {};
    
    const filteredModifiers = FIXED_MODIFIERS.filter(mod => {
        if (!searchTerm) return true;
        return mod.name.toLowerCase().includes(searchTerm) || mod.key.toLowerCase().includes(searchTerm);
    });

    filteredModifiers.forEach(mod => {
        if (!modifiersByCat[mod.category]) modifiersByCat[mod.category] = [];
        modifiersByCat[mod.category].push(mod);
    });

    let modifiersHtml = '';
    const categories = ['Combate', 'Defesa e Resistências', 'Recursos', 'Perícias', 'Proficiências', 'Movimento', 'Vulnerabilidades e Imunidades', 'Outros'];
    
    categories.forEach(category => {
        if (!modifiersByCat[category]) return;

        const highlight = (text) => {
            if (!searchTerm) return text;
            const regex = new RegExp(searchTerm, 'gi');
            return text.replace(regex, match => `<span class="bg-yellow-500 text-black rounded">${match}</span>`);
        };

        let categoryModsHtml = modifiersByCat[category].map(mod => {
            if (mod.category === 'Perícias') return '';
            if (mod.key === 'poderes_divindade') return '';

            const totalValue = globalModifiers[mod.key] || 0;
            
            let displayName = state.showTechnicalModifierNames 
                ? `<code class="text-xs text-yellow-400">${highlight(mod.key)}</code>` 
                : highlight(mod.name);

            const sources = modifierSources[mod.key] || [];
            const sourcesHtml = sources.length > 0 ? 
                `<button class="details-toggle-btn text-blue-400" data-target="mod-details-${mod.key}">ⓘ</button>` : '<span></span>';
            const sourcesDetailHtml = sources.length > 0 ? 
                `<div id="mod-details-${mod.key}" class="details-section col-span-2">
                     <div class="glass-effect p-2 text-xs mt-1 space-y-1">
                         ${sources.map(s => `<div>${s}</div>`).join('')}
                     </div>
                 </div>` : '';
            
            let displayHtml;
            if (mod.isBool) {
                const isChecked = totalValue > 0;
                displayHtml = `
                    <div class="flex justify-center">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} disabled class="form-checkbox bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500 h-5 w-5 cursor-not-allowed">
                    </div>
                `;
            } else {
                const displayValue = totalValue >= 0 ? `+${totalValue}`: totalValue;
                const colorClass = totalValue > 0 ? 'text-green-400' : (totalValue < 0 ? 'text-red-400' : '');
                displayHtml = `<span class="font-semibold text-lg ${colorClass}">${displayValue}</span>`;
            }

            return `<div class="col-span-1">
                        <div class="grid grid-cols-[1fr,auto,auto] items-center gap-4 text-sm">
                            <span class="text-gray-400">${displayName}</span>
                            ${displayHtml}
                            ${sourcesHtml}
                        </div>
                         ${sourcesDetailHtml}
                    </div>`;
        }).join('');

        if(categoryModsHtml.trim() !== ''){
             modifiersHtml += `
                 <details class="glass-effect mb-4" ${searchTerm ? 'open' : ''}>
                     <summary class="text-lg font-semibold text-red-400">${category}</summary>
                     <div class="p-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                         ${categoryModsHtml}
                     </div>
                 </details>
                    `;
        }
    });
    document.getElementById('global-modifiers-display').innerHTML = modifiersHtml || '<p class="text-center text-gray-400">Nenhum modificador encontrado.</p>';
}

function updateResourceBars() {
    const maxHP = parseInt(document.getElementById('max-hp')?.textContent) || 1;
    const maxPM = parseInt(document.getElementById('max-pm')?.textContent) || 1;
    const hpPercent = Math.max(0, Math.min(100, (state.currentCharacter.currentHP / maxHP) * 100));
    const pmPercent = Math.max(0, Math.min(100, (state.currentCharacter.currentPM / maxPM) * 100));
    if(document.getElementById('hp-bar')) document.getElementById('hp-bar').style.width = `${hpPercent}%`;
    if(document.getElementById('pm-bar')) document.getElementById('pm-bar').style.width = `${pmPercent}%`;
}

function renderSkillsSection(attributes, globalModifiers, originBenefitSkills = new Set()) {
    const { chosenClassSkills, level } = state.currentCharacter;
    const container = document.getElementById('skills-list');
    const charClass = state.currentCharacter.class;
    
    let classFixedSkills = new Set();
    if (charClass?.periciasDeClasse) {
        charClass.periciasDeClasse.split(',').forEach(part => {
            if (!part.includes(' ou ')) {
                classFixedSkills.add(part.trim());
            }
        });
    }
    // Add chosen mandatory skills
    Object.values(state.currentCharacter.chosenClassFixedSkills).forEach(skill => {
        if(skill) classFixedSkills.add(skill);
    });
    
    const classChoiceSkills = Object.values(chosenClassSkills).filter(s => s);
    const autoTrainedSkills = new Set([...classFixedSkills, ...classChoiceSkills, ...originBenefitSkills]);

    const trainableCount = (globalModifiers.per_apren || 0);
    let manuallyTrainedSkills = state.currentCharacter.trainedSkills.filter(s => !autoTrainedSkills.has(s));
    const trainedCount = manuallyTrainedSkills.length;
    
    document.getElementById('skills-counter').innerHTML = `perícias treinadas atual <span class="font-bold text-lg">${trainedCount}</span> / <span class="font-bold text-lg">${trainableCount}</span> perícias livres`;
    
    container.innerHTML = Object.keys(SKILL_DEFAULT_ATTR).map(skill => {
        const isAutoTrained = autoTrainedSkills.has(skill);
        const isManuallyTrained = manuallyTrainedSkills.includes(skill);
        const isTrained = isAutoTrained || isManuallyTrained;

        const isDisabled = isAutoTrained || (!isManuallyTrained && trainedCount >= trainableCount);
        
        const trainingBonus = isTrained ? (level < 7 ? 2 : (level < 15 ? 4 : 6)) : 0;
        const halfLevelBonus = Math.floor(level / 2);
        const otherBonus = globalModifiers[`bonus_pericia_${skill}`] || 0;
        const chosenAttr = state.currentCharacter.skillAttributes[skill] || SKILL_DEFAULT_ATTR[skill];
        const attrBonus = attributes[chosenAttr] || 0;
        const totalBonus = halfLevelBonus + trainingBonus + otherBonus + attrBonus;
        
        return `<div class="grid grid-cols-12 gap-2 items-center text-sm border-b border-gray-800 py-2">
            <div class="col-span-1 flex justify-center">
                <input type="checkbox" class="form-checkbox bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500" data-skill-name="${skill}" ${isTrained ? 'checked' : ''} ${isAutoTrained ? 'disabled' : ''}>
            </div>
            <span class="col-span-3 ${isDisabled && !isTrained ? 'text-gray-500' : ''}">${skill}</span>
            <span class="col-span-1 font-semibold text-center text-lg">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
            <span class="col-span-2 text-center">
                <select data-skill-name="${skill}" class="skill-attr-select form-select py-0.5 text-xs text-center bg-gray-800 border-gray-700">
                    ${ALL_ATTRIBUTES.map(attr => `<option value="${attr}" ${attr === chosenAttr ? 'selected' : ''}>${attr}</option>`).join('')}
                </select>
            </span>
            <span class="col-span-1 text-center">${attrBonus >= 0 ? '+' : ''}${attrBonus}</span>
            <span class="col-span-2 text-center">${trainingBonus}</span>
            <span class="col-span-2 text-center">${halfLevelBonus + otherBonus}</span>
        </div>`;
    }).join('');
    
    container.querySelectorAll('input[type="checkbox"]').forEach(box => {
        box.addEventListener('change', (e) => {
            if (e.target.disabled) return;
            const skillName = e.target.dataset.skillName;
            if (e.target.checked) {
                if(manuallyTrainedSkills.length < trainableCount) {
                    state.currentCharacter.trainedSkills.push(skillName);
                } else {
                    e.target.checked = false; // Prevent checking if limit is reached
                }
            } else {
                 state.currentCharacter.trainedSkills = state.currentCharacter.trainedSkills.filter(s => s !== skillName);
            }
            recalculateSheet();
        });
    });

    container.querySelectorAll('.skill-attr-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const skillName = e.target.dataset.skillName;
            state.currentCharacter.skillAttributes[skillName] = e.target.value;
            recalculateSheet();
        });
    });
}

function setupPointBuyCalculator() {
    const container = document.getElementById('point-buy-calculator');
    const totalPointsInput = document.getElementById('point-buy-total');
    const remainingPointsSpan = document.getElementById('point-buy-remaining');

    const updatePointBuy = () => {
        let totalCost = 0;
        Object.values(state.currentCharacter.baseAttributes).forEach(val => {
            totalCost += POINT_BUY_COST[val] || 0;
        });
        const remaining = state.currentCharacter.pointBuyTotal - totalCost;
        remainingPointsSpan.textContent = remaining;
        remainingPointsSpan.classList.toggle('text-red-500', remaining < 0);

        ALL_ATTRIBUTES.forEach(attr => {
            const value = state.currentCharacter.baseAttributes[attr];
            document.getElementById(`point-buy-value-${attr}`).textContent = value;
            document.getElementById(`point-buy-cost-${attr}`).textContent = `${POINT_BUY_COST[value] || 0} pts`;
        });
        recalculateSheet();
    };

    container.innerHTML = ALL_ATTRIBUTES.map(attr => `
        <div class="grid grid-cols-4 items-center gap-4">
            <span class="font-semibold text-gray-300">${attr}</span>
            <div class="flex items-center justify-center gap-2">
                <button data-attr="${attr}" data-amount="-1" class="point-buy-btn bg-gray-700 hover:bg-gray-600 h-8 w-8 rounded-full">-</button>
                <span id="point-buy-value-${attr}" class="font-bold text-xl w-8 text-center">0</span>
                <button data-attr="${attr}" data-amount="1" class="point-buy-btn bg-gray-700 hover:bg-gray-600 h-8 w-8 rounded-full">+</button>
            </div>
            <span id="point-buy-cost-${attr}" class="text-sm text-gray-400">0 pts</span>
        </div>
    `).join('');

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('point-buy-btn')) {
            const attr = e.target.dataset.attr;
            const amount = parseInt(e.target.dataset.amount);
            let currentValue = state.currentCharacter.baseAttributes[attr];
            let newValue = currentValue + amount;
            
            if (newValue < -1) newValue = -1;
            if (newValue > 4) newValue = 4;
            
            let futureCost = 0;
            Object.entries(state.currentCharacter.baseAttributes).forEach(([a, v]) => {
                futureCost += POINT_BUY_COST[a === attr ? newValue : v] || 0;
            });

            // Allow spending if remaining points are >= 0, or if reducing cost
            if (amount > 0 && futureCost > state.currentCharacter.pointBuyTotal) return;

            state.currentCharacter.baseAttributes[attr] = newValue;
            updatePointBuy();
        }
    });

    totalPointsInput.addEventListener('input', (e) => {
        state.currentCharacter.pointBuyTotal = parseInt(e.target.value) || 0;
        updatePointBuy();
    });

    updatePointBuy();
}

function renderDefenseSection(attributes, globalModifiers) {
    const { equippedArmor, equippedShield, defenseAttribute } = state.currentCharacter;
    const armorItem = state.armors.find(a => a.id === equippedArmor);
    const shieldItem = state.armors.find(s => s.id === equippedShield);

    let defAttrMod = 0;
    if (defenseAttribute !== 'Nenhum') {
        defAttrMod = attributes[defenseAttribute] || 0;
    }

    const armorBonus = armorItem?.bonus_defesa || 0;
    const shieldBonus = shieldItem?.bonus_defesa || 0;
    const outrosBonus = globalModifiers.bonus_armadura || 0;
    let totalDefesa = 10 + defAttrMod + armorBonus + shieldBonus + outrosBonus;
    
    ALL_ATTRIBUTES.forEach(attr => {
        if(globalModifiers[`soma_${attr.toLowerCase()}_na_defesa`]){
            totalDefesa += (attributes[attr] || 0);
        }
    });

    const armorPenalty = armorItem?.penalidade_armadura || 0;
    const shieldPenalty = shieldItem?.penalidade_armadura || 0;
    const outrosPenalty = globalModifiers.penalidade_armadura_outros || 0;
    const totalPenalidade = armorPenalty + shieldPenalty + outrosPenalty;

    document.getElementById('defense-display').innerHTML = `
        <div class="flex items-center justify-between">
            <h4 class="text-lg font-semibold">Defesa Total</h4>
            <div class="flex items-center gap-2">
                <span class="text-3xl font-light">${totalDefesa}</span>
                <button class="details-toggle-btn text-blue-400" data-target="defesa-details">ⓘ</button>
            </div>
        </div>
        <div id="defesa-details" class="details-section">
            <div class="glass-effect p-2 text-xs text-gray-400 space-y-1">
                <div class="flex justify-between"><span>Base:</span><span>10</span></div>
                <div class="flex justify-between"><span>Atributo (${defenseAttribute}):</span><span>${defAttrMod}</span></div>
                <div class="flex justify-between"><span>Armadura:</span><span>${armorBonus}</span></div>
                <div class="flex justify-between"><span>Escudo:</span><span>${shieldBonus}</span></div>
                <div class="flex justify-between"><span>Outros:</span><span>${outrosBonus}</span></div>
            </div>
        </div>
        <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
                <label for="defense-attribute-select">Atributo</label>
                <select id="defense-attribute-select" class="form-select text-xs py-1 w-full mt-1">
                     ${ALL_ATTRIBUTES.map(attr => `<option value="${attr}" ${defenseAttribute === attr ? 'selected' : ''}>${attr}</option>`).join('')}
                     <option value="Nenhum" ${defenseAttribute === 'Nenhum' ? 'selected' : ''}>Nenhum</option>
                </select>
            </div>
        </div>
         <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
                <label for="select-armor">Armadura</label>
                <select id="select-armor" class="form-select text-xs py-1 w-full mt-1"></select>
            </div>
            <div>
                <label for="select-shield">Escudo</label>
                <select id="select-shield" class="form-select text-xs py-1 w-full mt-1"></select>
            </div>
        </div>
        <div class="mt-4 flex items-center justify-between border-t border-gray-700 pt-2">
            <h4 class="text-lg font-semibold">Penalidade de Armadura</h4>
            <div class="flex items-center gap-2">
                <span class="text-3xl font-light text-amber-400">${totalPenalidade}</span>
                <button class="details-toggle-btn text-blue-400" data-target="penalidade-details">ⓘ</button>
            </div>
        </div>
         <div id="penalidade-details" class="details-section">
            <div class="glass-effect p-2 text-xs text-gray-400 space-y-1">
                <div class="flex justify-between"><span>Armadura:</span><span>${armorPenalty}</span></div>
                <div class="flex justify-between"><span>Escudo:</span><span>${shieldPenalty}</span></div>
                <div class="flex justify-between"><span>Outros:</span><span>${outrosPenalty}</span></div>
            </div>
        </div>
    `;
    populateEquipmentSelects();
    if(equippedArmor) document.getElementById('select-armor').value = equippedArmor;
    if(equippedShield) document.getElementById('select-shield').value = equippedShield;
}

function renderMagicSection(level, attributes, globalModifiers) {
    const { spellAttribute } = state.currentCharacter;
    const spellAttrMod = attributes[spellAttribute] || 0;
    const spellCD = 10 + Math.floor(level / 2) + spellAttrMod + (globalModifiers.bonus_cd || 0);

    document.getElementById('spell-cd-display').innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <h4 class="text-lg font-semibold">CD de Magia</h4>
                 <select id="spell-attribute-select" class="form-select text-xs py-1">
                     ${ALL_ATTRIBUTES.map(attr => `<option value="${attr}" ${spellAttribute === attr ? 'selected' : ''}>${attr}</option>`).join('')}
                 </select>
            </div>
            <div class="flex items-center gap-2">
                 <span class="text-3xl font-light">${spellCD}</span>
                <button class="details-toggle-btn text-blue-400" data-target="spell-cd-details">ⓘ</button>
            </div>
        </div>
        <div id="spell-cd-details" class="details-section">
            <div class="glass-effect p-2 text-xs text-gray-400 space-y-1">
                <div class="flex justify-between"><span>Base:</span><span>10</span></div>
                <div class="flex justify-between"><span>Metade do Nível:</span><span>${Math.floor(level / 2)}</span></div>
                <div class="flex justify-between"><span>Atributo (${spellAttribute}):</span><span>${spellAttrMod}</span></div>
                <div class="flex justify-between"><span>Outros:</span><span>${globalModifiers.bonus_cd || 0}</span></div>
            </div>
        </div>
        <div class="mt-4 border-t border-gray-700 pt-4">
            <button id="learn-spell-btn" class="btn-primary w-full py-2 rounded-md text-sm">Aprender Magia</button>
        </div>
    `;
}

function renderLearnedSpells() {
    const container = document.getElementById('learned-spells-display');
    const learnedSpellsIds = state.currentCharacter.learnedSpells;

    if (!learnedSpellsIds || learnedSpellsIds.length === 0) {
        container.innerHTML = '<p class="text-gray-400">Nenhuma magia aprendida.</p>';
        return;
    }

    const learnedSpells = learnedSpellsIds.map(id => state.spells.find(s => s.id === id)).filter(s => s);
    
    let html = '';
    learnedSpells.sort((a, b) => a.circulo - b.circulo || a.name.localeCompare(b.name)).forEach(spell => {
        html += `
            <details class="glass-effect">
                <summary class="p-3 cursor-pointer text-sm font-semibold flex justify-between">
                    <span>${spell.name}</span>
                    <span class="text-xs text-gray-400">${spell.circulo}º Círculo - ${spell.escola}</span>
                </summary>
                <div class="p-3 border-t border-gray-700 text-xs text-gray-300 space-y-2">
                    <p><strong>Execução:</strong> ${spell.execucao || 'N/A'}</p>
                    <p><strong>Alcance:</strong> ${spell.alcance || 'N/A'}</p>
                    <p><strong>Duração:</strong> ${spell.duracao || 'N/A'}</p>
                    <p><strong>Resistência:</strong> ${spell.resistencia || 'N/A'}</p>
                    <div class="mt-2 pt-2 border-t border-gray-600">${spell.description || ''}</div>
                    ${spell.aprimoramentos ? `<div class="mt-2 pt-2 border-t border-gray-600"><strong>Aprimoramentos:</strong><br>${spell.aprimoramentos.replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            </details>
        `;
    });
    container.innerHTML = html;
}

function openLearnSpellModal() {
    openModal('Aprender Magia', getLearnSpellModalHtml(), { isAction: true });
    
    document.getElementById('modal-body').addEventListener('click', e => {
        if (e.target.classList.contains('learn-spell-action-btn')) {
            const spellId = e.target.dataset.id;
            if (!state.currentCharacter.learnedSpells.includes(spellId)) {
                state.currentCharacter.learnedSpells.push(spellId);
                e.target.textContent = 'Aprendida';
                e.target.disabled = true;
                e.target.classList.remove('btn-primary');
                e.target.classList.add('btn-secondary', 'opacity-50', 'cursor-not-allowed');
                recalculateSheet();
            }
        }
    });
}

function getLearnSpellModalHtml() {
    let html = '<div class="space-y-4">';
    const spellsByCircle = {};
    state.spells.forEach(spell => {
        if (!spellsByCircle[spell.circulo]) spellsByCircle[spell.circulo] = [];
        spellsByCircle[spell.circulo].push(spell);
    });

    for (let i = 1; i <= 5; i++) {
        html += `<details class="glass-effect" ${i === 1 ? 'open' : ''}>
                         <summary class="p-3 cursor-pointer text-md font-semibold text-red-400">${i}º Círculo</summary>
                         <div class="p-4 border-t border-gray-700 space-y-3">`;
        if (spellsByCircle[i] && spellsByCircle[i].length > 0) {
            spellsByCircle[i].forEach(spell => {
                const isLearned = state.currentCharacter.learnedSpells.includes(spell.id);
                html += `
                    <div class="glass-effect p-3 text-sm">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-semibold">${spell.name}</div>
                                <div class="text-xs text-gray-400">${spell.escola} - ${spell.execucao}</div>
                            </div>
                            <button data-id="${spell.id}" class="learn-spell-action-btn ${isLearned ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'} px-3 py-1 rounded-md text-xs" ${isLearned ? 'disabled' : ''}>
                                ${isLearned ? 'Aprendida' : 'Aprender'}
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
             html += '<p class="text-sm text-gray-500">Nenhuma magia deste círculo.</p>';
        }
        html += `</div></details>`;
    }

    html += '</div>';
    return html;
}


function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
