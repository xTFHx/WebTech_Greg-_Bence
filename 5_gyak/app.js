let szam;
rnd = Math.floor(Math.random() * (1000000-0+1));
let proba = 5;

do {
    let szam = parseInt(prompt("Adj meg egy számot:"));

    if (szam < rnd)
        alert("Nagyobb a szám");
    else if (szam > rnd)
        alert("Kisebb a szám");
    else {
        alert("Eltaláltad a számot");
        break;
    }
    proba--;
} while (proba > 0);

console.log("A szám a", rnd, "volt");