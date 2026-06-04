# Bildungsplan Frontend

Angular-Frontend zur strukturierten Darstellung und Suche von EFZ-Bildungsplandaten.

Dieses Projekt ist Teil der IPA «Benutzerfreundliche GUI zur strukturierten Suche im EFZ-Bildungsplan mit Filterung nach Perspektiven und Bedürfnissen für eine zielgerichtete Ausbildungsplanung».

Das Frontend konsumiert eine bestehende REST-API. Das Backend ist nicht Bestandteil der Frontend-Entwicklung und wird nur lokal gestartet, damit die Daten im Angular-Frontend angezeigt werden können.

## Techstack

* Angular 20
* TypeScript
* HTML5
* CSS3
* Node.js
* npm
* REST-API über HTTP
* Git / GitLab
* Vitest für Unit-Tests

## Voraussetzungen

Vor dem Start müssen folgende Programme beziehungsweise Dateien vorhanden sein:

* Node.js
* npm
* Angular CLI
* Java
* Zugriff auf die Backend-JAR-Datei `bildungsplan-1.0.8.jar`
* Zugriff auf das GitLab-Repository des Frontends

Die verwendete Backend-Version für die lokale Entwicklung ist:

```text
bildungsplan-1.0.8.jar
```

## Projekt lokal vorbereiten

Repository klonen oder lokal öffnen:

```bash
git clone <repository-url>
cd bildungsplan-frontend
```

Abhängigkeiten installieren:

```bash
npm install
```

## Backend starten

Das Backend muss gestartet werden, bevor das Frontend sinnvoll genutzt werden kann. Das Backend wird aus dem Ordner gestartet, in dem sich die Datei `bildungsplan-1.0.8.jar` befindet.

```bash
java -jar bildungsplan-1.0.8.jar
```

Standardmässig startet die REST-API auf Port 8080:

```text
http://localhost:8080
```

## Alternative bei belegtem Port 8080

Falls Port 8080 bereits durch einen anderen Prozess belegt ist, kann das Backend temporär auf einem anderen Port gestartet werden, zum Beispiel auf Port 8008:

```bash
java -jar bildungsplan-1.0.8.jar --server.port=8008
```

Die REST-API ist danach unter folgender Adresse erreichbar:

```text
http://localhost:8008
```

Wichtig: Wenn ein anderer Port verwendet wird, muss die API-Basis-URL im Angular-Frontend entsprechend angepasst werden. Die API-Konfiguration befindet sich im Projekt unter:

```text
src/app/core/config/api.config.ts
```

## Frontend starten

Angular-Entwicklungsserver starten:

```bash
ng serve
```

Die Anwendung ist danach lokal erreichbar unter:

```text
http://localhost:4200
```

Falls im Projekt ein npm-Startscript definiert ist, kann alternativ folgender Befehl verwendet werden:

```bash
npm start
```

## Empfohlene Startreihenfolge

Für eine reproduzierbare lokale Ausführung wird folgende Reihenfolge empfohlen:

1. Backend-JAR starten
2. Prüfen, ob die REST-API erreichbar ist
3. Im Frontend-Projekt `npm install` ausführen, falls die Abhängigkeiten noch nicht installiert sind
4. Frontend mit `ng serve` oder `npm start` starten
5. Anwendung im Browser unter `http://localhost:4200` öffnen

## Tests ausführen

Unit-Tests ausführen:

```bash
npm test
```

Falls ein anderes Testscript im Projekt definiert ist, muss der entsprechende npm-Befehl aus `package.json` verwendet werden.

## Tests mit Coverage ausführen

Falls im Projekt ein Coverage-Script definiert ist, kann die Testabdeckung mit folgendem Befehl geprüft werden:

```bash
npm run test:coverage
```

Alternativ ist der konkret definierte Befehl aus `package.json` zu verwenden.

Die Coverage dient als Nachweis, dass zentrale Services, Komponenten und fachliche Logik automatisiert geprüft wurden.

## Build ausführen

Für eine technische Schlussprüfung kann ein Build ausgeführt werden:

```bash
npm run build
```

Der Build zeigt, ob die Anwendung ohne TypeScript-, Template- oder Konfigurationsfehler gebaut werden kann.

## Projektstruktur

Die Anwendung ist feature-orientiert aufgebaut. API-Zugriffe erfolgen über Angular-Services. Komponenten sind für Darstellung und Benutzerinteraktion zuständig. Wiederverwendbarer Zustand wird über Angular Signals geführt.

Wichtige Bestandteile:

* Auswahl von EFZ
* Auswahl von Fachrichtung / Spezialisierung, falls vorhanden
* Darstellung von Bildungsplandaten im gewählten Kontext
* Anzeige von Lernorten und Modulen
* Suche und Filterung
* Detailansichten
* Navigation zwischen EFZ, Fachrichtung, Lernort, Modul, Handlungskompetenzbereich und Handlungskompetenz
* Fehler- und Leerezustände
* Unit-Tests für zentrale Services und Komponenten

Die wichtigsten Projektbereiche sind:

```text
src/app/core/services
src/app/core/state
src/app/core/config
src/app/features
src/app/models
src/app/app.routes.ts
src/app/app.config.ts
```

## Hinweise zur API

Die Anwendung erwartet eine lokal laufende REST-API. Die API muss vor dem Start beziehungsweise vor der Nutzung des Frontends verfügbar sein.

Wenn das Backend nicht erreichbar ist, können im Frontend keine Daten geladen werden. In diesem Fall sind folgende Punkte zu prüfen:

* Läuft das Backend?
* Stimmt der verwendete Port?
* Ist die API-Basis-URL im Frontend korrekt konfiguriert?
* Wird der Port bereits durch einen anderen Prozess verwendet?
* Wurde das Backend im richtigen Ordner gestartet?
* Ist Java korrekt installiert?

## Relevante API-Endpunkte

Die Anwendung verwendet unter anderem folgende API-Bereiche:

* EFZ
* Fachrichtungen
* Lernorte
* Module
* Handlungskompetenzbereiche
* Handlungskompetenzen

Die konkreten Endpunkte sind in der OpenAPI-Spezifikation beziehungsweise in der Projektdokumentation beschrieben.

## Verhalten bei fehlender Auswahl

Der fachliche Einstieg erfolgt über die Auswahl eines EFZ. Ohne EFZ-Auswahl sind Suche, Detailfunktionen und kontextbezogene Inhalte nicht verfügbar.

Falls für ein EFZ Fachrichtungen vorhanden sind, muss zusätzlich eine Fachrichtung gewählt werden. Erst danach werden die passenden Daten im gewählten Kontext angezeigt.

## Backend-Version

Für die lokale Entwicklung und die Reproduzierbarkeit der Anwendung wird die Backend-Version `bildungsplan-1.0.8.jar` verwendet.

## Versionierung

Der Quellcode wird mit Git versioniert und in GitLab verwaltet. Änderungen sollen nachvollziehbar committed werden.

Empfohlenes Vorgehen:

```bash
git status
git add .
git commit -m "Beschreibende Commit-Nachricht"
git push
```

## Troubleshooting

### Backend startet nicht

Mögliche Ursachen:

* Java ist nicht installiert oder nicht im PATH verfügbar.
* Die Datei `bildungsplan-1.0.8.jar` befindet sich nicht im aktuellen Ordner.
* Der Port ist bereits belegt.

Prüfen:

```bash
java -version
```

### Frontend lädt keine Daten

Mögliche Ursachen:

* Backend läuft nicht.
* API-Port stimmt nicht mit der Frontend-Konfiguration überein.
* Die API-Basis-URL ist falsch gesetzt.
* Netzwerk- oder Proxy-Konfiguration ist nicht korrekt.

### npm install schlägt fehl

Mögliche Ursachen:

* Falsche oder veraltete Node.js-Version.
* Abhängigkeiten sind nicht kompatibel.
* Lokale `node_modules` oder `package-lock.json` sind inkonsistent.

Mögliche Lösung:

```bash
rm -rf node_modules
npm install
```

Unter Windows kann der Ordner `node_modules` alternativ manuell gelöscht werden.

### Tests schlagen fehl

Mögliche Ursachen:

* Mock-Daten passen nicht zu den TypeScript-Interfaces.
* Provider fehlen in der Testkonfiguration.
* Komponenten erwarten Services oder Router-Konfigurationen.
* Änderungen am Code wurden noch nicht in den Tests nachgeführt.

Prüfen:

```bash
npm test
```

## Hinweis zum Projektumfang

Nicht Bestandteil dieses Projekts sind:

* Backend-Anpassungen
* Datenbank-Anpassungen
* Authentifizierung
* Autorisierung
* Rollen- oder Berechtigungssysteme
* produktives Deployment
* Hosting
* Monitoring
* Taxonomie
* Leistungsziele

Diese Punkte sind ausserhalb des definierten IPA-Scopes.
