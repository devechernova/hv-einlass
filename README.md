# HV-Einlass – AMAG Soft AG

## 1. Projektbeschreibung

HV-Einlass ist eine Webanwendung zur Unterstützung des Einlasses bei der jährlichen Hauptversammlung der AMAG Soft AG.

Die Anwendung lädt ein Aktienregister mit 20 Aktionären aus einer JSON-Datei und stellt die Daten übersichtlich in einer Tabelle dar. Mitarbeitende können Aktionäre suchen, nach Stadt filtern und ihren Check-in erfassen. Die Versammlungsleitung erhält eine aktuelle Übersicht über die anwesenden Aktionäre und die vertretenen Stimmen.

## 2. Projektziel

Ziel des Projekts ist es, den Einlass zur Hauptversammlung digital zu unterstützen und die Präsenz der Aktionäre jederzeit nachvollziehbar darzustellen.

Die Anwendung ermöglicht:

- die Anzeige aller Aktionäre in einer Tabelle;
- die Suche nach Name oder Aktionärsnummer;
- die Filterung nach Stadt;
- den Check-in eines Aktionärs;
- die Speicherung der Check-ins über das Neuladen der Seite hinaus;
- die Berechnung der anwesenden Aktionäre und Stimmen.

Jede Aktie entspricht einer Stimme. Insgesamt umfasst das Aktienregister 100.000 Aktien bzw. Stimmen.

## 3. Verwendete Technologien

| Bereich | Technologie |
|---|---|
| Struktur | HTML5 |
| Gestaltung | CSS3 (Custom Properties) |
| Programmiersprache | JavaScript (Vanilla JavaScript) |
| Datenquelle | JSON |
| Daten laden | Fetch API (`async` / `await`) |
| Speicherung der Check-ins | Browser `localStorage` |
| Entwicklungsumgebung | Visual Studio Code |
| Lokaler Webserver | Live Server |
| Versionsverwaltung | Git und GitHub |

Es werden keine JavaScript-Frameworks und keine Datenbank benötigt.

## 4. Projektstruktur

```text
HV-Einlass/
│
├── css/
│   └── style.css
│
├── data/
│   └── shareholders.json
│
├── js/
│   └── app.js
│
├── index.html
├── .gitignore
└── README.md
```

## 5. Implementierte Funktionen

### 5.1 Aktienregister laden und anzeigen

- Die Aktionärsdaten werden mit der Fetch API aus `data/shareholders.json` geladen.
- Die HTTP-Antwort wird mit `response.ok` überprüft.
- Bei einem Ladefehler wird eine Fehlermeldung mit dem Statuscode angezeigt.
- Alle 20 Aktionäre werden in einer HTML-Tabelle dargestellt.
- Angezeigt werden Aktionärsnummer, Name, Typ, Wohnort, Aktien und Check-in-Status.
- Bei mehreren Anschriften wird die Hauptanschrift mit einem Zusatz wie `(+1)` angezeigt.
- Aktienzahlen werden mit `toLocaleString("de-DE")` formatiert und rechtsbündig ausgerichtet.

### 5.2 Suche und Stadtfilter

- Die Suche berücksichtigt Namen unabhängig von Groß- und Kleinschreibung.
- Zusätzlich kann eine exakte Aktionärsnummer eingegeben werden.
- Die Städteauswahl wird dynamisch aus allen Anschriften erstellt.
- Jede Stadt erscheint in der Auswahlliste nur einmal.
- Ein Aktionär wird bei einem Stadtfilter berücksichtigt, wenn mindestens eine seiner Anschriften in der ausgewählten Stadt liegt.
- Suche und Stadtfilter können kombiniert werden.
- Die Tabelle und der Trefferzähler werden bei Änderungen sofort aktualisiert.
- Gibt es keine Treffer, erscheint die Meldung `Kein Aktionär gefunden.`

### 5.3 Check-in und Präsenz

- Nicht eingecheckte Aktionäre erhalten die Schaltfläche `Einchecken`.
- Nach dem Check-in wird der Status `✓ anwesend` angezeigt und die Tabellenzeile hervorgehoben.
- Im `localStorage` werden ausschließlich die Aktionärsnummern unter dem Schlüssel `hv-checkins` gespeichert.
- Beim erneuten Laden der Seite werden die gespeicherten Check-ins wiederhergestellt.
- Die Präsenz wird auf Basis aller Aktionäre berechnet – unabhängig von einer aktiven Suche oder einem Stadtfilter.
- Angezeigt werden die Anzahl der anwesenden Aktionäre, die vertretenen Stimmen und der prozentuale Stimmenanteil.

## 6. Datenmodell und Datenquelle

Die Datei `data/shareholders.json` enthält ein Array mit 20 Aktionären.

Wichtige Eigenschaften eines Aktionärs:

| Eigenschaft | Beschreibung |
|---|---|
| `id` | Aktionärsnummer |
| `name` | Name des Aktionärs |
| `type` | Aktionärstyp (`privat` oder `institutionell`) |
| `shares` | Anzahl der Aktien bzw. Stimmen |
| `address` | Array mit einer Hauptanschrift und gegebenenfalls einer Zustellanschrift |

Die Anschriften enthalten unter anderem die Felder `kind`, `street`, `pc` und `city`.

## 7. Anwendung starten

1. Das Projektverzeichnis `HV-Einlass` in Visual Studio Code öffnen.
2. Sicherstellen, dass die Erweiterung **Live Server** installiert ist.
3. Die Datei `index.html` im Explorer mit der rechten Maustaste anklicken.
4. **Open with Live Server** auswählen.
5. Die Anwendung öffnet sich im Browser.

**Wichtig:** Die Anwendung sollte über Live Server und nicht direkt über eine `file://`-Adresse geöffnet werden, damit der Browser die JSON-Datei mit `fetch()` laden kann.

## 8. Kontroll- und Testergebnisse

Die Umsetzung wurde anhand der Kontrollwerte aus der Aufgabenstellung geprüft.

### Suche und Stadtfilter

| Test | Erwartetes Ergebnis |
|---|---:|
| Anzahl der Städte | 8 |
| Stadt `Köln` | 7 Aktionäre |
| Suche `ann` | 3 Aktionäre |
| Suche `25` | 1 Aktionär (Hannah Müller) |
| Stadt `Köln` und Suche `er` | 5 Aktionäre |

### Check-in und Präsenz

Für den Kontrolltest werden die Aktionäre mit den Nummern **3, 7, 25 und 62** eingecheckt.

| Kennzahl | Ergebnis |
|---|---:|
| Anwesende Aktionäre | 4 von 20 |
| Anwesende Stimmen | 43.000 von 100.000 |
| Präsenz | 43,0 % |

Zusätzlich wurde geprüft, dass die Check-ins nach dem Neuladen der Seite erhalten bleiben und die Präsenz unabhängig von den gesetzten Filtern korrekt berechnet wird.

## 9. Projektstatus

- [x] Aufgabe 1 – Aktienregister laden und anzeigen
- [x] Aufgabe 2 – Suche und Stadtfilter
- [x] Aufgabe 3 – Check-in und Präsenz mit `localStorage`
- [ ] Aufgabe 4 – Optionale Erweiterung mit einer ASP.NET-Core-Web-API (nicht umgesetzt)

## 10. Fazit

Mit HV-Einlass wurde eine browserbasierte Anwendung erstellt, die die wesentlichen Abläufe am Einlass einer Hauptversammlung unterstützt. Die Aktionärsdaten werden aus einer JSON-Datei geladen, können gesucht und gefiltert werden und lassen sich per Check-in als anwesend markieren.

Durch die Speicherung der Check-ins im `localStorage` bleibt der Anwesenheitsstatus auch nach dem Neuladen der Seite erhalten. Die Präsenzberechnung berücksichtigt stets das gesamte Aktienregister und stellt die vertretenen Stimmen sowie deren prozentualen Anteil dar.

Die Basisaufgaben 1–3 wurden umgesetzt und anhand der vorgegebenen Kontrollwerte getestet.