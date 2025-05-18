"use client"

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import io from "socket.io-client";
import { getLeagueByName, getLeagueWindows, getLevelByLeague } from "./pvpRoom.helpers";

const socket = io("http://localhost:4000");

export function usePvpRoomLogic({ roomId, router }: { roomId: string, router: any }) {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Player_Test";
  const leagueName = searchParams.get("league") || "Byte";

  const league = getLeagueByName(leagueName);
  const windows = getLeagueWindows(league.name);
  const level = getLevelByLeague(league.name);

  const [code, setCode] = useState(`# Write your solution here\ndef solve():\n    print("Hello!")`);
  const [output, setOutput] = useState("");
  const [matchTime, setMatchTime] = useState(0);
  const [canSabotage, setCanSabotage] = useState(false);
  const [manualUsed, setManualUsed] = useState(0);
  const [editorLocked, setEditorLocked] = useState(false);
  const [sabotaged, setSabotaged] = useState<"opponent" | "self" | null>(null);
  const [chaosIntervalId, setChaosIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isChaosActive, setIsChaosActive] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runInSandbox = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const codeToRun = `
      try:
        logs = []
        import builtins
        old_print = print
        def print(*args, **kwargs):
            logs.append(" ".join(map(str, args)))
        exec(${JSON.stringify(code)}, globals())
        parent.postMessage({ "type": "sandboxResult", "logs": logs }, "*")
      except Exception as e:
        parent.postMessage({ "type": "sandboxResult", "logs": ["Error: " + str(e)] }, "*")
    `;

    const blob = new Blob([`<script type="text/python">\n${codeToRun}\n</script>`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
  };

  useEffect(() => {
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data?.type === "sandboxResult") {
        setOutput(event.data.logs.join("\n"));
      }
    });
  }, []);

  useEffect(() => {
    socket.emit("joinRoom", { roomId, username });
    console.log(`Joined room: ${roomId}`);
  }, [roomId]);

  useEffect(() => {
    const timer = setInterval(() => setMatchTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (matchTime === windows.chaosStart) {
      const interval = setInterval(() => {
        socket.emit("autoSabotage", { roomId, level });
      }, 25000);
      setChaosIntervalId(interval);
      setIsChaosActive(true);
    }

    if (matchTime === windows.chaosEnd && chaosIntervalId) {
      clearInterval(chaosIntervalId);
      setIsChaosActive(false);
    }

    if (matchTime >= league.time && !editorLocked) {
      handleSubmit();
      setEditorLocked(true);
    }

    const inWindow = windows.sabotageWindows.some(({ start, end }) =>
      matchTime >= start && matchTime <= end && manualUsed < windows.maxSabotageUses
    );
    setCanSabotage(inWindow);
  }, [matchTime]);

  useEffect(() => {
    socket.on('receiveSabotage', ({ chaos, byOpponent }) => {
    console.log('🧨 Sabotage received! Updating code...')
    setCode(chaos)
    setSabotaged(byOpponent ? "opponent" : "self")
    setTimeout(() => setSabotaged(null), 5000)
  });

    return () => {
      socket.off("receiveSabotage");
    };
  }, []);

  useEffect(() => {
    socket.emit("updateCode", { roomId, code });
  }, [code]);

  const handleSabotage = () => {
    if (!canSabotage || manualUsed >= windows.maxSabotageUses) return;
    socket.emit("sendSabotage", { roomId, level });
    setManualUsed(prev => prev + 1);
    setCanSabotage(false);
  };

  const handleSubmit = () => {
    runInSandbox();
    setManualUsed(windows.maxSabotageUses);
    setTimeout(() => router.push(`/pvp/matchExtro/${roomId}`), 3000);
  };

  return {
    username,
    league,
    windows,
    level,
    code,
    setCode,
    output,
    runInSandbox,
    handleSubmit,
    handleSabotage,
    canSabotage,
    matchTime,
    editorLocked,
    sabotaged,
    iframeRef,
  };
}