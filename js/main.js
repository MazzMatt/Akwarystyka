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