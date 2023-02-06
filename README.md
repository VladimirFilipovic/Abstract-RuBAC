# Abstract-RuBAC

## Pokretanje aplikacije:

Aplikacija moze biti pokrenuta na dva nacina:

 1. Kao docker container pomocu komandi:
 
        npm run build:docker-image && npm run start:docker

 2. Ili pomocu komandi 
 
        npm i && npm run start

## Testiranje:

Jest testovi mogu biti pokrenuti pomocu komande npm run test

Testovi koji testiraju glavnu funckionalnost sistema nalaze se u [ovom fajlu](https://github.com/VladimirFilipovic/Abstract-RuBAC/blob/main/rubac/tests/rubac-service.spec.js)


Primeri poziva servisa pomocu curl-a

 1. U ovom primeru servis vraca access granted s' obzirom da za datu putanju ne postoje pravila koja ogranicavaju pristup:

        curl http://localhost:3000/random/path


 2. U drugom primeru bi trebali da dobijemo odgovor da pristup nije odobren (ogranicenje ip adrese i usera)


        curl http://localhost:3000/platform/test
        
#### Napomena: Pokusao sam da smanjim mogucnost REDOS napada tako sto sam svaki korisceni regex proverio pomocu beslatnog alata

