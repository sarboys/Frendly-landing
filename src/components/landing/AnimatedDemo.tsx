import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Wine,
  Users,
  MessageCircle,
  MapPin,
  Mic,
  Check,
  AlertTriangle,
  Phone,
  Send,
  Heart,
  Coffee,
  Music,
  Camera,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  Flame,
  X,
  Star,
  Ticket,
  Calendar,
  Plus,
  Image as ImageIcon,
  Clock,
  Globe,
  Lock,
  Moon,
  Search,
} from "lucide-react";
import iconV5 from "@/assets/icon-v5-sage.png";
import eventWine from "@/assets/event-wine.jpg";
import eventBoard from "@/assets/event-boardgames.jpg";
import eventCinema from "@/assets/event-cinema.jpg";
import eventRun from "@/assets/event-run.jpg";
import datingAnya from "@/assets/dating-anya.jpg";
import datingMira from "@/assets/dating-mira.jpg";
import datingLiza from "@/assets/dating-liza.jpg";
import datingSonya from "@/assets/dating-sonya.jpg";
import datingPolina from "@/assets/dating-polina.jpg";

/* ---------- frame ticker (deterministic-ish) ---------- */

function useFrame(playing: boolean, total: number, fps = 30) {
  const [frame, setFrame] = useState(0);
  const ref = useRef<number | null>(null);
  const last = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    const tick = (t: number) => {
      if (!last.current) last.current = t;
      const dt = (t - last.current) / 1000;
      last.current = t;
      setFrame((f) => (f + dt * fps) % total);
      ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
      last.current = 0;
    };
  }, [playing, total, fps]);

  return [frame, setFrame] as const;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const range = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
// ease-out cubic
const eo = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/* ---------- Phone Shell ---------- */

const PhoneShell = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <div className="w-[min(300px,calc(100vw-48px))] aspect-[300/610] rounded-[46px] bg-foreground p-3 phone-shadow-lux mx-auto">
    <div
      className={`relative w-full h-full rounded-[36px] overflow-hidden lux-frame ${
        dark ? "bg-[hsl(var(--ad-bg))]" : "bg-paper"
      }`}
    >
      {dark && <div className="absolute top-0 left-0 right-0 h-9 bg-paper z-10" />}
      {/* Notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-full z-30" />
      {/* Status bar */}
      <div className="absolute top-3 left-6 right-6 flex items-center justify-between text-[10px] font-semibold z-20 text-foreground/70">
        <span className={dark ? "text-foreground" : ""}>21:42</span>
        <span className={dark ? "text-foreground" : ""}>•••</span>
      </div>
      {/* Scene content area: top padding for status bar, bottom padding for home indicator */}
      <div className="absolute inset-0 pt-9 pb-7 overflow-hidden">{children}</div>
      {/* Home indicator */}
      <div
        className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full z-30 ${
          dark ? "bg-[hsl(var(--ad-fg-soft))]" : "bg-foreground/70"
        }`}
      />
    </div>
  </div>
);

/* ============================================================
   SCENE 1 — Tonight feed → join evening
============================================================ */

const SceneTonight = ({ frame }: { frame: number }) => {
  const cards = [
    { img: eventWine, t: "Винный вечер", m: "19:30 · 5/8", color: "primary" },
    { img: eventBoard, t: "Настолки", m: "20:00 · 4/6", color: "secondary" },
    { img: eventCinema, t: "Кинопоказ", m: "21:00 · 7/10", color: "primary" },
  ];
  // 0–30 header, 30–90 cards stagger, 90–130 highlight first card
  // 130–180 join button press, 180–240 success pop
  const headerY = lerp(-20, 0, eo(range(frame, 0, 25)));
  const headerO = eo(range(frame, 0, 25));

  const highlight = range(frame, 90, 110);
  const joinPress = range(frame, 140, 160);
  const successIn = eo(range(frame, 175, 210));
  const successOut = 1 - eo(range(frame, 230, 260));

  return (
    <div className="px-4 pt-2 h-full relative flex flex-col">
      {/* Header — like real Tonight screen */}
      <div
        className="flex items-center justify-between mb-2"
        style={{ transform: `translateY(${headerY}px)`, opacity: headerO }}
      >
        <div>
          <p className="text-[9px] text-ink-mute font-medium flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" /> Чистые пруды
          </p>
          <p className="font-display font-semibold text-[17px] leading-tight">
            Что сегодня вечером?
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-ink-soft" />
          </div>
          <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center relative">
            <img src={iconV5} className="w-4 h-4 rounded-[28%]" alt="" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-card" />
          </div>
        </div>
      </div>

      {/* Day / After Dark segment */}
      <div
        className="flex gap-1 p-0.5 rounded-full bg-card border border-border mb-2.5"
        style={{ opacity: eo(range(frame, 10, 35)) }}
      >
        <div className="flex-1 h-7 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center gap-1">
          <Sparkles className="w-2.5 h-2.5" /> Сегодня
        </div>
        <div className="flex-1 h-7 rounded-full text-ink-soft text-[10px] font-bold flex items-center justify-center gap-1">
          <Music className="w-2.5 h-2.5" /> After Dark
          <Lock className="w-2 h-2" />
        </div>
      </div>

      <div className="space-y-2 flex-1">
        {cards.map((c, i) => {
          const start = 30 + i * 18;
          const o = eo(range(frame, start, start + 30));
          const y = lerp(20, 0, eo(range(frame, start, start + 30)));
          const ring = i === 0 ? highlight : 0;
          return (
            <div
              key={i}
              className="rounded-2xl bg-card border overflow-hidden shadow-soft relative"
              style={{
                opacity: o,
                transform: `translateY(${y}px) scale(${1 + ring * 0.02})`,
                borderColor: `hsl(var(--border))`,
                boxShadow: ring > 0 ? `0 0 0 ${ring * 3}px hsl(var(--primary) / 0.25)` : undefined,
              }}
            >
              <div
                className="h-16 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${c.img})` }}
              >
                <div className="absolute bottom-1.5 left-1.5 flex -space-x-1.5">
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      className="w-4 h-4 rounded-full border-2 border-background"
                      style={{ background: `hsl(${(k * 70 + i * 30) % 360} 60% 70%)` }}
                    />
                  ))}
                </div>
              </div>
              <div className="p-2 flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-[12px]">{c.t}</p>
                  <p className="text-[9px] text-ink-mute mt-0.5">{c.m}</p>
                </div>
                {i === 0 && (
                  <button
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold text-primary-foreground"
                    style={{
                      background: `hsl(var(--primary))`,
                      transform: `scale(${1 - joinPress * 0.1})`,
                    }}
                  >
                    {frame > 180 ? "В деле ✓" : "Я в деле"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Success toast */}
      <div
        className="absolute left-4 right-4 bottom-2"
        style={{
          opacity: successIn * successOut,
          transform: `translateY(${(1 - successIn) * 30}px)`,
        }}
      >
        <div className="bg-foreground text-background rounded-2xl p-3 flex items-center gap-2 shadow-card">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-semibold">Ты в вечере!</p>
            <p className="text-[10px] opacity-70">Чат уже открыт</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SCENE 2 — AI Evening Builder
============================================================ */

const SceneBuilder = ({ frame }: { frame: number }) => {
  const aiMsg = "Соберу вечер на 4 часа. Терпкое вино + виды + поздний ужин?";
  const typed = Math.floor(range(frame, 10, 90) * aiMsg.length);

  const stops = [
    { icon: Wine, t: "Bar Strelka", time: "19:30", sub: "Натуральное вино" },
    { icon: MapPin, t: "Крыша Garage", time: "21:00", sub: "Закат + DJ-сет" },
    { icon: Coffee, t: "Saviv", time: "22:30", sub: "Поздний ужин" },
  ];
  const buildBtn = range(frame, 200, 230);
  const publish = range(frame, 240, 270);

  const moods = ["🍷 Вино", "🌃 Виды", "🎵 Музыка", "🍝 Ужин", "🎲 Игры"];
  const selectedMoods = [0, 1, 3];

  return (
    <div className="px-4 pt-2 h-full flex flex-col">
      {/* Step indicator like real builder */}
      <div className="flex items-center gap-1.5 mb-2">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className="flex-1 h-1 rounded-full"
            style={{
              background:
                s <= 1 ? "hsl(var(--primary))" : "hsl(var(--muted))",
            }}
          />
        ))}
        <span className="text-[9px] text-ink-mute font-bold ml-1">2/4</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <p className="font-display font-semibold text-[13px]">Frendly AI</p>
        <span className="ml-auto text-[10px] text-ink-mute">собирает вечер…</span>
      </div>

      {/* AI bubble */}
      <div className="bg-muted rounded-2xl rounded-tl-sm p-2.5 max-w-[230px] mb-2">
        <p className="text-[11px] leading-snug">
          {aiMsg.slice(0, typed)}
          {typed < aiMsg.length && (
            <span className="inline-block w-1 h-3 bg-foreground ml-0.5 align-middle" />
          )}
        </p>
      </div>

      {/* Mood chips */}
      <div className="flex flex-wrap gap-1 mb-2.5" style={{ opacity: eo(range(frame, 70, 100)) }}>
        {moods.map((m, i) => {
          const sel = selectedMoods.includes(i);
          return (
            <span
              key={m}
              className="px-2 py-0.5 rounded-full text-[9px] font-bold border"
              style={{
                background: sel ? "hsl(var(--primary))" : "hsl(var(--card))",
                color: sel ? "hsl(var(--primary-foreground))" : "hsl(var(--ink-soft))",
                borderColor: sel ? "hsl(var(--primary))" : "hsl(var(--border))",
              }}
            >
              {m}
            </span>
          );
        })}
      </div>

      {/* Route stops appear */}
      <div className="space-y-2 flex-1">
        {stops.map((s, i) => {
          const start = 100 + i * 30;
          const o = eo(range(frame, start, start + 25));
          const x = lerp(-30, 0, eo(range(frame, start, start + 25)));
          return (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-2.5 flex items-center gap-3"
              style={{ opacity: o, transform: `translateX(${x}px)` }}
            >
              <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <s.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold leading-tight">{s.t}</p>
                <p className="text-[10px] text-ink-mute">{s.sub}</p>
              </div>
              <span className="text-[10px] font-bold text-primary">{s.time}</span>
            </div>
          );
        })}
      </div>

      {/* Publish CTA */}
      <button
        className="mt-3 h-10 rounded-2xl font-semibold text-[12px] flex items-center justify-center gap-1.5"
        style={{
          background: `hsl(var(--foreground))`,
          color: `hsl(var(--background))`,
          opacity: eo(range(frame, 195, 225)),
          transform: `scale(${1 - buildBtn * 0.05 + publish * 0.03})`,
        }}
      >
        {publish > 0.5 ? (
          <>
            <Check className="w-3.5 h-3.5" /> Опубликовано
          </>
        ) : (
          <>Опубликовать вечер</>
        )}
      </button>
    </div>
  );
};

/* ============================================================
   SCENE 3 — Live meetup chat
============================================================ */

const SceneChat = ({ frame }: { frame: number }) => {
  const messages = [
    { from: "them", name: "Аня", text: "Я уже на месте 🍷", t: 0 },
    { from: "them", name: "Марк", text: "+10 мин, такси", t: 40 },
    { from: "me", text: "Беру вам столик у окна", t: 80 },
    { from: "them", name: "Лиза", text: "Ура! Несу настолку 🎲", t: 130 },
    { from: "me", text: "🎉", t: 175 },
  ];
  const typingShow = range(frame, 200, 230) * (1 - range(frame, 245, 260));

  return (
    <div className="px-4 pt-2 h-full flex flex-col">
      <div className="flex items-center gap-2 pb-2 border-b border-border mb-2">
        <div className="flex -space-x-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: `hsl(${(i * 70 + 10) % 360} 60% 60%)` }}
            >
              {["А", "М", "Л", "К"][i]}
            </div>
          ))}
        </div>
        <div className="flex-1 ml-1">
          <p className="font-display font-semibold text-[12px] flex items-center gap-1">
            Винный вечер
            <Wine className="w-3 h-3 text-primary" />
          </p>
          <p className="text-[9px] text-online flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" /> 4 онлайн · 19:30 Strelka
          </p>
        </div>
        <MapPin className="w-3.5 h-3.5 text-ink-mute" />
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        {messages.map((m, i) => {
          const o = eo(range(frame, m.t, m.t + 25));
          const y = lerp(15, 0, eo(range(frame, m.t, m.t + 25)));
          if (m.from === "me") {
            return (
              <div
                key={i}
                className="flex justify-end"
                style={{ opacity: o, transform: `translateY(${y}px)` }}
              >
                <div className="bg-bubble-me text-bubble-me-fg rounded-2xl rounded-tr-sm px-3 py-1.5 text-[12px] max-w-[80%]">
                  {m.text}
                </div>
              </div>
            );
          }
          return (
            <div
              key={i}
              className="flex flex-col"
              style={{ opacity: o, transform: `translateY(${y}px)` }}
            >
              <span className="text-[9px] text-ink-mute ml-2 mb-0.5">{m.name}</span>
              <div className="bg-bubble-them text-bubble-them-fg rounded-2xl rounded-tl-sm px-3 py-1.5 text-[12px] max-w-[80%] self-start">
                {m.text}
              </div>
            </div>
          );
        })}

        {/* typing indicator */}
        <div
          className="flex items-center gap-1 ml-2"
          style={{ opacity: typingShow }}
        >
          <span className="text-[9px] text-ink-mute">Аня печатает</span>
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="w-1 h-1 rounded-full bg-ink-mute"
              style={{
                opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame / 8 + d) * 0.6)),
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5">
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-ink-mute">
          <Plus className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 h-7 bg-muted rounded-full px-3 flex items-center justify-between text-[10px] text-ink-mute">
          <span>Сообщение…</span>
          <span className="text-[12px]">😊</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Mic className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SCENE 4 — Safety / SOS
============================================================ */

const SceneSafety = ({ frame }: { frame: number }) => {
  const contacts = [
    { name: "Мама", channel: "SMS", color: "hsl(11 70% 60%)" },
    { name: "Лена (сестра)", channel: "Telegram", color: "hsl(200 80% 55%)" },
    { name: "Костя", channel: "Email", color: "hsl(145 40% 50%)" },
  ];
  const headerO = eo(range(frame, 0, 25));
  const sosPulse = 1 + 0.08 * Math.sin(frame * 0.25);
  const sosPress = range(frame, 110, 130);
  const sheet = eo(range(frame, 140, 175));
  const sentChecks = [range(frame, 200, 220), range(frame, 220, 240), range(frame, 240, 260)];

  return (
    <div className="px-4 pt-2 h-full flex flex-col" style={{ opacity: headerO }}>
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-secondary" />
        <p className="font-display font-semibold text-[13px]">Безопасность</p>
        <span className="ml-auto px-1.5 py-0.5 rounded-full bg-secondary-soft border border-secondary/30 text-[8px] font-bold text-secondary flex items-center gap-0.5">
          <Check className="w-2 h-2" /> Verified
        </span>
      </div>

      {/* Share-location toggle (like real SafetyHub) */}
      <div className="bg-card border border-border rounded-xl p-2 flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-primary-soft text-primary flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold leading-tight">Делиться локацией</p>
          <p className="text-[9px] text-ink-mute">с участниками вечера</p>
        </div>
        <div className="w-8 h-4 rounded-full bg-primary relative">
          <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-background rounded-full shadow" />
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-wider text-ink-mute font-semibold mb-1.5">
        Доверенные контакты
      </p>
      <div className="space-y-1.5 mb-3">
        {contacts.map((c, i) => {
          const o = eo(range(frame, 15 + i * 15, 45 + i * 15));
          return (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-2 flex items-center gap-2"
              style={{ opacity: o, transform: `translateX(${(1 - o) * 20}px)` }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: c.color }}
              >
                {c.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold">{c.name}</p>
                <p className="text-[9px] text-ink-mute">{c.channel}</p>
              </div>
              {sentChecks[i] > 0 && (
                <div
                  className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center"
                  style={{ transform: `scale(${sentChecks[i]})` }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex items-center justify-center">
        <button
          className="relative w-32 h-32 rounded-full flex flex-col items-center justify-center text-white font-display font-bold"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(0 80% 65%), hsl(0 75% 50%))`,
            transform: `scale(${sosPulse * (1 - sosPress * 0.15)})`,
            boxShadow: `0 0 0 ${8 + 8 * Math.sin(frame * 0.25)}px hsl(0 70% 55% / 0.18)`,
          }}
        >
          <AlertTriangle className="w-8 h-8 mb-1" />
          <span className="text-[16px]">SOS</span>
          <span className="text-[8px] opacity-80 mt-0.5">удержи 2 сек</span>
        </button>
      </div>

      {/* Bottom sheet */}
      <div
        className="absolute left-3 right-3 bottom-3 bg-card border border-border rounded-2xl p-3 shadow-card"
        style={{
          opacity: sheet,
          transform: `translateY(${(1 - sheet) * 100}px)`,
        }}
      >
        <p className="text-[11px] font-semibold mb-1.5 flex items-center gap-1">
          <Send className="w-3 h-3 text-primary" /> Рассылка отправлена
        </p>
        <p className="text-[10px] text-ink-mute leading-snug">
          📍 геолокация · 👥 4 участника · 🔗 ссылка на встречу
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   SCENE 5 — Live meetup with route progress
============================================================ */

const SceneLive = ({ frame }: { frame: number }) => {
  const steps = [
    { t: "Bar Strelka", time: "19:30", icon: Wine },
    { t: "Крыша Garage", time: "21:00", icon: Music },
    { t: "Saviv", time: "22:30", icon: Coffee },
  ];
  const currentStep = Math.min(2, Math.floor(range(frame, 30, 240) * 3));
  const headerO = eo(range(frame, 0, 25));
  const checkin = range(frame, 200, 230);

  return (
    <div className="px-4 pt-2 h-full flex flex-col" style={{ opacity: headerO }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-online font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" /> LIVE
          </p>
          <p className="font-display font-semibold text-[14px]">Винный вечер</p>
        </div>
        <div className="flex -space-x-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-background"
              style={{ background: `hsl(${(i * 70 + 10) % 360} 60% 70%)` }}
            />
          ))}
        </div>
      </div>

      {/* Mini map with route */}
      <div
        className="relative h-16 rounded-2xl overflow-hidden border border-border mb-2"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--secondary-soft)) 0%, hsl(var(--muted)) 100%)",
          opacity: eo(range(frame, 15, 50)),
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 64" preserveAspectRatio="none">
          <path d="M 0 20 Q 60 10 120 28 T 200 30" stroke="hsl(var(--border))" strokeWidth="0.8" fill="none" />
          <path d="M 0 50 Q 80 55 160 45 T 200 50" stroke="hsl(var(--border))" strokeWidth="0.8" fill="none" />
          {/* route */}
          <path
            d="M 25 45 Q 80 20 110 32 T 175 22"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 3"
            fill="none"
            style={{
              strokeDashoffset: -frame * 0.5,
            }}
          />
        </svg>
        {/* pins */}
        {[
          { x: 12, y: 70, done: 0 },
          { x: 55, y: 50, done: 1 },
          { x: 87, y: 35, done: 2 },
        ].map((p, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <div
                className="w-3 h-3 rounded-full border-2 border-background flex items-center justify-center"
                style={{
                  background:
                    isDone || isActive ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  boxShadow: isActive
                    ? `0 0 0 ${3 + 3 * Math.sin(frame * 0.3)}px hsl(var(--primary) / 0.3)`
                    : undefined,
                }}
              >
                {isDone && <Check className="w-2 h-2 text-primary-foreground" />}
              </div>
            </div>
          );
        })}
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-background/90 backdrop-blur text-[8px] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" />
          4 рядом
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="relative flex-1 pl-6">
        <div className="absolute left-2.5 top-2 bottom-8 w-0.5 bg-border" />
        <div
          className="absolute left-2.5 top-2 w-0.5 bg-primary"
          style={{
            height: `${range(frame, 30, 240) * 100}%`,
            maxHeight: "calc(100% - 32px)",
          }}
        />
        {steps.map((s, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          const o = eo(range(frame, 30 + i * 25, 60 + i * 25));
          return (
            <div
              key={i}
              className="relative mb-4"
              style={{ opacity: o, transform: `translateX(${(1 - o) * 15}px)` }}
            >
              <div
                className="absolute -left-[18px] top-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  background: isDone || isActive ? `hsl(var(--primary))` : `hsl(var(--muted))`,
                  boxShadow: isActive
                    ? `0 0 0 ${4 + 3 * Math.sin(frame * 0.3)}px hsl(var(--primary) / 0.25)`
                    : undefined,
                }}
              >
                {isDone && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
              </div>
              <div className="bg-card border border-border rounded-xl p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <s.icon className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[12px] font-semibold">{s.t}</p>
                  </div>
                  <span className="text-[10px] text-ink-mute">{s.time}</span>
                </div>
                {isActive && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-primary font-semibold">
                    <MapPin className="w-3 h-3" /> идёт сейчас
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="h-10 rounded-2xl bg-primary text-primary-foreground font-semibold text-[12px] flex items-center justify-center gap-1.5"
        style={{
          transform: `scale(${1 - checkin * 0.05})`,
          opacity: eo(range(frame, 60, 90)),
        }}
      >
        {checkin > 0.5 ? (
          <>
            <Check className="w-3.5 h-3.5" /> Чек-ин
          </>
        ) : (
          <>
            <Camera className="w-3.5 h-3.5" /> Чек-ин в Garage
          </>
        )}
      </button>
    </div>
  );
};

/* ============================================================
   SCENE 6 — After Dark
============================================================ */

const SceneAfterDark = ({ frame }: { frame: number }) => {
  const cats = [
    { e: "", t: "Все" },
    { e: "🌃", t: "Найтлайф" },
    { e: "💋", t: "Свидания" },
    { e: "♨️", t: "Wellness" },
  ];
  const activeCat = Math.floor(frame / 85) % cats.length;

  const reveal = eo(range(frame, 5, 35));
  const headerIn = eo(range(frame, 20, 50));
  const controlsIn = eo(range(frame, 45, 80));
  const eventIn = eo(range(frame, 70, 115));
  const requestPress = range(frame, 190, 215);
  const requested = frame > 215;

  const a = (Math.sin(frame * 0.05) + 1) / 2;
  const b = (Math.cos(frame * 0.06) + 1) / 2;

  return (
    <div
      className="h-full relative text-[hsl(var(--ad-fg))] overflow-hidden flex flex-col"
      style={{ opacity: reveal }}
    >
      {/* Ambient glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 15%, hsl(var(--ad-magenta) / ${0.28 + a * 0.12}), transparent 50%), radial-gradient(circle at 85% 75%, hsl(var(--ad-violet) / ${0.32 + b * 0.12}), transparent 55%), radial-gradient(circle at 60% 40%, hsl(var(--ad-cyan) / 0.12), transparent 60%)`,
        }}
      />
      {/* film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Header */}
      <div
        className="relative px-5 pt-4 flex items-center justify-between shrink-0"
        style={{ opacity: headerIn, transform: `translateY(${(1 - headerIn) * -10}px)` }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <ChevronDown className="w-5 h-5 rotate-90 text-white" strokeWidth={2.4} />
        </div>
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4" style={{ color: "hsl(var(--ad-magenta))" }} />
          <span
            className="font-display text-[14px] font-bold uppercase tracking-[0.14em] bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-neon)" }}
          >
            AFTER DARK
          </span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" style={{ color: "hsl(var(--ad-cyan))" }} strokeWidth={2.2} />
        </div>
      </div>

      {/* Hero */}
      <div
        className="relative px-5 mt-5 shrink-0"
        style={{ opacity: headerIn, transform: `translateY(${(1 - headerIn) * 14}px)` }}
      >
        <p className="font-display text-[11px] uppercase tracking-[0.14em] font-semibold flex items-center gap-2" style={{ color: "hsl(var(--ad-fg-mute))" }}>
          <span style={{ color: "hsl(var(--ad-gold))" }}>✧</span> Сегодня ночью
        </p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <p className="font-display font-semibold text-[26px] leading-[1.05] tracking-[-0.04em] text-white">
            <span className="whitespace-nowrap">8 приватных</span>
            <br />
            события
          </p>
          <button
            className="mt-1 h-10 px-3.5 rounded-full font-display text-[12px] font-bold text-white shrink-0"
            style={{
              background: "var(--gradient-neon)",
              boxShadow: "0 14px 42px hsl(var(--ad-magenta) / 0.38)",
              transform: `scale(${1 - requestPress * 0.04})`,
            }}
          >
            Создать 18+
          </button>
        </div>
      </div>

      {/* Search */}
      <div
        className="relative px-5 mt-5 shrink-0"
        style={{ opacity: controlsIn, transform: `translateY(${(1 - controlsIn) * 10}px)` }}
      >
        <div
          className="h-12 rounded-[18px] border flex items-center gap-3 px-4"
          style={{
            borderColor: "hsl(var(--ad-border))",
            background: "hsl(var(--ad-bg) / 0.62)",
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--ad-fg-mute))" }} />
          <span className="text-[12.5px] whitespace-nowrap truncate" style={{ color: "hsl(var(--ad-fg-mute))" }}>
            Найти событие или место
          </span>
        </div>
      </div>

      {/* Category chips */}
      <div
        className="relative pl-5 pr-0 mt-3 flex gap-2 overflow-hidden shrink-0"
        style={{ opacity: controlsIn, transform: `translateY(${(1 - controlsIn) * 10}px)` }}
      >
        {cats.map((c, i) => {
          const sel = i === activeCat;
          return (
            <div
              key={c.t}
              className="h-9 px-3.5 rounded-full flex items-center gap-1.5 text-[12px] font-bold whitespace-nowrap border transition-all"
              style={{
                background: sel ? "var(--gradient-neon)" : "hsl(var(--ad-surface) / 0.72)",
                borderColor: sel ? "transparent" : "hsl(var(--ad-border))",
                color: sel ? "hsl(var(--ad-fg))" : "hsl(var(--ad-fg-soft))",
                boxShadow: sel ? "var(--shadow-neon)" : undefined,
              }}
            >
              {c.e && <span className="text-[14px]">{c.e}</span>}
              {c.t}
            </div>
          );
        })}
      </div>

      {/* Events */}
      <div className="relative flex-1 min-h-0 px-5 mt-3 pb-3 overflow-hidden">
        <div
          className="relative rounded-[24px] overflow-hidden border"
          style={{
            borderColor: "hsl(var(--ad-border))",
            background: "hsl(var(--ad-surface) / 0.92)",
            opacity: eventIn,
            transform: `translateY(${(1 - eventIn) * 20}px)`,
            boxShadow: "0 18px 55px hsl(var(--ad-bg) / 0.48)",
          }}
        >
          <div className="relative h-[76px] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 18% 30%, hsl(var(--ad-magenta) / 0.86), transparent 42%), radial-gradient(circle at 78% 35%, hsl(var(--ad-violet) / 0.84), transparent 48%), linear-gradient(135deg, hsl(var(--ad-surface-elev)), hsl(var(--ad-bg)))",
              }}
            />
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(135deg, transparent 0 42%, hsl(var(--ad-cyan) / 0.45) 43% 45%, transparent 46% 100%)" }} />
            <div className="absolute top-2.5 left-2.5 h-5 px-2 rounded-full bg-black/35 backdrop-blur flex items-center gap-1 text-[9px] font-bold text-white">
              <Flame className="w-3 h-3" style={{ color: "hsl(var(--ad-magenta))" }} />
              Найтлайф
            </div>
            <div className="absolute top-2.5 right-2.5 h-5 px-2 rounded-full bg-black/35 backdrop-blur flex items-center gap-1 text-[9px] font-bold" style={{ color: "hsl(var(--ad-cyan))" }}>
              <ShieldCheck className="w-3 h-3" />
              Verified
            </div>
            <div className="absolute bottom-2.5 left-3 right-3">
              <p className="font-display text-[19px] leading-none font-semibold text-white tracking-[-0.04em]">
                Velvet Room
              </p>
              <p className="mt-1 text-[9px] text-white/70">закрытый лаунж · сегодня 23:30</p>
            </div>
          </div>

          <div className="p-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[9.5px] leading-snug" style={{ color: "hsl(var(--ad-fg-soft))" }}>
                Приватный вход, NDA, пары и синглы после верификации.
              </p>
              <span
                className="h-7 px-2.5 rounded-full flex items-center text-[9px] font-bold shrink-0"
                style={{
                  color: requested ? "hsl(var(--ad-cyan))" : "white",
                  background: requested ? "hsl(var(--ad-cyan) / 0.14)" : "var(--gradient-neon)",
                }}
              >
                {requested ? "В заявках" : "Войти"}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <span
                className="h-6 px-2 rounded-full flex items-center gap-1 text-[9px] font-bold border"
                style={{
                  borderColor: "hsl(var(--ad-border))",
                  color: "hsl(var(--ad-fg-soft))",
                  background: "hsl(var(--ad-bg) / 0.48)",
                }}
              >
                👥 24 / 30
              </span>
              <span
                className="h-6 px-2 rounded-full flex items-center gap-1 text-[9px] font-bold border"
                style={{
                  borderColor: "hsl(var(--ad-border))",
                  color: "hsl(var(--ad-fg-soft))",
                  background: "hsl(var(--ad-bg) / 0.48)",
                }}
              >
                <MapPin className="w-3 h-3" /> центр
              </span>
              <span
                className="h-6 px-2 rounded-full flex items-center gap-1 text-[9px] font-bold border"
                style={{
                  borderColor: "hsl(var(--ad-cyan) / 0.35)",
                  color: "hsl(var(--ad-cyan))",
                  background: "hsl(var(--ad-cyan) / 0.12)",
                }}
              >
                <ShieldCheck className="w-3 h-3" /> Кодекс
              </span>
            </div>
            <p className="mt-2 text-[8.5px] truncate" style={{ color: "hsl(var(--ad-fg-mute))" }}>
              Кодекс согласия включен · no photo · awareness team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SCENE 7 — Dating (swipe + match)
============================================================ */

const SceneDating = ({ frame }: { frame: number }) => {
  const cards = [
    { img: datingMira, name: "Мира, 26", bio: "Винные четверги · керамика · бег" },
    { img: datingAnya, name: "Аня, 27", bio: "Кино, настолки, кофе с собакой" },
    { img: datingLiza, name: "Лиза, 24", bio: "Йога утром, концерты вечером" },
  ];

  const swipeAt = (start: number) => eo(range(frame, start, start + 30));
  const swipe1 = swipeAt(70);
  const swipe2 = swipeAt(140);
  const matchIn = eo(range(frame, 215, 250));
  const matchOut = 1 - eo(range(frame, 285, 320));
  const headerO = eo(range(frame, 0, 25));

  return (
    <div className="px-4 pt-2 h-full flex flex-col" style={{ opacity: headerO }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary fill-primary" />
          <p className="font-display font-semibold text-[14px]">Свидания</p>
        </div>
        <span className="text-[10px] text-ink-mute">в твоём районе</span>
      </div>
      <div className="flex gap-1 mb-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{
              background:
                (i === 0) || (i === 1 && swipe1 > 0) || (i === 2 && swipe2 > 0)
                  ? `hsl(var(--primary))`
                  : `hsl(var(--muted))`,
            }}
          />
        ))}
      </div>

      <div className="relative flex-1">
        {cards.map((c, i) => {
          let translateX = 0;
          let rotate = 0;
          let opacity = 1;
          let scale = 1 - i * 0.04;
          let translateY = i * 6;
          let zIndex = 10 - i;

          if (i === 0) {
            translateX = swipe1 * 380;
            rotate = swipe1 * 18;
            opacity = 1 - swipe1;
          } else if (i === 1) {
            scale = lerp(1 - 0.04, 1, swipe1) - swipe2 * 0.04;
            translateY = lerp(6, 0, swipe1);
            translateX = swipe2 * 380;
            rotate = swipe2 * 18;
            opacity = 1 - swipe2;
            zIndex = 9;
          } else {
            scale = lerp(1 - 0.08, 1 - 0.04, swipe1);
            scale = lerp(scale, 1, swipe2);
            translateY = lerp(12, 6, swipe1);
            translateY = lerp(translateY, 0, swipe2);
            zIndex = 8;
          }

          const likeOp = i === 0 ? swipe1 : i === 1 ? swipe2 : 0;

          return (
            <div
              key={i}
              className="absolute inset-0 rounded-3xl overflow-hidden border border-border shadow-card"
              style={{
                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-transparent to-foreground/10" />

              {likeOp > 0.05 && (
                <div
                  className="absolute top-6 left-6 px-3 py-1 rounded-lg border-2 font-display font-bold text-[16px] tracking-wider"
                  style={{
                    color: "hsl(var(--primary))",
                    borderColor: "hsl(var(--primary))",
                    transform: "rotate(-15deg)",
                    opacity: likeOp,
                  }}
                >
                  LIKE
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
                <p className="font-display font-semibold text-[18px]">{c.name}</p>
                <p className="text-[11px] opacity-90 mt-0.5">{c.bio}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4">
        <button className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow-soft">
          <X className="w-5 h-5 text-ink-mute" />
        </button>
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-card"
          style={{
            background: "hsl(var(--primary))",
            transform: `scale(${1 + 0.08 * Math.sin(frame * 0.18)})`,
          }}
        >
          <Heart className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
        </button>
        <button className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow-soft">
          <Star className="w-5 h-5 text-secondary" />
        </button>
      </div>

      {matchIn * matchOut > 0.01 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary) / ${
              matchIn * matchOut * 0.95
            }), hsl(var(--secondary) / ${matchIn * matchOut * 0.85}))`,
          }}
        >
          <div
            className="text-center text-background"
            style={{ transform: `scale(${0.7 + matchIn * 0.3})` }}
          >
            <Heart className="w-12 h-12 fill-background mx-auto mb-2" />
            <p className="font-display font-bold text-[26px] tracking-tight">It's a match!</p>
            <p className="text-[11px] opacity-90 mt-1">Ты и Мира — общий вечер?</p>
            <div className="mt-4 flex justify-center">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-background">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${datingSonya})` }}
                />
              </div>
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-background -ml-3">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${datingMira})` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   SCENE 8 — Posters / Афиши
============================================================ */

const ScenePosters = ({ frame }: { frame: number }) => {
  const posters = [
    { img: eventWine, t: "Wine & Vinyl", v: "Strelka Bar", d: "Сегодня · 20:00", price: "1 200 ₽", tag: "Вино" },
    { img: eventCinema, t: "Премьера: Drive", v: "Garage Cinema", d: "Завтра · 21:30", price: "800 ₽", tag: "Кино" },
    { img: eventBoard, t: "Турнир Catan", v: "Hitzel", d: "Сб · 19:00", price: "Free", tag: "Игры" },
    { img: eventRun, t: "Утренний забег", v: "Парк Горького", d: "Вс · 08:00", price: "Free", tag: "Спорт" },
  ];
  const tabs = ["Все", "Сегодня", "Музыка", "Кино", "Гастро"];
  const activeTab = Math.floor(range(frame, 50, 200) * tabs.length) % tabs.length;
  const headerO = eo(range(frame, 0, 25));

  return (
    <div className="px-4 pt-2 h-full flex flex-col" style={{ opacity: headerO }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider">
            Афиша города
          </p>
          <p className="font-display font-semibold text-[16px]">240 событий</p>
        </div>
        <Calendar className="w-4 h-4 text-primary" />
      </div>

      <div className="flex gap-1.5 mb-3 overflow-hidden">
        {tabs.map((t, i) => (
          <div
            key={t}
            className="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
            style={{
              background: i === activeTab ? `hsl(var(--foreground))` : `hsl(var(--muted))`,
              color: i === activeTab ? `hsl(var(--background))` : `hsl(var(--ink-soft))`,
              transform: i === activeTab ? "scale(1.05)" : "scale(1)",
            }}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1">
        {posters.map((p, i) => {
          const start = 30 + i * 25;
          const o = eo(range(frame, start, start + 30));
          const y = lerp(20, 0, eo(range(frame, start, start + 30)));
          const highlightI = Math.floor(range(frame, 180, 260) * 4) % 4;
          const isHi = i === highlightI && frame > 180 && frame < 260;
          return (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden border border-border bg-card"
              style={{
                opacity: o,
                transform: `translateY(${y}px) scale(${isHi ? 1.03 : 1})`,
                boxShadow: isHi ? `0 0 0 2px hsl(var(--primary) / 0.5)` : undefined,
              }}
            >
              <div
                className="aspect-square bg-cover bg-center"
                style={{ backgroundImage: `url(${p.img})` }}
              />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-background/90 backdrop-blur text-[8px] font-bold">
                {p.tag}
              </div>
              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-foreground/80 text-background text-[8px] font-bold">
                {p.price}
              </div>
              <div className="p-2 bg-card">
                <p className="font-display font-semibold text-[10px] leading-tight truncate">{p.t}</p>
                <p className="text-[8px] text-ink-mute mt-0.5 truncate">{p.v}</p>
                <p className="text-[8px] text-primary font-semibold mt-0.5">{p.d}</p>
              </div>
            </div>
          );
        })}
      </div>

      {frame > 230 && (
        <div
          className="mt-2 bg-foreground text-background rounded-2xl p-2.5 flex items-center gap-2"
          style={{
            opacity: eo(range(frame, 230, 260)),
            transform: `translateY(${(1 - eo(range(frame, 230, 260))) * 20}px)`,
          }}
        >
          <Ticket className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1 text-[10px]">
            <p className="font-semibold">Билет в кошельке</p>
            <p className="opacity-70">Wine & Vinyl · 2 места</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   SCENE 9 — Create Meetup
============================================================ */

const SceneCreate = ({ frame }: { frame: number }) => {
  const titleText = "Винный четверг";
  const titleTyped = Math.floor(range(frame, 30, 90) * titleText.length);
  const tags = ["🍷 Вино", "🎲 Настолки", "🌃 Закат", "📚 Книги", "🎵 Vinyl"];
  const selectedTags = [0, 2];
  const privacyShow = eo(range(frame, 130, 165));
  const selectedPrivacy = frame > 195 ? 1 : 0;
  const photoIn = eo(range(frame, 170, 210));
  const publishPress = range(frame, 240, 270);
  const successIn = eo(range(frame, 280, 320));

  return (
    <div className="px-4 pt-2 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <p className="font-display font-semibold text-[14px]">Новая встреча</p>
        </div>
        <X className="w-4 h-4 text-ink-mute" />
      </div>

      <div
        className="h-20 rounded-2xl mb-2.5 overflow-hidden border border-border relative"
        style={{ opacity: photoIn }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${eventWine})` }}
        />
        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-background" />
        </div>
      </div>

      <div className="bg-muted rounded-xl p-2.5 mb-2">
        <p className="text-[8px] uppercase tracking-wider text-ink-mute font-bold mb-0.5">
          Название
        </p>
        <p className="font-display font-semibold text-[14px]">
          {titleText.slice(0, titleTyped)}
          {titleTyped < titleText.length && (
            <span className="inline-block w-1 h-3 bg-foreground ml-0.5 align-middle" />
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-muted rounded-xl p-2" style={{ opacity: eo(range(frame, 95, 125)) }}>
          <p className="text-[8px] uppercase tracking-wider text-ink-mute font-bold mb-0.5 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Когда
          </p>
          <p className="text-[11px] font-semibold">Чт · 19:30</p>
        </div>
        <div className="bg-muted rounded-xl p-2" style={{ opacity: eo(range(frame, 110, 140)) }}>
          <p className="text-[8px] uppercase tracking-wider text-ink-mute font-bold mb-0.5 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" /> Где
          </p>
          <p className="text-[11px] font-semibold truncate">Bar Strelka</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-2.5">
        {tags.map((t, i) => {
          const isSel = selectedTags.includes(i);
          const o = eo(range(frame, 100 + i * 12, 130 + i * 12));
          return (
            <span
              key={t}
              className="px-2 py-1 rounded-full text-[10px] font-semibold border"
              style={{
                opacity: o,
                background: isSel ? `hsl(var(--primary))` : `hsl(var(--card))`,
                color: isSel ? `hsl(var(--primary-foreground))` : `hsl(var(--ink-soft))`,
                borderColor: isSel ? `hsl(var(--primary))` : `hsl(var(--border))`,
                transform: `scale(${isSel ? 1 + 0.04 * Math.sin(frame * 0.2) : 1})`,
              }}
            >
              {t}
            </span>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-2" style={{ opacity: privacyShow }}>
        {[
          { i: Globe, t: "Все" },
          { i: Users, t: "Друзья" },
          { i: Lock, t: "По коду" },
        ].map((p, i) => {
          const sel = i === selectedPrivacy;
          return (
            <div
              key={p.t}
              className="rounded-xl py-2 flex flex-col items-center gap-0.5 border"
              style={{
                background: sel ? `hsl(var(--secondary-soft))` : `hsl(var(--card))`,
                borderColor: sel ? `hsl(var(--secondary))` : `hsl(var(--border))`,
              }}
            >
              <p.i
                className="w-3.5 h-3.5"
                style={{ color: sel ? `hsl(var(--secondary))` : `hsl(var(--ink-mute))` }}
              />
              <span
                className="text-[9px] font-bold"
                style={{ color: sel ? `hsl(var(--secondary))` : `hsl(var(--ink-mute))` }}
              >
                {p.t}
              </span>
            </div>
          );
        })}
      </div>

      <button
        className="mt-auto h-10 rounded-2xl font-semibold text-[12px] flex items-center justify-center gap-1.5"
        style={{
          background: `hsl(var(--foreground))`,
          color: `hsl(var(--background))`,
          opacity: eo(range(frame, 215, 245)),
          transform: `scale(${1 - publishPress * 0.06})`,
        }}
      >
        {successIn > 0.5 ? (
          <>
            <Check className="w-3.5 h-3.5" /> Встреча опубликована
          </>
        ) : (
          <>Опубликовать</>
        )}
      </button>

      {successIn > 0.1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const dist = 60 + 80 * successIn;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist - successIn * 40;
            const colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(42 95% 60%)"];
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: "50%",
                  top: "70%",
                  background: colors[i % 3],
                  transform: `translate(${x}px, ${y}px) scale(${1 - successIn * 0.5})`,
                  opacity: 1 - successIn * 0.6,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   SCENE 10 — Communities
============================================================ */

const SceneCommunities = ({ frame }: { frame: number }) => {
  const communities = [
    { t: "Беги, Москва", m: "1 248 френдов", e: "🏃", color: "hsl(145 40% 50%)" },
    { t: "Кино без диванов", m: "318 френдов", e: "🎬", color: "hsl(268 60% 60%)" },
    { t: "Настолки PRO", m: "542 френда", e: "🎲", color: "hsl(42 80% 55%)" },
  ];
  const headerO = eo(range(frame, 0, 25));
  const joinPress = range(frame, 200, 230);
  const joined = frame > 230;

  return (
    <div className="px-4 pt-2 h-full flex flex-col" style={{ opacity: headerO }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider">
            Сообщества
          </p>
          <p className="font-display font-semibold text-[16px]">Найди своих</p>
        </div>
        <Users className="w-4 h-4 text-secondary" />
      </div>

      <div
        className="relative rounded-2xl overflow-hidden mb-3 border border-border"
        style={{
          opacity: eo(range(frame, 20, 60)),
          transform: `translateY(${(1 - eo(range(frame, 20, 60))) * 15}px)`,
        }}
      >
        <div
          className="h-24 bg-cover bg-center"
          style={{ backgroundImage: `url(${eventWine})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
          <Flame className="w-2.5 h-2.5" /> Топ недели
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-background flex items-center justify-between">
          <div>
            <p className="font-display font-semibold text-[14px]">Винные четверги</p>
            <p className="text-[10px] opacity-90">412 френдов · 8 вечеров</p>
          </div>
          <button
            className="px-3 py-1.5 rounded-full bg-background text-foreground text-[10px] font-bold flex items-center gap-1"
            style={{ transform: `scale(${1 - joinPress * 0.1})` }}
          >
            {joined ? (
              <>
                <Check className="w-3 h-3" /> В клубе
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Вступить
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-1.5 flex-1">
        {communities.map((c, i) => {
          const start = 60 + i * 25;
          const o = eo(range(frame, start, start + 30));
          return (
            <div
              key={c.t}
              className="bg-card border border-border rounded-2xl p-2.5 flex items-center gap-3"
              style={{ opacity: o, transform: `translateX(${(1 - o) * 20}px)` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px]"
                style={{ background: `${c.color}22` }}
              >
                {c.e}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-[12px]">{c.t}</p>
                <p className="text-[10px] text-ink-mute">{c.m}</p>
              </div>
              <div className="flex -space-x-1.5">
                {[0, 1, 2].map((k) => (
                  <div
                    key={k}
                    className="w-5 h-5 rounded-full border-2 border-card"
                    style={{ background: `hsl(${(k * 80 + i * 40) % 360} 60% 70%)` }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {joined && (
        <div
          className="mt-2 bg-secondary-soft border border-secondary/40 rounded-2xl p-2.5 flex items-center gap-2"
          style={{
            opacity: eo(range(frame, 240, 270)),
            transform: `translateY(${(1 - eo(range(frame, 240, 270))) * 20}px)`,
          }}
        >
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-secondary-foreground" />
          </div>
          <div className="flex-1 text-[10px]">
            <p className="font-semibold text-foreground">Новый вечер от клуба</p>
            <p className="text-ink-mute">«Натуральное вино» · сегодня в 19:30</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Scene: Map ---------- */

const SceneMap = ({ frame }: { frame: number }) => {
  // pins on a stylized city map
  const pins = [
    { x: 22, y: 28, t: "Wine Bar 28", k: "🍷", tag: "Сегодня · 19:30", people: 6, hot: true,  color: "hsl(12 70% 55%)" },
    { x: 58, y: 22, t: "Rooftop Sky", k: "🌆", tag: "Завтра · 21:00", people: 12, hot: false, color: "hsl(268 60% 60%)" },
    { x: 72, y: 48, t: "Board Café",  k: "🎲", tag: "Сегодня · 20:00", people: 4,  hot: false, color: "hsl(42 80% 55%)" },
    { x: 36, y: 58, t: "Run Club",    k: "🏃", tag: "Утро · 08:00",   people: 18, hot: true,  color: "hsl(145 50% 50%)" },
    { x: 50, y: 76, t: "Jazz Night",  k: "🎷", tag: "Сегодня · 22:00", people: 9,  hot: false, color: "hsl(210 70% 55%)" },
  ];

  const headerO = eo(range(frame, 0, 25));
  const mapO    = eo(range(frame, 10, 50));
  // selected pin cycles
  const cycle = Math.floor(frame / 55) % pins.length;
  const filterIdx = Math.floor(frame / 90) % 3;
  const filters = ["Все", "Сегодня", "🔥 Горячие"];

  // user dot pulses
  const pulse = (Math.sin(frame / 6) + 1) / 2;

  return (
    <div className="px-4 pt-2 h-full flex flex-col" style={{ opacity: headerO }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider">
            Карта города
          </p>
          <p className="font-display font-semibold text-[16px]">Вечера рядом</p>
        </div>
        <MapPin className="w-4 h-4 text-primary" />
      </div>

      {/* filter chips */}
      <div className="flex gap-1.5 mb-2">
        {filters.map((f, i) => {
          const active = i === filterIdx;
          return (
            <div
              key={f}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-ink-mute border-border"
              }`}
            >
              {f}
            </div>
          );
        })}
      </div>

      {/* map */}
      <div
        className="relative flex-1 rounded-2xl overflow-hidden border border-border"
        style={{
          opacity: mapO,
          background:
            "linear-gradient(135deg, hsl(var(--secondary-soft)) 0%, hsl(var(--muted)) 100%)",
        }}
      >
        {/* fake roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 30 Q 30 20 60 35 T 100 40" stroke="hsl(var(--border))" strokeWidth="0.6" fill="none" />
          <path d="M 0 65 Q 25 70 50 60 T 100 70" stroke="hsl(var(--border))" strokeWidth="0.6" fill="none" />
          <path d="M 25 0 Q 30 30 20 60 T 35 100" stroke="hsl(var(--border))" strokeWidth="0.6" fill="none" />
          <path d="M 70 0 Q 65 25 75 55 T 70 100" stroke="hsl(var(--border))" strokeWidth="0.6" fill="none" />
          <path d="M 0 0 L 100 100" stroke="hsl(var(--border))" strokeWidth="0.3" fill="none" opacity="0.5" />
        </svg>

        {/* river */}
        <div
          className="absolute inset-x-0"
          style={{
            top: "44%",
            height: "10%",
            background:
              "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.12), transparent)",
            transform: "rotate(-4deg)",
          }}
        />

        {/* user location */}
        <div
          className="absolute"
          style={{ left: "48%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 44 + pulse * 20,
              height: 44 + pulse * 20,
              background: "hsl(var(--primary) / 0.18)",
              transform: "translate(-50%, -50%)",
              left: 0,
              top: 0,
              opacity: 1 - pulse * 0.6,
            }}
          />
          <div
            className="w-3 h-3 rounded-full bg-primary border-2 border-background"
            style={{ transform: "translate(-50%, -50%)", boxShadow: "0 2px 6px hsl(var(--primary) / 0.5)" }}
          />
        </div>

        {/* pins */}
        {pins.map((p, i) => {
          const appear = eo(range(frame, 30 + i * 8, 60 + i * 8));
          const active = i === cycle;
          return (
            <div
              key={p.t}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translate(-50%, -100%) scale(${appear * (active ? 1.15 : 1)})`,
                opacity: appear,
                zIndex: active ? 20 : 10,
                transition: "transform 300ms ease",
              }}
            >
              <div
                className="relative px-1.5 py-1 rounded-full flex items-center gap-1 shadow-lg border-2 border-background"
                style={{ background: p.color }}
              >
                <span className="text-[12px] leading-none">{p.k}</span>
                <span className="text-[9px] font-bold text-background pr-1">{p.people}</span>
                {p.hot && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                    <Flame className="w-2 h-2 text-primary-foreground" />
                  </div>
                )}
              </div>
              {/* tail */}
              <div
                className="w-2 h-2 mx-auto -mt-0.5 rotate-45 border-r-2 border-b-2 border-background"
                style={{ background: p.color }}
              />
            </div>
          );
        })}

        {/* preview card for active pin */}
        {pins.map((p, i) => {
          if (i !== cycle) return null;
          return (
            <div
              key={`card-${p.t}`}
              className="absolute left-2 right-2 bottom-2 bg-card border border-border rounded-2xl p-2.5 flex items-center gap-2.5 shadow-xl"
              style={{
                opacity: eo(range(frame % 55, 5, 25)),
                transform: `translateY(${(1 - eo(range(frame % 55, 5, 25))) * 12}px)`,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px]"
                style={{ background: `${p.color}22` }}
              >
                {p.k}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-[12px] truncate">{p.t}</p>
                <p className="text-[10px] text-ink-mute flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {p.tag} · {p.people} идут
                </p>
              </div>
              <button className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                Я с вами
              </button>
            </div>
          );
        })}

        {/* counter */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-background/90 backdrop-blur border border-border text-[10px] font-semibold flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {pins.length} рядом
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   Scenarios registry
============================================================ */

type Scenario = {
  id: string;
  label: string;
  blurb: string;
  duration: number;
  icon: React.ComponentType<{ className?: string }>;
  dark?: boolean;
  render: (frame: number) => React.ReactNode;
};

const SCENARIOS: Scenario[] = [
  {
    id: "tonight",
    label: "Лента «Tonight»",
    blurb: "Видишь вечера рядом и присоединяешься в один тап.",
    duration: 270,
    icon: Sparkles,
    render: (f) => <SceneTonight frame={f} />,
  },
  {
    id: "map",
    label: "Карта города",
    blurb: "Точки вечеров на карте — фильтры, превью и подключение в один тап.",
    duration: 280,
    icon: MapPin,
    render: (f) => <SceneMap frame={f} />,
  },
  {
    id: "create",
    label: "Создание встречи",
    blurb: "Название, место, теги, приватность — всё за минуту.",
    duration: 340,
    icon: Plus,
    render: (f) => <SceneCreate frame={f} />,
  },
  {
    id: "builder",
    label: "AI-конструктор вечера",
    blurb: "AI собирает маршрут под твоё настроение и публикует встречу.",
    duration: 300,
    icon: Wine,
    render: (f) => <SceneBuilder frame={f} />,
  },
  {
    id: "chat",
    label: "Чат встречи",
    blurb: "Голосовые, реакции, шаги маршрута — всё в одном месте.",
    duration: 280,
    icon: MessageCircle,
    render: (f) => <SceneChat frame={f} />,
  },
  {
    id: "live",
    label: "Live-вечер с маршрутом",
    blurb: "Таймлайн в реальном времени, чек-ины и общая локация.",
    duration: 280,
    icon: Users,
    render: (f) => <SceneLive frame={f} />,
  },
  {
    id: "safety",
    label: "Безопасность и SOS",
    blurb: "Доверенные контакты, рассылка с локацией, верификация.",
    duration: 280,
    icon: ShieldCheck,
    render: (f) => <SceneSafety frame={f} />,
  },
  {
    id: "dating",
    label: "Свидания и матчи",
    blurb: "Свайп-знакомства с приглашением на общий вечер.",
    duration: 340,
    icon: Heart,
    render: (f) => <SceneDating frame={f} />,
  },
  {
    id: "posters",
    label: "Афиша города",
    blurb: "Концерты, кино, фестивали — с билетами в один тап.",
    duration: 280,
    icon: Calendar,
    render: (f) => <ScenePosters frame={f} />,
  },
  {
    id: "communities",
    label: "Сообщества",
    blurb: "Клубы по интересам с регулярными вечерами.",
    duration: 290,
    icon: Users,
    render: (f) => <SceneCommunities frame={f} />,
  },
  {
    id: "afterdark",
    label: "After Dark · 18+",
    blurb: "Ночные события для верифицированных френдов.",
    duration: 260,
    icon: Music,
    dark: true,
    render: (f) => <SceneAfterDark frame={f} />,
  },
];

/* ============================================================
   The section
============================================================ */

export const AnimatedDemo = () => {
  const [currentId, setCurrentId] = useState(SCENARIOS[0].id);
  const [playing, setPlaying] = useState(true);
  const [open, setOpen] = useState(false);

  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === currentId)!,
    [currentId]
  );

  const [frame, setFrame] = useFrame(playing, scenario.duration);

  const select = (id: string) => {
    setCurrentId(id);
    setFrame(0);
    setOpen(false);
    setPlaying(true);
  };

  const progress = (frame / scenario.duration) * 100;

  return (
    <section id="demo" className="relative bg-paper-deep/60 border-y border-hairline overflow-hidden">
      <div className="absolute inset-0 -z-10 lux-paper opacity-60" />
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
        {/* Editorial section header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div>
            <p className="lux-eyebrow">Live · Demonstration</p>
            <div className="mt-3 w-12 lux-rule mx-auto" />
          </div>
          <div className="mt-8">
            <h2 className="lux-h1 text-center text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
              Посмотри, как это <em className="lux-h1-italic text-primary">работает</em> —
              прямо в кадре.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
          {/* LEFT — controls */}
          <div>
            <p className="text-[16px] text-ink-soft max-w-md leading-[1.65] font-light">
              Выбери сценарий и наблюдай, как Frendly разворачивается на экране телефона —
              <em className="font-serif font-light text-foreground"> без скачивания</em>.
            </p>

            {/* Custom dropdown */}
            <div className="mt-10 relative max-w-sm">
              <button
                onClick={() => setOpen((o) => !o)}
                className="w-full h-14 px-4 rounded-2xl bg-paper border border-hairline flex items-center gap-3 text-left shadow-soft hover:border-foreground/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <scenario.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="lux-eyebrow text-[9px]">Сценарий</p>
                  <p className="font-serif text-[16px] tracking-tight truncate mt-0.5">
                    {scenario.label}
                  </p>
                </div>
                <ChevronDown
                  className="w-4 h-4 text-ink-mute shrink-0"
                  style={{
                    transform: `rotate(${open ? 180 : 0}deg)`,
                    transition: "transform 0.2s",
                  }}
                />
              </button>

              {open && (
                <div className="absolute z-20 left-0 right-0 top-[calc(100%+8px)] bg-paper border border-hairline rounded-2xl shadow-paper overflow-hidden animate-fade-in">
                  {SCENARIOS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => select(s.id)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-paper-deep/60 transition-colors border-b border-hairline last:border-b-0 ${
                        s.id === currentId ? "bg-paper-deep/40" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          s.id === currentId
                            ? "bg-foreground text-background"
                            : "bg-paper-deep text-foreground"
                        }`}
                      >
                        <s.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-[15px] tracking-tight">{s.label}</p>
                        <p className="text-[11px] text-ink-mute truncate font-light mt-0.5">{s.blurb}</p>
                      </div>
                      {s.id === currentId && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Blurb + controls */}
            <div className="mt-8 max-w-sm">
              <div className="flex items-start gap-4">
                <div className="w-8 h-px bg-hairline mt-2.5 shrink-0" />
                <p className="font-serif font-light text-[16px] text-foreground/85 leading-[1.55] tracking-tight">
                  {scenario.blurb}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center tap-fade hover:bg-ink-deep transition-colors"
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => setFrame(0)}
                  className="w-10 h-10 rounded-full bg-paper border border-hairline flex items-center justify-center tap-fade hover:border-foreground/30"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="flex-1 h-px bg-hairline relative overflow-visible">
                  <div
                    className="absolute inset-y-[-1px] left-0 h-[2px] bg-foreground"
                    style={{ width: `${progress}%`, transition: "width 0.05s linear" }}
                  />
                </div>
                <span className="lux-num text-[14px] tabular-nums text-ink-mute">
                  {(frame / 30).toFixed(1)}s
                </span>
              </div>

              {/* Scenario chips */}
              <div className="mt-7 flex flex-wrap gap-2">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => select(s.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase transition-all ${
                      s.id === currentId
                        ? "bg-foreground text-background border border-foreground"
                        : "bg-paper border border-hairline text-ink-soft hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — phone framed editorially */}
          <div className="relative">
            <div
              className="absolute -inset-16 rounded-full blur-3xl -z-10"
              style={{
                background: scenario.dark
                  ? "radial-gradient(circle, hsl(var(--ad-magenta) / 0.32), transparent 70%)"
                  : "radial-gradient(circle, hsl(var(--primary) / 0.18), transparent 70%)",
              }}
            />

            {/* corner ticks */}
            <span className="absolute -top-4 -left-4 w-6 h-6 border-l border-t border-foreground/40 z-10" />
            <span className="absolute -top-4 -right-4 w-6 h-6 border-r border-t border-foreground/40 z-10" />
            <span className="absolute -bottom-4 -left-4 w-6 h-6 border-l border-b border-foreground/40 z-10" />
            <span className="absolute -bottom-4 -right-4 w-6 h-6 border-r border-b border-foreground/40 z-10" />

            <PhoneShell dark={scenario.dark}>
              <div key={scenario.id} className="h-full">
                {scenario.render(frame)}
              </div>
            </PhoneShell>

            {/* Editorial caption */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 lux-eyebrow text-[9px] text-ink-mute whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" />
              Live preview · Frendly N° 01 · {scenario.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
