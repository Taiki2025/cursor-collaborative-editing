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
    
    // 通話ログ関連
    // transcriptToggle: document.getElementById('transcriptToggle'),
    // transcriptContent: document.getElementById('transcriptContent'),
    logMessageArea: document.getElementById('logMessageArea'),
    summaryWindow: document.getElementById('summaryWindow'),
    summaryContent: document.getElementById('summaryContent'),
    
    // シナリオ選択関連
    scenarioSelector: document.getElementById('scenarioSelector'),
    scenarioButtons: document.querySelectorAll('.scenario-btn'),
    selectedScenario: document.getElementById('selectedScenario'),
    selectedScenarioIcon: document.getElementById('selectedScenarioIcon'),
    selectedScenarioName: document.getElementById('selectedScenarioName'),
    changeScenarioBtn: document.getElementById('changeScenarioBtn'),
    
    // アラート関連
    alertPanel: document.getElementById('alertPanel'),
    alertContent: document.getElementById('alertContent'),
    sharedInfoPanel: document.getElementById('sharedInfoPanel'),
    sharedInfoContent: document.getElementById('sharedInfoContent'),
    

    
    // 再点申込関連
    slotButtons: document.querySelectorAll('.slot-btn'),
    restoreDate: document.getElementById('restoreDate'),
    
    // デモ関連
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
                "bot_prompt": "契約廃止の手続きをご案内します。解約理由をお聞かせください。契約番号も必要です。",
                "options": ["はい", "いいえ"]
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
                    { "speaker": "顧客", "text": "引越し先での電気利用の契約をしたいです。" },
                    { "speaker": "オペレーター", "text": "はい、オペレーターの鈴木が承ります。それではまずご本人様確認をさせていただきます。お名前をフルネームでお答えいただけますでしょうか。" },
                    { "speaker": "顧客", "text": "山田太郎です。" },
                    { "speaker": "オペレーター", "text": "山田太郎さまでございますね。続きまして、ご利用のお電話番号をお願いいたします。" },
                    { "speaker": "顧客", "text": "092-123-4567です。" },
                    { "speaker": "オペレーター", "text": "はい、092-123-4567ですね。最後に、現在電気利用の契約をしているご住所につきましてもお願いいたします。" },
                    { "speaker": "顧客", "text": "福岡県福岡市博多区博多駅前1-1-1です。" },
                    { "speaker": "オペレーター", "text": "はい、福岡県福岡市博多区博多駅前1-1-1ですね。ありがとうございます。" },
                    { "speaker": "オペレーター", "text": "お客様の確認が取れました。本日は引越し先での新規電気利用契約のお申込みとのことですので、こちらで対応させていただきます。まずは新しいご利用場所の住所についてお聞かせ願えますでしょうか。" },
                    { "speaker": "顧客", "text": "はい、福岡県福岡市中央区天神2-2-2です。" },
                    { "speaker": "オペレーター", "text": "福岡県福岡市中央区天神2-2-2ですね。続きまして、ご利用開始の希望日はいつごろになりますでしょうか。" },
                    { "speaker": "顧客", "text": "8/15でお願いしたいです。" },
                    { "speaker": "オペレーター", "text": "8/15で承りました。電気利用の契約プランにつきましては、現在のレギュラープランのままでよろしかったでしょうか。" },
                    { "speaker": "顧客", "text": "大丈夫です。" },
                    { "speaker": "オペレーター", "text": "承知いたしました。それでは、福岡県福岡市中央区天神2-2-2で、8/15よりレギュラープランの開始申込を受付いたしました。" },
                    { "speaker": "顧客", "text": "ありがとうございます。" },
                    { "speaker": "オペレーター", "text": "ちなみに、山田様は引越し前の現在のご住所における契約につきまして、解約の申し込みがまだお済みでないようですが、この電話にて合わせて対応いたしましょうか？" },
                    { "speaker": "顧客", "text": "あ、忘れてたかもしれないですね。じゃあ解約の件も今お願いします。" },
                    { "speaker": "オペレーター", "text": "承知いたしました。それでは廃止の手続きも進めさせていただきます。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:25", "summary": "顧客情報確認完了・新規契約申込受付開始" },
                    { "time": "14:00:30", "summary": "新住所確認・利用開始日調整" },
                    { "time": "14:00:50", "summary": "契約プラン確認・レギュラープラン継続" },
                    { "time": "14:01:00", "summary": "新規契約申込完了：天神2-2-2で8/15より開始" },
                    { "time": "14:01:20", "summary": "元契約廃止手続き開始" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    // Phase 1: 顧客情報の段階的入力（顧客の発言の0.5秒後）
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchName", 
                        "value": "山田太郎", 
                        "delay": 6500
                    },
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchPhone", 
                        "value": "092-123-4567", 
                        "delay": 10500
                    },
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchAddress", 
                        "value": "福岡県福岡市博多区博多駅前1-1-1", 
                        "delay": 14500
                    },
                    
                    // Phase 2: 顧客検索実行
                    { 
                        "type": "CLICK_SEARCH_BUTTON", 
                        "delay": 17000
                    },
                    
                    // Phase 3: 再点タブに切り替え
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "restore-power", 
                        "tabName": "再点",
                        "delay": 18000
                    },
                    
                    // Phase 4: 新住所入力
                    { 
                        "type": "INPUT_DATA", 
                        "field": "newAddress", 
                        "value": "福岡県福岡市中央区天神2-2-2", 
                        "delay": 20500
                    },
                    
                    // Phase 5: 利用開始日入力
                    { 
                        "type": "INPUT_DATA", 
                        "field": "startDate", 
                        "value": "2025-08-15", 
                        "delay": 22500
                    },
                    
                    // Phase 6: 契約プラン確認
                    { 
                        "type": "SELECT_OPTION", 
                        "selector": "#contractPlan", 
                        "value": "regular", 
                        "delay": 28500
                    },
                    
                    // Phase 7: 廃止タブに切り替え
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "termination", 
                        "tabName": "廃止",
                        "delay": 38000
                    }
                ],
                "aiGuidance": [
                    { "trigger": "scenario_start", "message": "シナリオ開始：引越し先での新規電気利用契約申込", "options": [] },
                    { "trigger": "restore_intent", "message": "会話内容より「再点」の意図を検知。\n「再点」のフローに沿って手順を提示してよろしいですか？", "options": [] },
                    { "trigger": "operator_confirm", "message": "まずはお客様照会のため以下の情報を確認してください。\n氏名・電話番号・住所", "options": [] },
                    { "trigger": "customer_verified", "message": "お客様確認完了。続いて「再点」タブにて新住所、利用開始日、プランの変更有無について確認してください。", "options": [] },
                    { "trigger": "restore_complete", "message": "再点の申し込み受付作業完了。", "options": [] },
                    { "trigger": "termination_alert", "message": "**このお客様は元契約の廃止申込がされていません！**\n解約申込もこの電話対応で可能である旨確認してください。", "options": [] },
                    { "trigger": "termination_start", "message": "廃止の手続きを進めます。", "options": [] }
                ]
            },
            {
                "code": "USAGE_CALCULATION",
                "name": "使用量計算～料金計算",
                "icon": "🧮",
                "transcript": [
                    { "speaker": "顧客", "text": "今月の料金計算について詳しく教えてください" },
                    { "speaker": "オペレーター", "text": "承知いたします。料金計算の詳細をご説明いたします。ご本人確認をさせていただきます。お名前をお聞かせください。" },
                    { "speaker": "顧客", "text": "山田太郎です。" },
                    { "speaker": "オペレーター", "text": "お電話番号もお聞かせください。" },
                    { "speaker": "顧客", "text": "092-123-4567です。" },
                    { "speaker": "オペレーター", "text": "お客様情報を検索いたします。スマートメーターから使用量データを収集中です。" },
                    { "speaker": "オペレーター", "text": "7月分の使用量は220kWhでした。前月比で15kWh減少しています。" },
                    { "speaker": "オペレーター", "text": "ナイト・セレクトプランで計算いたします。基本料金¥2,400、従量料金¥5,580です。" },
                    { "speaker": "オペレーター", "text": "異常値チェックも完了し、エラーはありませんでした。" },
                    { "speaker": "オペレーター", "text": "最終的な請求額は¥7,980となります。詳細な内訳をお送りいたします。" }
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
                    // Phase 1: 顧客情報の段階的入力
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchName", 
                        "value": "山田太郎", 
                        "delay": 5000
                    },
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchPhone", 
                        "value": "092-123-4567", 
                        "delay": 9000
                    },
                    
                    // Phase 2: 顧客検索実行
                    { 
                        "type": "CLICK_SEARCH_BUTTON", 
                        "delay": 13000
                    },
                    
                    // Phase 3: 契約・サービスタブで料金プラン確認
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "contract-service", 
                        "tabName": "契約・サービス",
                        "delay": 17000
                    },
                    { 
                        "type": "HIGHLIGHT_FIELD", 
                        "fieldId": "currentPlan", 
                        "duration": 2000,
                        "delay": 18000
                    },
                    
                    // Phase 4: 使用量・料金確認タブに移動
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "usage-billing", 
                        "tabName": "使用量・料金確認",
                        "delay": 22000
                    },
                    
                    // Phase 5: 使用量データ入力（7番目の会話「220kWh」と同時）
                    { 
                        "type": "INPUT_DATA", 
                        "field": "usageInput", 
                        "value": "220", 
                        "delay": 25000
                    },
                    
                    // Phase 6: 料金計算実行（8番目の会話「計算いたします」と同時）
                    { 
                        "type": "CLICK_BUTTON", 
                        "buttonId": "calculateBill", 
                        "delay": 35000
                    },
                    
                    // Phase 7: 請求・支払状況確認タブで結果確認
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "billing-payment", 
                        "tabName": "請求・支払状況",
                        "delay": 50000
                    },
                    { 
                        "type": "HIGHLIGHT_FIELD", 
                        "fieldId": "currentBill", 
                        "duration": 2000,
                        "delay": 51000
                    }
                ]
            },
            {
                "code": "BILLING_MANAGEMENT",
                "name": "請求・未収管理",
                "icon": "💰",
                "transcript": [
                    { "speaker": "顧客", "text": "すみません！電気が止まってしまったのですが、停電でしょうか？" },
                    { "speaker": "オペレーター", "text": "はい、オペレーターの鈴木が承ります。ご不便をおかけしてしまい申し訳ございません。ご本人様確認をさせていただきます。お名前をフルネームでお答えいただけますでしょうか。" },
                    { "speaker": "顧客", "text": "山田太郎です。" },
                    { "speaker": "オペレーター", "text": "山田太郎さまでございますね。続きまして、ご利用のお電話番号をお願いいたします。" },
                    { "speaker": "顧客", "text": "092-123-4567です。" },
                    { "speaker": "オペレーター", "text": "はい、092-123-4567ですね。最後に、現在電気利用の契約をしているご住所につきましてもお願いいたします。" },
                    { "speaker": "顧客", "text": "福岡県福岡市博多区博多駅前1-1-1です。" },
                    { "speaker": "オペレーター", "text": "はい、福岡県福岡市博多区博多駅前1-1-1ですね。ありがとうございます。" },
                    { "speaker": "オペレーター", "text": "お客様の確認が取れました。電気供給が止まっているとのことですので、原因を確認させていただきます。" },
                    { "speaker": "顧客", "text": "はい、お願いします。" },
                    { "speaker": "オペレーター", "text": "現在のところ、お住いのエリアにおける停電発生の報告はございません。山田さまのお支払い状況も確認させていただきます。" },
                    { "speaker": "顧客", "text": "お願いします。" },
                    { "speaker": "オペレーター", "text": "2025年7月分につきまして、お支払いの確認が取れていないものがございます。今回の供給停止につきましてはこちらが原因と想定されます。" },
                    { "speaker": "顧客", "text": "あ、すみません。払い忘れがあったんですね。" },
                    { "speaker": "オペレーター", "text": "お手元に払込票か督促状はございますでしょうか？そちらでの払い込みが確認でき次第の復旧となります。" },
                    { "speaker": "顧客", "text": "督促状がポストに入ってました。2025年7月分ですね。こちらを払えばいいんでしょうか。" },
                    { "speaker": "オペレーター", "text": "はい、15,430円のお支払いになります。" },
                    { "speaker": "顧客", "text": "今から払うんですが、どの程度で復旧されますか？" },
                    { "speaker": "オペレーター", "text": "お支払いの確認が取れ次第、復旧作業に移らせていただきます。特別な工事等は発生しないため、確認後30分以内には対応させていただきます。" }
                ],
                "summaryUpdates": [
                    { "time": "14:00:17", "summary": "顧客情報確認完了・停電原因調査開始" },
                    { "time": "14:00:23", "summary": "エリア停電なし・支払状況確認中" },
                    { "time": "14:00:27", "summary": "未収金検出：2025年7月分¥15,430" },
                    { "time": "14:00:35", "summary": "支払用紙確認・復旧手順案内完了" }
                ],
                "alerts": [],
                "sharedInfo": [],
                "operatorActions": [
                    // Phase 1: 顧客情報の段階的入力（顧客の発言の0.5秒後）
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchName", 
                        "value": "山田太郎", 
                        "delay": 6500
                    },
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchPhone", 
                        "value": "092-123-4567", 
                        "delay": 10500
                    },
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchAddress", 
                        "value": "福岡県福岡市博多区博多駅前1-1-1", 
                        "delay": 14500
                    },
                    
                    // Phase 2: 顧客検索実行
                    { 
                        "type": "CLICK_SEARCH_BUTTON", 
                        "delay": 17000
                    },
                    
                    // Phase 3: 請求・支払状況確認タブに切り替え
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "billing-payment", 
                        "tabName": "請求・支払状況",
                        "delay": 21000
                    },
                    
                    // Phase 4: 未収金額領域を強調表示
                    { 
                        "type": "HIGHLIGHT_FIELD", 
                        "fieldId": "unpaidAmount", 
                        "duration": 3000,
                        "delay": 24000
                    }
                ],
                "aiGuidance": [
                    { "trigger": "scenario_start", "message": "シナリオ開始：停電復旧対応", "options": [] },
                    { "trigger": "power_outage_intent", "message": "会話内容より「停電復旧」の意図を検知。\n「停電復旧」のフローに沿って手順を提示してよろしいですか？", "options": [] },
                    { "trigger": "operator_confirm", "message": "まずはお客様照会のため情報を確認してください。\n氏名・電話番号・住所", "options": [] },
                    { "trigger": "customer_verified", "message": "お客様確認完了。続いて供給地点における停電情報は確認できていません。", "options": [] },
                    { "trigger": "check_billing", "message": "請求・支払い状況タブにてお客様の支払状況を確認してください。", "options": [] },
                    { "trigger": "unpaid_found", "message": "未収による停電の可能性についてお客様に連携してください。", "options": [] },
                    { "trigger": "check_payment_slip", "message": "続いて、払込票および督促状が手元にあるかを確認してください。", "options": [] },
                    { "trigger": "payment_slip_confirmed", "message": "払込が確認でき次第の復旧になる旨を連携してください。", "options": [] }
                ]
            },
            {
                "code": "CONTRACT_CHANGE",
                "name": "契約変更",
                "icon": "🔄",
                "transcript": [
                    { "speaker": "顧客", "text": "契約内容を変更したいのですが" },
                    { "speaker": "オペレーター", "text": "承知いたします。契約変更のご相談ですね。ご本人確認をさせていただきます。お名前をお聞かせください。" },
                    { "speaker": "顧客", "text": "山田太郎です。" },
                    { "speaker": "オペレーター", "text": "お電話番号もお聞かせください。" },
                    { "speaker": "顧客", "text": "092-123-4567です。プランとアンペア数を変更したいです。" },
                    { "speaker": "オペレーター", "text": "お客様情報を検索いたします。変更可否と影響範囲を審査いたします。" },
                    { "speaker": "オペレーター", "text": "レギュラープラン50Aへの変更で、月額¥1,420の増額になります。" },
                    { "speaker": "顧客", "text": "はい、お願いします。" },
                    { "speaker": "オペレーター", "text": "システム上の契約情報を更新します。" },
                    { "speaker": "オペレーター", "text": "新料金計算設定完了。変更完了通知を送付いたします。" }
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
                    // Phase 1: 顧客情報の段階的入力
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchName", 
                        "value": "山田太郎", 
                        "delay": 5000
                    },
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchPhone", 
                        "value": "092-123-4567", 
                        "delay": 9000
                    },
                    
                    // Phase 2: 顧客検索実行
                    { 
                        "type": "CLICK_SEARCH_BUTTON", 
                        "delay": 13000
                    },
                    
                    // Phase 3: 契約・サービスタブで現在の契約確認
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "contract-service", 
                        "tabName": "契約・サービス",
                        "delay": 17000
                    },
                    { 
                        "type": "HIGHLIGHT_FIELD", 
                        "fieldId": "currentPlan", 
                        "duration": 2000,
                        "delay": 20000
                    },
                    
                    // Phase 4: 契約変更タブに移動
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "change-plan", 
                        "tabName": "契約変更",
                        "delay": 25000
                    },
                    
                    // Phase 5: 新プラン選択（7番目の会話「レギュラープラン50A」と同時）
                    { 
                        "type": "SELECT_OPTION", 
                        "selector": "#newPlan", 
                        "value": "regular", 
                        "delay": 30000
                    },
                    { 
                        "type": "HIGHLIGHT_FIELD", 
                        "fieldId": "planComparison", 
                        "duration": 2000,
                        "delay": 32000
                    },
                    
                    // Phase 6: 契約変更実行（9番目の会話「システム上の契約情報を更新」と同時）
                    { 
                        "type": "CLICK_BUTTON", 
                        "buttonId": "confirmPlanChange", 
                        "delay": 45000
                    }
                ]
            },
            {
                "code": "CONTRACT_TERMINATION",
                "name": "契約廃止",
                "icon": "🚪",
                "transcript": [
                    { "speaker": "顧客", "text": "契約を完全に終了したいのですが" },
                    { "speaker": "オペレーター", "text": "解約のお申出ですね。ご本人確認をさせていただきます。お名前をお聞かせください。" },
                    { "speaker": "顧客", "text": "山田太郎です。" },
                    { "speaker": "オペレーター", "text": "お電話番号もお聞かせください。" },
                    { "speaker": "顧客", "text": "092-123-4567です。" },
                    { "speaker": "オペレーター", "text": "お客様情報を検索いたします。解約条件を確認いたします。" },
                    { "speaker": "オペレーター", "text": "確認いたしました。最低利用期間と違約金はございません。" },
                    { "speaker": "顧客", "text": "7月31日で終了でお願いします。" },
                    { "speaker": "オペレーター", "text": "承知いたします。最終請求の精算と解約手続きを進めます。" },
                    { "speaker": "オペレーター", "text": "解約手続き完了いたします。解約証明書を送付いたします。" }
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
                    // Phase 1: 顧客情報の段階的入力
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchName", 
                        "value": "山田太郎", 
                        "delay": 5000
                    },
                    { 
                        "type": "INPUT_SEARCH_FIELD", 
                        "field": "searchPhone", 
                        "value": "092-123-4567", 
                        "delay": 9000
                    },
                    
                    // Phase 2: 顧客検索実行
                    { 
                        "type": "CLICK_SEARCH_BUTTON", 
                        "delay": 13000
                    },
                    
                    // Phase 3: 契約・サービスタブで契約状況確認
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "contract-service", 
                        "tabName": "契約・サービス",
                        "delay": 17000
                    },
                    { 
                        "type": "HIGHLIGHT_FIELD", 
                        "fieldId": "contractStatus", 
                        "duration": 2000,
                        "delay": 18000
                    },
                    
                    // Phase 4: 契約廃止タブに移動（6番目の会話「解約条件を確認」と同時）
                    { 
                        "type": "SWITCH_TAB", 
                        "tabId": "termination", 
                        "tabName": "契約廃止",
                        "delay": 25000
                    },
                    
                    // Phase 5: 解約日設定（8番目の会話「7月31日で終了」の後）
                    { 
                        "type": "INPUT_DATA", 
                        "field": "terminationDate", 
                        "value": "2025-07-31", 
                        "delay": 35000
                    },
                    { 
                        "type": "HIGHLIGHT_FIELD", 
                        "fieldId": "finalBill", 
                        "duration": 2000,
                        "delay": 37000
                    },
                    
                    // Phase 6: 解約手続き実行（10番目の会話「解約手続き完了」と同時）
                    { 
                        "type": "CLICK_BUTTON", 
                        "buttonId": "confirmTermination", 
                        "delay": 50000
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
    // elements.sendButton.addEventListener('click', sendChatMessage);
    // elements.chatInput.addEventListener('keypress', (e) => {
    //     if (e.key === 'Enter') {
    //         sendChatMessage();
    //     }
    // });
    
    // 音声入力
    // elements.voiceButton.addEventListener('click', handleVoiceInput);
    

    
    // トランスクリプト切り替え（削除済み要素）
    // elements.transcriptToggle.addEventListener('click', toggleTranscript);
    

    

    
    // シナリオ選択
    elements.scenarioButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectScenario(button.dataset.scenario);
        });
    });
    
    // 業務変更ボタン
    elements.changeScenarioBtn.addEventListener('click', () => {
        showScenarioSelector();
    });
    
    // 再点申込スロット選択
    elements.slotButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectTimeSlot(button);
        });
    });
    

    
    // 顧客検索関連
    elements.searchCustomerBtn.addEventListener('click', handleCustomerSearch);
    elements.clearSearchBtn.addEventListener('click', clearCustomerSearch);
    elements.newSearchBtn.addEventListener('click', showCustomerSearch);
    
    // Enterキーで検索実行
    elements.searchName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCustomerSearch();
    });
    elements.searchPhone.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCustomerSearch();
    });
    elements.searchAddress.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCustomerSearch();
    });

    // 契約申込（再点タブ）
    const applyBtn = document.getElementById('applyContractBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            // 申込結果表示領域を表示
            const resultArea = document.getElementById('applicationResult');
            const resultMessage = document.getElementById('resultMessage');
            const resultAlert = document.getElementById('resultAlert');
            
            // 受け付けた旨のメッセージを表示
            const timestamp = new Date().getTime();
            resultMessage.textContent = `申込を受け付けました。受付番号: APP-${timestamp}`;
            
            // 結果領域を表示
            resultArea.style.display = 'block';
            
            // アラートも表示（前の電気契約の廃止申込を受け付けていない場合）
            resultAlert.textContent = 'こちらのお客様は、前の電気契約の廃止申込を受け付けておりません。契約終了もその場で対応できるかを確認してください！';
            resultAlert.style.display = 'block';
            
            // ボタンを無効化
            applyBtn.disabled = true;
            applyBtn.textContent = '申込済み';
            applyBtn.style.opacity = '0.6';
        });
    }
}

// 初期状態の設定
function setupInitialState() {
    // 顧客検索画面を表示、詳細画面は非表示
    showCustomerSearch();
    

    
    // 初期通話ログをクリア（停電対応の自動設定を防ぐ）
    elements.logMessageArea.innerHTML = '';
    elements.summaryContent.textContent = 'お客様情報の検索をお待ちしています';
    
    // デモモードは初期状態で無効（ユーザーが業務を選択するまで）
    demoMode = false;
    currentScenario = null;
    

    
    // アラートと共有事項をクリア
    elements.alertPanel.style.display = 'none';
    elements.sharedInfoPanel.style.display = 'none';
    elements.alertContent.innerHTML = '';
    elements.sharedInfoContent.innerHTML = '';
}

// シナリオ選択
function selectScenario(scenarioCode) {
    console.log('シナリオ選択:', scenarioCode);
    

    
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
    
    // 業務選択パネルを非表示にして、選択された業務のみを表示
    showSelectedScenario(currentScenario);
    
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
    
    // AIからシナリオ開始の案内を追加（RESTORE_POWERとBILLING_MANAGEMENTシナリオでは不要）
    const now = formatTime(new Date());
    if (currentScenario.code !== 'RESTORE_POWER' && currentScenario.code !== 'BILLING_MANAGEMENT') {
        addChatMessage('bot', `${currentScenario.name}のシナリオを開始します。`, now, {
            type: 'ai_scenario_start',
            scenario: scenarioCode
        });
    }
    
    // AIガイダンスを開始（RESTORE_POWERとBILLING_MANAGEMENTシナリオは専用タイミング）
    console.log('AIガイダンス開始処理:', currentScenario.code, currentScenario.aiGuidance);
    if (currentScenario.aiGuidance && currentScenario.aiGuidance.length > 0) {
        if (currentScenario.code === 'RESTORE_POWER') {
            // RESTORE_POWERシナリオ専用のタイミング設定
            console.log('RESTORE_POWER専用AIガイダンス開始');
            startRestorePowerAIGuidance();
        } else if (currentScenario.code === 'BILLING_MANAGEMENT') {
            // BILLING_MANAGEMENTシナリオ専用のタイミング設定
            startBillingManagementAIGuidance();
        } else {
            setTimeout(() => {
                const firstGuidance = currentScenario.aiGuidance.find(g => g.trigger === 'scenario_start');
                if (firstGuidance) {
                    showAIGuidance(firstGuidance);
                }
            }, 2000);
        }
    } else {
        console.log('AIガイダンスが定義されていません');
    }
    

    
    // シナリオ選択後にデモモードを有効にしてシナリオ再生開始
    demoMode = true;
    setTimeout(() => {
        startScenarioPlayback();
    }, 500);
}

// 選択された業務の表示
function showSelectedScenario(scenario) {
    // 業務選択パネルを非表示
    elements.scenarioSelector.style.display = 'none';
    
    // 選択された業務の表示を更新
    elements.selectedScenarioIcon.textContent = scenario.icon;
    elements.selectedScenarioName.textContent = scenario.name;
    
    // 選択された業務の表示を表示
    elements.selectedScenario.style.display = 'block';
}

// 業務選択パネルの表示
function showScenarioSelector() {
    // 選択された業務の表示を非表示
    elements.selectedScenario.style.display = 'none';
    
    // 業務選択パネルを表示
    elements.scenarioSelector.style.display = 'block';
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
    

    
    // メッセージ表示インターバル
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
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
    let summaryIndex = 0;
    const summaryInterval = setInterval(() => {
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
    let alertIndex = 0;
    const alertInterval = setInterval(() => {
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
    let sharedInfoIndex = 0;
    const sharedInfoInterval = setInterval(() => {
        if (currentScenario.sharedInfo && sharedInfoIndex < currentScenario.sharedInfo.length) {
            const sharedInfo = currentScenario.sharedInfo[sharedInfoIndex];
            console.log('共有事項表示:', sharedInfo);
            showSharedInfo(sharedInfo);
            sharedInfoIndex++;
        } else {
            clearInterval(sharedInfoInterval);
        }
    }, 12000);
    
    // オペレーター動作シミュレーション（delayに基づく個別スケジューリング）
    if (currentScenario.operatorActions) {
        currentScenario.operatorActions.forEach((action, index) => {
            const actionDelay = action.delay || (index * 3000); // delayが指定されていない場合は従来の3秒間隔
            
            setTimeout(() => {
                console.log('オペレーター動作実行:', action);
                executeOperatorAction(action);
            }, actionDelay);
        });
    }
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
    // オペレーター動作の表示を削除（実際の対応では表示されない）
    
    switch (action.type) {
        case 'SWITCH_TAB':
            switchTab(action.tabId);
            break;
        case 'INPUT_DATA':
            inputCustomerData(action.field, action.value);
            break;
        case 'SELECT_OPTION':
            selectOption(action.selector, action.value);
            break;
        case 'CLICK_BUTTON':
            clickButton(action.buttonId);
            break;
        case 'SCROLL_TO':
            scrollToElement(action.elementId);
            break;
        case 'HIGHLIGHT_FIELD':
            highlightField(action.fieldId, action.duration);
            break;
        case 'CUSTOMER_SEARCH':
            performCustomerSearch(action.name, action.phone, action.address);
            break;
        case 'INPUT_SEARCH_FIELD':
            inputSearchField(action.field, action.value);
            break;
        case 'CLICK_SEARCH_BUTTON':
            clickSearchButton();
            break;
    }

    // 操作に応じたAI提案を追加
    maybePushAISuggestionForAction(action);
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
        // 共通のタイピング関数を使用
        typeIntoField(inputElement, value, 100).then(() => {
            // タイピング完了後の処理
            setTimeout(() => {
                inputElement.classList.remove('operator-action-highlight');
            }, 700);
        });
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
function clickButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('button-click-effect');
        setTimeout(() => {
            button.classList.remove('button-click-effect');
            
            // calculateBillボタンの場合は料金計算処理を実行
            if (buttonId === 'calculateBill') {
                executeCalculationProcess();
            } else if (buttonId === 'confirmNewContract') {
                executeNewContractProcess();
            } else {
                button.click();
            }
        }, 200);
    }
}

// 新規契約手続き処理の実行
function executeNewContractProcess() {
    console.log('新規契約手続きを開始します');
    
    // 1. 契約データ作成
    const contractCreateStatus = document.getElementById('contractCreateStatus');
    if (contractCreateStatus) {
        contractCreateStatus.textContent = '処理中...';
        contractCreateStatus.style.color = '#856404';
    }
    
    setTimeout(() => {
        if (contractCreateStatus) {
            contractCreateStatus.textContent = '完了';
            contractCreateStatus.style.color = '#155724';
        }
        
        // 2. 供給地点特定番号発行
        const supplyPointStatus = document.getElementById('supplyPointStatus');
        if (supplyPointStatus) {
            supplyPointStatus.textContent = '処理中...';
            supplyPointStatus.style.color = '#856404';
        }
        
        setTimeout(() => {
            if (supplyPointStatus) {
                supplyPointStatus.textContent = '完了';
                supplyPointStatus.style.color = '#155724';
            }
            
            // 3. スケジュール設定
            const scheduleStatus = document.getElementById('scheduleStatus');
            if (scheduleStatus) {
                scheduleStatus.textContent = '処理中...';
                scheduleStatus.style.color = '#856404';
            }
            
            setTimeout(() => {
                if (scheduleStatus) {
                    scheduleStatus.textContent = '完了';
                    scheduleStatus.style.color = '#155724';
                }
                
                // 4. 結果表示更新
                updateNewContractResult();
            }, 1000);
        }, 1500);
    }, 1000);
}

// 新規契約結果の更新
function updateNewContractResult() {
    const contractResultTitle = document.getElementById('contractResultTitle');
    const newContractId = document.getElementById('newContractId');
    const newSupplyPoint = document.getElementById('newSupplyPoint');
    
    if (contractResultTitle) {
        contractResultTitle.textContent = '✅ 新規契約手続き完了';
    }
    
    if (newContractId) {
        newContractId.textContent = 'CTR-2025-0815-001';
    }
    
    if (newSupplyPoint) {
        newSupplyPoint.textContent = '09-5678-5678-5678-0000-0001';
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
    
    // キーワードトリガーチェック（RESTORE_POWERとBILLING_MANAGEMENTシナリオでは無効化）
    const triggeredKeyword = (currentScenario && (currentScenario.code === 'RESTORE_POWER' || currentScenario.code === 'BILLING_MANAGEMENT')) ? null : checkKeywordTrigger(message);
    
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



// トランスクリプト切り替え（削除済み機能）
// function toggleTranscript() {
//     const isVisible = elements.transcriptContent.style.display !== 'none';
//     elements.transcriptContent.style.display = isVisible ? 'none' : 'block';
//     elements.transcriptToggle.textContent = isVisible ? '▲' : '▼';
// }





// 通話ログメッセージ追加
function addCallLogMessage(message) {
    const messageEntry = document.createElement('div');
    messageEntry.classList.add('message-entry');
    messageEntry.classList.add(message.speaker === '顧客' ? 'customer' : 'operator');
    
    const speaker = document.createElement('span');
    speaker.classList.add('speaker-label');
    speaker.textContent = message.speaker + ': ';
    
    const text = document.createElement('span');
    text.classList.add('message-text');
    text.textContent = message.text;
    
    messageEntry.appendChild(speaker);
    messageEntry.appendChild(text);
    
    elements.logMessageArea.appendChild(messageEntry);
    
    // アニメーション
    setTimeout(() => {
        messageEntry.classList.add('show');
    }, 10);
    
    // 自動スクロール
    elements.logMessageArea.scrollTop = elements.logMessageArea.scrollHeight;
    
    // キーワードトリガーチェック（RESTORE_POWERとBILLING_MANAGEMENTシナリオでは無効化）
    if (message.speaker === '顧客' && (!currentScenario || (currentScenario.code !== 'RESTORE_POWER' && currentScenario.code !== 'BILLING_MANAGEMENT'))) {
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
        { speaker: "顧客", text: "もしもし、電気が止まってしまったんですが…" },
        { speaker: "オペレーター", text: "申し訳ありません。契約番号をお願いします。" },
        { speaker: "顧客", text: "CTR-09-1234-5678です。" },
        { speaker: "オペレーター", text: "未収¥15,430、最終入金2025/05/20です。" }
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
        // RESTORE_POWERシナリオのAIガイダンスは明示的なaiGuidance配列で管理するため、
        // ここでの自動メッセージ生成は無効化
        /*
        if (currentScenario.code === 'RESTORE_POWER') {
            if (action.type === 'SWITCH_TAB' && action.tabId === 'restore-power') {
                // オペレーターの質問
                addChatMessage('user', '再点タブに切り替えました。新規契約の手続きを進めますか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                // AIの回答
                setTimeout(() => {
                    addChatMessage('bot', '✅ 新住所・利用開始日・契約プランの確認を行ってください。レギュラープランの継続で問題ありませんか？', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1000);
            }
            if (action.type === 'INPUT_DATA' && action.field === 'contractPlan') {
                addChatMessage('user', '契約プランをレギュラーに設定しました。次のステップは？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '✅ 新規契約申込が完了しました。元契約の廃止手続きも必要です。廃止タブに切り替えてください。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1200);
            }
            if (action.type === 'SWITCH_TAB' && action.tabId === 'termination') {
                addChatMessage('user', '廃止タブに切り替えました。元契約の解約手続きを進めますか？', now, {
                    type: 'operator_question',
                    linkedTo: 'operator_action',
                    scenario: currentScenario.code,
                    action
                });
                setTimeout(() => {
                    addChatMessage('bot', '🎉 廃止手続きを開始します。元住所の契約解約を進めてください。手続き完了後、顧客への通知を送信します。', now, {
                        type: 'ai_response',
                        linkedTo: 'operator_question',
                        scenario: currentScenario.code,
                        action
                    });
                }, 1000);
            }
        }
        */

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

        // BILLING_MANAGEMENTシナリオのAIガイダンスは明示的なaiGuidance配列で管理するため、
        // ここでの自動メッセージ生成は無効化
        /*
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
        */

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

// 顧客検索機能
function handleCustomerSearch() {
    const name = elements.searchName.value.trim();
    const phone = elements.searchPhone.value.trim();
    const address = elements.searchAddress.value.trim();
    
    // 最低1つの項目が入力されているかチェック
    if (!name && !phone && !address) {
        addChatMessage('bot', '検索条件を入力してください。氏名、電話番号、住所のいずれかを入力してください。', formatTime(new Date()), {
            type: 'ai_error',
            scenario: null
        });
        return;
    }
    
    // 検索実行をチャットに表示（「お客様情報を検索しています...」の表示は不要）
    const searchConditions = [];
    if (name) searchConditions.push(`氏名: ${name}`);
    if (phone) searchConditions.push(`電話番号: ${phone}`);
    if (address) searchConditions.push(`住所: ${address}`);
    
    // 検索条件は表示しない（RESTORE_POWERとBILLING_MANAGEMENTシナリオでは不要）
    if (!currentScenario || (currentScenario.code !== 'RESTORE_POWER' && currentScenario.code !== 'BILLING_MANAGEMENT')) {
        addChatMessage('bot', `検索条件: ${searchConditions.join(', ')}`, formatTime(new Date()), {
            type: 'ai_search',
            scenario: null
        });
    }
    
    // 検索処理をシミュレート
    setTimeout(() => {
        // 顧客情報を表示
        showCustomerInfo(name, phone, address);
        
        // 検索完了メッセージ（RESTORE_POWERとBILLING_MANAGEMENTシナリオでは不要）
        if (!currentScenario || (currentScenario.code !== 'RESTORE_POWER' && currentScenario.code !== 'BILLING_MANAGEMENT')) {
            addChatMessage('bot', 'お客様情報が見つかりました。詳細情報を表示いたします。', formatTime(new Date()), {
                type: 'ai_search_complete',
                scenario: null
            });
        }
        
        // 通話ログに検索アクションを追加
        addCallLogMessage({
            timestamp: formatTime(new Date()),
            speaker: "オペレーター",
            text: `顧客検索実行: ${searchConditions.join(', ')}`
        });
        
        // 要約更新
        elements.summaryContent.textContent = `顧客情報確認完了: ${name || phone || address}`;
    }, 1500);
}

function clearCustomerSearch() {
    elements.searchName.value = '';
    elements.searchPhone.value = '';
    elements.searchAddress.value = '';
    elements.searchName.focus();
}

function showCustomerSearch() {
    // 顧客検索画面を表示、詳細画面を非表示
    elements.customerSearch.style.display = 'block';
    elements.customerInfo.style.display = 'none';
    elements.tabsContainer.style.display = 'none';
    
    // 検索フィールドをクリア
    clearCustomerSearch();
    
    // 請求・支払状況確認タブをアクティブにリセット
            switchTab('restore-power');
}

function showCustomerInfo(searchName, searchPhone, searchAddress) {
    // 顧客情報を更新（実際のシステムでは検索結果から取得）
    const customerData = {
        furigana: searchName ? 'ヤマダ タロウ' : 'タナカ ハナコ',
        fullName: searchName || '田中 花子',
        customerId: 'CUST-2025-0001',
        phone: searchPhone || '092-123-4567',
        email: 'tanaka@example.com',
        address: searchAddress || '福岡県福岡市博多区博多駅前1-1-1',
        supplyId: '09-1234-1234-1234-0000-0000',
        contractType: '電気',
        plan: 'ナイト・セレクト',
        paymentMethod: '口座振替',
        contractPeriod: '4年10か月'
    };
    
    // 表示要素を更新
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
    
    // 画面切り替え
    elements.customerSearch.style.display = 'none';
    elements.customerInfo.style.display = 'block';
    elements.tabsContainer.style.display = 'block';
    
    // タブコンテンツ内の顧客情報も更新
    updateTabCustomerInfo(customerData);
}

function updateTabCustomerInfo(customerData) {
    // 概要タブの顧客情報を更新
    const overviewElements = {
        customerId: document.querySelectorAll('#customerId'),
        customerName: document.querySelectorAll('td:contains("田中 太郎")'),
        customerPhone: document.querySelectorAll('td:contains("092-123-4567")'),
        customerEmail: document.querySelectorAll('td:contains("tanaka@example.com")'),
        customerAddress: document.querySelectorAll('td:contains("福岡県福岡市博多区博多駅前1-1-1")')
    };
    
    // すべてのcustomerIdを更新
    overviewElements.customerId.forEach(el => {
        if (el) el.textContent = customerData.customerId;
    });
}

// オペレーター動作での顧客検索実行（レガシー対応：一括入力）
function performCustomerSearch(name, phone, address) {
    console.log('レガシー顧客検索実行:', { name, phone, address });
    
    // 新しいリアルタイム入力方式では、この関数は使用されない
    // 既存のシナリオとの互換性のために残している
    
    // タイピングアニメーション付きで順次入力
    const typingPromises = [];
    
    if (name) {
        typingPromises.push(typeIntoField(elements.searchName, name, 100));
    }
    
    if (phone) {
        typingPromises.push(
            new Promise(resolve => {
                setTimeout(() => {
                    typeIntoField(elements.searchPhone, phone, 100).then(resolve);
                }, name ? 500 : 0); // 名前入力後0.5秒待機
            })
        );
    }
    
    if (address) {
        typingPromises.push(
            new Promise(resolve => {
                setTimeout(() => {
                    typeIntoField(elements.searchAddress, address, 100).then(resolve);
                }, (name ? 500 : 0) + (phone ? 500 : 0)); // 前の入力完了後0.5秒待機
            })
        );
    }
    
    // 全ての入力完了後に検索実行
    Promise.all(typingPromises).then(() => {
        setTimeout(() => {
            // 検索ボタンをハイライト
            elements.searchCustomerBtn.classList.add('button-click-effect');
            
            setTimeout(() => {
                // 検索実行
                handleCustomerSearch();
                
                // ハイライト解除
                setTimeout(() => {
                    elements.searchName.classList.remove('operator-action-highlight');
                    elements.searchPhone.classList.remove('operator-action-highlight');
                    elements.searchAddress.classList.remove('operator-action-highlight');
                    elements.searchCustomerBtn.classList.remove('button-click-effect');
                }, 1000);
            }, 500);
        }, 500); // 全入力完了後0.5秒待機
    });
}

// 検索フィールドへの個別入力（リアルタイム）
function inputSearchField(fieldId, value) {
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        // タイピングアニメーション実行
        typeIntoField(inputElement, value, 120).then(() => {
            // タイピング完了後の処理
            setTimeout(() => {
                inputElement.classList.remove('operator-action-highlight');
            }, 700);
        });
        
        console.log(`検索フィールド入力: ${fieldId} = ${value}`);
    }
}

// 検索ボタンクリック
function clickSearchButton() {
    if (elements.searchCustomerBtn) {
        // ボタンをハイライト
        elements.searchCustomerBtn.classList.add('button-click-effect');
        
        setTimeout(() => {
            // 検索実行
            handleCustomerSearch();
            
            // ハイライト解除
            setTimeout(() => {
                elements.searchCustomerBtn.classList.remove('button-click-effect');
            }, 1000);
        }, 500);
        
        console.log('検索ボタンクリック実行');
    }
}

// 共通のタイピングアニメーション関数
function typeIntoField(inputElement, value, delay = 100) {
    return new Promise((resolve) => {
        if (!inputElement) {
            resolve();
            return;
        }
        
        // フィールドをハイライト
        inputElement.classList.add('operator-action-highlight');
        inputElement.focus();
        
        // 既存の値をクリア
        inputElement.value = '';
        
        let currentValue = '';
        let charIndex = 0;
        
        const typeInterval = setInterval(() => {
            if (charIndex < value.length) {
                currentValue += value[charIndex];
                inputElement.value = currentValue;
                inputElement.classList.add('typing-animation');
                charIndex++;
                
                // 特定フィールドの関連表示更新
                if (inputElement.id === 'usageInput') {
                    const usageDisplay = document.getElementById('usageDisplay');
                    if (usageDisplay) {
                        usageDisplay.textContent = currentValue;
                    }
                }
            } else {
                clearInterval(typeInterval);
                
                // タイピング完了時の処理
                setTimeout(() => {
                    inputElement.classList.remove('typing-animation');
                    inputElement.blur();
                    resolve();
                }, 300);
            }
        }, delay);
    });
}

// AIガイダンス機能
function showAIGuidance(guidance) {
    // RESTORE_POWERとBILLING_MANAGEMENTシナリオは専用のタイミング制御を使用するため、この関数は使用しない
    if (currentScenario && (currentScenario.code === 'RESTORE_POWER' || currentScenario.code === 'BILLING_MANAGEMENT')) return;
    
    const now = formatTime(new Date());
    
    // ガイダンスメッセージを表示
    addChatMessage('bot', guidance.message, now, {
        type: 'ai_guidance',
        trigger: guidance.trigger,
        scenario: currentScenario ? currentScenario.code : null
    });
    
    // 選択肢ボタンを追加
    if (guidance.options && guidance.options.length > 0) {
        setTimeout(() => {
            addGuidanceOptions(guidance.options, guidance.trigger);
        }, 500);
    } else {
        // オプションがない場合は自動で次のガイダンスに進む
        setTimeout(() => {
            processGuidanceFlow(null, guidance.trigger);
        }, 1000);
    }
}

function addGuidanceOptions(options, trigger) {
    const messageArea = elements.messageArea;
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('guidance-options');
    
    options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('guidance-option-btn');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => {
            handleGuidanceSelection(option, trigger);
            optionsContainer.remove();
        });
        optionsContainer.appendChild(optionButton);
    });
    
    messageArea.appendChild(optionsContainer);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function handleGuidanceSelection(selectedOption, trigger) {
    const now = formatTime(new Date());
    
    // 選択結果をチャットに表示
    addChatMessage('user', `選択: ${selectedOption}`, now, {
        type: 'guidance_selection',
        trigger: trigger,
        scenario: currentScenario ? currentScenario.code : null
    });
    
    // 次のガイダンスステップを実行
    processGuidanceFlow(selectedOption, trigger);
}

function processGuidanceFlow(selectedOption, trigger) {
    if (!currentScenario || !currentScenario.aiGuidance) return;
    
    // RESTORE_POWERとBILLING_MANAGEMENTシナリオは専用のタイミング制御を使用するため、この関数は使用しない
    if (currentScenario.code === 'RESTORE_POWER' || currentScenario.code === 'BILLING_MANAGEMENT') return;
    
    const now = formatTime(new Date());
    let nextGuidance = null;
    
    switch (trigger) {
        case 'scenario_start':
            // 自動で次のガイダンスに進む（開始ボタンなし）
            nextGuidance = currentScenario.aiGuidance.find(g => g.trigger === 'restore_intent');
            break;
        case 'restore_intent':
            // 自動で「はい」と回答
            addChatMessage('user', 'はい', now, {
                type: 'guidance_selection',
                trigger: trigger,
                scenario: currentScenario ? currentScenario.code : null
            });
            nextGuidance = currentScenario.aiGuidance.find(g => g.trigger === 'operator_confirm');
            break;
        case 'operator_confirm':
            // 自動で次のガイダンスに進む
            nextGuidance = currentScenario.aiGuidance.find(g => g.trigger === 'customer_verified');
            break;
        case 'customer_verified':
            // 自動で次のガイダンスに進む
            nextGuidance = currentScenario.aiGuidance.find(g => g.trigger === 'restore_complete');
            break;
        case 'restore_complete':
            // 自動で次のガイダンスに進む
            nextGuidance = currentScenario.aiGuidance.find(g => g.trigger === 'termination_alert');
            break;
        case 'termination_alert':
            // 自動で「廃止も対応」と回答
            addChatMessage('user', '廃止も対応', now, {
                type: 'guidance_selection',
                trigger: trigger,
                scenario: currentScenario ? currentScenario.code : null
            });
            nextGuidance = currentScenario.aiGuidance.find(g => g.trigger === 'termination_start');
            break;
        case 'termination_start':
            // 自動で「開始」と回答
            addChatMessage('user', '開始', now, {
                type: 'guidance_selection',
                trigger: trigger,
                scenario: currentScenario ? currentScenario.code : null
            });
            addChatMessage('bot', '廃止手続きを開始します。元契約の解約手続きを進めてください。', now, {
                type: 'ai_guidance',
                scenario: currentScenario.code
            });
            return;
    }
    
    if (nextGuidance) {
        setTimeout(() => {
            showAIGuidance(nextGuidance);
        }, 1000);
    }
}

// RESTORE_POWERシナリオ専用のAIガイダンスタイミング制御
function startRestorePowerAIGuidance() {
    if (!currentScenario || currentScenario.code !== 'RESTORE_POWER') return;
    
    const aiGuidanceSchedule = [
        { delay: 0, trigger: 'scenario_start' },          // +0s
        { delay: 5000, trigger: 'restore_intent' },       // +5s
        { delay: 6000, action: 'auto_response', text: 'はい' }, // +6s
        { delay: 7000, trigger: 'operator_confirm' },     // +7s
        { delay: 18000, trigger: 'customer_verified' },   // +18s
        { delay: 31000, trigger: 'restore_complete' },    // +31s
        { delay: 32000, trigger: 'termination_alert' },   // +32s
        { delay: 37000, action: 'auto_response', text: '廃止も対応' }, // +37s
        { delay: 38000, action: 'final_message', text: '廃止の手続きを進めます。' } // +38s
    ];
    
    aiGuidanceSchedule.forEach(schedule => {
        setTimeout(() => {
            if (!demoMode || !currentScenario || currentScenario.code !== 'RESTORE_POWER') return;
            
            if (schedule.action === 'auto_response') {
                // 自動回答を表示
                const now = formatTime(new Date());
                addChatMessage('user', schedule.text, now, {
                    type: 'guidance_selection',
                    trigger: 'auto_response',
                    scenario: currentScenario.code
                });
            } else if (schedule.action === 'final_message') {
                // 最終メッセージを表示
                const now = formatTime(new Date());
                addChatMessage('bot', schedule.text, now, {
                    type: 'ai_guidance',
                    trigger: 'final_message',
                    scenario: currentScenario.code
                });
            } else {
                // AIガイダンスを表示
                const guidance = currentScenario.aiGuidance.find(g => g.trigger === schedule.trigger);
                if (guidance) {
                    showRestorePowerAIGuidance(guidance);
                }
            }
        }, schedule.delay);
    });
}

// RESTORE_POWER専用のAIガイダンス表示（選択肢なし、自動進行のみ）
function showRestorePowerAIGuidance(guidance) {
    const now = formatTime(new Date());
    
    // ガイダンスメッセージを表示（選択肢は表示しない）
    addChatMessage('bot', guidance.message, now, {
        type: 'ai_guidance',
        trigger: guidance.trigger,
        scenario: currentScenario.code
    });
    
    // operator_confirmの場合は手順1を表示
    if (guidance.trigger === 'operator_confirm') {
        setTimeout(() => {
            displayRestorePowerProcedure();
        }, 1000);
    }
    
    // customer_verifiedの場合は手順2に遷移
    if (guidance.trigger === 'customer_verified') {
        setTimeout(() => {
            advanceToNextStep();
        }, 1000);
        // 各種確認のアニメーションを開始（住所所在確認: 成功）
        startVerificationAnimation('verify-address', true);
    }
    
    // restore_completeの場合は手順3に遷移
    if (guidance.trigger === 'restore_complete') {
        setTimeout(() => {
            advanceToNextStep();
        }, 1000);
        // 供給地点番号確認: 成功、アンペア対応確認: 成功（デモ）
        startVerificationAnimation('verify-supplyid', true);
        setTimeout(() => startVerificationAnimation('verify-ampere', true), 300);
    }
    
    // termination_startの場合は手順完了
    if (guidance.trigger === 'termination_start') {
        setTimeout(() => {
            completeProcedure();
        }, 1000);
    }
    
    // termination_startの場合は追加処理は不要（ユーザー仕様では+38sで終了）
}

// 各種確認のアニメーション制御
function startVerificationAnimation(targetId, isSuccess) {
    const container = document.getElementById(targetId);
    if (!container) return;
    const icon = container.querySelector('.verify-icon');
    if (!icon) return;
    // 初期化
    icon.classList.remove('show-success', 'show-failure', 'show-spinner');
    // スピナー表示
    icon.classList.add('show-spinner');
    // 1.5秒後に結果表示
    setTimeout(() => {
        icon.classList.remove('show-spinner');
        icon.classList.add(isSuccess ? 'show-success' : 'show-failure');
        const resultEl = icon.querySelector('.result');
        if (resultEl) {
            resultEl.textContent = isSuccess ? '✓' : '✕';
        }
    }, 1500);
}

// BILLING_MANAGEMENTシナリオ専用のAIガイダンスタイミング制御
function startBillingManagementAIGuidance() {
    if (!currentScenario || currentScenario.code !== 'BILLING_MANAGEMENT') return;
    
    const aiGuidanceSchedule = [
        { delay: 0, trigger: 'scenario_start' },              // +0s
        { delay: 5000, trigger: 'power_outage_intent' },      // +5s
        { delay: 6000, action: 'auto_response', text: 'はい' }, // +6s
        { delay: 7000, trigger: 'operator_confirm' },         // +7s
        { delay: 19000, trigger: 'customer_verified' },       // +19s
        { delay: 21000, trigger: 'check_billing' },           // +21s
        { delay: 24000, action: 'auto_response', text: '未収あり' }, // +24s
        { delay: 25000, trigger: 'unpaid_found' },            // +25s
        { delay: 28000, trigger: 'check_payment_slip' },      // +28s
        { delay: 33000, action: 'auto_response', text: '支払用紙あり' }, // +33s
        { delay: 35000, trigger: 'payment_slip_confirmed' }   // +35s
    ];
    
    aiGuidanceSchedule.forEach(schedule => {
        setTimeout(() => {
            if (!demoMode || !currentScenario || currentScenario.code !== 'BILLING_MANAGEMENT') return;
            
            if (schedule.action === 'auto_response') {
                // 自動回答を表示
                const now = formatTime(new Date());
                addChatMessage('user', schedule.text, now, {
                    type: 'guidance_selection',
                    trigger: 'auto_response',
                    scenario: currentScenario.code
                });
            } else {
                // AIガイダンスを表示
                const guidance = currentScenario.aiGuidance.find(g => g.trigger === schedule.trigger);
                if (guidance) {
                    showBillingManagementAIGuidance(guidance);
                }
            }
        }, schedule.delay);
    });
}

// BILLING_MANAGEMENT専用のAIガイダンス表示（選択肢なし、自動進行のみ）
function showBillingManagementAIGuidance(guidance) {
    const now = formatTime(new Date());
    
    // ガイダンスメッセージを表示（選択肢は表示しない）
    addChatMessage('bot', guidance.message, now, {
        type: 'ai_guidance',
        trigger: guidance.trigger,
        scenario: currentScenario.code
    });
}

// 初期化完了メッセージ
console.log('AIエージェントUI JavaScript初期化完了');

// 手順表示用の関数
function displayRestorePowerProcedure() {
    const procedureContent = document.getElementById('procedureContent');
    if (!procedureContent) return;
    
    const procedure = {
        title: '⚡ 再点申込手順',
        steps: [
            {
                step: '手順1. 本人確認',
                checklist: [
                    'お客様の名前、住所、電話番号を確認する',
                    '各情報を復唱し、お客様情報の検索を行う'
                ]
            },
            {
                step: '手順2. 再点用の情報確認',
                checklist: [
                    '新しく電気を利用する住所を確認する',
                    '電気の利用日を確認する',
                    '契約アンペア・契約プラン数に変更がないか確認する'
                ]
            },
            {
                step: '手順3. 廃止情報の確認',
                checklist: [
                    'お客様に対し、今回の申し込みに関連する情報確認を行う旨を伝える',
                    '廃止の申し込みが入っているかを確認する'
                ]
            }
        ]
    };
    
    window.currentProcedureStep = 0;
    window.totalProcedureSteps = procedure.steps.length;
    
    procedureContent.innerHTML = generateStepHTML(0);
    
    const procedureSection = document.querySelector('.procedure-section');
    if (procedureSection) {
        procedureSection.classList.remove('collapsed');
        const procedureToggle = document.getElementById('procedureToggle');
        if (procedureToggle) {
            procedureToggle.textContent = '▼';
        }
    }
}

function generateStepHTML(stepIndex) {
    const procedure = {
        title: '⚡ 再点申込手順',
        steps: [
            {
                step: '手順1. 本人確認',
                checklist: [
                    'お客様の名前、住所、電話番号を確認する',
                    '各情報を復唱し、お客様情報の検索を行う'
                ]
            },
            {
                step: '手順2. 再点用の情報確認',
                checklist: [
                    '新しく電気を利用する住所を確認する',
                    '電気の利用日を確認する',
                    '契約アンペア・契約プラン数に変更がないか確認する'
                ]
            },
            {
                step: '手順3. 廃止情報の確認',
                checklist: [
                    'お客様に対し、今回の申し込みに関連する情報確認を行う旨を伝える',
                    '廃止の申し込みが入っているかを確認する'
                ]
            }
        ]
    };
    
    const step = procedure.steps[stepIndex];
    
    return `
        <div class="procedure-step">
            <div class="step-header">
                <h4>${procedure.title}</h4>
                <div class="step-navigation">
                    <span class="step-counter">手順 ${stepIndex + 1} / ${procedure.steps.length}. ${step.step.replace(/^手順\d+\.\s*/, '')}</span>
                </div>
            </div>
            
            <div class="step-content">
                <ul class="checklist">
                    ${step.checklist.map(item => `<li><span class="checkmark">☐</span>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="step-status">
                <div class="status-indicator">
                    ${stepIndex === 0 ? '🔄 進行中' : stepIndex < window.totalProcedureSteps - 1 ? '⏳ 待機中' : '⏳ 待機中'}
                </div>
            </div>
        </div>
    `;
}

function advanceToNextStep() {
    if (window.currentProcedureStep < window.totalProcedureSteps - 1) {
        window.currentProcedureStep++;
        const procedureContent = document.getElementById('procedureContent');
        if (procedureContent) {
            procedureContent.innerHTML = generateStepHTML(window.currentProcedureStep);
        }
    }
}

function completeProcedure() {
    const procedureContent = document.getElementById('procedureContent');
    if (procedureContent) {
        procedureContent.innerHTML = `
            <div class="procedure-complete">
                <div class="complete-icon">✅</div>
                <h4>手順完了</h4>
                <p>再点申込の手順が完了しました。</p>
                <button class="step-btn restart-btn" onclick="displayRestorePowerProcedure()">最初からやり直す</button>
            </div>
        `;
    }
}