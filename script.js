// グローバル変数
let currentScenario = null;
let demoMode = false;
let keywords = [];
let scenarios = [];
let currentScenarioIndex = 0;
let operatorActionIndex = 0; // オペレーター動作のインデックス
let chatHistory = []; // チャット履歴（タイムライン紐づけ用）

// DOM要素の取得
const elements = {
    // タブ関連
    tabButtons: document.querySelectorAll('.tab-button'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // チャット関連
    messageArea: document.getElementById('messageArea'),
    chatInput: document.getElementById('chatInput'),
    sendButton: document.getElementById('sendButton'),
    voiceButton: document.getElementById('voiceButton'),
    faqButton: document.getElementById('faqButton'),
    
    // 通話ログ関連（transcript機能追加）
    transcriptToggle: document.getElementById('transcriptToggle'),
    transcriptContent: document.getElementById('transcriptContent'),
    logMessageArea: document.getElementById('logMessageArea'),
    summaryWindow: document.getElementById('summaryWindow'),
    summaryContent: document.getElementById('summaryContent'),
    demoModeToggle: document.getElementById('demoModeToggle'),
    
    // シナリオ選択関連
    scenarioSelector: document.getElementById('scenarioSelector'),
    scenarioButtons: document.querySelectorAll('.scenario-btn'),
    
    // アラート関連
    alertPanel: document.getElementById('alertPanel'),
    alertContent: document.getElementById('alertContent'),
    sharedInfoPanel: document.getElementById('sharedInfoPanel'),
    sharedInfoContent: document.getElementById('sharedInfoContent'),
    
    // モーダル関連
    faqModal: document.getElementById('faqModal'),
    closeFaqModal: document.getElementById('closeFaqModal'),
    
    // 再点申込関連
    slotButtons: document.querySelectorAll('.slot-btn'),
    restoreDate: document.getElementById('restoreDate'),
    
    // デモ関連
    demoToggle: document.getElementById('demoToggle'),
    statusIndicator: document.getElementById('statusIndicator'),
    
    // 顧客検索関連
    customerSearch: document.getElementById('customerSearch'),
    customerInfo: document.getElementById('customerInfo'),
    tabsContainer: document.getElementById('tabsContainer'),
    searchCustomerBtn: document.getElementById('searchCustomerBtn'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    newSearchBtn: document.getElementById('newSearchBtn'),
    searchName: document.getElementById('searchName'),
    searchPhone: document.getElementById('searchPhone'),
    searchAddress: document.getElementById('searchAddress')
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // キーワードとシナリオデータの読み込み
        await loadKeywords();
        await loadScenarios();
        
        // イベントリスナーの設定
        setupEventListeners();
        
        // 初期状態の設定
        setupInitialState();
        
        console.log('AIエージェントUI初期化完了');
    } catch (error) {
        console.error('初期化エラー:', error);
    }
}

// キーワードデータの読み込み
async function loadKeywords() {
    try {
        keywords = [
            { "scenario": "RESTORE_POWER", "trigger": "再開", "bot_prompt": "サービス再開のお申込みですね。契約番号をお願いします。" },
            { "scenario": "RESTORE_POWER", "trigger": "再点", "bot_prompt": "再点申込の手続きをご案内します。契約番号をお願いします。" },
            { "scenario": "RESTORE_POWER", "trigger": "利用再開", "bot_prompt": "サービス再開のお申込みですね。過去の契約履歴を確認いたします。" },
            { "scenario": "USAGE_CALCULATION", "trigger": "使用量", "bot_prompt": "使用量計算について詳しくご説明いたします。契約番号をお願いします。" },
            { "scenario": "USAGE_CALCULATION", "trigger": "料金計算", "bot_prompt": "料金計算の詳細をご案内します。契約番号をお願いします。" },
            { "scenario": "USAGE_CALCULATION", "trigger": "計算方法", "bot_prompt": "料金の計算方法についてご説明いたします。" },
            { "scenario": "BILLING_MANAGEMENT", "trigger": "請求書", "bot_prompt": "請求書の発行状況を確認いたします。契約番号をお願いします。" },
            { "scenario": "BILLING_MANAGEMENT", "trigger": "未収", "bot_prompt": "未収金についてのご相談ですね。債権管理状況を確認いたします。" },
            { "scenario": "BILLING_MANAGEMENT", "trigger": "支払い", "bot_prompt": "お支払いについてのご相談ですね。入金状況を確認いたします。" },
            { "scenario": "CONTRACT_CHANGE", "trigger": "契約変更", "bot_prompt": "契約変更の手続きをご案内します。変更内容をお聞かせください。" },
            { "scenario": "CONTRACT_CHANGE", "trigger": "プラン変更", "bot_prompt": "プラン変更のご相談ですね。現在の契約内容と変更希望を確認いたします。" },
            { "scenario": "CONTRACT_CHANGE", "trigger": "住所変更", "bot_prompt": "住所変更の手続きをご案内します。契約番号をお願いします。" },
            { "scenario": "CONTRACT_CHANGE", "trigger": "オプション追加", "bot_prompt": "オプション追加のご相談ですね。変更可否を審査いたします。" },
            { "scenario": "CONTRACT_TERMINATION", "trigger": "解約", "bot_prompt": "契約廃止のお申出ですね。解約条件を確認いたします。" },
            { "scenario": "CONTRACT_TERMINATION", "trigger": "契約廃止", "bot_prompt": "契約廃止の手続きをご案内します。解約理由をお聞かせください。" },
            { "scenario": "CONTRACT_TERMINATION", "trigger": "契約終了", "bot_prompt": "契約終了のお手続きですね。最終精算についてご案内いたします。" }
        ];
        console.log('キーワードデータ読み込み完了:', keywords.length, '件');
    } catch (error) {
        console.error('キーワード読み込みエラー:', error);
    }
}

// シナリオデータの読み込み
async function loadScenarios() {
    try {
        scenarios = [
            {
                "code": "RESTORE_POWER",
                "name": "再点申込",
                "icon": "⚡",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "もしもし、電気が止まってしまったんですが…" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "電力供給停止のご相談ですね。契約番号をお聞かせください。" },
                    { "timestamp": "14:00:15", "speaker": "顧客", "text": "契約番号は CUST-2025-0001 です。引っ越しの関係で…" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "新住所と利用開始日を確認させていただきます。" },
                    { "timestamp": "14:00:35", "speaker": "顧客", "text": "福岡県福岡市中央区天神2-2-2で、8月15日からお願いします。" },
                    { "timestamp": "14:00:45", "speaker": "オペレーター", "text": "承知いたしました。新規契約手続きを開始いたします。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:10", "summary": "顧客からの電力再点申込相談" },
                    { "time": "14:00:20", "summary": "契約番号 CUST-2025-0001 確認完了" },
                    { "time": "14:00:30", "summary": "新住所：福岡県福岡市中央区天神2-2-2" },
                    { "time": "14:00:40", "summary": "利用開始日：2025年8月15日設定" },
                    { "time": "14:00:50", "summary": "新規契約手続き開始" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "restore-power", "tabName": "再点申込", "delay": 3000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "newAddress", "description": "新住所確認", "duration": 2000, "delay": 1000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "startDate", "description": "利用開始日確認", "duration": 2000, "delay": 1000 },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmNewContract", "description": "新規契約実行", "delay": 2000 }
                ],
                "aiGuidance": [
                    {
                        "trigger": "tab_switch_restore-power",
                        "message": "再点申込の手続きを開始します。新住所と利用開始日を確認してください。",
                        "options": ["新住所を入力", "利用開始日を選択", "契約審査実行"]
                    },
                    {
                        "trigger": "click_confirmNewContract",
                        "message": "新規契約手続きが完了しました。顧客に開通予定日を案内してください。",
                        "options": ["開通通知送信", "契約書作成", "手続き完了報告"]
                    }
                ]
            },
            {
                "code": "USAGE_CALCULATION",
                "name": "使用量計算～料金計算",
                "icon": "🧮",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "今月の使用量計算について確認したいのですが" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "使用量計算についてご案内いたします。契約番号をお聞かせください。" },
                    { "timestamp": "14:00:15", "speaker": "顧客", "text": "CUST-2025-0001です。計算方法が知りたくて…" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "スマートメーターのデータを確認いたします。220kWhのご使用量ですね。" },
                    { "timestamp": "14:00:35", "speaker": "顧客", "text": "料金の内訳も詳しく教えてください。" },
                    { "timestamp": "14:00:45", "speaker": "オペレーター", "text": "基本料金と従量料金に分けてご説明いたします。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:10", "summary": "使用量計算・料金計算の問い合わせ" },
                    { "time": "14:00:20", "summary": "契約番号 CUST-2025-0001 確認、メーターデータ収集開始" },
                    { "time": "14:00:30", "summary": "使用量220kWh確認、プラン条件確認" },
                    { "time": "14:00:40", "summary": "料金内訳説明：基本¥2,400 + 従量¥5,580" },
                    { "time": "14:00:50", "summary": "請求データ生成完了" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "simulation", "tabName": "使用量計算～料金計算", "delay": 3000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "usageInput", "description": "使用量データ確認", "duration": 2000, "delay": 1000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "calculationProcess", "description": "料金計算過程表示", "duration": 3000, "delay": 1000 },
                    { "type": "CLICK_BUTTON", "buttonId": "calculateBill", "description": "請求データ生成", "delay": 2000 }
                ],
                "aiGuidance": [
                    {
                        "trigger": "tab_switch_simulation",
                        "message": "使用量計算システムにアクセスしました。メーターデータを確認してください。",
                        "options": ["使用量を確認", "プラン情報を表示", "計算を開始"]
                    },
                    {
                        "trigger": "click_calculateBill",
                        "message": "料金計算が完了しました。請求データが生成されています。",
                        "options": ["内訳を説明", "請求書発行", "顧客に通知"]
                    }
                ]
            },
            {
                "code": "BILLING_MANAGEMENT",
                "name": "請求・未収管理",
                "icon": "💰",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "請求書が届いていないのですが…" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "請求書の発行状況を確認いたします。契約番号をお聞かせください。" },
                    { "timestamp": "14:00:15", "speaker": "顧客", "text": "CUST-2025-0001です。未収があると聞いたのですが…" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "未収金額¥15,430が3ヶ月分ございます。分割払いも可能です。" },
                    { "timestamp": "14:00:35", "speaker": "顧客", "text": "分割でお願いします。3回払いでできますか？" },
                    { "timestamp": "14:00:45", "speaker": "オペレーター", "text": "3回分割で設定いたします。債権管理帳票を更新いたします。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:10", "summary": "請求書未着問い合わせ" },
                    { "time": "14:00:20", "summary": "契約番号確認、請求・未収状況調査" },
                    { "time": "14:00:30", "summary": "未収金額¥15,430（3ヶ月分）確認" },
                    { "time": "14:00:40", "summary": "分割払い（3回）設定" },
                    { "time": "14:00:50", "summary": "債権管理帳票更新完了" }
                ],
                "alerts": [
                    {
                        "type": "UNPAID_ALERT",
                        "message": "未収金3ヶ月分¥15,430の債権管理対象",
                        "severity": "MEDIUM",
                        "timestamp": "14:00:25"
                    }
                ],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "billing-history", "tabName": "請求履歴", "delay": 3000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "currentBill", "description": "請求書発行状況確認", "duration": 2000, "delay": 1000 },
                    { "type": "SWITCH_TAB", "tabId": "unpaid-management", "tabName": "未収管理", "delay": 2000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "unpaidAmount", "description": "未入金額確認", "duration": 2000, "delay": 1000 },
                    { "type": "SELECT_OPTION", "selector": "#paymentMethod", "value": "installment", "description": "分割払い設定", "delay": 1000 },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmPayment", "description": "債権管理帳票更新", "delay": 2000 }
                ],
                "aiGuidance": [
                    {
                        "trigger": "tab_switch_billing-history",
                        "message": "請求履歴を確認中です。未収金額があります。",
                        "options": ["未収管理画面へ", "支払い方法変更", "督促状況確認"]
                    },
                    {
                        "trigger": "click_confirmPayment",
                        "message": "分割払い設定が完了しました。債権管理帳票が更新されています。",
                        "options": ["支払計画通知", "督促停止設定", "顧客フォロー"]
                    }
                ]
            },
            {
                "code": "CONTRACT_CHANGE",
                "name": "契約変更",
                "icon": "🔄",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "プランを変更したいのですが…" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "契約変更のご相談ですね。現在のプランと変更希望をお聞かせください。" },
                    { "timestamp": "14:00:15", "speaker": "顧客", "text": "ナイト・セレクトからレギュラープランに変えたいです。アンペアも50Aに。" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "変更可否を確認いたします。料金差額とアンペア工事費が発生します。" },
                    { "timestamp": "14:00:35", "speaker": "顧客", "text": "金額はいくらぐらいになりますか？" },
                    { "timestamp": "14:00:45", "speaker": "オペレーター", "text": "月額¥1,420増、工事費¥3,300となります。変更手続きを進めますか？" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:10", "summary": "契約変更申込：プラン変更・アンペア変更" },
                    { "time": "14:00:20", "summary": "変更内容：ナイト・セレクト40A → レギュラー50A" },
                    { "time": "14:00:30", "summary": "変更可否審査：変更可能、料金差額・工事費確認" },
                    { "time": "14:00:40", "summary": "料金影響：+¥1,420/月、工事費¥3,300" },
                    { "time": "14:00:50", "summary": "契約変更手続き承認待ち" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "contract-service", "tabName": "契約・サービス", "delay": 3000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "planComparison", "description": "プラン比較確認", "duration": 3000, "delay": 1000 },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmPlanChange", "description": "契約変更実行", "delay": 2000 }
                ],
                "aiGuidance": [
                    {
                        "trigger": "tab_switch_contract-service",
                        "message": "契約変更システムにアクセスしました。変更内容を確認してください。",
                        "options": ["変更可否確認", "料金影響確認", "変更実行"]
                    },
                    {
                        "trigger": "click_confirmPlanChange",
                        "message": "契約変更が完了しました。変更通知を顧客に送信してください。",
                        "options": ["変更通知送信", "契約書更新", "手続き完了報告"]
                    }
                ]
            },
            {
                "code": "CONTRACT_TERMINATION",
                "name": "契約廃止",
                "icon": "🚪",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "引っ越しのため契約を廃止したいのですが…" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "契約廃止のお手続きですね。廃止理由と希望日をお聞かせください。" },
                    { "timestamp": "14:00:15", "speaker": "顧客", "text": "引っ越しで、7月31日で廃止したいです。" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "解約条件を確認いたします。違約金等はございません。" },
                    { "timestamp": "14:00:35", "speaker": "顧客", "text": "最終の精算はどうなりますか？" },
                    { "timestamp": "14:00:45", "speaker": "オペレーター", "text": "7月分の精算¥7,093となります。解約手続きを開始いたします。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:10", "summary": "契約廃止申込：引っ越しに伴う解約" },
                    { "time": "14:00:20", "summary": "廃止理由：引っ越し、希望廃止日：2025/07/31" },
                    { "time": "14:00:30", "summary": "解約条件確認：違約金なし、解約可能" },
                    { "time": "14:00:40", "summary": "最終精算額：¥7,093（7月分）" },
                    { "time": "14:00:50", "summary": "解約手続き開始、完了通知準備" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "contract-service", "tabName": "契約・サービス", "delay": 3000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "contractStatus", "description": "契約状況確認", "duration": 2000, "delay": 1000 },
                    { "type": "SWITCH_TAB", "tabId": "termination", "tabName": "契約廃止", "delay": 2000 },
                    { "type": "SELECT_OPTION", "selector": "#terminationReason", "value": "moving", "description": "廃止理由設定", "delay": 1000 },
                    { "type": "INPUT_DATA", "field": "terminationDate", "value": "2025-07-31", "description": "解約日設定", "delay": 1000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "finalBill", "description": "最終精算額確認", "duration": 2000, "delay": 1000 },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmTermination", "description": "解約手続き実行", "delay": 2000 }
                ],
                "aiGuidance": [
                    {
                        "trigger": "tab_switch_termination",
                        "message": "契約廃止システムにアクセスしました。解約条件を確認してください。",
                        "options": ["解約条件確認", "最終精算確認", "手続き実行"]
                    },
                    {
                        "trigger": "click_confirmTermination",
                        "message": "契約廃止手続きが完了しました。解約証明書を発行してください。",
                        "options": ["解約証明書発行", "完了通知送信", "手続き完了報告"]
                    }
                ]
            }
        ];
        console.log('シナリオデータ読み込み完了:', scenarios.length, '件');
    } catch (error) {
        console.error('シナリオ読み込みエラー:', error);
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // タブ切り替え
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            const tabContent = document.getElementById(tabId);
            
            if (tabContent) {
                // すべてのタブボタンからactiveクラスを削除
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // すべてのタブコンテンツからactiveクラスを削除
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 選択されたタブボタンとコンテンツにactiveクラスを追加
                button.classList.add('active');
                tabContent.classList.add('active');
            }
        });
    });
    
    // チャット送信
    elements.sendButton.addEventListener('click', sendChatMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // 音声入力
    elements.voiceButton.addEventListener('click', handleVoiceInput);
    
    // FAQ表示
    elements.faqButton.addEventListener('click', () => {
        elements.faqModal.style.display = 'flex';
    });
    
    elements.closeFaqModal.addEventListener('click', () => {
        elements.faqModal.style.display = 'none';
    });
    
    // モーダル外クリックで閉じる
    elements.faqModal.addEventListener('click', (e) => {
        if (e.target === elements.faqModal) {
            elements.faqModal.style.display = 'none';
        }
    });
    
    // デモモードトグル
    elements.demoModeToggle.addEventListener('change', toggleDemoMode);
    
    // シナリオボタン
    elements.scenarioButtons.forEach(button => {
        button.addEventListener('click', () => {
            const scenario = button.dataset.scenario;
            selectScenario(scenario);
        });
    });
    
    // 顧客検索関連
    elements.searchCustomerBtn.addEventListener('click', searchCustomer);
    elements.clearSearchBtn.addEventListener('click', clearSearch);
    elements.newSearchBtn.addEventListener('click', newSearch);
    
    // 検索フィールドでのEnterキー
    [elements.searchName, elements.searchPhone, elements.searchAddress].forEach(input => {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchCustomer();
                }
            });
        }
    });
    
    // 新しく追加：transcript機能のイベントリスナー
    if (elements.transcriptToggle) {
        elements.transcriptToggle.addEventListener('click', toggleTranscript);
    }
    
    // 各種ボタンのイベントリスナー
    setupFormEventListeners();
}

// transcript表示/非表示トグル（新しく追加された機能）
function toggleTranscript() {
    if (elements.transcriptContent) {
        const isVisible = elements.transcriptContent.style.display !== 'none';
        elements.transcriptContent.style.display = isVisible ? 'none' : 'block';
        elements.transcriptToggle.textContent = isVisible ? '▼' : '▲';
    }
}

// 初期状態の設定
function setupInitialState() {
    // 初期画面：顧客検索画面を表示
    showCustomerSearch();
    
    // デモモードをオフにする
    demoMode = false;
    elements.demoModeToggle.checked = false;
    if (elements.scenarioSelector) {
        elements.scenarioSelector.style.display = 'none';
    }
    
    // 初期のAIメッセージ表示
    setTimeout(() => {
        addBotMessage("こんにちは！九州電力のAIアシスタントです。何かお手伝いできることはありますか？");
    }, 1000);
}

// 顧客検索画面表示
function showCustomerSearch() {
    // 顧客検索画面を表示、情報画面を非表示
    elements.customerSearch.style.display = 'block';
    elements.customerInfo.style.display = 'none';
    elements.tabsContainer.style.display = 'none';
    
    // 検索フィールドをクリア
    elements.searchName.value = '';
    elements.searchPhone.value = '';
    elements.searchAddress.value = '';
}

// 顧客検索実行
function searchCustomer() {
    const name = elements.searchName.value.trim();
    const phone = elements.searchPhone.value.trim();
    const address = elements.searchAddress.value.trim();
    
    // 検索条件チェック
    if (!name && !phone && !address) {
        alert('検索条件を入力してください');
        return;
    }
    
    // 検索中の表示
    showSearchProgress();
    
    // 模擬検索処理（実際はAPIコール）
    setTimeout(() => {
        showCustomerInfo();
        hideSearchProgress();
        
        // 検索成功後、タブを表示し、billing-historyタブをアクティブにする（概要タブ削除対応）
        elements.tabsContainer.style.display = 'block';
        switchToTab('billing-history');
        
        // AIメッセージ
        addBotMessage("顧客情報を表示しました。ご用件についてお聞かせください。");
    }, 2000);
}

// 顧客情報表示
function showCustomerInfo() {
    // 顧客情報を表示
    elements.customerSearch.style.display = 'none';
    elements.customerInfo.style.display = 'block';
    
    // 検索結果で顧客情報を更新（実際のデータに置き換え）
    const customerData = {
        furigana: "ヤマダ タロウ",
        fullName: "山田 太郎",
        customerId: "CUST-2025-0001",
        phone: elements.searchPhone.value || "092-123-4567",
        email: "tanaka@example.com",
        address: elements.searchAddress.value || "福岡県福岡市博多区博多駅前1-1-1",
        supplyId: "09-1234-1234-1234-0000-0000",
        contractType: "電気",
        plan: "ナイト・セレクト",
        paymentMethod: "口座振替",
        contractPeriod: "4年10か月"
    };
    
    // 各フィールドに値を設定
    document.getElementById('customerFurigana').textContent = customerData.furigana;
    document.getElementById('customerFullName').textContent = customerData.fullName;
    document.getElementById('customerId').textContent = customerData.customerId;
    document.getElementById('customerPhoneDisplay').textContent = customerData.phone;
    document.getElementById('customerEmail').textContent = customerData.email;
    document.getElementById('customerAddressDisplay').textContent = customerData.address;
    document.getElementById('customerSupplyId').textContent = customerData.supplyId;
    document.getElementById('customerContractType').textContent = customerData.contractType;
    document.getElementById('customerPlan').textContent = customerData.plan;
    document.getElementById('customerPaymentMethod').textContent = customerData.paymentMethod;
    document.getElementById('customerContractPeriod').textContent = customerData.contractPeriod;
}

// 検索中プログレス表示
function showSearchProgress() {
    // 簡単なローディング表示
    elements.searchCustomerBtn.textContent = '検索中...';
    elements.searchCustomerBtn.disabled = true;
}

// 検索中プログレス非表示
function hideSearchProgress() {
    elements.searchCustomerBtn.textContent = '🔍 顧客検索';
    elements.searchCustomerBtn.disabled = false;
}

// 検索クリア
function clearSearch() {
    elements.searchName.value = '';
    elements.searchPhone.value = '';
    elements.searchAddress.value = '';
}

// 新規検索
function newSearch() {
    showCustomerSearch();
}

// タブ切り替え
function switchToTab(tabId) {
    // すべてのタブボタンからactiveクラスを削除
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // すべてのタブコンテンツからactiveクラスを削除
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 指定されたタブボタンとコンテンツにactiveクラスを追加
    const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
    const tabContent = document.getElementById(tabId);
    
    if (tabButton && tabContent) {
        tabButton.classList.add('active');
        tabContent.classList.add('active');
    }
}

// 各種フォームイベントリスナーの設定
function setupFormEventListeners() {
    // 再点申込関連
    const confirmNewContractBtn = document.getElementById('confirmNewContract');
    if (confirmNewContractBtn) {
        confirmNewContractBtn.addEventListener('click', () => {
            executeNewContractProcess();
        });
    }
    
    // 使用量計算関連
    const calculateBillBtn = document.getElementById('calculateBill');
    if (calculateBillBtn) {
        calculateBillBtn.addEventListener('click', () => {
            executeBillCalculation();
        });
    }
    
    // 未収管理関連
    const confirmPaymentBtn = document.getElementById('confirmPayment');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            executePaymentConfirmation();
        });
    }
    
    // 契約変更関連
    const confirmPlanChangeBtn = document.getElementById('confirmPlanChange');
    if (confirmPlanChangeBtn) {
        confirmPlanChangeBtn.addEventListener('click', () => {
            executePlanChange();
        });
    }
    
    // 契約廃止関連
    const confirmTerminationBtn = document.getElementById('confirmTermination');
    if (confirmTerminationBtn) {
        confirmTerminationBtn.addEventListener('click', () => {
            executeContractTermination();
        });
    }
}

// 新規契約手続き実行
function executeNewContractProcess() {
    const steps = [
        { elementId: 'contractCreateStatus', text: '処理中...', delay: 1000 },
        { elementId: 'contractCreateStatus', text: '完了', delay: 0 },
        { elementId: 'supplyPointStatus', text: '処理中...', delay: 1000 },
        { elementId: 'supplyPointStatus', text: '完了', delay: 0 },
        { elementId: 'scheduleStatus', text: '処理中...', delay: 1000 },
        { elementId: 'scheduleStatus', text: '完了', delay: 0 }
    ];
    
    executeSteps(steps, () => {
        // 完了後の処理
        document.getElementById('contractResultTitle').textContent = '✅ 新規契約手続き完了';
        document.getElementById('newContractId').textContent = 'CONT-20250815-0001';
        document.getElementById('newSupplyPoint').textContent = '09-5678-5678-5678-0001-0001';
        
        addBotMessage("新規契約手続きが完了しました。開通予定日は2025年8月15日です。");
    });
}

// 請求データ生成実行
function executeBillCalculation() {
    const usageValue = document.getElementById('usageInput').value || 220;
    
    const steps = [
        { elementId: 'collectionStatus', text: '処理中...', delay: 500 },
        { elementId: 'collectionStatus', text: '完了', delay: 0 },
        { elementId: 'basicFeeStatus', text: '計算中...', delay: 500 },
        { elementId: 'basicFeeStatus', text: '完了', delay: 0 },
        { elementId: 'usageFeeStatus', text: '計算中...', delay: 500 },
        { elementId: 'usageFeeStatus', text: '完了', delay: 0 },
        { elementId: 'usageFeeValue', text: `¥${(usageValue * 25.4).toLocaleString()}`, delay: 0 },
        { elementId: 'discountStatus', text: '計算中...', delay: 500 },
        { elementId: 'discountStatus', text: '完了', delay: 0 },
        { elementId: 'totalStatus', text: '計算中...', delay: 500 },
        { elementId: 'totalStatus', text: '完了', delay: 0 },
        { elementId: 'totalValue', text: `¥${(2400 + usageValue * 25.4).toLocaleString()}`, delay: 0 }
    ];
    
    executeSteps(steps, () => {
        // エラーチェック処理
        setTimeout(() => {
            updateErrorCheck('usageCheck', '正常');
            updateErrorCheck('calculationCheck', '正常');
            updateErrorCheck('planCheck', '正常');
            
            // 請求データ生成
            setTimeout(() => {
                document.getElementById('billingResultTitle').textContent = '✅ 請求データ生成完了';
                document.getElementById('billingId').textContent = 'BILL-202507-0001';
                document.getElementById('finalBillAmount').textContent = `¥${(2400 + usageValue * 25.4).toLocaleString()}`;
                document.getElementById('auditLog').textContent = 'AUD-202507-0001';
                document.getElementById('generationStatus').textContent = '完了';
                
                addBotMessage("料金計算が完了しました。請求データを生成いたします。");
            }, 2000);
        }, 1000);
    });
}

// エラーチェック結果更新
function updateErrorCheck(checkId, result) {
    const iconElement = document.getElementById(checkId + 'Icon');
    const resultElement = document.getElementById(checkId + 'Result');
    
    if (iconElement && resultElement) {
        iconElement.textContent = result === '正常' ? '✅' : '❌';
        resultElement.textContent = result;
    }
}

// 支払い確認実行
function executePaymentConfirmation() {
    addBotMessage("分割払い設定を実行します。債権管理帳票を更新いたします。");
    
    setTimeout(() => {
        addBotMessage("分割払い設定が完了しました。3回払いで設定されています。");
    }, 2000);
}

// プラン変更実行
function executePlanChange() {
    addBotMessage("契約変更手続きを実行します。システム更新を開始いたします。");
    
    setTimeout(() => {
        addBotMessage("契約変更が完了しました。レギュラープラン50Aに変更されました。");
    }, 3000);
}

// 契約廃止実行
function executeContractTermination() {
    addBotMessage("契約廃止手続きを実行します。解約処理を開始いたします。");
    
    setTimeout(() => {
        addBotMessage("契約廃止手続きが完了しました。解約証明書を発行いたします。");
    }, 3000);
}

// ステップ実行ヘルパー関数
function executeSteps(steps, callback) {
    let currentStep = 0;
    
    function executeNextStep() {
        if (currentStep >= steps.length) {
            if (callback) callback();
            return;
        }
        
        const step = steps[currentStep];
        
        setTimeout(() => {
            const element = document.getElementById(step.elementId);
            if (element) {
                element.textContent = step.text;
                
                // スタイル更新
                if (step.text === '完了') {
                    element.style.color = '#28a745';
                } else if (step.text.includes('処理中') || step.text.includes('計算中')) {
                    element.style.color = '#ffc107';
                }
            }
            
            currentStep++;
            executeNextStep();
        }, step.delay);
    }
    
    executeNextStep();
}

// チャットメッセージ送信
function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    // ユーザーメッセージを追加
    addUserMessage(message);
    
    // 入力フィールドをクリア
    elements.chatInput.value = '';
    
    // ボット応答を生成
    setTimeout(() => {
        generateBotResponse(message);
    }, 1000);
}

// ユーザーメッセージ追加
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-bubble user';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-timestamp">${getCurrentTime()}</div>
    `;
    elements.messageArea.appendChild(messageElement);
    scrollToBottom();
}

// ボットメッセージ追加
function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-bubble bot';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-timestamp">${getCurrentTime()}</div>
    `;
    elements.messageArea.appendChild(messageElement);
    scrollToBottom();
}

// ボット応答生成
function generateBotResponse(userMessage) {
    // キーワードマッチング
    const matchedKeyword = keywords.find(keyword => 
        userMessage.includes(keyword.trigger)
    );
    
    if (matchedKeyword) {
        addBotMessage(matchedKeyword.bot_prompt);
        
        // 該当シナリオがある場合はAIガイダンスを表示
        const scenario = scenarios.find(s => s.code === matchedKeyword.scenario);
        if (scenario && demoMode) {
            setTimeout(() => {
                showAIGuidance({
                    message: `${scenario.name}のシナリオを開始します。`,
                    options: ["シナリオ実行", "詳細確認", "キャンセル"]
                });
            }, 1000);
        }
    } else {
        // デフォルト応答
        const defaultResponses = [
            "申し訳ございませんが、詳しい内容をお聞かせください。",
            "お困りの内容について、もう少し詳しく教えていただけますか？",
            "どのようなお手続きでしょうか？契約番号をお聞かせください。"
        ];
        
        const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        addBotMessage(randomResponse);
    }
}

// 現在時刻取得
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// メッセージエリアのスクロール
function scrollToBottom() {
    elements.messageArea.scrollTop = elements.messageArea.scrollHeight;
}

// 音声入力ハンドラー
function handleVoiceInput() {
    // Web Speech API の実装（ブラウザサポート要確認）
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            elements.chatInput.value = transcript;
        };
        recognition.start();
    } else {
        addBotMessage("音声入力はサポートされていません。");
    }
}

// デモモード切り替え
function toggleDemoMode() {
    demoMode = elements.demoModeToggle.checked;
    
    if (demoMode) {
        // デモモード有効化
        elements.scenarioSelector.style.display = 'block';
        elements.statusIndicator.textContent = '● デモモード';
        elements.statusIndicator.style.color = '#ff6b35';
        addBotMessage("デモモードが有効になりました。シナリオを選択してください。");
    } else {
        // デモモード無効化
        elements.scenarioSelector.style.display = 'none';
        elements.statusIndicator.textContent = '● 接続中';
        elements.statusIndicator.style.color = '#28a745';
        stopScenario();
        addBotMessage("デモモードが無効になりました。");
    }
}

// シナリオ選択
function selectScenario(scenarioCode) {
    // シナリオボタンのアクティブ状態更新
    elements.scenarioButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.scenario === scenarioCode) {
            btn.classList.add('active');
        }
    });
    
    // 選択されたシナリオを取得
    currentScenario = scenarios.find(s => s.code === scenarioCode);
    if (!currentScenario) return;
    
    // シナリオ実行
    operatorActionIndex = 0;
    addBotMessage(`${currentScenario.name}のシナリオを開始します。`);
    
    // AIガイダンス表示
    setTimeout(() => {
        showAIGuidance({
            message: `${currentScenario.name}のシナリオが開始されました。オペレーター操作を開始します。`,
            options: ["操作開始", "一時停止", "スキップ"]
        });
    }, 1000);
    
    // シナリオ実行開始
    setTimeout(() => {
        executeScenario();
    }, 3000);
}

// シナリオ実行
function executeScenario() {
    if (!currentScenario || !demoMode) return;
    
    // 通話ログ追加
    addCallLogMessages();
    
    // 要約更新
    updateSummary();
    
    // アラート表示
    showAlerts();
    
    // オペレーター操作実行
    executeOperatorActions();
}

// 通話ログメッセージ追加
function addCallLogMessages() {
    if (!currentScenario.transcript) return;
    
    currentScenario.transcript.forEach((item, index) => {
        setTimeout(() => {
            addCallLogMessage(item);
        }, index * 2000);
    });
}

// 通話ログメッセージ追加（個別）
function addCallLogMessage(logItem) {
    const logMessage = document.createElement('div');
    logMessage.className = `log-message ${logItem.speaker === '顧客' ? 'customer' : 'operator'}`;
    logMessage.innerHTML = `
        <div class="log-timestamp">${logItem.timestamp}</div>
        <div class="log-speaker">${logItem.speaker}:</div>
        <div class="log-text">${logItem.text}</div>
    `;
    
    elements.logMessageArea.appendChild(logMessage);
    elements.logMessageArea.scrollTop = elements.logMessageArea.scrollHeight;
}

// 要約更新
function updateSummary() {
    if (!currentScenario.summaryUpdates) return;
    
    currentScenario.summaryUpdates.forEach((update, index) => {
        setTimeout(() => {
            elements.summaryContent.textContent = update.summary;
        }, index * 3000);
    });
}

// アラート表示
function showAlerts() {
    if (!currentScenario.alerts || currentScenario.alerts.length === 0) return;
    
    currentScenario.alerts.forEach((alert, index) => {
        setTimeout(() => {
            showAlert(alert);
        }, index * 5000);
    });
}

// アラート表示（個別）
function showAlert(alert) {
    elements.alertPanel.style.display = 'block';
    elements.alertContent.innerHTML = `
        <div class="alert-message ${alert.severity.toLowerCase()}">
            <strong>${alert.type}:</strong> ${alert.message}
        </div>
        <div class="alert-timestamp">${alert.timestamp}</div>
    `;
    
    // 5秒後に非表示
    setTimeout(() => {
        elements.alertPanel.style.display = 'none';
    }, 5000);
}

// オペレーター操作実行
function executeOperatorActions() {
    if (!currentScenario.operatorActions) return;
    
    currentScenario.operatorActions.forEach((action, index) => {
        setTimeout(() => {
            executeOperatorAction(action);
        }, (index + 1) * (action.delay || 4000));
    });
}

// オペレーター操作実行（個別）
function executeOperatorAction(action) {
    console.log('オペレーター操作:', action.type, action);
    
    // 作業進行状況を表示
    showOperatorProgress(action.description || action.type);
    
    switch (action.type) {
        case 'SWITCH_TAB':
            switchToTab(action.tabId);
            addOperatorActionLog(`${action.tabName || action.tabId}タブに切り替え`);
            
            // AIガイダンス表示チェック
            maybePushAISuggestionForAction('tab_switch_' + action.tabId);
            break;
            
        case 'HIGHLIGHT_FIELD':
            highlightField(action.fieldId, action.duration || 3000);
            addOperatorActionLog(`${action.fieldId}フィールドをハイライト`);
            break;
            
        case 'CLICK_BUTTON':
            simulateButtonClick(action.buttonId);
            addOperatorActionLog(`${action.buttonId}ボタンをクリック`);
            
            // AIガイダンス表示チェック
            maybePushAISuggestionForAction('click_' + action.buttonId);
            break;
            
        case 'SELECT_OPTION':
            simulateSelectOption(action.selector, action.value);
            addOperatorActionLog(`${action.selector}で${action.value}を選択`);
            break;
            
        case 'INPUT_DATA':
            simulateInputData(action.field, action.value);
            addOperatorActionLog(`${action.field}に${action.value}を入力`);
            break;
    }
    
    // 進行状況を非表示
    setTimeout(() => {
        hideOperatorProgress();
    }, 2000);
}

// オペレーター進行状況表示
function showOperatorProgress(description) {
    // 既存の進行状況を削除
    hideOperatorProgress();
    
    const progress = document.createElement('div');
    progress.className = 'operator-progress';
    progress.innerHTML = `
        <span>🔄 ${description}</span>
    `;
    document.body.appendChild(progress);
}

// オペレーター進行状況非表示
function hideOperatorProgress() {
    const existingProgress = document.querySelector('.operator-progress');
    if (existingProgress) {
        existingProgress.remove();
    }
}

// オペレーター動作ログ追加（本番では非表示）
function addOperatorActionLog(description) {
    // 実際の画面では作業ログは表示しない
    console.log('オペレーター作業:', description);
}

// フィールドハイライト
function highlightField(fieldId, duration = 3000) {
    const element = document.getElementById(fieldId);
    if (!element) return;
    
    element.classList.add('highlight');
    setTimeout(() => {
        element.classList.remove('highlight');
    }, duration);
}

// ボタンクリックシミュレーション
function simulateButtonClick(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 1000);
    }
}

// セレクトオプション選択シミュレーション
function simulateSelectOption(selector, value) {
    const selectElement = document.querySelector(selector);
    if (selectElement) {
        selectElement.value = value;
        selectElement.classList.add('highlight');
        setTimeout(() => {
            selectElement.classList.remove('highlight');
        }, 2000);
    }
}

// データ入力シミュレーション
function simulateInputData(fieldId, value) {
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.value = value;
        inputElement.classList.add('highlight');
        setTimeout(() => {
            inputElement.classList.remove('highlight');
        }, 2000);
    }
}

// AIガイダンス表示判定
function maybePushAISuggestionForAction(trigger) {
    if (!currentScenario || !currentScenario.aiGuidance) return;
    
    const guidance = currentScenario.aiGuidance.find(g => g.trigger === trigger);
    if (guidance) {
        setTimeout(() => {
            showAIGuidance(guidance);
        }, 1000);
    }
}

// AIガイダンス表示
function showAIGuidance(guidance) {
    const guidancePanel = document.createElement('div');
    guidancePanel.className = 'ai-guidance-panel';
    guidancePanel.innerHTML = `
        <div class="guidance-header">
            <span class="guidance-icon">🤖</span>
            <span class="guidance-title">AIガイダンス</span>
            <button class="guidance-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="guidance-content">
            <p>${guidance.message}</p>
            ${guidance.options ? `
                <div class="guidance-options">
                    ${guidance.options.map(option => `
                        <button class="guidance-option" onclick="selectGuidanceOption('${option}', '${guidance.trigger}')">${option}</button>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(guidancePanel);
    
    // 10秒後に自動削除
    setTimeout(() => {
        if (guidancePanel.parentElement) {
            guidancePanel.remove();
        }
    }, 10000);
}

// ガイダンスオプション選択
function selectGuidanceOption(selectedOption, trigger) {
    // ガイダンスパネルを削除
    const panels = document.querySelectorAll('.ai-guidance-panel');
    panels.forEach(panel => panel.remove());
    
    // 選択されたオプションに基づく処理
    addBotMessage(`「${selectedOption}」を選択されました。処理を実行します。`);
    
    // より詳細なガイダンスフローがある場合
    const nextGuidance = getNextGuidanceFlow(selectedOption, trigger);
    if (nextGuidance) {
        setTimeout(() => {
            showAIGuidance(nextGuidance);
        }, 1000);
    }
    
    console.log(`ガイダンスフロー処理: ${selectedOption} (trigger: ${trigger}) - 自動システムにより管理`);
}

// 次のガイダンスフロー取得
function getNextGuidanceFlow(selectedOption, trigger) {
    // 実際の実装では、より複雑なフロー管理を行う
    // ここでは簡単なサンプルフローを提供
    const followUpGuidances = {
        'シナリオ実行': {
            message: 'シナリオの実行を継続します。次のステップに進んでください。',
            options: ['続行', '一時停止', '詳細表示']
        },
        '続行': {
            message: 'シナリオが正常に実行されています。',
            options: []
        }
    };
    
    return followUpGuidances[selectedOption];
}

// シナリオ停止
function stopScenario() {
    currentScenario = null;
    operatorActionIndex = 0;
    
    // すべてのハイライトを削除
    document.querySelectorAll('.highlight').forEach(el => {
        el.classList.remove('highlight');
    });
    
    // 進行状況を非表示
    hideOperatorProgress();
    
    // AIガイダンスパネルを削除
    document.querySelectorAll('.ai-guidance-panel').forEach(panel => {
        panel.remove();
    });
}

// 初期化完了メッセージ
console.log('AIエージェントUI JavaScript初期化完了');
