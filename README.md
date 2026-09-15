# Kaader — fotograafia koduleht

Staatiline fotograafia portfoolio koduleht. Ei vaja build-sammu ega serveripoolset koodi.

## Struktuur

```
kaader/
├── index.html          # Kogu lehe sisu (5 "kaadrit")
├── css/styles.css      # Kõik stiilid
├── js/main.js          # Portfoolio filter, horisontaalne navigatsioon, vorm
├── netlify.toml        # Netlify seadistus
└── .gitignore
```

## Kohalik käivitamine

Ära ava `index.html` otse brauseris (`file://` protokoll tekitab hiljem probleeme). Käivita kohalik server:

```bash
python3 -m http.server 8000
```

Seejärel ava `http://localhost:8000`

Alternatiiv, kui Node on olemas ja tahad automaatset värskendust:

```bash
npx serve .
```

## Disaini põhimõtted

Need on teadlikud valikud — hoia neid muutes tervikpilti silmas.

### Läbiv kontseptsioon
Leht on üles ehitatud **filmirulli** metafoorile. Iga sektsioon on üks "kaader", mille vahel liigutakse **horisontaalselt** (mitte vertikaalselt). Kaadrite üla- ja alaservas jooksevad perforatsiooniribad koos pideva kaadrinumbriga (0001–0100).

### Värvid

| Muutuja | Väärtus | Kasutus |
|---|---|---|
| `--paper` | `#FAFAF8` | Hele taust |
| `--ink` | `#15151A` | Tume taust, tekst |
| `--blue` | `#1F4FA0` | Aktsent (tsüanotüüpia viide) |
| `--yellow` | `#EFC94C` | Aktsent (kontaktlehe märgistus) |

Esilehe taust: `#FFFFF0` (tselluloidi/ivory toon — töötlemata filmimaterjali loomulik värv).

### Kategooriavärvid
Igal portfoolio žanril on oma duotoon, et kasutaja saaks need värvi järgi ära tunda:
- Portree — sinine
- Pulm & sündmus — soe roosakas
- Äri & bränd — mustvalge
- Kontsert & üritus — kollane

### Tüpograafia
- **Archivo** (900) — pealkirjad
- **Inter** — põhitekst
- **Space Mono** — kaadrinumbrid, tehnilised sildid (fotograafia-vernakulaar)

## Teadaolevad lahtised küsimused

- [ ] **Värviperekondade ühtlustamine.** Lehel on praegu kolm suunda korraga: põlenud oranž (nav + perforatsioon), ivory/hall (esileht), sinine + kollane (ülejäänud sektsioonid). Vajab otsust.
- [ ] **Pakkumisvorm ei saada päringuid.** Praegu ainult front-end. Vaja ühendada (Netlify Forms / Formspree / EmailJS).
- [ ] **Kõik pildid on gradient-kohatäited.** Vaja asendada päris fotodega.
- [ ] **Darkroom-vinjett pildiplokkidel** — suund valitud, ehitamata.
- [ ] **Testida päris seadmetes**: hiiratta → horisontaalne teisendus ja mobiilne vertikaalne tagasilangus.

## Ligipääsetavus

- Perforatsiooniribad on `aria-hidden` (puhtalt dekoratiivsed)
- `prefers-reduced-motion` on arvestatud
- Nooleklahvid ← → liiguvad kaadrite vahel, aga ei sega vormiväljade täitmist
