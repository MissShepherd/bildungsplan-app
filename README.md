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

## Voraussetzungen

Vor dem Start müssen folgende Programme installiert sein:

* Node.js
* npm
* Angular CLI
* Java
* Zugriff auf die Backend-JAR-Datei `bildungsplan-1.0.8.jar`

## Backend starten

Das Backend wird aus dem Ordner gestartet, in dem sich die Datei `bildungsplan-1.0.8.jar` befindet:

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

Wichtig: Wenn ein anderer Port verwendet wird, muss die API-Basis-URL im Angular-Frontend entsprechend angepasst werden.

## Frontend installieren

Abhängigkeiten installieren:

```bash
npm install
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

## Tests ausführen

Unit-Tests ausführen:

```bash
npm test
```

Falls ein anderes Testscript im Projekt definiert ist, muss der entsprechende npm-Befehl aus `package.json` verwendet werden.

## Projektstruktur

Die Anwendung ist feature-orientiert aufgebaut. API-Zugriffe erfolgen über Angular-Services. Komponenten sind für Darstellung und Benutzerinteraktion zuständig.

Wichtige Bestandteile:

* Auswahl von EFZ
* Auswahl von Fachrichtung / Spezialisierung, falls vorhanden
* Darstellung von Bildungsplandaten im gewählten Kontext
* Suche und Filterung
* Detailansichten
* Fehler- und Leerezustände
* Unit-Tests für zentrale Services und Komponenten

## Hinweise zur API

Die Anwendung erwartet eine lokal laufende REST-API. Die API muss vor dem Start beziehungsweise vor der Nutzung des Frontends verfügbar sein.

Wenn das Backend nicht erreichbar ist, können im Frontend keine Daten geladen werden. In diesem Fall sind folgende Punkte zu prüfen:

* Läuft das Backend?
* Stimmt der verwendete Port?
* Ist die API-Basis-URL im Frontend korrekt konfiguriert?
* Wird der Port bereits durch einen anderen Prozess verwendet?

## Backend-Version

Für die lokale Entwicklung und die Reproduzierbarkeit der Anwendung wird die Backend-Version `bildungsplan-1.0.8.jar` verwendet.

## Versionierung

Der Quellcode wird mit Git versioniert und in GitLab verwaltet. Änderungen sollen nachvollziehbar committed werden.
