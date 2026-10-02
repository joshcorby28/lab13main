"use client";

import { useEffect, useRef, useState } from "react";

const BARS = 28;
const SRC = "/audio/tallahassee.mp3";

export function TrackOfTheDay({ className = "" }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frameRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: BARS }, () => 0.18),
  );

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.preload = "metadata";
    audio.loop = true;
    audioRef.current = audio;

    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      cancelAnimationFrame(frameRef.current);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
      audio.pause();
      audio.src = "";
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      void ctxRef.current?.close();
      audioRef.current = null;
      ctxRef.current = null;
      analyserRef.current = null;
      sourceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(frameRef.current);
      setLevels(Array.from({ length: BARS }, (_, i) => 0.12 + (i % 5) * 0.02));
      return;
    }

    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const next = Array.from({ length: BARS }, (_, i) => {
        const start = Math.floor((i / BARS) * data.length * 0.55);
        const end = Math.max(start + 1, Math.floor(((i + 1) / BARS) * data.length * 0.55));
        let sum = 0;
        for (let j = start; j < end; j += 1) sum += data[j] ?? 0;
        const avg = sum / (end - start) / 255;
        return 0.12 + avg * 0.88;
      });
      setLevels(next);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [playing]);

  const ensureGraph = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.78;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }
    if (ctxRef.current.state === "suspended") await ctxRef.current.resume();
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    await ensureGraph();
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div data-chrome className={`pointer-events-auto flex flex-col items-center ${className}`}>
      <p className="text-[9px] tracking-[0.2em] uppercase text-white/40">Track of the day</p>
      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => void toggle()}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/25 bg-white/5 text-white transition-colors hover:border-white/45 hover:bg-white/10"
          aria-label={playing ? "Pause track of the day" : "Play track of the day"}
        >
          {playing ? (
            <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden>
              <rect x="2" y="1.5" width="2.5" height="9" fill="currentColor" />
              <rect x="7.5" y="1.5" width="2.5" height="9" fill="currentColor" />
            </svg>
          ) : (
            <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden>
              <path d="M3.2 1.8v8.4l6.6-4.2L3.2 1.8z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="flex h-4 items-end gap-[2px]" aria-hidden>
          {levels.map((level, i) => (
            <span
              key={i}
              className="w-[2px] rounded-full bg-white/70"
              style={{
                height: `${Math.max(14, level * 100)}%`,
                opacity: 0.35 + level * 0.65,
                transition: playing ? "height 60ms linear" : "height 280ms ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
