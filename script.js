// グローバル変数
let currentScenario = null;
let demoMode = false;
let keywords = [];
let scenarios = [];
let currentScenarioIndex = 0;
let operatorActionIndex = 0; // オペレーター動作のインデックス

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
    
    // 通話ログ関連
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
    statusIndicator: document.getElementById('statusIndicator')
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
        // 外部ファイルの読み込みを試行（CORSエラー対策のためコメントアウト）
        // const response = await fetch('dummy_data_v2.json');
        // const data = await response.json();
        // keywords = data.keywords || [];
        
        // 直接データを埋め込み（CORSエラー回避）
        keywords = [
            {
                "scenario": "RESTORE_POWER",
                "trigger": "電気が止まった",
                "bot_prompt": "停電とのことですので、再点申込の手順をご案内します。契約番号をお願いします。"
            },
            {
                "scenario": "RESTORE_POWER",
                "trigger": "停電",
                "bot_prompt": "停電とのことですので、再点申込の手順をご案内します。契約番号をお願いします。"
            },
            {
                "scenario": "RESTORE_POWER",
                "trigger": "再点",
                "bot_prompt": "再点申込の手順をご案内します。契約番号をお願いします。"
            },
            {
                "scenario": "USAGE_CALCULATION",
                "trigger": "使用量",
                "bot_prompt": "使用量の確認ですね。契約番号をお願いします。"
            },
            {
                "scenario": "USAGE_CALCULATION",
                "trigger": "料金",
                "bot_prompt": "料金の確認ですね。契約番号をお願いします。"
            },
            {
                "scenario": "USAGE_CALCULATION",
                "trigger": "計算",
                "bot_prompt": "料金計算のご相談ですね。契約番号をお願いします。"
            },
            {
                "scenario": "BILLING_MANAGEMENT",
                "trigger": "請求額",
                "bot_prompt": "最新の請求額は¥7,980です。支払期限は2025/08/20になります。"
            },
            {
                "scenario": "BILLING_MANAGEMENT",
                "trigger": "請求",
                "bot_prompt": "請求額の確認ですね。契約番号をお願いします。"
            },
            {
                "scenario": "BILLING_MANAGEMENT",
                "trigger": "支払い",
                "bot_prompt": "支払いについてのご相談ですね。契約番号をお願いします。"
            },
            {
                "scenario": "BILLING_MANAGEMENT",
                "trigger": "未収",
                "bot_prompt": "未収金についてのご相談ですね。契約番号をお願いします。"
            },
            {
                "scenario": "CONTRACT_CHANGE",
                "trigger": "プラン変更",
                "bot_prompt": "プラン変更の手続きをご案内します。現在のプランと希望プランをお聞かせください。"
            },
            {
                "scenario": "CONTRACT_CHANGE",
                "trigger": "プラン",
                "bot_prompt": "プラン変更のご相談ですね。現在のプランと希望プランをお聞かせください。"
            },
            {
                "scenario": "CONTRACT_CHANGE",
                "trigger": "契約変更",
                "bot_prompt": "契約変更の手続きをご案内します。変更内容をお聞かせください。"
            },
            {
                "scenario": "CONTRACT_TERMINATION",
                "trigger": "契約廃止",
                "bot_prompt": "契約廃止の手続きをご案内します。廃止理由と希望日をお聞かせください。"
            },
            {
                "scenario": "CONTRACT_TERMINATION",
                "trigger": "解約",
                "bot_prompt": "契約廃止のご相談ですね。廃止理由と希望日をお聞かせください。"
            },
            {
                "scenario": "CONTRACT_TERMINATION",
                "trigger": "廃止",
                "bot_prompt": "契約廃止のご相談ですね。廃止理由と希望日をお聞かせください。"
            }
        ];
        console.log('キーワードデータ読み込み完了:', keywords.length, '件');
    } catch (error) {
        console.error('キーワード読み込みエラー:', error);
    }
}

// シナリオデータの読み込み
async function loadScenarios() {
    try {
        // 外部ファイルの読み込みを試行（CORSエラー対策のためコメントアウト）
        // const response = await fetch('dummy_data_v2.json');
        // const data = await response.json();
        // scenarios = data.scenarios || [];
        
        // 直接データを埋め込み（CORSエラー回避）
        scenarios = [
            {
                "code": "RESTORE_POWER",
                "name": "再点申込",
                "icon": "⚡",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "もしもし、電気が止まってしまったんですが…" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "申し訳ありません。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "未収¥15,430、最終入金2025/05/20です。" },
                    { "timestamp": "14:00:30", "speaker": "オペレーター", "text": "再点候補は08/12 09:00,13:00,15:30です。いかがですか？" },
                    { "timestamp": "14:00:45", "speaker": "顧客", "text": "13:00でお願いします。" },
                    { "timestamp": "14:01:00", "speaker": "オペレーター", "text": "予約完了しました。予約ID: RES-20250812-0001" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "未収¥15,430／最終入金2025/05/20を確認" },
                    { "time": "14:00:25", "summary": "再点希望13:00で予約指示" },
                    { "time": "14:01:00", "summary": "予約完了：RES-20250812-0001" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号フィールドを確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "unpaid-management", "tabName": "未収管理" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "unpaidAmount", "description": "未収金額を確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "restore-power", "tabName": "再点申込" },
                    { "type": "SELECT_OPTION", "selector": "#restoreDate", "value": "2025-08-12", "description": "再点日を選択" },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmRestore", "description": "再点申込確認ボタンをクリック" },
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要に戻る" }
                ]
            },
            {
                "code": "USAGE_CALCULATION",
                "name": "使用量計算～料金計算",
                "icon": "🧮",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "今月の使用量と料金を教えてください" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "承知いたしました。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "2025年7月分の使用量は220kWhです。" },
                    { "timestamp": "14:00:20", "speaker": "オペレーター", "text": "基本料金¥2,400、従量料金¥5,580、合計¥7,980です。" },
                    { "timestamp": "14:00:25", "speaker": "顧客", "text": "前月と比べてどうですか？" },
                    { "timestamp": "14:00:30", "speaker": "オペレーター", "text": "前月比-15kWh、料金差額-¥140の減少です。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "7月分使用量220kWhを確認" },
                    { "time": "14:00:20", "summary": "料金内訳：基本¥2,400＋従量¥5,580＝¥7,980" },
                    { "time": "14:00:30", "summary": "前月比-15kWh、-¥140の減少を案内" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号フィールドを確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "billing-history", "tabName": "請求履歴" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "currentUsage", "description": "現在の使用量を確認", "duration": 2000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "currentBill", "description": "現在の請求額を確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "simulation", "tabName": "料金シミュレーション" },
                    { "type": "INPUT_DATA", "field": "usageInput", "value": "220", "description": "使用量を入力" },
                    { "type": "CLICK_BUTTON", "buttonId": "calculateBill", "description": "料金計算ボタンをクリック" },
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要に戻る" }
                ]
            },
            {
                "code": "BILLING_MANAGEMENT",
                "name": "請求・未収管理",
                "icon": "💰",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "未収金の支払いについて相談したいのですが" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "承知いたしました。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "未収金額は¥15,430（3ヶ月分）です。" },
                    { "timestamp": "14:00:20", "speaker": "オペレーター", "text": "分割払いも可能です。いかがでしょうか？" },
                    { "timestamp": "14:00:25", "speaker": "顧客", "text": "分割払いでお願いします。" },
                    { "timestamp": "14:00:30", "speaker": "オペレーター", "text": "3回払いで設定いたします。1回目は8月20日までです。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "未収¥15,430（3ヶ月分）を確認" },
                    { "time": "14:00:20", "summary": "分割払い案内実施" },
                    { "time": "14:00:30", "summary": "3回払い設定完了、1回目8/20期限" }
                ],
                "alerts": [
                    {
                        "type": "UNPAID_ALERT",
                        "message": "未収金3ヶ月分¥15,430の支払い相談",
                        "severity": "MEDIUM",
                        "timestamp": "14:00:15"
                    }
                ],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号フィールドを確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "unpaid-management", "tabName": "未収管理" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "unpaidAmount", "description": "未収金額を確認", "duration": 2000 },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "unpaidMonths", "description": "未収月数を確認", "duration": 2000 },
                    { "type": "SELECT_OPTION", "selector": "#paymentMethod", "value": "installment", "description": "分割払いを選択" },
                    { "type": "SELECT_OPTION", "selector": "#installmentCount", "value": "3", "description": "3回払いを選択" },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmPayment", "description": "支払い方法確認ボタンをクリック" },
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要に戻る" }
                ]
            },
            {
                "code": "CONTRACT_CHANGE",
                "name": "契約変更",
                "icon": "🔄",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "プランを変更したいのですが" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "承知いたしました。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "現在はナイト・セレクトプランですね。" },
                    { "timestamp": "14:00:20", "speaker": "顧客", "text": "レギュラープランに変更したいです。" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "月額¥1,220の増額になりますが、よろしいですか？" },
                    { "timestamp": "14:00:30", "speaker": "顧客", "text": "はい、お願いします。" },
                    { "timestamp": "14:00:35", "speaker": "オペレーター", "text": "変更完了しました。適用開始は9月1日です。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "現在プラン：ナイト・セレクトを確認" },
                    { "time": "14:00:25", "summary": "レギュラープラン変更希望、+¥1,220/月" },
                    { "time": "14:00:35", "summary": "変更完了：適用開始2025/09/01" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号フィールドを確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "contract-service", "tabName": "契約・サービス" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "currentPlan", "description": "現在のプランを確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "change-plan", "tabName": "プラン変更" },
                    { "type": "SELECT_OPTION", "selector": "#newPlan", "value": "regular", "description": "レギュラープランを選択" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "planComparison", "description": "プラン比較を確認", "duration": 2000 },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmPlanChange", "description": "プラン変更確認ボタンをクリック" },
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要に戻る" }
                ]
            },
            {
                "code": "CONTRACT_TERMINATION",
                "name": "契約廃止",
                "icon": "🚪",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "契約を廃止したいのですが" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "承知いたしました。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "廃止理由をお聞かせください。" },
                    { "timestamp": "14:00:20", "speaker": "顧客", "text": "引越しのためです。" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "希望廃止日はいつでしょうか？" },
                    { "timestamp": "14:00:30", "speaker": "顧客", "text": "7月31日でお願いします。" },
                    { "timestamp": "14:00:35", "speaker": "オペレーター", "text": "廃止手続き完了しました。最終請求書を送付いたします。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "廃止理由ヒアリング開始" },
                    { "time": "14:00:20", "summary": "廃止理由：引越し" },
                    { "time": "14:00:30", "summary": "希望廃止日：2025/07/31" },
                    { "time": "14:00:35", "summary": "廃止手続き完了" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号フィールドを確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "contract-service", "tabName": "契約・サービス" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "contractStatus", "description": "契約状況を確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "termination", "tabName": "契約廃止" },
                    { "type": "SELECT_OPTION", "selector": "#terminationReason", "value": "moving", "description": "廃止理由を選択" },
                    { "type": "INPUT_DATA", "field": "terminationDate", "value": "2025-07-31", "description": "廃止希望日を入力" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "finalBill", "description": "最終請求額を確認", "duration": 2000 },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmTermination", "description": "契約廃止確認ボタンをクリック" },
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要に戻る" }
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
    
    // FAQモーダル
    elements.faqButton.addEventListener('click', openFaqModal);
    elements.closeFaqModal.addEventListener('click', closeFaqModal);
    elements.faqModal.addEventListener('click', (e) => {
        if (e.target === elements.faqModal) {
            closeFaqModal();
        }
    });
    
    // トランスクリプト切り替え
    elements.transcriptToggle.addEventListener('click', toggleTranscript);
    
    // デモモード
    elements.demoModeToggle.addEventListener('change', toggleDemoMode);
    elements.demoToggle.addEventListener('click', toggleDemoMode);
    
    // シナリオ選択
    elements.scenarioButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectScenario(button.dataset.scenario);
        });
    });
    
    // 再点申込スロット選択
    elements.slotButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectTimeSlot(button);
        });
    });
    
    // FAQアイテムクリック
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const question = item.querySelector('.faq-question').textContent;
            elements.chatInput.value = question;
            closeFaqModal();
        });
    });
}

// 初期状態の設定
function setupInitialState() {
    // 最初のタブをアクティブにする
    switchTab('overview');
    
    // 初期メッセージを表示
    addChatMessage('bot', 'こんにちは！九州電力のAIアシスタントです。何かお手伝いできることはありますか？', '14:00');
    
    // 初期通話ログをクリア（停電対応の自動設定を防ぐ）
    elements.logMessageArea.innerHTML = '';
    elements.summaryContent.textContent = 'AIエージェントUI初期化完了';
    
    // デモモードは初期状態では無効
    demoMode = false;
    currentScenario = null;
    
    // シナリオ選択パネルを非表示
    elements.scenarioSelector.style.display = 'none';
    
    // アラートと共有事項をクリア
    elements.alertPanel.style.display = 'none';
    elements.sharedInfoPanel.style.display = 'none';
    elements.alertContent.innerHTML = '';
    elements.sharedInfoContent.innerHTML = '';
}

// シナリオ選択
function selectScenario(scenarioCode) {
    console.log('シナリオ選択:', scenarioCode);
    
    // 現在のシナリオ再生を停止
    stopScenarioPlayback();
    
    // すべてのシナリオボタンからアクティブクラスを削除
    elements.scenarioButtons.forEach(btn => btn.classList.remove('active'));
    
    // 選択されたシナリオボタンにアクティブクラスを追加
    const selectedButton = document.querySelector(`[data-scenario="${scenarioCode}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // シナリオデータを取得
    currentScenario = scenarios.find(s => s.code === scenarioCode);
    if (!currentScenario) {
        console.error('シナリオが見つかりません:', scenarioCode);
        return;
    }
    
    console.log('選択されたシナリオ:', currentScenario);
    
    // 通話ログをクリア
    elements.logMessageArea.innerHTML = '';
    
    // 要約をリセット
    elements.summaryContent.textContent = 'シナリオ開始: ' + currentScenario.name;
    
    // アラートと共有事項をクリア
    elements.alertPanel.style.display = 'none';
    elements.sharedInfoPanel.style.display = 'none';
    elements.alertContent.innerHTML = '';
    elements.sharedInfoContent.innerHTML = '';
    
    // シナリオ開始メッセージを追加
    addCallLogMessage({
        timestamp: "14:00:00",
        speaker: "システム",
        text: `シナリオ開始: ${currentScenario.name}`
    });
    
    // デモモード中なら即座にシナリオ再生開始
    if (demoMode) {
        setTimeout(() => {
            startScenarioPlayback();
        }, 500);
    }
}

// シナリオ再生開始
function startScenarioPlayback() {
    if (!currentScenario) {
        console.error('シナリオが設定されていません');
        return;
    }
    
    if (!demoMode) {
        console.log('デモモードが無効です');
        return;
    }
    
    console.log('シナリオ再生開始:', currentScenario.name);
    
    let messageIndex = 0;
    let summaryIndex = 0;
    let alertIndex = 0;
    let sharedInfoIndex = 0;
    operatorActionIndex = 0;
    
    // メッセージ表示インターバル
    const messageInterval = setInterval(() => {
        if (!demoMode) {
            clearInterval(messageInterval);
            return;
        }
        
        if (messageIndex < currentScenario.transcript.length) {
            const message = currentScenario.transcript[messageIndex];
            console.log('メッセージ追加:', message);
            addCallLogMessage(message);
            messageIndex++;
        } else {
            console.log('メッセージ再生完了');
            clearInterval(messageInterval);
        }
    }, 2000);
    
    // 要約更新インターバル
    const summaryInterval = setInterval(() => {
        if (!demoMode) {
            clearInterval(summaryInterval);
            return;
        }
        
        if (currentScenario.summaryUpdates && summaryIndex < currentScenario.summaryUpdates.length) {
            const summary = currentScenario.summaryUpdates[summaryIndex];
            console.log('要約更新:', summary);
            updateSummary(summary.summary);
            summaryIndex++;
        } else {
            clearInterval(summaryInterval);
        }
    }, 8000);
    
    // アラート表示インターバル
    const alertInterval = setInterval(() => {
        if (!demoMode) {
            clearInterval(alertInterval);
            return;
        }
        
        if (currentScenario.alerts && alertIndex < currentScenario.alerts.length) {
            const alert = currentScenario.alerts[alertIndex];
            console.log('アラート表示:', alert);
            showAlert(alert);
            alertIndex++;
        } else {
            clearInterval(alertInterval);
        }
    }, 10000);
    
    // 共有事項表示インターバル
    const sharedInfoInterval = setInterval(() => {
        if (!demoMode) {
            clearInterval(sharedInfoInterval);
            return;
        }
        
        if (currentScenario.sharedInfo && sharedInfoIndex < currentScenario.sharedInfo.length) {
            const sharedInfo = currentScenario.sharedInfo[sharedInfoIndex];
            console.log('共有事項表示:', sharedInfo);
            showSharedInfo(sharedInfo);
            sharedInfoIndex++;
        } else {
            clearInterval(sharedInfoInterval);
        }
    }, 12000);
    
    // オペレーター動作シミュレーションインターバル
    const operatorActionInterval = setInterval(() => {
        if (!demoMode) {
            clearInterval(operatorActionInterval);
            return;
        }
        
        if (currentScenario.operatorActions && operatorActionIndex < currentScenario.operatorActions.length) {
            const action = currentScenario.operatorActions[operatorActionIndex];
            console.log('オペレーター動作実行:', action);
            executeOperatorAction(action);
            operatorActionIndex++;
        } else {
            clearInterval(operatorActionInterval);
        }
    }, 3000);
    
    // インターバルIDを保存
    window.scenarioIntervals = {
        message: messageInterval,
        summary: summaryInterval,
        alert: alertInterval,
        sharedInfo: sharedInfoInterval,
        operatorAction: operatorActionInterval
    };
}

// アラート表示
function showAlert(alert) {
    elements.alertPanel.style.display = 'block';
    
    const alertItem = document.createElement('div');
    alertItem.classList.add('alert-item');
    
    const alertType = document.createElement('div');
    alertType.classList.add('alert-type');
    alertType.textContent = getAlertTypeText(alert.type);
    
    const alertMessage = document.createElement('div');
    alertMessage.classList.add('alert-message');
    alertMessage.textContent = alert.message;
    
    alertItem.appendChild(alertType);
    alertItem.appendChild(alertMessage);
    elements.alertContent.appendChild(alertItem);
    
    // アニメーション
    setTimeout(() => {
        alertItem.style.opacity = '1';
        alertItem.style.transform = 'translateY(0)';
    }, 10);
}

// 共有事項表示
function showSharedInfo(sharedInfo) {
    elements.sharedInfoPanel.style.display = 'block';
    
    const sharedItem = document.createElement('div');
    sharedItem.classList.add('shared-item');
    
    const sharedType = document.createElement('div');
    sharedType.classList.add('shared-type');
    sharedType.textContent = getSharedInfoTypeText(sharedInfo.type);
    
    const sharedMessage = document.createElement('div');
    sharedMessage.classList.add('shared-message');
    sharedMessage.textContent = sharedInfo.message;
    
    sharedItem.appendChild(sharedType);
    sharedItem.appendChild(sharedMessage);
    elements.sharedInfoContent.appendChild(sharedItem);
    
    // アニメーション
    setTimeout(() => {
        sharedItem.style.opacity = '1';
        sharedItem.style.transform = 'translateY(0)';
    }, 10);
}

// アラートタイプテキスト取得
function getAlertTypeText(type) {
    const typeMap = {
        'HARASSMENT': 'パワハラ検知',
        'SEXUAL_HARASSMENT': 'セクハラ検知',
        'MISSING_INFO': '伝達漏れ検知',
        'UNPAID_ALERT': '未収金アラート'
    };
    return typeMap[type] || type;
}

// 共有事項タイプテキスト取得
function getSharedInfoTypeText(type) {
    const typeMap = {
        'MISSING_INFO': '伝達漏れ',
        'IMPORTANT_INFO': '重要情報',
        'FOLLOW_UP': 'フォローアップ'
    };
    return typeMap[type] || type;
}

// オペレーター動作実行
function executeOperatorAction(action) {
    // 進行状況を表示
    showOperatorProgress(action.description);
    
    switch (action.type) {
        case 'SWITCH_TAB':
            switchTab(action.tabId);
            addOperatorActionLog(`タブ切り替え: ${action.tabName}`);
            break;
        case 'INPUT_DATA':
            inputCustomerData(action.field, action.value);
            addOperatorActionLog(`データ入力: ${action.field} = ${action.value}`);
            break;
        case 'SELECT_OPTION':
            selectOption(action.selector, action.value);
            addOperatorActionLog(`選択: ${action.description}`);
            break;
        case 'CLICK_BUTTON':
            clickButton(action.buttonId, action.description);
            addOperatorActionLog(`ボタンクリック: ${action.description}`);
            break;
        case 'SCROLL_TO':
            scrollToElement(action.elementId);
            addOperatorActionLog(`スクロール: ${action.description}`);
            break;
        case 'HIGHLIGHT_FIELD':
            highlightField(action.fieldId, action.duration);
            addOperatorActionLog(`フィールドハイライト: ${action.description}`);
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

// オペレーター動作ログ追加
function addOperatorActionLog(description) {
    const logArea = document.getElementById('logMessageArea');
    if (logArea) {
        const logEntry = document.createElement('div');
        logEntry.classList.add('log-entry', 'operator-action');
        logEntry.innerHTML = `
            <span class="log-time">${formatTime(new Date())}</span>
            <span class="log-speaker">オペレーター</span>
            <span class="log-text">${description}</span>
        `;
        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;
    }
}

// タブ切り替え
function switchTab(tabId) {
    // タブボタンとタブコンテンツを取得
    const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
    const tabContent = document.getElementById(tabId);
    
    if (tabButton && tabContent) {
        // タブボタンにハイライト効果を追加
        tabButton.classList.add('operator-switching');
        
        setTimeout(() => {
            // すべてのタブボタンからactiveクラスを削除
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // すべてのタブコンテンツからactiveクラスを削除
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 選択されたタブボタンとコンテンツにactiveクラスを追加
            tabButton.classList.add('active');
            tabContent.classList.add('active');
            
            setTimeout(() => {
                tabButton.classList.remove('operator-switching');
            }, 1000);
        }, 500);
    }
}

// 顧客データ入力
function inputCustomerData(field, value) {
    const inputElement = document.getElementById(field);
    if (inputElement) {
        // 入力フィールドをハイライト
        inputElement.classList.add('operator-action-highlight');
        inputElement.focus();
        
        // タイピングアニメーション
        let currentValue = '';
        const typeInterval = setInterval(() => {
            if (currentValue.length < value.length) {
                currentValue += value[currentValue.length];
                inputElement.value = currentValue;
                inputElement.classList.add('typing-animation');
            } else {
                clearInterval(typeInterval);
                // ハイライトを解除
                setTimeout(() => {
                    inputElement.classList.remove('operator-action-highlight', 'typing-animation');
                    inputElement.blur();
                }, 1000);
            }
        }, 100);
    }
}

// オプション選択
function selectOption(selector, value) {
    const selectElement = document.querySelector(selector);
    if (selectElement) {
        selectElement.classList.add('operator-action-highlight');
        selectElement.focus();
        selectElement.value = value;
        
        // changeイベントを発火
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
        
        setTimeout(() => {
            selectElement.classList.remove('operator-action-highlight');
            selectElement.blur();
        }, 1000);
    }
}

// ボタンクリック
function clickButton(buttonId, description) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('button-click-effect');
        setTimeout(() => {
            button.classList.remove('button-click-effect');
            button.click();
        }, 200);
    }
}

// 要素までスクロール
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('scroll-target');
        setTimeout(() => {
            element.classList.remove('scroll-target');
        }, 2000);
    }
}

// フィールドハイライト
function highlightField(fieldId, duration = 2000) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('field-highlight');
        setTimeout(() => {
            field.classList.remove('field-highlight');
        }, duration);
    }
}

// チャットメッセージ送信
function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // ユーザーメッセージを追加
    addChatMessage('user', message, time);
    elements.chatInput.value = '';
    
    // キーワードトリガーチェック
    const triggeredKeyword = checkKeywordTrigger(message);
    
    // ボット応答を生成
    setTimeout(() => {
        const botResponse = generateBotResponse(message, triggeredKeyword);
        addChatMessage('bot', botResponse, time);
    }, 500);
}

// キーワードトリガーチェック
function checkKeywordTrigger(message) {
    return keywords.find(keyword => 
        message.toLowerCase().includes(keyword.trigger.toLowerCase())
    );
}

// ボット応答生成
function generateBotResponse(message, triggeredKeyword) {
    if (triggeredKeyword) {
        console.log('キーワードトリガー:', triggeredKeyword);
        return triggeredKeyword.bot_prompt;
    }
    
    // デフォルト応答
    const defaultResponses = {
        "再点申込の手順を教えて": "1. 契約番号入力 → 2. 未収確認 → 3. 再点日選択 → 4. 予約実行",
        "使用量計算の方法を教えて": "契約番号を入力いただければ、使用量と料金の詳細をお調べいたします。",
        "料金計算の仕組みを教えて": "基本料金と従量料金の合計で計算されます。詳細は契約番号をお聞かせください。",
        "今回の請求額はいくら？": "2025年7月分は¥7,980（支払期限：08/20）",
        "未収金の支払い方法を教えて": "分割払いも可能です。契約番号をお聞かせください。",
        "プラン変更後の試算を比較して": "レギュラー: ¥9,200/月(+¥1,220)、デイタイム: ¥10,500/月(+¥2,520)",
        "契約変更の手続きを教えて": "現在のプランと希望プランをお聞かせください。契約番号も必要です。",
        "契約廃止の手続きを教えて": "廃止理由と希望日をお聞かせください。契約番号も必要です。",
        "廃止手続きPDFを取れる？": "[ダウンロード](https://chatgpt.com/reports/termination/CTR-09-1234-5678.pdf)",
        "停電": "停電とのことですので、再点申込の手順をご案内します。契約番号をお願いします。",
        "電気が止まった": "停電とのことですので、再点申込の手順をご案内します。契約番号をお願いします。",
        "再点": "再点申込の手順をご案内します。契約番号をお願いします。",
        "使用量": "使用量の確認ですね。契約番号をお願いします。",
        "料金": "料金の確認ですね。契約番号をお願いします。",
        "計算": "料金計算のご相談ですね。契約番号をお願いします。",
        "請求": "請求額の確認ですね。契約番号をお願いします。",
        "支払い": "支払いについてのご相談ですね。契約番号をお願いします。",
        "未収": "未収金についてのご相談ですね。契約番号をお願いします。",
        "プラン": "プラン変更のご相談ですね。現在のプランと希望プランをお聞かせください。",
        "契約変更": "契約変更の手続きをご案内します。変更内容をお聞かせください。",
        "解約": "契約廃止のご相談ですね。廃止理由と希望日をお聞かせください。",
        "廃止": "契約廃止のご相談ですね。廃止理由と希望日をお聞かせください。"
    };
    
    // メッセージに含まれるキーワードをチェック
    for (const [keyword, response] of Object.entries(defaultResponses)) {
        if (message.toLowerCase().includes(keyword.toLowerCase())) {
            console.log('キーワードマッチ:', keyword);
            return response;
        }
    }
    
    return "申し訳ありません、その質問にはお答えできません。別の方法でお手伝いできることはありますか？";
}

// チャットメッセージ追加
function addChatMessage(sender, text, time) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-bubble', sender);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = text;
    
    const timestamp = document.createElement('div');
    timestamp.classList.add('message-timestamp');
    timestamp.textContent = time;
    
    messageContainer.appendChild(messageContent);
    messageContainer.appendChild(timestamp);
    
    elements.messageArea.appendChild(messageContainer);
    
    // アニメーション
    setTimeout(() => {
        messageContainer.classList.add('show');
    }, 10);
    
    // 自動スクロール
    elements.messageArea.scrollTop = elements.messageArea.scrollHeight;
}

// 音声入力処理
function handleVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
            elements.voiceButton.style.background = '#ff6b6b';
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            elements.chatInput.value = transcript;
        };
        
        recognition.onend = () => {
            elements.voiceButton.style.background = '#005BAC';
        };
        
        recognition.start();
    } else {
        alert('音声入力はお使いのブラウザではサポートされていません。');
    }
}

// FAQモーダルを開く
function openFaqModal() {
    elements.faqModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// FAQモーダルを閉じる
function closeFaqModal() {
    elements.faqModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// トランスクリプト切り替え
function toggleTranscript() {
    const isVisible = elements.transcriptContent.style.display !== 'none';
    elements.transcriptContent.style.display = isVisible ? 'none' : 'block';
    elements.transcriptToggle.textContent = isVisible ? '▲' : '▼';
}

// デモモード切り替え
function toggleDemoMode() {
    demoMode = !demoMode;
    elements.demoModeToggle.checked = demoMode;
    elements.demoToggle.textContent = demoMode ? 'デモ停止' : 'デモモード';
    
    console.log('デモモード切り替え:', demoMode);
    
    // シナリオ選択パネルを表示/非表示
    if (demoMode) {
        elements.scenarioSelector.style.display = 'block';
        // デモモード開始時はシナリオを自動選択しない
        // ユーザーが手動でシナリオを選択するまで待機
        currentScenario = null;
        elements.logMessageArea.innerHTML = '';
        elements.summaryContent.textContent = 'デモモード開始 - シナリオを選択してください';
        elements.alertPanel.style.display = 'none';
        elements.sharedInfoPanel.style.display = 'none';
        elements.alertContent.innerHTML = '';
        elements.sharedInfoContent.innerHTML = '';
        
        // シナリオボタンからアクティブクラスを削除
        elements.scenarioButtons.forEach(btn => btn.classList.remove('active'));
    } else {
        elements.scenarioSelector.style.display = 'none';
        stopScenarioPlayback();
        
        // デモモード終了時のクリーンアップ
        currentScenario = null;
        elements.logMessageArea.innerHTML = '';
        elements.summaryContent.textContent = 'デモモード終了';
        elements.alertPanel.style.display = 'none';
        elements.sharedInfoPanel.style.display = 'none';
        elements.alertContent.innerHTML = '';
        elements.sharedInfoContent.innerHTML = '';
        
        // シナリオボタンからアクティブクラスを削除
        elements.scenarioButtons.forEach(btn => btn.classList.remove('active'));
    }
}

// シナリオ再生停止
function stopScenarioPlayback() {
    if (window.scenarioIntervals) {
        Object.values(window.scenarioIntervals).forEach(interval => {
            if (interval) {
                clearInterval(interval);
            }
        });
        window.scenarioIntervals = null;
    }
    
    // オペレーター進行状況を非表示
    hideOperatorProgress();
    
    console.log('シナリオ再生停止');
}

// 通話ログメッセージ追加
function addCallLogMessage(message) {
    const messageEntry = document.createElement('div');
    messageEntry.classList.add('message-entry');
    messageEntry.classList.add(message.speaker === '顧客' ? 'customer' : 'operator');
    
    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.textContent = message.timestamp;
    
    const speaker = document.createElement('span');
    speaker.classList.add('speaker-label');
    speaker.textContent = message.speaker + ': ';
    
    const text = document.createElement('span');
    text.classList.add('message-text');
    text.textContent = message.text;
    
    messageEntry.appendChild(timestamp);
    messageEntry.appendChild(speaker);
    messageEntry.appendChild(text);
    
    elements.logMessageArea.appendChild(messageEntry);
    
    // アニメーション
    setTimeout(() => {
        messageEntry.classList.add('show');
    }, 10);
    
    // 自動スクロール
    elements.logMessageArea.scrollTop = elements.logMessageArea.scrollHeight;
    
    // キーワードトリガーチェック
    if (message.speaker === '顧客') {
        const triggeredKeyword = checkKeywordTrigger(message.text);
        if (triggeredKeyword) {
            setTimeout(() => {
                addChatMessage('bot', triggeredKeyword.bot_prompt, message.timestamp);
            }, 1000);
        }
    }
}

// 要約更新
function updateSummary(summary) {
    elements.summaryContent.textContent = summary;
    elements.summaryWindow.classList.add('highlight');
    
    setTimeout(() => {
        elements.summaryWindow.classList.remove('highlight');
    }, 3000);
}

// 初期通話ログ表示
function addInitialCallLog() {
    const initialMessages = [
        { timestamp: "14:00:01", speaker: "顧客", text: "もしもし、電気が止まってしまったんですが…" },
        { timestamp: "14:00:05", speaker: "オペレーター", text: "申し訳ありません。契約番号をお願いします。" },
        { timestamp: "14:00:12", speaker: "顧客", text: "CTR-09-1234-5678です。" },
        { timestamp: "14:00:15", speaker: "オペレーター", text: "未収¥15,430、最終入金2025/05/20です。" }
    ];
    
    initialMessages.forEach(message => {
        addCallLogMessage(message);
    });
}

// 時間スロット選択
function selectTimeSlot(selectedButton) {
    // すべてのスロットボタンからアクティブクラスを削除
    elements.slotButtons.forEach(btn => btn.classList.remove('active'));
    
    // 選択されたボタンにアクティブクラスを追加
    selectedButton.classList.add('active');
    
    // 予約結果を更新
    const selectedTime = selectedButton.dataset.time;
    updateReservationResult(selectedTime);
}

// 予約結果更新
function updateReservationResult(selectedTime) {
    const resultCard = document.querySelector('.result-card');
    if (resultCard) {
        const details = resultCard.querySelector('.result-details');
        if (details) {
            const timeElement = details.querySelector('p:nth-child(2)');
            if (timeElement) {
                timeElement.innerHTML = `<strong>予約日時:</strong> 2025年8月12日 ${selectedTime}`;
            }
        }
    }
}

// ユーティリティ関数
function formatTime(date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('JavaScriptエラー:', event.error);
});

// パフォーマンス監視
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`ページ読み込み時間: ${loadTime}ms`);
    });
}

// アクセシビリティ対応
document.addEventListener('keydown', (e) => {
    // ESCキーでモーダルを閉じる
    if (e.key === 'Escape' && elements.faqModal.style.display === 'block') {
        closeFaqModal();
    }
    
    // Tabキーでフォーカス管理
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// レスポンシブ対応
window.addEventListener('resize', debounce(() => {
    // 画面サイズ変更時の処理
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // モバイル用の調整
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}, 250));

// 初期化完了メッセージ
console.log('AIエージェントUI JavaScript初期化完了');