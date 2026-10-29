class PlanAkwarium {
  constructor(dlugosc, szerokosc, wysokosc, styl) {
    this.dlugosc = Number(dlugosc);
    this.szerokosc = Number(szerokosc);
    this.wysokosc = Number(wysokosc);
    this.styl = styl;
  }

  objetosc() {
    return Math.round((this.dlugosc * this.szerokosc * this.wysokosc) / 1000);
  }

  limitRyb() {
    return Math.max(1, Math.floor(this.objetosc() / 7));
  }

  podsumowanie() {
    return `Akwarium ${this.styl}: ${this.objetosc()} l, orientacyjnie do ${this.limitRyb()} małych ryb.`;
  }
}

function pobierzPoId(id) {
  return document.getElementById(id);
}

function pokazPoradnik(temat) {
  const poradniki = {
    start: "<h3>Start akwarium</h3><p>Przygotuj filtr, podłoże i rośliny, a ryby wpuść dopiero po dojrzewaniu zbiornika.</p>",
    woda: "<h3>Parametry wody</h3><p>Regularnie kontroluj temperaturę, pH oraz azotyny. Stabilność jest ważniejsza niż szybkie korekty.</p>",
    swiatlo: "<h3>Światło</h3><p>Rośliny zwykle lubią 7-9 godzin światła dziennie. Nadmiar światła sprzyja glonom.</p>"
  };

  const blok = pobierzPoId("blokSpa");

  if (blok) {
    blok.innerHTML = poradniki[temat] || poradniki.start;
    blok.classList.remove("poradnik-start", "poradnik-woda", "poradnik-swiatlo");
    blok.classList.add(`poradnik-${temat}`);
  }

  document.querySelectorAll("[data-zakladka-poradnika]").forEach(zakladka => {
    zakladka.classList.toggle("active", zakladka.dataset.zakladkaPoradnika === temat);
  });
}

function obliczAkwarium() {
  const dlugosc = pobierzPoId("dlugosc")?.value;
  const szerokosc = pobierzPoId("szerokosc")?.value;
  const wysokosc = pobierzPoId("wysokosc")?.value;
  const styl = pobierzPoId("styl")?.value || "towarzyskie";
  const wynik = pobierzPoId("wynikKalkulatora");

  if (!wynik) return;

  const plan = new PlanAkwarium(dlugosc, szerokosc, wysokosc, styl);

  if (!dlugosc || !szerokosc || !wysokosc || plan.objetosc() <= 0) {
    wynik.innerHTML = "Uzupełnij wszystkie wymiary akwarium.";
    return;
  }

  wynik.innerHTML = `<strong>${plan.podsumowanie()}</strong><br>Podmieniaj około ${Math.round(plan.objetosc() * 0.25)} l wody tygodniowo.`;
}

function sprawdzFormularzKontaktowy(event) {
  const formularz = event.target;
  let ok = true;
  const wzorImienia = /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż ]{3,}$/;
  const wzorEmaila = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const ustawBlad = (id, komunikat) => {
    const poleBledu = pobierzPoId(id);
    if (poleBledu) poleBledu.innerHTML = komunikat;
    if (komunikat) ok = false;
  };

  ustawBlad("bladImienia", wzorImienia.test(formularz.imie.value) ? "" : "Podaj imię lub nazwę, min. 3 znaki.");
  ustawBlad("bladEmaila", wzorEmaila.test(formularz.email.value) ? "" : "Podaj poprawny adres e-mail.");
  ustawBlad("bladTematu", formularz.temat.value ? "" : "Wybierz temat wiadomości.");
  ustawBlad("bladWiadomosci", formularz.wiadomosc.value.trim().length >= 12 ? "" : "Wiadomość powinna mieć min. 12 znaków.");

  if (!ok) {
    event.preventDefault();
    return false;
  }

  event.preventDefault();
  pobierzPoId("podsumowanieKontaktu").innerHTML =
    `<strong>Dziękujemy!</strong> Odebrano wiadomość od ${formularz.imie.value} w temacie: ${formularz.temat.value}.`;

  formularz.reset();
  return true;
}

function zapiszRybe() {
  const gatunek = pobierzPoId("gatunek")?.value.trim();
  const liczba = Number(pobierzPoId("liczba")?.value);
  const notatka = pobierzPoId("notatka")?.value.trim();
  const zapisane = JSON.parse(localStorage.getItem("listaRyb") || "[]");

  if (!gatunek || liczba < 1) {
    pobierzPoId("wynikMagazynu").innerHTML = "Wpisz gatunek i liczbę sztuk.";
    return;
  }

  zapisane.push({ gatunek, liczba, notatka });
  localStorage.setItem("listaRyb", JSON.stringify(zapisane));
  wyswietlListeRyb();
}

function wyswietlListeRyb() {
  const cel = pobierzPoId("wynikMagazynu");
  if (!cel) return;

  const zapisane = JSON.parse(localStorage.getItem("listaRyb") || "[]");

  if (!zapisane.length) {
    cel.innerHTML = "Brak zapisanych ryb w lokalnym magazynie danych.";
    return;
  }

  cel.innerHTML = zapisane.map((pozycja, indeks) =>
    `<div class="border-bottom py-2">
      <div class="d-flex justify-content-between align-items-center gap-2">
        <span>${pozycja.gatunek} - ${pozycja.liczba} szt.</span>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" type="button" onclick="przelaczNotatkeRyby(${indeks})">${pozycja.notatka ? "Notatka" : "Brak notatki"}</button>
          <button class="btn btn-outline-danger" type="button" onclick="usunRybe(${indeks})">Usuń</button>
        </div>
      </div>
      <div class="notatka-ryby mt-2 d-none" id="notatkaRyby${indeks}">${pozycja.notatka || "Nie dodano notatki dla tej pozycji."}</div>
    </div>`
  ).join("");
}

function przelaczNotatkeRyby(indeks) {
  const notatka = pobierzPoId(`notatkaRyby${indeks}`);
  if (notatka) {
    notatka.classList.toggle("d-none");
  }
}

function usunRybe(indeks) {
  const zapisane = JSON.parse(localStorage.getItem("listaRyb") || "[]");
  zapisane.splice(indeks, 1);
  localStorage.setItem("listaRyb", JSON.stringify(zapisane));
  wyswietlListeRyb();
}

function zlokalizujAkwaryste() {
  const wynik = pobierzPoId("wynikGeo");
  const ramkaMapy = pobierzPoId("ramkaMapy");

  if (!wynik) return;

  if (!navigator.geolocation) {
    wynik.innerHTML = "Ta przeglądarka nie obsługuje geolokalizacji.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const szerokoscGeo = position.coords.latitude.toFixed(5);
      const dlugoscGeo = position.coords.longitude.toFixed(5);
      wynik.innerHTML = `Twoja pozycja: ${szerokoscGeo}, ${dlugoscGeo}.`;

      if (ramkaMapy) {
        ramkaMapy.classList.remove("d-none");
        ramkaMapy.innerHTML = `<iframe title="Mapa Google z aktualną lokalizacją" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=${szerokoscGeo},${dlugoscGeo}&z=14&output=embed"></iframe>`;
      }
    },
    () => {
      wynik.innerHTML = "Nie udostępniono lokalizacji.";
      if (ramkaMapy) {
        ramkaMapy.innerHTML = "";
        ramkaMapy.classList.add("d-none");
      }
    }
  );
}

function uruchomEfektyJQuery() {
  if (typeof window.jQuery === "undefined") return;

  $(".jq-tip").on("click", function () {
    $(this).toggleClass("zielony").find(".tip-extra").slideToggle(180);
  });
}

function uruchomNotatkiKaruzeli() {
  const karuzela = pobierzPoId("karuzelaZakladania");
  const notatki = document.querySelectorAll("[data-notatka-slajdu]");
  const kropki = document.querySelectorAll("[data-kropka-slajdu]");

  if (!karuzela || !notatki.length) return;

  karuzela.addEventListener("slid.bs.carousel", event => {
    notatki.forEach(notatka => {
      notatka.classList.toggle("active", Number(notatka.dataset.notatkaSlajdu) === event.to);
    });
    kropki.forEach(kropka => {
      kropka.classList.toggle("active", Number(kropka.dataset.kropkaSlajdu) === event.to);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  pokazPoradnik("start");
  wyswietlListeRyb();
  uruchomEfektyJQuery();
  uruchomNotatkiKaruzeli();

  const formularzKontaktowy = pobierzPoId("formularzKontaktowy");
  if (formularzKontaktowy) {
    formularzKontaktowy.addEventListener("submit", sprawdzFormularzKontaktowy);
  }

  const przyciskOblicz = pobierzPoId("przyciskOblicz");
  if (przyciskOblicz) {
    przyciskOblicz.addEventListener("click", obliczAkwarium);
  }
});