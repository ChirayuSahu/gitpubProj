// --- SOCKET SERVER SETUP ---
const { Server } = require("socket.io");
const http = require("http");
const fetch = require("node-fetch");
require("dotenv").config();

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const queue = {
  byte: [],
  kilo: [],
  mega: [],
  giga: [],
  tera: [],
};

function getQueueKeyFromLeague(leagueName) {
  const map = {
    Byte: "byte",
    Kilobyte: "kilo",
    Megabyte: "mega",
    Gigabyte: "giga",
    Terabyte: "tera",
  };
  return map[leagueName] || "byte";
}

const roomState = {};

// --- MATCHMAKING LOGIC ---
io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("findMatch", ({ username, league }) => {
    const queueKey = getQueueKeyFromLeague(league);
    queue[queueKey].push({ socket, username });

    if (queue[queueKey].length >= 2) {
      const p1 = queue[queueKey].shift();
      const p2 = queue[queueKey].shift();

      const roomId = `room_${Date.now()}`;
      p1.socket.join(roomId);
      p2.socket.join(roomId);

      roomState[roomId] = {
        [p1.socket.id]: { username: p1.username, code: "" },
        [p2.socket.id]: { username: p2.username, code: "" },
      };

      p1.socket.emit("matchFound", { roomId, opponent: p2.username });
      p2.socket.emit("matchFound", { roomId, opponent: p1.username });

      console.log(`Match created in room : ${roomId}`);
    }
  });

  socket.on("joinRoom", ({ roomId, username }) => {
    if (!roomState[roomId]) {
      roomState[roomId] = {};
    }
    roomState[roomId][socket.id] = {
      username,
      code: "",
    };
    socket.join(roomId);
    console.log(`👤 ${username} joined ${roomId}`);
  });

  socket.on("updateCode", ({ roomId, code }) => {
    if (roomState[roomId] && roomState[roomId][socket.id]) {
      roomState[roomId][socket.id].code = code;
    }
  });

  // --- SABOTAGE HANDLER ---
  async function handleSabotage(roomId, targetId, code, level, isManual = false) {
    const lines = code.split("\n");
    const mutatedLines = [];
    const failedLines = [];

    for (let i = 0; i < lines.length; i++) {
      if (i % 2 === 0) {
        try {
          const res = await fetch("http://localhost:8000/generate-chaos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: lines[i] }),
          });
          const data = await res.json();
          if (data?.completion && data.completion !== lines[i]) {
            mutatedLines[i] = data.completion;
          } else {
            failedLines.push({ index: i, content: lines[i] });
            mutatedLines[i] = lines[i];
          }
        } catch {
          failedLines.push({ index: i, content: lines[i] });
          mutatedLines[i] = lines[i];
        }
      } else {
        mutatedLines[i] = lines[i];
      }
    }

    let finalCode = "";

    if (failedLines.length > lines.length / 2) {
      const prompt = `
You will be given a block of Python code and a sabotage LEVEL from 1 to 5.

Perform these actions:

1. MUTATE the code based on LEVEL:
- Level 1 (Byte): Off-by-one errors, subtle string changes, etc.
- Level 2 (Kilobyte): Rename variables, change conditionals.
- Level 3 (Megabyte): Alter loop bounds or function behavior.
- Level 4 (Gigabyte): Modify logic, unreachable branches.
- Level 5 (Terabyte): Combine chaos without making the code obvious.

2. DO NOT ADD NEW LINES.
Only mutate the existing lines in-place.
Each line in the output should correspond to a line from the input.

3. DO NOT remove lines unless you’re replacing them with something chaotic.
Maintain the original structure and number of lines.

4. At the end, optionally add 1–2 sarcastic Python comment lines.

5. DO NOT explain anything. Only return mutated Python code.

LEVEL: ${level}

ORIGINAL CODE:
\`\`\`python
${code}
\`\`\`
      `.trim();

      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a chaotic Python saboteur." },
              { role: "user", content: prompt },
            ],
            temperature: 0.9,
          }),
        });
        const gptData = await res.json();
        finalCode = gptData.choices?.[0]?.message?.content?.trim() || code;
      } catch (err) {
        console.error("❌ GPT full chaos fallback failed:", err);
        finalCode = code;
      }
    } else {
      finalCode = mutatedLines.join("\n");

      try {
        const tauntPrompt = `
You are a sarcastic Python code reviewer.
Review this code and return short sarcastic Python comments.
Only return valid Python comments (start with #).
If any print statement is found, change its content to something mocking.
Return only 1–2 high-quality sarcastic comments.

CODE:
\`\`\`python
${finalCode}
\`\`\`
        `.trim();

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: tauntPrompt }],
            temperature: 0.8,
            max_tokens: 50,
          }),
        });

        const gptData = await res.json();
        const taunt = gptData.choices?.[0]?.message?.content?.trim();
        if (taunt) {
          const sanitizedTaunt = taunt
            .split("\n")
            .map((line) => (line.startsWith("#") ? line : `# ${line}`))
            .join("\n");
          finalCode += `\n${sanitizedTaunt}`;
        }
      } catch (err) {
        console.error("❌ GPT sarcasm failed:", err);
      }
    }

    const byOpponent = isManual; // 🔥 Manual sabotage = true
    io.to(targetId).emit("receiveSabotage", { chaos: finalCode, byOpponent });
  }

  // 🔁 AUTOSABOTAGE
  socket.on("autoSabotage", async ({ roomId, level }) => {
    const code = roomState[roomId]?.[socket.id]?.code;
    if (!code) return;
    await handleSabotage(roomId, socket.id, code, level, false);
  });

  // 🎯 MANUAL SABOTAGE
  socket.on("sendSabotage", async ({ roomId, level }) => {
    const players = Object.keys(roomState[roomId] || {});
    const opponentId = players.find((id) => id !== socket.id);
    const code = roomState[roomId]?.[opponentId]?.code;
    if (!opponentId || !code) return;

    console.log("🎯 Manual sabotage triggered by", socket.id, "target:", opponentId);
    await handleSabotage(roomId, opponentId, code, level, true);
  });

  // 🛑 DISCONNECT
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
    for (const roomId in roomState) {
      if (roomState[roomId][socket.id]) {
        delete roomState[roomId][socket.id];
      }
      if (Object.keys(roomState[roomId]).length === 0) {
        delete roomState[roomId];
      }
    }
    for (const queueKey in queue) {
      queue[queueKey] = queue[queueKey].filter((entry) => entry.socket.id !== socket.id);
    }
  });
});

// --- START SERVER ---
server.listen(4000, () => {
  console.log("✅ Socket.IO server running on port 4000");
});