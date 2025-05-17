// --- SOCKET SERVER ---

const { Server } = require("socket.io");
const http = require("http");
const fetch = require("node-fetch");
require("dotenv").config();

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 🏁 Matchmaking queues by league
const queue = {
  byte: [],
  kilo: [],
  mega: [],
  giga: [],
  tera: []
};

function getLeague(rp) {
  if (rp < 200) return "byte";
  if (rp < 500) return "kilo";
  if (rp < 1000) return "mega";
  if (rp < 2000) return "giga";
  return "tera";
}

const roomState = {}; // { roomId: { socketId: { code, username } } }

// 🔥 GPT sarcasm fetch
const gptTaunt = async (code) => {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a sarcastic AI code reviewer. Return one short sarcastic comment as a code comment."
          },
          {
            role: "user",
            content: `Here's the code:\n${code}`
          }
        ],
        max_tokens: 50
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "// GPT taunt failed.";
  } catch (e) {
    console.error("GPT Error:", e);
    return "// GPT taunt failed.";
  }
};

// 🧠 Custom chaos model fetch
const fetchChaosFromModel = async (prompt) => {
  try {
    const res = await fetch("http://localhost:8000/generate-chaos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.completion;
  } catch (err) {
    console.error("Chaos Model Error:", err);
    return "// model failed";
  }
};

// 🎮 Socket Logic
io.on("connection", (socket) => {
  console.log("🔌 Player connected:", socket.id);

  socket.on("findMatch", ({ username, rp }) => {
    const league = getLeague(rp);
    queue[league].push({ socket, username });

    if (queue[league].length >= 2) {
      const p1 = queue[league].shift();
      const p2 = queue[league].shift();

      const roomId = `room_${Date.now()}`;
      p1.socket.join(roomId);
      p2.socket.join(roomId);

      roomState[roomId] = {
        [p1.socket.id]: { username: p1.username, code: "" },
        [p2.socket.id]: { username: p2.username, code: "" }
      };

      p1.socket.emit("matchFound", { roomId, opponent: p2.username });
      p2.socket.emit("matchFound", { roomId, opponent: p1.username });

      console.log(`🛖 Match created in ${roomId}`);
    }
  });

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`👤 ${username} joined ${roomId}`);
  });

  socket.on("updateCode", ({ roomId, code }) => {
    if (roomState[roomId]?.[socket.id]) {
      roomState[roomId][socket.id].code = code;
    }
  });

  // 🔁 Auto chaos
  socket.on("autoSabotage", async ({ roomId, level }) => {
    if (!roomState[roomId]) return;
    const opponentId = Object.keys(roomState[roomId]).find(id => id !== socket.id);
    const opponentCode = roomState[roomId][opponentId]?.code || "";
    const prompt = `Level: ${level}\nCode:\n${opponentCode}`;

    const chaos = await fetchChaosFromModel(prompt);
    const taunt = await gptTaunt(opponentCode);

    const lines = chaos.split("\n");
    const sabotaged = lines.map((line, i) => (i % 2 === 0 ? line : taunt)).join("\n");

    io.to(opponentId).emit("receiveSabotage", { chaos: sabotaged });
  });

  // ⚔️ Manual sabotage
  socket.on("sendSabotage", async ({ roomId, level }) => {
    if (!roomState[roomId]) return;
    const opponentId = Object.keys(roomState[roomId]).find(id => id !== socket.id);
    if (!opponentId) return;

    const opponentCode = roomState[roomId][opponentId]?.code || "";
    const prompt = `Level: ${level}\nCode:\n${opponentCode}`;

    try {
      const chaos = await fetchChaosFromModel(prompt);
      const taunt = await gptTaunt(opponentCode);
      const lines = chaos.split("\n");
      const sabotaged = lines.map((line, i) => (i % 2 === 0 ? line : taunt)).join("\n");

      io.to(opponentId).emit("receiveSabotage", { chaos: sabotaged });
    } catch (err) {
      console.error("❌ Manual sabotage failed:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("✅ Socket.IO server running on port 4000");
});