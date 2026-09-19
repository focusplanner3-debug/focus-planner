import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Play, Pause, Square, ArrowLeft, Coffee, Plus, X, Flame, Trophy, Target, Zap, Award, Lock, CalendarClock, Heart,
  ChevronUp, ChevronDown, Pencil, Trash2, Check, Info, Sun, Moon,
} from "lucide-react";

const LIGHT_THEME = {
  bg: "#F5F5FB",
  card: "#FFFFFF",
  ink: "#1E1B39",
  inkSoft: "#6B6B85",
  inkFaint: "#9A9AB2",
  border: "#ECECF5",
  primary: "#1E3A6B",
  primaryDark: "#13284D",
  primarySoft: "#E6ECF5",
  green: "#22B573",
  amber: "#E8A93C",
  red: "#E1566A",
  gold: "#E8B84B",
  dangerBg: "#FCE8EC",
  warnBg: "#FCF3E0",
  warnText: "#9C6A0F",
  successBg: "#E5F4EA",
};

const DARK_THEME = {
  bg: "#12141C",
  card: "#1C1F2B",
  ink: "#EEEEF6",
  inkSoft: "#A7ACC2",
  inkFaint: "#6E7288",
  border: "#2C2F3E",
  primary: "#6C93D6",
  primaryDark: "#4A6FA8",
  primarySoft: "#233049",
  green: "#3DDC97",
  amber: "#F0BB5C",
  red: "#F0768A",
  gold: "#F0C868",
  dangerBg: "#3A2530",
  warnBg: "#3A3221",
  warnText: "#F0BB5C",
  successBg: "#1F3A2E",
};

const sans = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const STORAGE_KEY = "planner-data-v2";
// Link per le donazioni "offrimi un caffè"
const DONATION_URL = "https://paypal.me/DanieleSalvi962";

const LOCALE_TAGS = { it: "it-IT", en: "en-US", es: "es-ES", de: "de-DE" };
// Colore fisso e scuro usato SOLO sui controlli a sfondo bianco della schermata timer
// (che resta sempre scura/atmosferica indipendentemente dal tema chiaro/scuro dell'app).
const FOCUS_INK = "#1E1B39";const LANGUAGES = [
  { code: "it", flag: "🇮🇹", label: "ITA" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ESP" },
  { code: "de", flag: "🇩🇪", label: "DE" },
];

const LOCALES = {
  it: {
    appName: "Focus Planner",
    donate: "Offrimi un caffè",
    donateFooter: "Ti è utile? Offrimi un caffè",
    defaultSubject: "Sessione di studio",
    back: "Indietro",
    tabTimer: "Con timer",
    tabManual: "Inserisci manualmente",
    subjectLabel: "Materia",
    subjectPlaceholder: "es. Analisi 1",
    studyMinutesLabel: "Studia per (minuti)",
    breakMinutesLabel: "Pausa di (minuti)",
    timerHint: 'Il timer alternerà automaticamente studio e pausa finché non premi "Ferma". Metti 0 minuti di pausa se non ne vuoi.',
    todoLabel: "To-do per questo pomodoro (opzionale)",
    todoPlaceholder: "es. Rileggere il capitolo 3",
    todoHint: "Potrai spuntare queste attività una volta avviato il pomodoro, e il punteggio resterà salvato con la sessione.",
    startTimerBtn: "Avvia timer",
    hoursLabel: "Ore *",
    dateLabel: "Data",
    noteLabel: "Nota (opz.)",
    notePlaceholder: "es. esercizi cap. 4",
    saveSessionBtn: "Salva sessione",
    errSubjectRequired: "Inserisci la materia prima di salvare.",
    errHoursRequired: "Il campo Ore è obbligatorio: inserisci quante ore hai studiato.",
    errExamFields: "Compila almeno materia e data.",
    errSessionSubjectEmpty: "La materia non può essere vuota.",
    errSessionHoursRequired: "Il campo Ore è obbligatorio.",
    registerSession: "Registra sessione",
    sessionsThisWeek: (n, m) => `${n} session${n === 1 ? "e" : "i"} questa settimana · ${m} materi${m === 1 ? "a" : "e"} attiv${m === 1 ? "a" : "e"}`,
    dailyGoalLabel: "Obiettivo giornaliero",
    perDay: "h/giorno",
    todayOf: (g) => `/ ${g}h oggi`,
    increaseGoalAria: "Aumenta obiettivo giornaliero",
    decreaseGoalAria: "Diminuisci obiettivo giornaliero",
    streakDaysLabel: (n) => `${n} giorni di streak`,
    keepGoing: "Continua così — ogni sessione conta.",
    totalHoursLabel: (n) => `${n}h totali`,
    onTargetLabel: (n) => `${n}% giorni in linea`,
    activityTitle: "Attività",
    less: "Meno",
    silver: "Argento",
    goldBadge: "🥇 Oro · 1 anno di costanza",
    streakDaysStat: "streak giorni",
    weekStat: "settimana",
    onTargetStat: "in linea",
    examsTitle: "Prossime scadenze",
    descPlaceholder: "Descrizione (opz.)",
    addBtn: "Aggiungi",
    noExams: "Nessuna scadenza in arrivo.",
    cancel: "Annulla",
    save: "Salva",
    editExamAria: "Modifica scadenza",
    deleteExamAria: "Elimina scadenza",
    daysSuffix: "gg",
    achievementsTitle: "Obiettivi",
    ofCount: (a, b) => `${a} di ${b}`,
    unlockedLabel: "Ottenuto ✓",
    lockedLabel: "Da sbloccare",
    progressLabel: "Progresso:",
    closeAria: "Chiudi",
    darkModeAria: "Attiva tema scuro",
    lightModeAria: "Attiva tema chiaro",
    recentSessionsTitle: "Sessioni recenti",
    noSessions: "Nessuna sessione ancora — registra la prima per vedere streak e attività prendere forma.",
    editSessionAria: "Modifica sessione",
    deleteSessionAria: "Elimina sessione",
    pauseLabel: "Pausa",
    todoFocusTitle: "TO-DO DEL POMODORO",
    startFocusBtn: "Inizia a Concentrarti",
    cyclesCompleted: (n, h) => `${n} cicl${n === 1 ? "o" : "i"} completat${n === 1 ? "o" : "i"} · ${h}h studiate`,
    beforeStart: (s, b) => `${s} min studio · ${b} min pausa`,
    timerNote: (n, done, total) => `Timer · ${n} cicl${n === 1 ? "o" : "i"}${total ? ` · ✅ ${done}/${total} attività` : ""}`,
    badges: {
      start: { label: "Primo passo", how: "Registra la tua prima sessione di studio, con il timer o inserendola manualmente.", progress: (n) => `${n}/1 sessione` },
      streak7: { label: "Costanza", how: "Studia almeno un po' ogni giorno per 7 giorni consecutivi, senza saltare un giorno.", progress: (n) => `${n}/7 giorni di streak` },
      ten: { label: "Dieci sessioni", how: "Registra almeno 10 sessioni di studio, anche di materie diverse.", progress: (n) => `${n}/10 sessioni` },
      fifty: { label: "50 ore totali", how: "Accumula un totale di 50 ore di studio, sommando tutte le sessioni registrate.", progress: (n) => `${n}/50 ore` },
      specialist: { label: "Specialista", how: "Raggiungi 20 ore di studio in una singola materia per diventarne lo specialista.", progress: () => "20h in una materia" },
      planner: { label: "Pianificatore", how: "Aggiungi almeno una scadenza o un esame nella sezione 'Prossime scadenze'.", progress: (n) => `${n}/1 scadenza` },
    },
  },
  en: {
    appName: "Focus Planner",
    donate: "Buy me a coffee",
    donateFooter: "Find this useful? Buy me a coffee",
    defaultSubject: "Study session",
    back: "Back",
    tabTimer: "With timer",
    tabManual: "Enter manually",
    subjectLabel: "Subject",
    subjectPlaceholder: "e.g. Calculus 1",
    studyMinutesLabel: "Study for (minutes)",
    breakMinutesLabel: "Break for (minutes)",
    timerHint: 'The timer will automatically alternate study and break until you press "Stop". Set 0 break minutes if you don\'t want one.',
    todoLabel: "To-do for this pomodoro (optional)",
    todoPlaceholder: "e.g. Reread chapter 3",
    todoHint: "You'll be able to check these off once the pomodoro starts, and the score will be saved with the session.",
    startTimerBtn: "Start timer",
    hoursLabel: "Hours *",
    dateLabel: "Date",
    noteLabel: "Note (opt.)",
    notePlaceholder: "e.g. exercises ch. 4",
    saveSessionBtn: "Save session",
    errSubjectRequired: "Enter the subject before saving.",
    errHoursRequired: "The Hours field is required: enter how many hours you studied.",
    errExamFields: "Fill in at least subject and date.",
    errSessionSubjectEmpty: "The subject can't be empty.",
    errSessionHoursRequired: "The Hours field is required.",
    registerSession: "Log session",
    sessionsThisWeek: (n, m) => `${n} session${n === 1 ? "" : "s"} this week · ${m} active subject${m === 1 ? "" : "s"}`,
    dailyGoalLabel: "Daily goal",
    perDay: "h/day",
    todayOf: (g) => `/ ${g}h today`,
    increaseGoalAria: "Increase daily goal",
    decreaseGoalAria: "Decrease daily goal",
    streakDaysLabel: (n) => `${n}-day streak`,
    keepGoing: "Keep it up — every session counts.",
    totalHoursLabel: (n) => `${n}h total`,
    onTargetLabel: (n) => `${n}% days on target`,
    activityTitle: "Activity",
    less: "Less",
    silver: "Silver",
    goldBadge: "🥇 Gold · 1-year streak",
    streakDaysStat: "streak days",
    weekStat: "week",
    onTargetStat: "on target",
    examsTitle: "Upcoming deadlines",
    descPlaceholder: "Description (opt.)",
    addBtn: "Add",
    noExams: "No upcoming deadlines.",
    cancel: "Cancel",
    save: "Save",
    editExamAria: "Edit deadline",
    deleteExamAria: "Delete deadline",
    daysSuffix: "d",
    achievementsTitle: "Achievements",
    ofCount: (a, b) => `${a} of ${b}`,
    unlockedLabel: "Unlocked ✓",
    lockedLabel: "Locked",
    progressLabel: "Progress:",
    closeAria: "Close",
    darkModeAria: "Switch to dark theme",
    lightModeAria: "Switch to light theme",
    recentSessionsTitle: "Recent sessions",
    noSessions: "No sessions yet — log your first one to see your streak and activity take shape.",
    editSessionAria: "Edit session",
    deleteSessionAria: "Delete session",
    pauseLabel: "Break",
    todoFocusTitle: "POMODORO TO-DO",
    startFocusBtn: "Start Focusing",
    cyclesCompleted: (n, h) => `${n} cycle${n === 1 ? "" : "s"} completed · ${h}h studied`,
    beforeStart: (s, b) => `${s} min study · ${b} min break`,
    timerNote: (n, done, total) => `Timer · ${n} cycle${n === 1 ? "" : "s"}${total ? ` · ✅ ${done}/${total} tasks` : ""}`,
    badges: {
      start: { label: "First step", how: "Log your first study session, either with the timer or by entering it manually.", progress: (n) => `${n}/1 session` },
      streak7: { label: "Consistency", how: "Study at least a bit every day for 7 days in a row, without missing one.", progress: (n) => `${n}/7 streak days` },
      ten: { label: "Ten sessions", how: "Log at least 10 study sessions, even across different subjects.", progress: (n) => `${n}/10 sessions` },
      fifty: { label: "50 total hours", how: "Accumulate a total of 50 hours of study, adding up all logged sessions.", progress: (n) => `${n}/50 hours` },
      specialist: { label: "Specialist", how: "Reach 20 hours of study in a single subject to become its specialist.", progress: () => "20h in one subject" },
      planner: { label: "Planner", how: "Add at least one deadline or exam in the 'Upcoming deadlines' section.", progress: (n) => `${n}/1 deadline` },
    },
  },
  es: {
    appName: "Focus Planner",
    donate: "Invítame un café",
    donateFooter: "¿Te resulta útil? Invítame un café",
    defaultSubject: "Sesión de estudio",
    back: "Atrás",
    tabTimer: "Con temporizador",
    tabManual: "Introducir manualmente",
    subjectLabel: "Materia",
    subjectPlaceholder: "ej. Cálculo 1",
    studyMinutesLabel: "Estudia durante (minutos)",
    breakMinutesLabel: "Descanso de (minutos)",
    timerHint: 'El temporizador alternará automáticamente estudio y descanso hasta que pulses "Detener". Pon 0 minutos de descanso si no quieres.',
    todoLabel: "Tareas para este pomodoro (opcional)",
    todoPlaceholder: "ej. Releer el capítulo 3",
    todoHint: "Podrás marcarlas una vez iniciado el pomodoro, y la puntuación se guardará con la sesión.",
    startTimerBtn: "Iniciar temporizador",
    hoursLabel: "Horas *",
    dateLabel: "Fecha",
    noteLabel: "Nota (opc.)",
    notePlaceholder: "ej. ejercicios cap. 4",
    saveSessionBtn: "Guardar sesión",
    errSubjectRequired: "Introduce la materia antes de guardar.",
    errHoursRequired: "El campo Horas es obligatorio: indica cuántas horas has estudiado.",
    errExamFields: "Completa al menos materia y fecha.",
    errSessionSubjectEmpty: "La materia no puede estar vacía.",
    errSessionHoursRequired: "El campo Horas es obligatorio.",
    registerSession: "Registrar sesión",
    sessionsThisWeek: (n, m) => `${n} sesion${n === 1 ? "" : "es"} esta semana · ${m} materia${m === 1 ? "" : "s"} activa${m === 1 ? "" : "s"}`,
    dailyGoalLabel: "Meta diaria",
    perDay: "h/día",
    todayOf: (g) => `/ ${g}h hoy`,
    increaseGoalAria: "Aumentar meta diaria",
    decreaseGoalAria: "Disminuir meta diaria",
    streakDaysLabel: (n) => `${n} días de racha`,
    keepGoing: "Sigue así — cada sesión cuenta.",
    totalHoursLabel: (n) => `${n}h totales`,
    onTargetLabel: (n) => `${n}% días en meta`,
    activityTitle: "Actividad",
    less: "Menos",
    silver: "Plata",
    goldBadge: "🥇 Oro · 1 año de constancia",
    streakDaysStat: "días de racha",
    weekStat: "semana",
    onTargetStat: "en meta",
    examsTitle: "Próximos vencimientos",
    descPlaceholder: "Descripción (opc.)",
    addBtn: "Añadir",
    noExams: "No hay vencimientos próximos.",
    cancel: "Cancelar",
    save: "Guardar",
    editExamAria: "Editar vencimiento",
    deleteExamAria: "Eliminar vencimiento",
    daysSuffix: "d",
    achievementsTitle: "Logros",
    ofCount: (a, b) => `${a} de ${b}`,
    unlockedLabel: "Conseguido ✓",
    lockedLabel: "Por desbloquear",
    progressLabel: "Progreso:",
    closeAria: "Cerrar",
    darkModeAria: "Activar tema oscuro",
    lightModeAria: "Activar tema claro",
    recentSessionsTitle: "Sesiones recientes",
    noSessions: "Aún no hay sesiones — registra la primera para ver tu racha y actividad tomar forma.",
    editSessionAria: "Editar sesión",
    deleteSessionAria: "Eliminar sesión",
    pauseLabel: "Descanso",
    todoFocusTitle: "TAREAS DEL POMODORO",
    startFocusBtn: "Empezar a concentrarte",
    cyclesCompleted: (n, h) => `${n} ciclo${n === 1 ? "" : "s"} completado${n === 1 ? "" : "s"} · ${h}h estudiadas`,
    beforeStart: (s, b) => `${s} min estudio · ${b} min descanso`,
    timerNote: (n, done, total) => `Temporizador · ${n} ciclo${n === 1 ? "" : "s"}${total ? ` · ✅ ${done}/${total} tareas` : ""}`,
    badges: {
      start: { label: "Primer paso", how: "Registra tu primera sesión de estudio, con el temporizador o introduciéndola manualmente.", progress: (n) => `${n}/1 sesión` },
      streak7: { label: "Constancia", how: "Estudia al menos un poco cada día durante 7 días seguidos, sin saltarte ninguno.", progress: (n) => `${n}/7 días de racha` },
      ten: { label: "Diez sesiones", how: "Registra al menos 10 sesiones de estudio, aunque sean de materias distintas.", progress: (n) => `${n}/10 sesiones` },
      fifty: { label: "50 horas totales", how: "Acumula un total de 50 horas de estudio, sumando todas las sesiones registradas.", progress: (n) => `${n}/50 horas` },
      specialist: { label: "Especialista", how: "Alcanza 20 horas de estudio en una sola materia para convertirte en su especialista.", progress: () => "20h en una materia" },
      planner: { label: "Planificador", how: "Añade al menos un vencimiento o examen en la sección 'Próximos vencimientos'.", progress: (n) => `${n}/1 vencimiento` },
    },
  },
  de: {
    appName: "Focus Planner",
    donate: "Spendier mir einen Kaffee",
    donateFooter: "Nützlich für dich? Spendier mir einen Kaffee",
    defaultSubject: "Lernsitzung",
    back: "Zurück",
    tabTimer: "Mit Timer",
    tabManual: "Manuell eingeben",
    subjectLabel: "Fach",
    subjectPlaceholder: "z.B. Analysis 1",
    studyMinutesLabel: "Lernzeit (Minuten)",
    breakMinutesLabel: "Pause (Minuten)",
    timerHint: 'Der Timer wechselt automatisch zwischen Lernen und Pause, bis du "Stopp" drückst. Stelle 0 Pausenminuten ein, wenn du keine willst.',
    todoLabel: "Aufgaben für diesen Pomodoro (optional)",
    todoPlaceholder: "z.B. Kapitel 3 nochmal lesen",
    todoHint: "Du kannst sie abhaken, sobald der Pomodoro läuft, und die Punktzahl wird mit der Sitzung gespeichert.",
    startTimerBtn: "Timer starten",
    hoursLabel: "Stunden *",
    dateLabel: "Datum",
    noteLabel: "Notiz (opt.)",
    notePlaceholder: "z.B. Übungen Kap. 4",
    saveSessionBtn: "Sitzung speichern",
    errSubjectRequired: "Gib das Fach ein, bevor du speicherst.",
    errHoursRequired: "Das Feld Stunden ist erforderlich: gib an, wie viele Stunden du gelernt hast.",
    errExamFields: "Fülle mindestens Fach und Datum aus.",
    errSessionSubjectEmpty: "Das Fach darf nicht leer sein.",
    errSessionHoursRequired: "Das Feld Stunden ist erforderlich.",
    registerSession: "Sitzung erfassen",
    sessionsThisWeek: (n, m) => `${n} Sitzung${n === 1 ? "" : "en"} diese Woche · ${m} aktive${m === 1 ? "s" : ""} Fach${m === 1 ? "" : "und mehr"}`,
    dailyGoalLabel: "Tagesziel",
    perDay: "Std./Tag",
    todayOf: (g) => `/ ${g} Std. heute`,
    increaseGoalAria: "Tagesziel erhöhen",
    decreaseGoalAria: "Tagesziel verringern",
    streakDaysLabel: (n) => `${n} Tage in Folge`,
    keepGoing: "Weiter so — jede Sitzung zählt.",
    totalHoursLabel: (n) => `${n} Std. gesamt`,
    onTargetLabel: (n) => `${n}% Tage im Ziel`,
    activityTitle: "Aktivität",
    less: "Weniger",
    silver: "Silber",
    goldBadge: "🥇 Gold · 1 Jahr Serie",
    streakDaysStat: "Serientage",
    weekStat: "Woche",
    onTargetStat: "im Ziel",
    examsTitle: "Anstehende Termine",
    descPlaceholder: "Beschreibung (opt.)",
    addBtn: "Hinzufügen",
    noExams: "Keine anstehenden Termine.",
    cancel: "Abbrechen",
    save: "Speichern",
    editExamAria: "Termin bearbeiten",
    deleteExamAria: "Termin löschen",
    daysSuffix: "T",
    achievementsTitle: "Erfolge",
    ofCount: (a, b) => `${a} von ${b}`,
    unlockedLabel: "Freigeschaltet ✓",
    lockedLabel: "Gesperrt",
    progressLabel: "Fortschritt:",
    closeAria: "Schließen",
    darkModeAria: "Dunkles Design aktivieren",
    lightModeAria: "Helles Design aktivieren",
    recentSessionsTitle: "Letzte Sitzungen",
    noSessions: "Noch keine Sitzungen — erfasse die erste, um Serie und Aktivität wachsen zu sehen.",
    editSessionAria: "Sitzung bearbeiten",
    deleteSessionAria: "Sitzung löschen",
    pauseLabel: "Pause",
    todoFocusTitle: "POMODORO-AUFGABEN",
    startFocusBtn: "Fokus starten",
    cyclesCompleted: (n, h) => `${n} Zyklus/Zyklen abgeschlossen · ${h} Std. gelernt`,
    beforeStart: (s, b) => `${s} Min. Lernen · ${b} Min. Pause`,
    timerNote: (n, done, total) => `Timer · ${n} Zyklus/Zyklen${total ? ` · ✅ ${done}/${total} Aufgaben` : ""}`,
    badges: {
      start: { label: "Erster Schritt", how: "Erfasse deine erste Lernsitzung, per Timer oder manuell eingegeben.", progress: (n) => `${n}/1 Sitzung` },
      streak7: { label: "Beständigkeit", how: "Lerne mindestens ein bisschen jeden Tag, 7 Tage in Folge, ohne einen Tag auszulassen.", progress: (n) => `${n}/7 Tage in Folge` },
      ten: { label: "Zehn Sitzungen", how: "Erfasse mindestens 10 Lernsitzungen, auch in verschiedenen Fächern.", progress: (n) => `${n}/10 Sitzungen` },
      fifty: { label: "50 Stunden gesamt", how: "Sammle insgesamt 50 Stunden Lernzeit aus allen erfassten Sitzungen.", progress: (n) => `${n}/50 Std.` },
      specialist: { label: "Spezialist", how: "Erreiche 20 Stunden Lernzeit in einem einzigen Fach, um dessen Spezialist zu werden.", progress: () => "20 Std. in einem Fach" },
      planner: { label: "Planer", how: "Füge mindestens einen Termin oder eine Prüfung im Bereich 'Anstehende Termine' hinzu.", progress: (n) => `${n}/1 Termin` },
    },
  },
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}
function fmtDate(d, localeTag) {
  return new Date(d).toLocaleDateString(localeTag || "it-IT", { day: "2-digit", month: "short" });
}
function fmtClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function StudyPlanner() {
  const [sessions, setSessions] = useState([]);
  const [exams, setExams] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2);
  const [loaded, setLoaded] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [sForm, setSForm] = useState({ subject: "", hours: "", date: todayStr(), note: "" });
  const [eForm, setEForm] = useState({ subject: "", name: "", date: "" });
  const [sFormError, setSFormError] = useState("");
  const [eFormError, setEFormError] = useState("");

  // Lingua dell'interfaccia (persistita insieme al resto dei dati)
  const [language, setLanguage] = useState("it");
  const t = LOCALES[language] || LOCALES.it;
  const localeTag = LOCALE_TAGS[language] || "it-IT";

  // Tema chiaro/scuro (persistito insieme al resto dei dati)
  const [theme, setTheme] = useState("light");
  const T = theme === "dark" ? DARK_THEME : LIGHT_THEME;

  // Editing state for recent sessions and upcoming exams (inline edit rows)
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editSessionDraft, setEditSessionDraft] = useState(null);
  const [editSessionError, setEditSessionError] = useState("");
  const [editingExamId, setEditingExamId] = useState(null);
  const [editExamDraft, setEditExamDraft] = useState(null);

  // Achievement detail modal
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Flow: "closed" -> "setup" -> "focus" (atmospheric timer screen)
  const [flowStage, setFlowStage] = useState("closed");
  const [setupTab, setSetupTab] = useState("timer");
  const [timerCfg, setTimerCfg] = useState({ subject: "", studyMinutes: 30, breakMinutes: 5 });
  const [phase, setPhase] = useState("study");
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  // To-do list built before starting a pomodoro, then checked off during the session.
  const [setupTasks, setSetupTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [pomodoroTasks, setPomodoroTasks] = useState([]);

  // Refs hold the source of truth for the ticking loop so it's timestamp-based (accurate even if the tab is backgrounded).
  const phaseRef = useRef("study");
  const phaseDurationRef = useRef(30 * 60);
  const endTimestampRef = useRef(0);
  const cfgRef = useRef(timerCfg);
  const accumulatedStudyRef = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          const p = JSON.parse(res.value);
          setSessions(p.sessions || []);
          setExams(p.exams || []);
          setDailyGoal(p.dailyGoal || 2);
          if (p.language && LOCALES[p.language]) setLanguage(p.language);
          if (p.theme === "dark" || p.theme === "light") setTheme(p.theme);
          else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
        } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setTheme("dark");
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback(async (next) => {
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(next), false); }
    catch (e) { console.error("Storage error:", e); }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    persist({ sessions, exams, dailyGoal, language, theme });
  }, [sessions, exams, dailyGoal, language, theme, loaded, persist]);

  const subjects = useMemo(() => {
    const set = new Set();
    sessions.forEach((s) => set.add(s.subject));
    return Array.from(set).sort();
  }, [sessions]);

  const totalHours = useMemo(() => sessions.reduce((a, s) => a + Number(s.hours || 0), 0), [sessions]);
  const todayHours = useMemo(() => sessions.filter((s) => s.date === todayStr()).reduce((a, s) => a + Number(s.hours || 0), 0), [sessions]);
  const ringPct = Math.max(0, Math.min(1, dailyGoal > 0 ? todayHours / dailyGoal : 0));

  const hoursByDay = useMemo(() => {
    const map = {};
    sessions.forEach((s) => { map[s.date] = (map[s.date] || 0) + Number(s.hours || 0); });
    return map;
  }, [sessions]);

  const { streak, streakDates } = useMemo(() => {
    let count = 0;
    let d = new Date();
    if (!hoursByDay[todayStr()]) d.setDate(d.getDate() - 1);
    const dates = new Set();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (hoursByDay[key] > 0) { count++; dates.add(key); d.setDate(d.getDate() - 1); }
      else break;
    }
    return { streak: count, streakDates: dates };
  }, [hoursByDay]);

  const sessionsThisWeek = useMemo(() => {
    const now = new Date();
    const start = new Date(now); start.setDate(now.getDate() - 6);
    return sessions.filter((s) => new Date(s.date) >= start).length;
  }, [sessions]);

  const onTargetRate = useMemo(() => {
    let hit = 0, total = 0;
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      total++;
      if ((hoursByDay[key] || 0) >= dailyGoal && dailyGoal > 0) hit++;
    }
    return total ? Math.round((hit / total) * 100) : 0;
  }, [hoursByDay, dailyGoal]);

  const YEAR_STREAK = 365;
  const HEATMAP_DAYS = 126; // 18 settimane: un quadrato più grande e prominente
  const heatDays = useMemo(() => {
    const arr = [];
    for (let i = HEATMAP_DAYS - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      arr.push({ key, hours: hoursByDay[key] || 0, date: d });
    }
    const weeks = [];
    for (let i = 0; i < arr.length; i += 7) weeks.push(arr.slice(i, i + 7));
    return weeks;
  }, [hoursByDay]);

  // Colore/aspetto di ogni quadretto: scala normale fino all'argento in base alle ore,
  // ma se la costanza (streak) raggiunge 1 anno, i giorni dello streak diventano oro.
  function heatCellStyle(d) {
    const isGoldStreak = streak >= YEAR_STREAK && streakDates.has(d.key);
    if (isGoldStreak) {
      return {
        background: "linear-gradient(135deg, #FCE8B2 0%, #E8B84B 55%, #B9862A 100%)",
        boxShadow: "0 0 0 1px rgba(185,134,42,0.5), 0 0 6px rgba(232,184,75,0.55)",
      };
    }
    const h = d.hours;
    if (h <= 0) return { background: T.border };
    if (h < 1) return { background: "#CFE0F5" };
    if (h < 2) return { background: "#9CC0EA" };
    if (h < 3) return { background: "#5B93D6" };
    if (h < 4) return { background: "#2F5FA8" };
    if (h < 6) return { background: T.primary };
    // livello massimo "in argento" per le giornate più intense
    return {
      background: "linear-gradient(135deg, #F2F4F7 0%, #C7CDD6 55%, #9AA3B1 100%)",
      boxShadow: "0 0 0 1px rgba(154,163,177,0.4), 0 0 4px rgba(154,163,177,0.5)",
    };
  }

  const upcomingExams = useMemo(
    () => [...exams].sort((a, b) => new Date(a.date) - new Date(b.date)).filter((e) => daysUntil(e.date) >= 0).map((e) => ({ ...e, days: daysUntil(e.date) })),
    [exams]
  );

  const badges = useMemo(() => {
    const subjWith20 = subjects.some((subj) => sessions.filter((s) => s.subject === subj).reduce((a, s) => a + Number(s.hours), 0) >= 20);
    const b = t.badges;
    return [
      {
        key: "start", label: b.start.label, icon: Zap, color: T.gold, earned: sessions.length >= 1,
        how: b.start.how, progress: b.start.progress(Math.min(sessions.length, 1)),
      },
      {
        key: "streak7", label: b.streak7.label, icon: Flame, color: T.red, earned: streak >= 7,
        how: b.streak7.how, progress: b.streak7.progress(Math.min(streak, 7)),
      },
      {
        key: "ten", label: b.ten.label, icon: Target, color: T.green, earned: sessions.length >= 10,
        how: b.ten.how, progress: b.ten.progress(Math.min(sessions.length, 10)),
      },
      {
        key: "fifty", label: b.fifty.label, icon: Trophy, color: T.amber, earned: totalHours >= 50,
        how: b.fifty.how, progress: b.fifty.progress(Math.round(Math.min(totalHours, 50) * 10) / 10),
      },
      {
        key: "specialist", label: b.specialist.label, icon: Award, color: T.primary, earned: subjWith20,
        how: b.specialist.how, progress: b.specialist.progress(),
      },
      {
        key: "planner", label: b.planner.label, icon: CalendarClock, color: "#3E7C8C", earned: exams.length >= 1,
        how: b.planner.how, progress: b.planner.progress(Math.min(exams.length, 1)),
      },
    ];
  }, [sessions, streak, totalHours, subjects, exams, t, T]);

  // Returns true on success, false (and sets an error message) if validation fails.
  function addSession(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!sForm.subject.trim()) {
      setSFormError(t.errSubjectRequired);
      return false;
    }
    if (sForm.hours === "" || sForm.hours === null || Number(sForm.hours) <= 0 || Number.isNaN(Number(sForm.hours))) {
      setSFormError(t.errHoursRequired);
      return false;
    }
    setSessions((p) => [...p, { id: uid(), subject: sForm.subject.trim(), hours: Number(sForm.hours), date: sForm.date, note: sForm.note.trim() }]);
    setSForm({ subject: "", hours: "", date: todayStr(), note: "" });
    setSFormError("");
    return true;
  }
  function addExam(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!eForm.subject.trim() || !eForm.date) {
      setEFormError(t.errExamFields);
      return false;
    }
    setExams((p) => [...p, { id: uid(), subject: eForm.subject.trim(), name: eForm.name.trim(), date: eForm.date }]);
    setEForm({ subject: "", name: "", date: "" });
    setEFormError("");
    setShowExamForm(false);
    return true;
  }
  function removeExam(id) { setExams((p) => p.filter((e) => e.id !== id)); }
  function removeSession(id) { setSessions((p) => p.filter((s) => s.id !== id)); }

  function startEditSession(s) {
    setEditingSessionId(s.id);
    setEditSessionDraft({ subject: s.subject, hours: String(s.hours), date: s.date, note: s.note || "" });
    setEditSessionError("");
  }
  function cancelEditSession() {
    setEditingSessionId(null);
    setEditSessionDraft(null);
    setEditSessionError("");
  }
  function saveEditSession(id) {
    if (!editSessionDraft.subject.trim()) {
      setEditSessionError(t.errSessionSubjectEmpty);
      return;
    }
    if (editSessionDraft.hours === "" || Number(editSessionDraft.hours) <= 0 || Number.isNaN(Number(editSessionDraft.hours))) {
      setEditSessionError(t.errSessionHoursRequired);
      return;
    }
    setSessions((p) => p.map((s) => s.id === id
      ? { ...s, subject: editSessionDraft.subject.trim(), hours: Number(editSessionDraft.hours), date: editSessionDraft.date, note: editSessionDraft.note.trim() }
      : s));
    cancelEditSession();
  }

  function startEditExam(ex) {
    setEditingExamId(ex.id);
    setEditExamDraft({ subject: ex.subject, name: ex.name || "", date: ex.date });
  }
  function cancelEditExam() {
    setEditingExamId(null);
    setEditExamDraft(null);
  }
  function saveEditExam(id) {
    if (!editExamDraft.subject.trim() || !editExamDraft.date) return;
    setExams((p) => p.map((ex) => ex.id === id
      ? { ...ex, subject: editExamDraft.subject.trim(), name: editExamDraft.name.trim(), date: editExamDraft.date }
      : ex));
    cancelEditExam();
  }

  const recentSessions = useMemo(() => [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [sessions]);

  // Timestamp-based ticking loop: recomputes remaining seconds from a fixed end-time each tick,
  // so it can't drift or silently stall, and correctly rolls over study <-> break.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const remain = Math.max(0, Math.ceil((endTimestampRef.current - Date.now()) / 1000));
      setSecondsLeft(remain);
      if (remain <= 0) {
        const cfg = cfgRef.current;
        if (phaseRef.current === "study") {
          accumulatedStudyRef.current += phaseDurationRef.current;
          setCycles((c) => c + 1);
          if (cfg.breakMinutes > 0) {
            phaseRef.current = "break";
            phaseDurationRef.current = cfg.breakMinutes * 60;
          } else {
            phaseRef.current = "study";
            phaseDurationRef.current = cfg.studyMinutes * 60;
          }
        } else {
          phaseRef.current = "study";
          phaseDurationRef.current = cfg.studyMinutes * 60;
        }
        endTimestampRef.current = Date.now() + phaseDurationRef.current * 1000;
        setPhase(phaseRef.current);
        setSecondsLeft(phaseDurationRef.current);
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  function openSetup() { setSetupTab("timer"); setFlowStage("setup"); setSFormError(""); setSetupTasks([]); setTaskInput(""); }
  function cancelFlow() { setFlowStage("closed"); setSFormError(""); }

  function addSetupTask(e) {
    if (e && e.preventDefault) e.preventDefault();
    const text = taskInput.trim();
    if (!text) return;
    setSetupTasks((p) => [...p, { id: uid(), text }]);
    setTaskInput("");
  }
  function removeSetupTask(id) { setSetupTasks((p) => p.filter((t) => t.id !== id)); }
  function toggleTask(id) { setPomodoroTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }

  // "Avvia timer" in the setup form arms the timer and opens the focus screen, ready but not yet counting down.
  function armTimer(e) {
    if (e && e.preventDefault) e.preventDefault();
    const cfg = {
      subject: timerCfg.subject.trim() || t.defaultSubject,
      studyMinutes: Math.max(1, Number(timerCfg.studyMinutes) || 30),
      breakMinutes: Math.max(0, Number(timerCfg.breakMinutes) || 0),
    };
    cfgRef.current = cfg;
    setTimerCfg(cfg);
    phaseRef.current = "study";
    phaseDurationRef.current = cfg.studyMinutes * 60;
    accumulatedStudyRef.current = 0;
    setPhase("study");
    setSecondsLeft(phaseDurationRef.current);
    setCycles(0);
    setStarted(false);
    setRunning(false);
    // Se è rimasto del testo non ancora aggiunto nel campo to-do, lo includiamo comunque
    // così non si perde un'attività digitata ma non confermata con "+" o Invio.
    const pendingText = taskInput.trim();
    const finalTasks = pendingText ? [...setupTasks, { id: uid(), text: pendingText }] : setupTasks;
    setPomodoroTasks(finalTasks.map((t) => ({ ...t, done: false })));
    setSetupTasks([]);
    setTaskInput("");
    setFlowStage("focus");
  }

  // "Inizia a Concentrarti" actually starts the countdown.
  function beginCountdown() {
    endTimestampRef.current = Date.now() + phaseDurationRef.current * 1000;
    setStarted(true);
    setRunning(true);
  }

  function togglePause() {
    if (running) {
      setRunning(false);
    } else {
      endTimestampRef.current = Date.now() + secondsLeft * 1000;
      setRunning(true);
    }
  }

  function liveStudySeconds() {
    return accumulatedStudyRef.current + (phaseRef.current === "study" ? (phaseDurationRef.current - secondsLeft) : 0);
  }

  function stopTimer() {
    const hrs = Math.round((liveStudySeconds() / 3600) * 100) / 100;
    const totalTasks = pomodoroTasks.length;
    const doneTasks = pomodoroTasks.filter((t) => t.done).length;
    if (hrs >= 0.02) {
      setSessions((p) => [...p, {
        id: uid(), subject: cfgRef.current.subject, hours: hrs, date: todayStr(),
        note: t.timerNote(cycles, doneTasks, totalTasks),
        taskScore: totalTasks ? { done: doneTasks, total: totalTasks } : null,
      }]);
    }
    setRunning(false);
    setStarted(false);
    setFlowStage("closed");
    setPomodoroTasks([]);
  }

  function backFromFocus() {
    if (started) stopTimer();
    else { setFlowStage("closed"); setPomodoroTasks([]); }
  }

  const R = 46, CIRC = 2 * Math.PI * R;

  // ---- Full-bleed atmospheric focus screen ----
  if (flowStage === "focus") {
    const totalPhaseSeconds = phaseDurationRef.current || 1;
    const elapsedFraction = started ? Math.min(1, Math.max(0, 1 - secondsLeft / totalPhaseSeconds)) : 0;
    const numTicks = 60;
    const activeTicks = Math.round(elapsedFraction * numTicks);
    const skylineHeights = [30, 55, 42, 70, 48, 95, 60, 78, 50, 88, 58, 72, 40, 66, 54, 46, 82, 60, 42, 68, 50, 74];
    // Con una to-do list attiva riduciamo un po' l'ingombro verticale (orologio più piccolo,
    // margini più stretti) così la card resta comoda anche su schermi bassi, senza dover scorrere.
    const hasTasks = pomodoroTasks.length > 0;
    const ringSize = hasTasks ? 224 : 280;
    const ringCenter = ringSize / 2;
    const clockFontSize = hasTasks ? 46 : 56;

    return (
      <div
        style={{
          minHeight: "100vh", width: "100%", position: "relative", overflow: "hidden",
          background: "linear-gradient(180deg, #16233D 0%, #3E4E68 32%, #7D7A78 62%, #C99B72 88%, #DDA96F 100%)",
          fontFamily: sans, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}
        className="w-full"
      >
        {/* horizon glow */}
        <div style={{
          position: "absolute", left: "50%", bottom: -60, width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,214,160,0.55) 0%, rgba(255,214,160,0) 70%)",
          transform: "translateX(-50%)", pointerEvents: "none",
        }} />

        {/* abstract skyline silhouette */}
        <svg viewBox="0 0 800 140" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "26%", opacity: 0.92, pointerEvents: "none" }}>
          {skylineHeights.map((h, i) => {
            const w = 800 / skylineHeights.length;
            return <rect key={i} x={i * w} y={140 - h} width={w - 1.5} height={h} fill="rgba(10,18,32,0.55)" />;
          })}
          {/* a slightly taller central tower for focal interest */}
          <rect x="368" y={140 - 118} width="14" height="118" fill="rgba(10,18,32,0.6)" />
          <circle cx="375" cy={140 - 122} r="3" fill="rgba(10,18,32,0.6)" />
        </svg>

        {/* back */}
        <button
          onClick={backFromFocus}
          style={{ position: "absolute", top: 20, left: 20, background: "rgba(255,255,255,0.16)", borderRadius: 999, width: 38, height: 38, zIndex: 2 }}
          className="flex items-center justify-center"
        >
          <ArrowLeft size={16} color="#fff" />
        </button>

        {/* subject / phase label */}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.75, zIndex: 1 }} className={hasTasks ? "mb-4 flex items-center gap-2" : "mb-6 flex items-center gap-2"}>
          {phase === "break" ? <Coffee size={13} /> : <Zap size={13} />}
          {phase === "break" ? t.pauseLabel : cfgRef.current.subject}
        </div>

        {/* dashed ring + clock */}
        <div style={{ position: "relative", width: ringSize, height: ringSize, zIndex: 1 }} className="flex items-center justify-center">
          <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} style={{ position: "absolute", top: 0, left: 0 }}>
            {Array.from({ length: numTicks }).map((_, i) => {
              const angle = i * (360 / numTicks) - 90;
              const rad = (angle * Math.PI) / 180;
              const outerR = ringCenter * 0.94, innerR = ringCenter * 0.83;
              const x1 = ringCenter + outerR * Math.cos(rad), y1 = ringCenter + outerR * Math.sin(rad);
              const x2 = ringCenter + innerR * Math.cos(rad), y2 = ringCenter + innerR * Math.sin(rad);
              const active = i < activeTicks;
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={active ? "#FFFFFF" : "rgba(255,255,255,0.35)"}
                  strokeWidth={active ? 3.2 : 2.4} strokeLinecap="round" />
              );
            })}
          </svg>
          <div style={{ fontSize: clockFontSize, fontWeight: 300, letterSpacing: "0.01em", fontVariantNumeric: "tabular-nums" }}>
            {fmtClock(secondsLeft)}
          </div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.7, zIndex: 1 }} className={hasTasks ? "mt-3 mb-4" : "mt-5 mb-5"}>
          {started
            ? t.cyclesCompleted(cycles, Math.round((liveStudySeconds() / 3600) * 100) / 100)
            : t.beforeStart(cfgRef.current.studyMinutes, cfgRef.current.breakMinutes)}
        </div>

        {hasTasks && (
          <div style={{
            background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)", borderRadius: 16, maxWidth: 320, width: "90%",
            backdropFilter: "blur(6px)", zIndex: 1,
          }} className="p-4 mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", opacity: 0.85 }}>{t.todoFocusTitle}</span>
              <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.95 }}>
                {pomodoroTasks.filter((t) => t.done).length}/{pomodoroTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-1" style={{ maxHeight: 168, overflowY: "auto" }}>
              {pomodoroTasks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTask(t.id)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                  className="flex items-center gap-2.5 py-1 px-0.5"
                >
                  <span style={{
                    width: 19, height: 19, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${t.done ? "#fff" : "rgba(255,255,255,0.55)"}`,
                    background: t.done ? "#fff" : "transparent",
                  }} className="flex items-center justify-center">
                    {t.done && <Check size={12} color={T.primary} strokeWidth={3.5} />}
                  </span>
                  <span style={{ fontSize: 13.5, textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.6 : 0.96 }}>
                    {t.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!started ? (
          <button
            onClick={beginCountdown}
            style={{ background: "rgba(255,255,255,0.94)", color: FOCUS_INK, borderRadius: 999 }}
            className="flex items-center gap-3 pl-2 pr-6 py-2 font-semibold text-base"
          >
            <span style={{ background: FOCUS_INK, borderRadius: 999, width: 34, height: 34 }} className="flex items-center justify-center">
              <Play size={15} color="#fff" fill="#fff" />
            </span>
            {t.startFocusBtn}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={togglePause}
              style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, width: 56, height: 56 }}
              className="flex items-center justify-center"
            >
              {running ? <Pause size={20} color="#fff" fill="#fff" /> : <Play size={20} color="#fff" fill="#fff" />}
            </button>
            <button
              onClick={stopTimer}
              style={{ background: "rgba(255,255,255,0.94)", borderRadius: 999, width: 56, height: 56 }}
              className="flex items-center justify-center"
            >
              <Square size={18} color={FOCUS_INK} fill={FOCUS_INK} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: sans, color: T.ink, fontSize: 15 }} className="w-full p-4 md:p-8">
      <style>{`
        input { font-family: ${sans}; background: ${T.card}; color: ${T.ink}; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: ${theme === "dark" ? "invert(1)" : "none"}; }
        ::placeholder { color: ${T.inkFaint}; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        .planner-shell { max-width: 1360px; margin: 0 auto; }
        .hero-row { grid-template-columns: 2fr 1fr; }
        @media (max-width: 720px) {
          .hero-row { grid-template-columns: 1fr; }
        }
        @media (min-width: 1024px) {
          .planner-shell { font-size: 16px; }
          .planner-shell h1, .planner-shell .pl-title { font-size: 19px; }
        }
        @media (min-width: 1440px) {
          .planner-shell { font-size: 17px; }
        }
      `}</style>

      <div className="planner-shell">

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <img src="/icons/icon-192.png" alt="" width={36} height={36} style={{ borderRadius: 10, display: "block" }} />
          <span className="pl-title" style={{ fontWeight: 700, fontSize: 19 }}>{t.appName}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span style={{ color: T.inkSoft, fontSize: 15 }} className="hidden sm:inline">
            {new Date().toLocaleDateString(localeTag, { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <button
            onClick={() => setTheme((th) => (th === "dark" ? "light" : "dark"))}
            aria-label={theme === "dark" ? t.lightModeAria : t.darkModeAria}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 999, width: 38, height: 38, color: T.inkSoft }}
            className="flex items-center justify-center transition-colors"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 999 }} className="flex items-center p-1 gap-0.5">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                aria-label={l.label}
                style={{
                  borderRadius: 999, fontSize: 12, fontWeight: 700,
                  background: language === l.code ? T.primary : "transparent",
                  color: language === l.code ? "#fff" : T.inkSoft,
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 transition-colors"
              >
                <span>{l.flag}</span>{l.label}
              </button>
            ))}
          </div>
          <a
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: `linear-gradient(135deg, ${T.gold}, #D99A2B)`, color: "#fff", borderRadius: 999,
              boxShadow: "0 4px 12px rgba(232,184,75,0.45)", textDecoration: "none",
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold"
          >
            <Coffee size={16} color="#fff" />
            {t.donate}
          </a>
        </div>
      </div>

      {flowStage === "setup" && (
        <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }} className="p-6 max-w-xl mx-auto">
          <button onClick={cancelFlow} style={{ color: T.inkSoft }} className="flex items-center gap-1 text-sm mb-4">
            <ArrowLeft size={14} /> {t.back}
          </button>

          <div style={{ background: T.bg, borderRadius: 12 }} className="flex p-1 mb-5">
            {[{ id: "timer", label: t.tabTimer }, { id: "manual", label: t.tabManual }].map((tb) => (
              <button
                key={tb.id}
                onClick={() => setSetupTab(tb.id)}
                style={{
                  flex: 1, borderRadius: 10, padding: "9px 0", fontSize: 14, fontWeight: 600,
                  background: setupTab === tb.id ? T.card : "transparent",
                  color: setupTab === tb.id ? T.primary : T.inkSoft,
                  boxShadow: setupTab === tb.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {setupTab === "timer" ? (
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: 13, color: T.inkSoft }} className="block mb-1">{t.subjectLabel}</label>
                <input list="subj" value={timerCfg.subject} onChange={(e) => setTimerCfg({ ...timerCfg, subject: e.target.value })}
                  style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base w-full" placeholder={t.subjectPlaceholder} autoFocus />
                <datalist id="subj">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label style={{ fontSize: 13, color: T.inkSoft }} className="block mb-1">{t.studyMinutesLabel}</label>
                  <input type="number" min="1" step="1" value={timerCfg.studyMinutes}
                    onChange={(e) => setTimerCfg({ ...timerCfg, studyMinutes: e.target.value })}
                    style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base w-full" />
                </div>
                <div className="flex-1">
                  <label style={{ fontSize: 13, color: T.inkSoft }} className="block mb-1">{t.breakMinutesLabel}</label>
                  <input type="number" min="0" step="1" value={timerCfg.breakMinutes}
                    onChange={(e) => setTimerCfg({ ...timerCfg, breakMinutes: e.target.value })}
                    style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base w-full" />
                </div>
              </div>
              <div style={{ fontSize: 12, color: T.inkFaint }}>
                {t.timerHint}
              </div>

              <div>
                <label style={{ fontSize: 13, color: T.inkSoft }} className="block mb-1.5">{t.todoLabel}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSetupTask(); } }}
                    style={{ border: `1px solid ${T.border}`, borderRadius: 10 }}
                    className="px-3 py-2.5 text-base flex-1"
                    placeholder={t.todoPlaceholder}
                  />
                  <button type="button" onClick={addSetupTask} style={{ background: T.primarySoft, color: T.primary, borderRadius: 10 }} className="px-4 flex items-center justify-center">
                    <Plus size={18} />
                  </button>
                </div>
                {setupTasks.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {setupTasks.map((tk) => (
                      <div key={tk.id} style={{ background: T.bg, borderRadius: 8 }} className="flex items-center justify-between">
                        <span className="px-3 py-1.5 text-sm">{tk.text}</span>
                        <button type="button" onClick={() => removeSetupTask(tk.id)} style={{ color: T.inkFaint }} className="px-2.5"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 12, color: T.inkFaint }} className="mt-1.5">
                  {t.todoHint}
                </div>
              </div>

              <button type="button" onClick={armTimer} style={{ background: T.primary, color: "#fff", borderRadius: 12 }} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold mt-1">
                <Play size={14} fill="#fff" /> {t.startTimerBtn}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: 13, color: T.inkSoft }} className="block mb-1">{t.subjectLabel}</label>
                <input list="subj2" value={sForm.subject} onChange={(e) => setSForm({ ...sForm, subject: e.target.value })}
                  style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base w-full" placeholder={t.subjectPlaceholder} />
                <datalist id="subj2">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label style={{ fontSize: 13, color: T.inkSoft }} className="block mb-1">{t.hoursLabel}</label>
                  <input type="number" step="0.25" min="0" value={sForm.hours}
                    onChange={(e) => { setSForm({ ...sForm, hours: e.target.value }); if (sFormError) setSFormError(""); }}
                    style={{ border: `1px solid ${sFormError && !sForm.hours ? T.red : T.border}`, borderRadius: 10 }}
                    className="px-3 py-2.5 text-base w-full" placeholder="2.5" required />
                </div>
                <div className="flex-1">
                  <label style={{ fontSize: 13, color: T.inkSoft }} className="block mb-1">{t.dateLabel}</label>
                  <input type="date" value={sForm.date} onChange={(e) => setSForm({ ...sForm, date: e.target.value })}
                    style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base w-full" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: T.inkSoft }} className="block mb-1">{t.noteLabel}</label>
                <input value={sForm.note} onChange={(e) => setSForm({ ...sForm, note: e.target.value })}
                  style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base w-full" placeholder={t.notePlaceholder} />
              </div>
              {sFormError && (
                <div style={{ background: T.dangerBg, color: T.red, borderRadius: 10, fontSize: 13, fontWeight: 500 }} className="px-3 py-2.5">
                  {sFormError}
                </div>
              )}
              <button type="button" onClick={() => { if (addSession()) cancelFlow(); }} style={{ background: T.primary, color: "#fff", borderRadius: 12 }} className="px-4 py-3 text-sm font-semibold mt-1">{t.saveSessionBtn}</button>
            </div>
          )}
        </div>
      )}

      {flowStage === "closed" && (
      <>
      {/* Hero row */}
      <div className="grid gap-4 mb-4 hero-row">
        <div style={{ background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`, borderRadius: 20 }} className="p-6 flex flex-wrap items-center justify-between gap-4 text-white">
          <div>
            <div style={{ fontSize: 13, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {new Date().toLocaleDateString(localeTag, { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <button
              onClick={openSetup}
              style={{ background: "#fff", color: T.primary, borderRadius: 14 }}
              className="flex items-center gap-2 px-4 py-2.5 mt-2 font-semibold text-lg"
            >
              <span style={{ background: T.primary, borderRadius: 999, width: 24, height: 24 }} className="flex items-center justify-center">
                <Play size={12} color="#fff" fill="#fff" />
              </span>
              {t.registerSession}
            </button>
            <div style={{ fontSize: 14, opacity: 0.85 }} className="mt-3">
              {t.sessionsThisWeek(sessionsThisWeek, subjects.length)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <svg width={110} height={110} viewBox="0 0 110 110">
              <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="9" />
              <circle
                cx="55" cy="55" r={R} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round"
                strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - ringPct)}
                transform="rotate(-90 55 55)"
              />
              <text x="55" y="51" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">{Math.round(todayHours * 10) / 10}</text>
              <text x="55" y="67" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.8)">{t.todayOf(dailyGoal)}</text>
            </svg>
            <div style={{ fontSize: 13 }}>
              <div style={{ opacity: 0.85, marginBottom: 4 }}>{t.dailyGoalLabel}</div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number" min="0.5" step="0.5" value={dailyGoal}
                  onChange={(e) => setDailyGoal(Math.max(0.5, Number(e.target.value) || 0))}
                  style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 52, color: "#fff", fontWeight: 700 }}
                  className="px-2 py-1.5 text-sm"
                />
                <span style={{ opacity: 0.85 }}>{t.perDay}</span>
                <div className="flex flex-col" style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <button
                    type="button"
                    onClick={() => setDailyGoal((g) => Math.round((g + 0.5) * 10) / 10)}
                    aria-label={t.increaseGoalAria}
                    style={{ background: "rgba(255,255,255,0.2)", width: 22, height: 16, color: "#fff" }}
                    className="flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <ChevronUp size={12} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDailyGoal((g) => Math.max(0.5, Math.round((g - 0.5) * 10) / 10))}
                    aria-label={t.decreaseGoalAria}
                    style={{ background: "rgba(255,255,255,0.2)", width: 22, height: 16, color: "#fff", borderTop: "1px solid rgba(255,255,255,0.25)" }}
                    className="flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <ChevronDown size={12} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }} className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={17} color={T.red} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>{t.streakDaysLabel(streak)}</span>
            </div>
            <div style={{ fontSize: 13, color: T.inkSoft }}>{t.keepGoing}</div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-1" style={{ fontSize: 13, color: T.inkSoft }}>
              <span>{t.totalHoursLabel(Math.round(totalHours * 10) / 10)}</span>
              <span>{t.onTargetLabel(onTargetRate)}</span>
            </div>
            <div style={{ background: T.border, borderRadius: 999, height: 8 }}>
              <div style={{ background: T.primary, width: `${onTargetRate}%`, height: 8, borderRadius: 999 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Activity heatmap — full width, prominent */}
      <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }} className="p-6 mb-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span style={{ fontWeight: 700, fontSize: 17 }}>{t.activityTitle}</span>
          <div className="flex items-center gap-4 flex-wrap">
            <span style={{ fontSize: 12, color: T.inkFaint }} className="flex items-center gap-1.5">
              {t.less}
              <span style={{ display: "flex", gap: 3 }}>
                {["", "#CFE0F5", "#9CC0EA", "#5B93D6", "#2F5FA8", T.primary].map((c, i) => (
                  <span key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c || T.border }} />
                ))}
                <span style={{
                  width: 12, height: 12, borderRadius: 3,
                  background: "linear-gradient(135deg, #F2F4F7 0%, #C7CDD6 55%, #9AA3B1 100%)",
                }} />
              </span>
              {t.silver}
            </span>
            <span
              style={{
                fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                background: streak >= YEAR_STREAK
                  ? "linear-gradient(135deg, #FCE8B2 0%, #E8B84B 55%, #B9862A 100%)"
                  : T.border,
                color: streak >= YEAR_STREAK ? "#5C3E0C" : T.inkFaint,
              }}
              className="flex items-center gap-1.5"
            >
              {t.goldBadge}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 4 }}>
          {heatDays.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {week.map((d) => (
                <div
                  key={d.key}
                  title={`${fmtDate(d.date, localeTag)} · ${d.hours}h${streak >= YEAR_STREAK && streakDates.has(d.key) ? ` · ${t.goldBadge}` : ""}`}
                  style={{ width: 17, height: 17, borderRadius: 4, transition: "transform 0.15s", ...heatCellStyle(d) }}
                  className="hover:scale-110"
                />
              ))}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              {streak}{streak >= YEAR_STREAK && <span style={{ fontSize: 15 }}>🥇</span>}
            </div>
            <div style={{ fontSize: 12, color: T.inkSoft }}>{t.streakDaysStat}</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{sessionsThisWeek}</div>
            <div style={{ fontSize: 12, color: T.inkSoft }}>{t.weekStat}</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{onTargetRate}%</div>
            <div style={{ fontSize: 12, color: T.inkSoft }}>{t.onTargetStat}</div>
          </div>
        </div>
      </div>

      {/* Two column row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {/* Exams */}
        <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontWeight: 700, fontSize: 15 }}>{t.examsTitle}</span>
            <button onClick={() => { setShowExamForm((v) => !v); setEFormError(""); }} style={{ color: T.primary }}><Plus size={18} /></button>
          </div>
          {showExamForm && (
            <div className="flex flex-col gap-2 mb-3">
              <input value={eForm.subject} onChange={(e) => setEForm({ ...eForm, subject: e.target.value })}
                style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base" placeholder={t.subjectLabel} />
              <input value={eForm.name} onChange={(e) => setEForm({ ...eForm, name: e.target.value })}
                style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base" placeholder={t.descPlaceholder} />
              <input type="date" value={eForm.date} onChange={(e) => setEForm({ ...eForm, date: e.target.value })}
                style={{ border: `1px solid ${T.border}`, borderRadius: 10 }} className="px-3 py-2.5 text-base" />
              {eFormError && <div style={{ color: T.red, fontSize: 12 }}>{eFormError}</div>}
              <button type="button" onClick={addExam} style={{ background: T.primary, color: "#fff", borderRadius: 10 }} className="px-3 py-2 text-sm font-medium">{t.addBtn}</button>
            </div>
          )}
          {upcomingExams.length === 0 ? (
            <div style={{ fontSize: 14, color: T.inkSoft }}>{t.noExams}</div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {upcomingExams.map((e) => (
                editingExamId === e.id ? (
                  <div key={e.id} style={{ background: T.bg, borderRadius: 12 }} className="p-2.5 flex flex-col gap-2">
                    <input value={editExamDraft.subject} onChange={(ev) => setEditExamDraft({ ...editExamDraft, subject: ev.target.value })}
                      style={{ border: `1px solid ${T.border}`, borderRadius: 8 }} className="px-2.5 py-1.5 text-sm" placeholder={t.subjectLabel} />
                    <input value={editExamDraft.name} onChange={(ev) => setEditExamDraft({ ...editExamDraft, name: ev.target.value })}
                      style={{ border: `1px solid ${T.border}`, borderRadius: 8 }} className="px-2.5 py-1.5 text-sm" placeholder={t.descPlaceholder} />
                    <input type="date" value={editExamDraft.date} onChange={(ev) => setEditExamDraft({ ...editExamDraft, date: ev.target.value })}
                      style={{ border: `1px solid ${T.border}`, borderRadius: 8 }} className="px-2.5 py-1.5 text-sm" />
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={cancelEditExam} style={{ color: T.inkFaint }} className="flex items-center gap-1 text-xs px-2 py-1"><X size={13} /> {t.cancel}</button>
                      <button onClick={() => saveEditExam(e.id)} style={{ background: T.primary, color: "#fff", borderRadius: 8 }} className="flex items-center gap-1 text-xs px-3 py-1.5 font-semibold"><Check size={13} /> {t.save}</button>
                    </div>
                  </div>
                ) : (
                  <div key={e.id} className="flex items-center justify-between group">
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{e.subject}{e.name ? ` · ${e.name}` : ""}</div>
                      <div style={{ fontSize: 13, color: T.inkSoft }}>{fmtDate(e.date, localeTag)}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                        background: e.days <= 3 ? T.dangerBg : e.days <= 7 ? T.warnBg : T.primarySoft,
                        color: e.days <= 3 ? T.red : e.days <= 7 ? T.warnText : T.primary,
                      }}>{e.days}{t.daysSuffix}</span>
                      <button onClick={() => startEditExam(e)} style={{ color: T.inkFaint }} className="p-1" aria-label={t.editExamAria}><Pencil size={14} /></button>
                      <button onClick={() => removeExam(e.id)} style={{ color: T.inkFaint }} className="p-1" aria-label={t.deleteExamAria}><Trash2 size={14} /></button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontWeight: 700, fontSize: 15 }}>{t.achievementsTitle}</span>
            <span style={{ fontSize: 12, color: T.inkFaint }}>{t.ofCount(badges.filter((b) => b.earned).length, badges.length)}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => {
              const Icon = b.earned ? b.icon : Lock;
              return (
                <button
                  key={b.key}
                  onClick={() => setSelectedBadge(b)}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                  className="flex flex-col items-center text-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                    background: b.earned ? b.color : T.border,
                  }}>
                    <Icon size={19} color={b.earned ? "#fff" : T.inkFaint} />
                  </div>
                  <span style={{ fontSize: 11, color: b.earned ? T.ink : T.inkFaint, lineHeight: 1.25 }}>{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }} className="p-5 mt-4">
          <span style={{ fontWeight: 700, fontSize: 15 }} className="block mb-3">{t.recentSessionsTitle}</span>
          <div className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              editingSessionId === s.id ? (
                <div key={s.id} style={{ background: T.bg, borderRadius: 12 }} className="p-3 flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <input value={editSessionDraft.subject} onChange={(e) => setEditSessionDraft({ ...editSessionDraft, subject: e.target.value })}
                      style={{ border: `1px solid ${T.border}`, borderRadius: 8 }} className="px-2.5 py-1.5 text-sm flex-1 min-w-[120px]" placeholder={t.subjectLabel} />
                    <input type="number" step="0.25" min="0" value={editSessionDraft.hours}
                      onChange={(e) => setEditSessionDraft({ ...editSessionDraft, hours: e.target.value })}
                      style={{ border: `1px solid ${editSessionError && !editSessionDraft.hours ? T.red : T.border}`, borderRadius: 8, width: 80 }}
                      className="px-2.5 py-1.5 text-sm" placeholder={t.hoursLabel.replace(" *", "")} />
                    <input type="date" value={editSessionDraft.date} onChange={(e) => setEditSessionDraft({ ...editSessionDraft, date: e.target.value })}
                      style={{ border: `1px solid ${T.border}`, borderRadius: 8 }} className="px-2.5 py-1.5 text-sm" />
                  </div>
                  <input value={editSessionDraft.note} onChange={(e) => setEditSessionDraft({ ...editSessionDraft, note: e.target.value })}
                    style={{ border: `1px solid ${T.border}`, borderRadius: 8 }} className="px-2.5 py-1.5 text-sm" placeholder={t.noteLabel} />
                  {editSessionError && <div style={{ color: T.red, fontSize: 12, fontWeight: 500 }}>{editSessionError}</div>}
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={cancelEditSession} style={{ color: T.inkFaint }} className="flex items-center gap-1 text-xs px-2 py-1"><X size={13} /> {t.cancel}</button>
                    <button onClick={() => saveEditSession(s.id)} style={{ background: T.primary, color: "#fff", borderRadius: 8 }} className="flex items-center gap-1 text-xs px-3 py-1.5 font-semibold"><Check size={13} /> {t.save}</button>
                  </div>
                </div>
              ) : (
                <div key={s.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {s.subject}{s.note ? <span style={{ color: T.inkSoft, fontWeight: 400 }}> · {s.note.replace(/ · ✅ \d+\/\d+ (attività|tasks|tareas|Aufgaben)/, "")}</span> : ""}
                    {s.taskScore && (
                      <span style={{
                        marginLeft: 8, fontSize: 12, fontWeight: 700, padding: "1px 8px", borderRadius: 999,
                        background: s.taskScore.done === s.taskScore.total ? T.successBg : T.primarySoft,
                        color: s.taskScore.done === s.taskScore.total ? T.green : T.primary,
                      }}>
                        ✅ {s.taskScore.done}/{s.taskScore.total}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3" style={{ fontSize: 13, color: T.inkSoft }}>
                    <span>{s.hours}h</span>
                    <span>{fmtDate(s.date, localeTag)}</span>
                    <button onClick={() => startEditSession(s)} style={{ color: T.inkFaint }} className="p-1" aria-label={t.editSessionAria}><Pencil size={14} /></button>
                    <button onClick={() => removeSession(s.id)} style={{ color: T.inkFaint }} className="p-1" aria-label={t.deleteSessionAria}><Trash2 size={14} /></button>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <div style={{ background: T.card, borderRadius: 20, border: `1px dashed ${T.border}` }} className="p-10 mt-4 text-center">
          <div style={{ fontSize: 14, color: T.inkSoft }}>{t.noSessions}</div>
        </div>
      )}

      <div className="flex justify-center mt-8 mb-2">
        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: `linear-gradient(135deg, ${T.gold}, #D99A2B)`, color: "#fff", textDecoration: "none",
            borderRadius: 999, boxShadow: "0 6px 16px rgba(232,184,75,0.4)",
          }}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold"
        >
          <Coffee size={17} color="#fff" />
          {t.donateFooter}
          <Heart size={14} color="#fff" fill="#fff" />
        </a>
      </div>
      </>
      )}

      {selectedBadge && (
        <div
          onClick={() => setSelectedBadge(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(20,20,40,0.45)", zIndex: 50 }}
          className="flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: T.card, borderRadius: 20, maxWidth: 380, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}
            className="p-6 relative"
          >
            <button
              onClick={() => setSelectedBadge(null)}
              style={{ position: "absolute", top: 14, right: 14, color: T.inkFaint }}
              aria-label={t.closeAria}
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div style={{
                width: 52, height: 52, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                background: selectedBadge.earned ? selectedBadge.color : T.border,
              }}>
                {React.createElement(selectedBadge.earned ? selectedBadge.icon : Lock, { size: 22, color: selectedBadge.earned ? "#fff" : T.inkFaint })}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{selectedBadge.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: selectedBadge.earned ? T.green : T.inkFaint }}>
                  {selectedBadge.earned ? t.unlockedLabel : t.lockedLabel}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 mb-3" style={{ background: T.bg, borderRadius: 12, padding: "12px 14px" }}>
              <Info size={16} color={T.primary} style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ fontSize: 14, color: T.ink, lineHeight: 1.5 }}>{selectedBadge.how}</div>
            </div>
            <div style={{ fontSize: 13, color: T.inkSoft }}>{t.progressLabel} <strong style={{ color: T.ink }}>{selectedBadge.progress}</strong></div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
