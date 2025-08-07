document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to the clicked button and its corresponding content
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Chatbot functionality
    const messageArea = document.querySelector('.message-area');
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-button');

    const conversationLog = [
        { "timestamp":"14:00:01","speaker":"顧客","text":"もしもし、電気が止まってしまったんですが…" },
        { "timestamp":"14:00:05","speaker":"オペレーター","text":"申し訳ありません。契約番号をお願いします。" },
        { "timestamp":"14:00:12","speaker":"顧客","text":"CTR-09-1234-5678です。" },
        { "timestamp":"14:00:15","speaker":"オペレーター","text":"未収¥15,430、最終入金2025/05/20です。" },
        { "timestamp":"14:00:30","speaker":"オペレーター","text":"再点候補は08/12 09:00,13:00,15:30です。いかがですか？" },
        { "timestamp":"14:00:45","speaker":"顧客","text":"13:00でお願いします。" }
    ];

    let messageIndex = 0;

    function addMessage(speaker, text, timestamp) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.classList.add(speaker === '顧客' ? 'user' : 'bot');
        messageBubble.textContent = text;

        const messageTimestamp = document.createElement('div');
        messageTimestamp.classList.add('message-timestamp');
        messageTimestamp.textContent = timestamp;

        messageArea.appendChild(messageBubble);
        messageArea.appendChild(messageTimestamp);
        messageArea.scrollTop = messageArea.scrollHeight; // Scroll to bottom
    }

    function simulateConversation() {
        if (messageIndex < conversationLog.length) {
            const msg = conversationLog[messageIndex];
            addMessage(msg.speaker, msg.text, msg.timestamp);
            messageIndex++;
            setTimeout(simulateConversation, 1000); // 1 second delay
        }
    }

    simulateConversation();

    const chatResponses = {
        "再点申込の手順を教えて": "1. 契約番号入力 → 2. 未収確認 → 3. 再点日選択 → 4. 予約実行",
        "今回の請求額はいくら？": "2025年7月分は¥7,980（支払期限：08/20）",
        "プラン変更後の試算を比較して": "レギュラー: ¥9,200/月(+¥1,220)、デイタイム: ¥10,500/月(+¥2,520)",
        "ハラスメント検知機能とは？": "通話中にパワハラワード検出→即アラート＆管理者通知",
        "廃止手続きPDFを取れる？": "[ダウンロード](https://chatgpt.com/reports/termination/CTR-09-1234-5678.pdf)"
    };

    sendButton.addEventListener('click', () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            const now = new Date();
            const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            addMessage('user', userMessage, timestamp);
            chatInput.value = '';

            // Simulate bot response
            setTimeout(() => {
                const botResponse = chatResponses[userMessage] || "申し訳ありません、その質問にはお答えできません。";
                addMessage('bot', botResponse, timestamp);
            }, 500);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});