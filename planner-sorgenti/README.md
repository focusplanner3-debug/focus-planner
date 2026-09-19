# Planner di Studio

App React standalone con timer di studio, streak, mappa attività e obiettivi.

## Prima di pubblicarla: imposta il tuo link di donazione

In fondo alla dashboard c'è un piccolo link "Offrimi un caffè". Apri `src/App.jsx`, cerca la riga:

```js
const DONATION_URL = "https://paypal.me/IlTuoNomePayPal";
```

e sostituiscila con il tuo vero link PayPal.me (o Revolut/Ko-fi, se preferisci).

## Come farla girare sul tuo PC

Ti serve [Node.js](https://nodejs.org) installato (versione 18 o più recente). Poi, da terminale, dentro questa cartella:

```bash
npm install
npm run dev
```

Si aprirà un indirizzo tipo `http://localhost:5173` — aprilo nel browser e l'app è pronta all'uso.

## Farla sembrare un'app vera (senza barra degli indirizzi)

Con `npm run dev` attivo, apri il sito in **Chrome** o **Edge**, poi:
- Chrome: menu ⋮ in alto a destra → **"Installa app…"**
- Edge: menu ··· → **App** → **"Installa questo sito come app"**

Si crea un'icona sul desktop/menu Start che apre l'app in una finestra propria, senza barra del browser.

## Versione "pubblicata" (build ottimizzata)

Se vuoi generare i file statici finali (ad esempio per caricarli su un hosting):

```bash
npm run build
npm run preview   # per testarla in locale prima di pubblicarla
```

I file pronti si trovano nella cartella `dist/`.

## Note

- I dati (sessioni di studio, scadenze, streak) sono salvati nel `localStorage` del browser: restano sul tuo PC, in quel browser specifico. Cambiando browser o computer non li ritrovi.
- Nessun dato viene inviato a server esterni: tutto resta in locale.
