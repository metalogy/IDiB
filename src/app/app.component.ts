import {Component, OnInit} from '@angular/core';
import {clothingInsulation, met, sortAsc} from "./variables";
import {InfluxDB} from '@influxdata/influxdb-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Komfort mikroklimatyczny';
  clothingInsulation = clothingInsulation.sort((a, b) => sortAsc(a.clo, b.clo));
  met = met.sort((a, b) => sortAsc(a.met, b.met));
  pmv = 0;
  ppd = 0;
  m = 0;
  ta = 20;
  icl = 0;
  va = 0.1;
  rh = 20;

  selectedMET: any;
  selectedCLO: any;
  selectedMeasurement: any;
  measurements = [];

  selected: boolean = true;
  showResult = false;
  selectSens = false;
  selectCLO = false;
  selectMET = false;

// You can generate an API token from the "API Tokens Tab" in the UI
  token = '_eWOCguM6-CycYr1tLtHW-zdNHnrAYT0T0gBpsxRqxxhbQFgXhRSddG8h3Z6xmXafO3JQAtbBkfmjsNSMAYALg==';
  org = 'organization';
  bucket = 'komfort';

  client = new InfluxDB({url: 'http://localhost:8086', token: this.token});

  constructor() {
  }

  ngOnInit(): void {

    const queryApi = this.client.getQueryApi(this.org);
    const q = 'from(bucket: "komfort")\n' +
      '  |> range(start: -14d)\n' +
      '  |> filter(fn: (r) => r["_measurement"] == "Room 1" or r["_measurement"] == "Room 2")\n' +
      '  |> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature")\n' +
      '  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")\n' +
      '  |> sort(columns: ["_time"], desc: false)';
    queryApi.collectRows(q).then(measurements => {
      // @ts-ignore
      this.measurements = measurements;
    });
  }

  calculatePMVandPPD(m: number, ta: number, icl: number, va: number, rh: number) {
    /**
     m, metabolizm (met)
     ta, temp. powietrza(°C)
     icl, izolacja ubioru (clo)
     va, prędkość wiatru (m/s)
     rh, wilgotność powietrza %
     */

    if ((this.selected && this.selectSens == false) || !this.selectCLO || !this.selectMET
      || ta == null || va == null || rh == null) {
      alert("Nie wypełniłeś wszystkich wartości")
    } else {
      m = Number(m);
      ta = Number(ta);
      icl = Number(icl);
      va = Number(va);
      rh = Number(rh);

      let tr = ta; //mean radiant temperature
      let w = 0 //praca zewnętrzna, zazwyczaj 0
      m = m * 58.15 //konwersja MET na W/m^2

      icl = icl * 0.155; //konwersja CLO na m^2*K/W
      let fcl; //stosunek ciała okrytego do zakrytego
      if (icl > 0.078) {
        fcl = 1.05 + 0.645 * icl;
      } else {
        fcl = 1.00 + 1.290 * icl;
      }

      let pa = rh * this.esat(ta); //pa- ciśnienie cząstkowe pary wodnej

      let diffusion = -3.05 * 1e-3 * (5733 - 6.99 * (m - w) - pa)
      let sweat = -0.48 * (m - w - 58.15);
      let evaporation = diffusion + sweat

      let vapour = -1.7 * 1e-5 * m * (5867 - pa);
      let temperature = -0.0014 * m * (34 - ta);
      let respiration = temperature + vapour;

      //izolacja ubrania thermal clothing level
      let tcl = (32 + 0.303 * Math.exp(-0.036 * m) - 0.028) + (3.05 * Math.pow(10, -3)) * va + (0.42 * (tr - 32))

      let radiation = -3.96 * 1e-8 * fcl * (Math.pow(tcl + 273, 4) - Math.pow(tr + 273, 4));

      let hc;
      if (Math.pow(Math.abs(tcl - ta), 0.25) > 12.1 * Math.sqrt(va)) {
        hc = 2.38 * Math.pow(Math.abs(tcl - ta), 0.25);
      } else {
        hc = 12.1 * Math.sqrt(va);
      }
      let convection = -fcl * hc * (tcl - ta);

      this.pmv = (0.303 * Math.exp(-0.036 * m) + 0.028) * (m - w + evaporation + respiration + radiation + convection);
      this.ppd = 100 - 95 * Math.exp(-0.03353 * Math.pow(this.pmv, 4) - 0.2179 * Math.pow(this.pmv, 2));
      this.showResult = true;
    }
  }

  esat(t: number): number { //ciśnienie pary nasyconej
    let a, b;
    if (t < 0) {
      a = 21.874;
      b = 7.66;
    } else {
      a = 17.269;
      b = 35.86;
    }
    return (611 * Math.exp(a * t / (t + 273.16 - b)) / 100);
  }

  taChanged(ta: any) {
    this.ta = ta;
  }

  rhChanged(rh: any) {
    this.rh = rh;
  }

  vaChanged(va: any) {
    this.va = va;
  }

  cloChanged(value: any) {
    debugger;
    this.selectCLO = true;
    this.icl = value;
  }

  metChanged(value: any) {
    debugger;
    this.selectMET = true;
    this.m = value;
  }

  valuesChanged(values: any) {
    this.selectSens = true;
    let tempHum = values.split(",")
    this.ta = tempHum[0];
    this.rh = tempHum[1];
  }
}
