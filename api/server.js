// 外部モジュールの読み込み
import line from '@line/bot-sdk';
import express from 'express';
import { middleware } from '@line/bot-sdk';
import 'dotenv/config'; // このモジュールで.envから環境変数を設定する

// ファイルの読み込み
import { index } from '../linebot/bot.js';
import { makeTextMessage } from '../utility.js';

//
const PORT = process.env.PORT || 3000;
const app = express();

const client = new line.Client({
    channelAccessToken: process.env.channelAccessToken,
});

// /にアクセスがあった時、Deploy succeededと返す
app.get('/', (req, res) => { res.send('Deploy succeeded'); });

// /webhookにアクセスがあったとき、bot.jsのindexを呼び出す
app.post('/webhook', middleware({
    channelSecret: process.env.channelSecret,
}), index);

app.post('/visitor', (req, res) => {
    // IoTから送られてきたデータを整理して、LINEのテキストとしてPUSHメッセージを送る
    const message = makeTextMessage("訪問者が来ました");
    
    client.pushMessage(process.env.userId, message);
});

app.listen(PORT); // サーバーを起動する
console.log(`Server running at ${PORT}`);