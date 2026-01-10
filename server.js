const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Statistics
let attackStats = {
    active: false,
    startTime: null,
    totalRequests: 0,
    successRequests: 0,
    failedRequests: 0,
    workers: []
};

// API Endpoints
app.get('/api/stats', (req, res) => {
    res.json(attackStats);
});

app.post('/api/attack/start', (req, res) => {
    const { target, workers, duration, attackType } = req.body;
    
    if (!target) {
        return res.status(400).json({ error: 'Target URL required' });
    }
    
    attackStats = {
        active: true,
        startTime: new Date(),
        totalRequests: 0,
        successRequests: 0,
        failedRequests: 0,
        workers: Array(workers || 10).fill({ status: 'active' }),
        target,
        attackType,
        duration
    };
    
    // Broadcast to WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'ATTACK_STARTED',
                data: attackStats
            }));
        }
    });
    
    res.json({ success: true, message: 'Attack started', stats: attackStats });
});

app.post('/api/attack/stop', (req, res) => {
    attackStats.active = false;
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'ATTACK_STOPPED',
                data: attackStats
            }));
        }
    });
    
    res.json({ success: true, message: 'Attack stopped', stats: attackStats });
});

// WebSocket connection
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    
    ws.send(JSON.stringify({
        type: 'INITIAL_STATS',
        data: attackStats
    }));
    
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Serve static files
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║    DARK AI DDoS ATTACK SERVER        ║
    ║    Port: ${PORT}                           ║
    ║    Mode: ${process.env.NODE_ENV || 'development'}                    ║
    ╚══════════════════════════════════════╝
    `);
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`⚠️  WARNING: For educational purposes only!`);
});