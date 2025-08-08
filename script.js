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
                "trigger": "再開",
                "bot_prompt": "サービス再開のお申込みですね。契約番号をお願いします。"
            },
            {
                "scenario": "RESTORE_POWER",
                "trigger": "再点",
                "bot_prompt": "再点申込の手続きをご案内します。契約番号をお願いします。"
            },
            {
                "scenario": "RESTORE_POWER",
                "trigger": "利用再開",
                "bot_prompt": "サービス再開のお申込みですね。過去の契約履歴を確認いたします。"
            },
            {
                "scenario": "USAGE_CALCULATION",
                "trigger": "使用量",
                "bot_prompt": "使用量計算について詳しくご説明いたします。契約番号をお願いします。"
            },
            {
                "scenario": "USAGE_CALCULATION",
                "trigger": "料金計算",
                "bot_prompt": "料金計算の詳細をご案内します。契約番号をお願いします。"
            },
            {
                "scenario": "USAGE_CALCULATION",
                "trigger": "計算方法",
                "bot_prompt": "料金の計算方法についてご説明いたします。"
            },
            {
                "scenario": "BILLING_MANAGEMENT",
                "trigger": "請求書",
                "bot_prompt": "請求書の発行状況を確認いたします。契約番号をお願いします。"
            },
            {
                "scenario": "BILLING_MANAGEMENT",
                "trigger": "未収",
                "bot_prompt": "未収金についてのご相談ですね。債権管理状況を確認いたします。"
            },
            {
                "scenario": "BILLING_MANAGEMENT",
                "trigger": "支払い",
                "bot_prompt": "お支払いについてのご相談ですね。入金状況を確認いたします。"
            },
            {
                "scenario": "CONTRACT_CHANGE",
                "trigger": "契約変更",
                "bot_prompt": "契約変更の手続きをご案内します。変更内容をお聞かせください。"
            },
            {
                "scenario": "CONTRACT_CHANGE",
                "trigger": "プラン変更",
                "bot_prompt": "プラン変更のご相談ですね。現在の契約内容と変更希望を確認いたします。"
            },
            {
                "scenario": "CONTRACT_CHANGE",
                "trigger": "住所変更",
                "bot_prompt": "住所変更の手続きをご案内します。契約番号をお願いします。"
            },
            {
                "scenario": "CONTRACT_CHANGE",
                "trigger": "オプション追加",
                "bot_prompt": "オプション追加のご相談ですね。変更可否を審査いたします。"
            },
            {
                "scenario": "CONTRACT_TERMINATION",
                "trigger": "解約",
                "bot_prompt": "契約廃止のお申出ですね。解約条件を確認いたします。"
            },
            {
                "scenario": "CONTRACT_TERMINATION",
                "trigger": "契約廃止",
                "bot_prompt": "契約廃止の手続きをご案内します。解約理由をお聞かせください。"
            },
            {
                "scenario": "CONTRACT_TERMINATION",
                "trigger": "契約終了",
                "bot_prompt": "契約終了のお手続きですね。最終精算についてご案内いたします。"
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
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "以前利用していたサービスを再開したいのですが…" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "再開のお申込みですね。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "過去の契約履歴を確認します。少々お待ちください。" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "未収金額¥15,430がございます。再開には清算が必要です。" },
                    { "timestamp": "14:00:35", "speaker": "顧客", "text": "分割で支払い可能でしょうか？" },
                    { "timestamp": "14:00:40", "speaker": "オペレーター", "text": "はい、3回払いでしたら可能です。再開日程を調整いたします。" },
                    { "timestamp": "14:00:50", "speaker": "オペレーター", "text": "システム上でアクティベーション完了しました。8月12日より利用再開です。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "顧客情報および過去契約履歴の照会開始" },
                    { "time": "14:00:25", "summary": "未収金確認：¥15,430／再開条件を明示" },
                    { "time": "14:00:40", "summary": "分割払い条件で再開可否審査完了" },
                    { "time": "14:00:50", "summary": "サービス再開設定完了：2025/08/12より利用開始" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号フィールドを確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "contract-service", "tabName": "契約・サービス" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "contractStatus", "description": "過去の契約履歴を確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "unpaid-management", "tabName": "未収管理" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "unpaidAmount", "description": "未収金額確認", "duration": 2000 },
                    { "type": "SELECT_OPTION", "selector": "#paymentMethod", "value": "installment", "description": "分割払い条件設定" },
                    { "type": "SWITCH_TAB", "tabId": "restore-power", "tabName": "再点申込" },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmRestore", "description": "サービス再開設定実行" }
                ]
            },
            {
                "code": "USAGE_CALCULATION",
                "name": "使用量計算～料金計算",
                "icon": "🧮",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "今月の料金計算について詳しく教えてください" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "承知いたします。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "利用ログとメーター情報を収集します。少々お待ちください。" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "7月分の使用量は220kWhです。料金プランとのマッチングを行います。" },
                    { "timestamp": "14:00:35", "speaker": "オペレーター", "text": "ナイト・セレクトプラン適用で基本料金¥2,400、従量料金¥5,580です。" },
                    { "timestamp": "14:00:45", "speaker": "オペレーター", "text": "異常値チェック完了、請求データを生成いたします。" },
                    { "timestamp": "14:00:55", "speaker": "オペレーター", "text": "合計¥7,980の請求データが完成しました。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "利用ログ・メーター情報の収集開始" },
                    { "time": "14:00:25", "summary": "使用量220kWh確認、料金プランマッチング実施" },
                    { "time": "14:00:35", "summary": "ナイト・セレクト適用：基本¥2,400＋従量¥5,580" },
                    { "time": "14:00:45", "summary": "課金エラー検知・異常値チェック完了" },
                    { "time": "14:00:55", "summary": "請求データ生成完了：¥7,980" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "contract-service", "tabName": "契約・サービス" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "currentPlan", "description": "料金プランを確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "simulation", "tabName": "料金シミュレーション" },
                    { "type": "INPUT_DATA", "field": "usageInput", "value": "220", "description": "使用量データ入力" },
                    { "type": "CLICK_BUTTON", "buttonId": "calculateBill", "description": "料金計算実行" },
                    { "type": "SWITCH_TAB", "tabId": "billing-history", "tabName": "請求履歴" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "currentBill", "description": "生成された請求データ確認", "duration": 2000 }
                ]
            },
            {
                "code": "BILLING_MANAGEMENT",
                "name": "請求・未収管理",
                "icon": "💰",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "未払いの請求について相談したいのですが" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "承知いたします。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "請求書発行状況を確認します。郵送とWeb請求書を発行済みです。" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "入金確認の結果、¥15,430の未入金がございます。" },
                    { "timestamp": "14:00:35", "speaker": "顧客", "text": "分割での支払いは可能でしょうか？" },
                    { "timestamp": "14:00:40", "speaker": "オペレーター", "text": "はい、3回分割が可能です。催促状の送付を停止いたします。" },
                    { "timestamp": "14:00:50", "speaker": "オペレーター", "text": "分割払い設定完了です。債権管理帳票を更新いたします。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "請求書発行状況確認：郵送・Web請求書発行済み" },
                    { "time": "14:00:25", "summary": "入金確認・差額チェック：未入金¥15,430検出" },
                    { "time": "14:00:40", "summary": "分割払い条件調整、催促状送付停止" },
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
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "billing-history", "tabName": "請求履歴" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "currentBill", "description": "請求書発行状況確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "unpaid-management", "tabName": "未収管理" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "unpaidAmount", "description": "未入金額確認", "duration": 2000 },
                    { "type": "SELECT_OPTION", "selector": "#paymentMethod", "value": "installment", "description": "分割払い設定" },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmPayment", "description": "債権管理帳票更新" }
                ]
            },
            {
                "code": "CONTRACT_CHANGE",
                "name": "契約変更",
                "icon": "🔄",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "契約内容を変更したいのですが" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "承知いたします。変更内容と契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。プランとアンペア数を変更したいです。" },
                    { "timestamp": "14:00:20", "speaker": "オペレーター", "text": "変更可否と影響範囲を審査いたします。少々お待ちください。" },
                    { "timestamp": "14:00:30", "speaker": "オペレーター", "text": "レギュラープラン50Aへの変更で、月額¥1,420の増額になります。" },
                    { "timestamp": "14:00:40", "speaker": "顧客", "text": "はい、お願いします。" },
                    { "timestamp": "14:00:45", "speaker": "オペレーター", "text": "システム上の契約情報を更新します。" },
                    { "timestamp": "14:00:55", "speaker": "オペレーター", "text": "新料金計算設定完了。変更完了通知を送付いたします。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:20", "summary": "変更申込受付：プラン・アンペア変更希望" },
                    { "time": "14:00:30", "summary": "変更可否・影響範囲審査：レギュラー50A、+¥1,420/月" },
                    { "time": "14:00:45", "summary": "システム契約情報更新実行" },
                    { "time": "14:00:55", "summary": "新料金計算設定・変更完了通知送付" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "contract-service", "tabName": "契約・サービス" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "currentPlan", "description": "現在の契約内容確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "change-plan", "tabName": "契約変更" },
                    { "type": "SELECT_OPTION", "selector": "#newPlan", "value": "regular", "description": "新プラン選択" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "planComparison", "description": "変更影響範囲確認", "duration": 2000 },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmPlanChange", "description": "契約情報更新実行" }
                ]
            },
            {
                "code": "CONTRACT_TERMINATION",
                "name": "契約廃止",
                "icon": "🚪",
                "transcript": [
                    { "timestamp": "14:00:01", "speaker": "顧客", "text": "契約を完全に終了したいのですが" },
                    { "timestamp": "14:00:05", "speaker": "オペレーター", "text": "解約のお申出ですね。契約番号をお願いします。" },
                    { "timestamp": "14:00:12", "speaker": "顧客", "text": "CTR-09-1234-5678です。" },
                    { "timestamp": "14:00:15", "speaker": "オペレーター", "text": "解約条件を確認します。最低利用期間と違約金はございません。" },
                    { "timestamp": "14:00:25", "speaker": "オペレーター", "text": "解約日設定およびシステム停止手続きを行います。" },
                    { "timestamp": "14:00:35", "speaker": "顧客", "text": "7月31日で終了でお願いします。" },
                    { "timestamp": "14:00:40", "speaker": "オペレーター", "text": "最終請求の精算と機器返却の手配をいたします。" },
                    { "timestamp": "14:00:50", "speaker": "オペレーター", "text": "解約完了通知と解約証明書を送付いたします。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:15", "summary": "解約申請受付：契約終了希望" },
                    { "time": "14:00:25", "summary": "解約条件確認：最低利用期間・違約金なし" },
                    { "time": "14:00:35", "summary": "解約日設定：2025/07/31" },
                    { "time": "14:00:40", "summary": "最終精算請求・機器返却手配" },
                    { "time": "14:00:50", "summary": "解約完了通知・証明書送付手配" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    { "type": "SWITCH_TAB", "tabId": "overview", "tabName": "顧客概要" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "customerId", "description": "契約番号確認", "duration": 2000 },
                    { "type": "INPUT_DATA", "field": "customerId", "value": "CTR-09-1234-5678" },
                    { "type": "SWITCH_TAB", "tabId": "contract-service", "tabName": "契約・サービス" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "contractStatus", "description": "契約状況確認", "duration": 2000 },
                    { "type": "SWITCH_TAB", "tabId": "termination", "tabName": "契約廃止" },
                    { "type": "SELECT_OPTION", "selector": "#terminationReason", "value": "moving", "description": "廃止理由設定" },
                    { "type": "INPUT_DATA", "field": "terminationDate", "value": "2025-07-31", "description": "解約日設定" },
                    { "type": "HIGHLIGHT_FIELD", "fieldId": "finalBill", "description": "最終精算額確認", "duration": 2000 },
                    { "type": "CLICK_BUTTON", "buttonId": "confirmTermination", "description": "解約手続き実行" }
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
    addChatMessage('bot', 'こんにちは！九州電力のAIアシスタントです。何かお手伝いできることはありますか？', '14:00', {
        type: 'ai_greeting',
        scenario: null
    });
    
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
    
    // デモモード説明をチャットに追加
    setTimeout(() => {
        addChatMessage('bot', 'デモモードを有効にすると、様々なシナリオの通話・操作を再現できます。右上の「デモモード」ボタンをクリックしてお試しください。', '14:00', {
            type: 'ai_instruction',
            scenario: null
        });
    }, 2000);
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
    
    // AIからシナリオ開始の案内を追加
    const now = formatTime(new Date());
    addChatMessage('bot', `${currentScenario.name}のシナリオを開始します。このシナリオでは、通話ログ、オペレーター操作、AI応答が連動して表示されます。`, now, {
        type: 'ai_scenario_start',
        scenario: scenarioCode
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

    // 操作に応じたAI提案を追加
    maybePushAISuggestionForAction(action);
    
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
                
                // usageInputの場合は関連表示も更新
                if (field === 'usageInput') {
                    const usageDisplay = document.getElementById('usageDisplay');
                    if (usageDisplay) {
                        usageDisplay.textContent = currentValue;
                    }
                }
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
            
            // calculateBillボタンの場合は料金計算処理を実行
            if (buttonId === 'calculateBill') {
                executeCalculationProcess();
            } else {
                button.click();
            }
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
    addChatMessage('user', message, time, {
        type: 'operator_chat',
        scenario: currentScenario ? currentScenario.code : undefined
    });
    elements.chatInput.value = '';
    
    // キーワードトリガーチェック
    const triggeredKeyword = checkKeywordTrigger(message);
    
    // ボット応答を生成
    setTimeout(() => {
        const botResponse = generateBotResponse(message, triggeredKeyword);
        addChatMessage('bot', botResponse, time, {
            type: 'ai_response',
            linkedTo: 'operator_chat',
            scenario: currentScenario ? currentScenario.code : undefined
        });
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
function addChatMessage(sender, text, time, meta = {}) {
    // チャット履歴へ保存（タイムライン紐づけ情報付き）
    chatHistory.push({ sender, text, time, meta });

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
                addChatMessage('bot', triggeredKeyword.bot_prompt, message.timestamp, {
                    type: 'ai_response',
                    linkedTo: 'transcript',
                    scenario: currentScenario ? currentScenario.code : undefined,
                    transcriptTimestamp: message.timestamp
                });
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

// 操作内容に基づくオペレーターの質問とAI回答を生成
function maybePushAISuggestionForAction(action) {
    if (!currentScenario) return;
    const now = formatTime(new Date());

    // オペレーターが質問 → AIが回答する自然な流れを演出
    setTimeout(() => {
        if (currentScenario.code === 'RESTORE_POWER') {
            if (action.type === 'SWITCH_TAB' && action.tabId === 'unpaid-management') {
                // オペレーターの質問
                addChatMessage('user', '未収管理タブを確認していますが、支払い条件はどうすればいいですか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                // AIの回答
                setTimeout(() => {
                    addChatMessage('bot', '未収金額¥15,430が3ヶ月分あります。分割払い（3回）を選択することで再開可能です。初回¥5,143をご案内ください。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1000);
            }
            if (action.type === 'SELECT_OPTION' && action.selector === '#paymentMethod' && action.value === 'installment') {
                addChatMessage('user', '分割払いを設定しました。次のステップは？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '✅ 分割払い設定完了です。再点申込タブで最終確認を行い、サービス再開設定を実行してください。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1200);
            }
            if (action.type === 'CLICK_BUTTON' && action.buttonId === 'confirmRestore') {
                addChatMessage('user', '再開設定を実行しました。通知関連はどうしますか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '🎉 再開設定完了です。顧客への通知送信とSLA記録を実施してください。メール・SMSで完了通知が送られます。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1000);
            }
        }

        if (currentScenario.code === 'USAGE_CALCULATION') {
            if (action.type === 'SWITCH_TAB' && action.tabId === 'simulation') {
                addChatMessage('user', '料金シミュレーションタブで使用量を確認中です。220kWhは適正ですか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '220kWhは前月235kWhと比較して適正値です。ナイト・セレクトプランで基本料金¥2,400＋従量料金¥5,580で計算されます。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1100);
            }
            if (action.type === 'CLICK_BUTTON' && action.buttonId === 'calculateBill') {
                addChatMessage('user', '料金計算を実行しました。結果に問題はありませんか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '💰 計算結果は¥7,980です。異常値チェックも完了しており、請求データ生成に問題ありません。監査ログも生成済みです。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1000);
            }
        }

        if (currentScenario.code === 'BILLING_MANAGEMENT') {
            if (action.type === 'HIGHLIGHT_FIELD' && action.fieldId === 'unpaidAmount') {
                addChatMessage('user', '未収金額を確認しています。どのような対応が適切ですか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '⚠️ 未収¥15,430（3ヶ月分）です。分割払い3回での支払いを提案し、催促状送付を停止することをお勧めします。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1200);
            }
            if (action.type === 'CLICK_BUTTON' && action.buttonId === 'confirmPayment') {
                addChatMessage('user', '支払い方法を確認しました。債権管理の更新は完了していますか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '✅ 債権管理帳票の更新が完了しました。催促状送付停止と分割払い設定が適用されています。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1000);
            }
        }

        if (currentScenario.code === 'CONTRACT_CHANGE') {
            if (action.type === 'SWITCH_TAB' && action.tabId === 'change-plan') {
                addChatMessage('user', '契約変更タブで確認中です。レギュラー50Aへの変更影響は？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', 'レギュラー50Aへの変更で月額+¥1,420（年間+¥17,040）となります。アンペア変更工事費¥3,300が別途発生します。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1100);
            }
            if (action.type === 'CLICK_BUTTON' && action.buttonId === 'confirmPlanChange') {
                addChatMessage('user', '契約変更を実行しました。顧客への通知はどうしますか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '🔄 変更完了です。変更後契約書PDFの生成とメール通知を送付してください。適用開始は2025/09/01からです。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1000);
            }
        }

        if (currentScenario.code === 'CONTRACT_TERMINATION') {
            if (action.type === 'SWITCH_TAB' && action.tabId === 'termination') {
                addChatMessage('user', '契約廃止タブを確認中です。解約条件に問題はありませんか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '解約条件を確認しました。最低利用期間・違約金はありません。2025/07/31での解約が可能です。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1200);
            }
            if (action.type === 'CLICK_BUTTON' && action.buttonId === 'confirmTermination') {
                addChatMessage('user', '解約手続きを実行しました。証明書の発行はどうしますか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '🚪 解約手続き完了です。解約証明書PDFを即時発行し、顧客へ送付してください。最終精算書は8/5に送付予定です。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1000);
            }
        }
    }, 1500); // 1.5秒遅延でオペレーターが操作を確認してから質問する流れを演出
}

// シナリオ別にチャット履歴を取得
function getChatHistoryByScenario(code) {
    return chatHistory.filter(entry => (entry.meta && entry.meta.scenario) === code);
}

// チャット履歴の統計情報を取得
function getChatStatistics() {
    const stats = {
        total: chatHistory.length,
        byType: {},
        byScenario: {},
        withTimeline: 0
    };
    
    chatHistory.forEach(entry => {
        // タイプ別統計
        const type = entry.meta?.type || 'unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        
        // シナリオ別統計
        const scenario = entry.meta?.scenario || 'no_scenario';
        stats.byScenario[scenario] = (stats.byScenario[scenario] || 0) + 1;
        
        // タイムライン紐づけ有無
        if (entry.meta?.linkedTo) {
            stats.withTimeline++;
        }
    });
    
    return stats;
}

// デバッグ用：チャット履歴をコンソールに出力
function debugChatHistory() {
    console.log('=== チャット履歴デバッグ ===');
    console.log('総メッセージ数:', chatHistory.length);
    console.log('統計情報:', getChatStatistics());
    console.log('履歴詳細:', chatHistory);
    
    if (currentScenario) {
        console.log('現在のシナリオのチャット:', getChatHistoryByScenario(currentScenario.code));
    }
}

// 料金計算処理の実行
function executeCalculationProcess() {
    console.log('料金計算処理を開始します');
    
    // 1. データ収集状況の更新
    const collectionStatus = document.getElementById('collectionStatus');
    if (collectionStatus) {
        collectionStatus.textContent = '収集中...';
        collectionStatus.style.color = '#856404';
    }
    
    setTimeout(() => {
        if (collectionStatus) {
            collectionStatus.textContent = '収集完了';
            collectionStatus.style.color = '#155724';
        }
        
        // 2. 段階的な計算処理
        executeCalculationSteps();
    }, 1000);
}

// 段階的な計算処理の実行
function executeCalculationSteps() {
    const steps = [
        { id: 'basicFeeStep', statusId: 'basicFeeStatus', delay: 800 },
        { id: 'usageFeeStep', statusId: 'usageFeeStatus', delay: 1000 },
        { id: 'discountStep', statusId: 'discountStatus', delay: 600 },
        { id: 'totalStep', statusId: 'totalStatus', delay: 800 }
    ];
    
    let currentStep = 0;
    
    function processNextStep() {
        if (currentStep >= steps.length) {
            // 全ステップ完了後にエラーチェックを実行
            executeErrorCheck();
            return;
        }
        
        const step = steps[currentStep];
        const stepElement = document.getElementById(step.id);
        const statusElement = document.getElementById(step.statusId);
        
        if (stepElement && statusElement) {
            // 処理中状態
            stepElement.classList.add('processing');
            statusElement.textContent = '計算中...';
            statusElement.classList.add('processing');
            
            setTimeout(() => {
                // 完了状態
                stepElement.classList.remove('processing');
                stepElement.classList.add('completed');
                statusElement.textContent = '完了';
                statusElement.classList.remove('processing');
                statusElement.classList.add('completed');
                
                currentStep++;
                setTimeout(processNextStep, 300);
            }, step.delay);
        } else {
            currentStep++;
            processNextStep();
        }
    }
    
    processNextStep();
}

// エラーチェック処理の実行
function executeErrorCheck() {
    const checks = [
        { id: 'usageCheck', iconId: 'usageCheckIcon', resultId: 'usageCheckResult', delay: 600 },
        { id: 'calculationCheck', iconId: 'calculationCheckIcon', resultId: 'calculationCheckResult', delay: 800 },
        { id: 'planCheck', iconId: 'planCheckIcon', resultId: 'planCheckResult', delay: 500 }
    ];
    
    let currentCheck = 0;
    
    function processNextCheck() {
        if (currentCheck >= checks.length) {
            // 全チェック完了後に請求データ生成を実行
            generateBillingData();
            return;
        }
        
        const check = checks[currentCheck];
        const checkElement = document.getElementById(check.id);
        const iconElement = document.getElementById(check.iconId);
        const resultElement = document.getElementById(check.resultId);
        
        if (checkElement && iconElement && resultElement) {
            // 処理中状態
            checkElement.classList.add('processing');
            iconElement.textContent = '🔄';
            resultElement.textContent = 'チェック中';
            
            setTimeout(() => {
                // 完了状態
                checkElement.classList.remove('processing');
                checkElement.classList.add('completed');
                iconElement.textContent = '✅';
                resultElement.textContent = '正常';
                
                currentCheck++;
                setTimeout(processNextCheck, 200);
            }, check.delay);
        } else {
            currentCheck++;
            processNextCheck();
        }
    }
    
    processNextCheck();
}

// 請求データ生成処理の実行
function generateBillingData() {
    const billingResult = document.getElementById('billingResult');
    const billingResultTitle = document.getElementById('billingResultTitle');
    const generationStatus = document.getElementById('generationStatus');
    const billingId = document.getElementById('billingId');
    const finalBillAmount = document.getElementById('finalBillAmount');
    const auditLog = document.getElementById('auditLog');
    
    if (billingResult && generationStatus) {
        // 生成中状態
        billingResult.classList.add('processing');
        billingResultTitle.textContent = '📄 請求データ生成中...';
        generationStatus.textContent = '生成中...';
        generationStatus.classList.add('processing');
        
        setTimeout(() => {
            // 完了状態
            billingResult.classList.remove('processing');
            billingResult.classList.add('completed');
            billingResultTitle.textContent = '📄 請求データ生成完了';
            generationStatus.textContent = '生成完了';
            generationStatus.classList.remove('processing');
            generationStatus.classList.add('completed');
            
            // データ更新
            if (billingId) billingId.textContent = 'BILL-202507-0001';
            if (finalBillAmount) finalBillAmount.textContent = '¥7,980';
            if (auditLog) auditLog.textContent = '生成済み';
        }, 1500);
    }
}

// グローバルに公開（ブラウザコンソールから利用可能）
window.chatHistory = chatHistory;
window.getChatHistoryByScenario = getChatHistoryByScenario;
window.getChatStatistics = getChatStatistics;
window.debugChatHistory = debugChatHistory;
window.executeCalculationProcess = executeCalculationProcess;

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