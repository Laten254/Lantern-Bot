import makeWASocket, { useMultiFileAuthState, DisconnectReason, makeInMemoryStore } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import P from 'pino'
import { exec } from 'child_process'
import { aiChat } from './plugins/aiChat.js'
import { videoDownloader } from './plugins/videoDownloader.js'
import { statusViewer } from './plugins/statusViewer.js'
import { antiDelete } from './plugins/antiDelete.js'
import { fakeActivity } from './plugins/fakeActivity.js'

// Start-up banner
console.clear()
console.log(chalk.cyanBright(`
🚀✨ [Lantern-bot Online]
⚡ Hello Legends! Your AI-powered sidekick is live, loaded, and glowing bright! 💡
🤖 Ready to shine through the chat — QR ✅ | Pairing Code ✅ | Cool Features ✅
`))

// Start bot
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if (qr) qrcode.generate(qr, { small: true })
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) startBot()
        }
    })

    // Incoming messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''

        if (text.startsWith('!ai')) aiChat(sock, msg, text)
        if (text.startsWith('!video')) videoDownloader(sock, msg, text)
        if (text === '!status') statusViewer(sock, msg)
        if (text === '!antidelete on') antiDelete(sock, true)
        if (text === '!antidelete off') antiDelete(sock, false)
        if (text.startsWith('!fake')) fakeActivity(sock, msg, text)
    })
}

startBot()
