# DogBook

En social nätverksapplikation för hundar på ett hunddagis.

## Projektöversikt

DogBook är ett administrativt verktyg utformat för att hjälpa hunddagispersonal att hålla koll på vilka hundar som är närvarande och deras relationer till andra hundar. Applikationen låter användare skapa hundprofiler med bilder, beskrivningar och vänlistor.

## Tekniker

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB
- **Testning**: Jest, React Testing Library

## Installation

### Förkrav

- Node.js
- MongoDB

### Backend-installation

1. Gå till backend-mappen:

   ```
   cd "/Users/jonathanaberg/Developer/Webbramverk JS/Inlämningsuppgift Dogbook/DogBook/backend"
   ```

2. Installera beroenden:

   ```
   npm install
   ```

3. Starta MongoDB:

   ```
   mongod --dbpath=/sökväg/till/datamapp
   ```

4. Starta backend-servern:
   ```
   node server.js
   ```
   Servern körs på http://localhost:5001

### Frontend-installation

1. Gå till frontend-mappen:

   ```
   cd "/Users/jonathanaberg/Developer/Webbramverk JS/Inlämningsuppgift Dogbook/DogBook/frontend"
   ```

2. Installera beroenden:

   ```
   npm install
   ```

3. Starta utvecklingsservern:
   ```
   npm run dev
   ```
   Applikationen körs på http://localhost:5173

### Köra tester

1. I frontend-mappen, kör:
   ```
   npm test
   ```

## Funktioner

- **Startsida**: Visa alla hundar med färgkodad status (grön för närvarande, röd för frånvarande)
- **Skapa-sida**: Lägg till en ny hund med namn, smeknamn, ålder, beskrivning och profilbild
- **Profil-sida**: Visa hundens detaljer och hantera vänskaper
- **Redigera-sida**: Uppdatera hundinformation

## Testinstruktioner

Följ dessa steg för att testa applikationen:

1. Skapa en ny hund (Dog1)
2. Redigera Dog1:s ålder och verifiera ändringen
3. Skapa en annan hund (Wolverine) och lägg till som vän till Dog1
4. Verifiera vänskapen på Dog1:s profil
5. Skapa en tredje hund (Lassie) och lägg till som vän till Dog1
6. Verifiera att Lassie är vän med Dog1 men inte med Wolverine
7. Verifiera att Dog1 är vän med både Wolverine och Lassie
8. Ta bort Wolverine
9. Verifiera att Dog1 nu endast är vän med Lassie
