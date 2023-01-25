import {KeyValue} from "@angular/common";

export let clothingInsulation = [
  {
    description: "Krótkie spodnie i rękaw: 0.36 clo",
    clo: 0.36,
  },
  {
    description: "Długie spodnie, krótki rękaw: 0.57 clo ",
    clo: 0.57,
  },
  {
    description: "Długie spodnie, dłgui rękaw (longsleeve): 0.61 clo",
    clo: 0.61,
  },
  {
    description: "Długie spodnie, marynarka: 0.96 clo",
    clo: 0.96,
  },
  {
    description: "Trousers, poszkoszulek, koszula, sweter: 1.01 clo",
    clo: 1.01,
  },
  {
    description: "Trousers, poszkoszulek, koszula, sweter, kurtka: 1.30 clo",
    clo: 1.30,
  },
  {
    description: "Dres: 0.74 clo",
    clo: 0.74,
  },
  {
    description: "Piżama i szlafrok: 0.96 clo",
    clo: 0.96,
  },
  {
    description: "Ocieplana kurtka, bielizna termoaaktywna: 1.37 clo",
    clo: 1.37,
  },
];

export let met = [
  {
    description: "Siedzenie przy biurku: 1.3 MET",
    met: 1.3
  },
  {
    description: "Stanie: 1.5 MET",
    met: 1.5
  },
  {
    description: "Spokojny spacer: 2 MET",
    met: 2.0
  },
  {
    description: "Zmywanie naczyń: 2.2 MET",
    met: 2.2
  },
  {
    description: "Yoga: 2.5 MET",
    met: 2.5
  },
  {
    description: "Sprzątanie: 3.5 MET",
    met: 3.5
  },
  {
    description: "Trening z ciężarami: 4 MET",
    met: 4.0
  },
  {
    description: "Wolne płytwanie: 6 MET",
    met: 6.0
  },
  {
    description: "Jazda na rowerze: 8 MET",
    met: 8.0
  },
  {
    description: "Bieganie: 11.5 MET",
    met: 11.5
  },
];

export function sortAsc(a: number, b: number) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
