import { useMemo, useState } from "react";

type PeriodicCategory = "alkali" | "alkaline" | "transition" | "post" | "metalloid" | "nonmetal" | "halogen" | "noble";

interface PeriodicElement {
  col: number;
  row: number;
  number: number;
  symbol: string;
  name: string;
  category: PeriodicCategory;
  detail: string;
  state: string;
}

const names: Record<string, string> = {
  H: "Hydrogen", He: "Helium", Li: "Lithium", Be: "Beryllium", B: "Boron", C: "Carbon",
  N: "Nitrogen", O: "Oxygen", F: "Fluorine", Ne: "Neon", Na: "Sodium", Mg: "Magnesium",
  Al: "Aluminium", Si: "Silicon", P: "Phosphorus", S: "Sulfur", Cl: "Chlorine", Ar: "Argon",
  Fe: "Iron", Cu: "Copper", Zn: "Zinc", Ag: "Silver", Au: "Gold", Hg: "Mercury",
  I: "Iodine", Sn: "Tin", Pb: "Lead", U: "Uranium", Pt: "Platinum", W: "Tungsten",
};

const categoryFor = (col: number): PeriodicCategory => {
  if (col === 1) return "alkali";
  if (col === 2) return "alkaline";
  if (col >= 3 && col <= 12) return "transition";
  if (col === 13) return "post";
  if (col === 14) return "metalloid";
  if (col >= 15 && col <= 16) return "nonmetal";
  if (col === 17) return "halogen";
  return "noble";
};

const rowData: Array<Array<[number, string]>> = [
  [[1, "H"], [18, "He"]],
  [[1, "Li"], [2, "Be"], [13, "B"], [14, "C"], [15, "N"], [16, "O"], [17, "F"], [18, "Ne"]],
  [[1, "Na"], [2, "Mg"], [13, "Al"], [14, "Si"], [15, "P"], [16, "S"], [17, "Cl"], [18, "Ar"]],
  [[1, "K"], [2, "Ca"], [3, "Sc"], [4, "Ti"], [5, "V"], [6, "Cr"], [7, "Mn"], [8, "Fe"], [9, "Co"], [10, "Ni"], [11, "Cu"], [12, "Zn"], [13, "Ga"], [14, "Ge"], [15, "As"], [16, "Se"], [17, "Br"], [18, "Kr"]],
  [[1, "Rb"], [2, "Sr"], [3, "Y"], [4, "Zr"], [5, "Nb"], [6, "Mo"], [7, "Tc"], [8, "Ru"], [9, "Rh"], [10, "Pd"], [11, "Ag"], [12, "Cd"], [13, "In"], [14, "Sn"], [15, "Sb"], [16, "Te"], [17, "I"], [18, "Xe"]],
  [[1, "Cs"], [2, "Ba"], [4, "Hf"], [5, "Ta"], [6, "W"], [7, "Re"], [8, "Os"], [9, "Ir"], [10, "Pt"], [11, "Au"], [12, "Hg"], [13, "Tl"], [14, "Pb"], [15, "Bi"], [16, "Po"], [17, "At"], [18, "Rn"]],
  [[1, "Fr"], [2, "Ra"], [4, "Rf"], [5, "Db"], [6, "Sg"], [7, "Bh"], [8, "Hs"], [9, "Mt"], [10, "Ds"], [11, "Rg"], [12, "Cn"], [13, "Nh"], [14, "Fl"], [15, "Mc"], [16, "Lv"], [17, "Ts"], [18, "Og"]],
];

const periodStarts = [1, 3, 11, 19, 37, 55, 87];

function atomicNumberFor(rowIndex: number, index: number) {
  if (rowIndex === 0) return index === 0 ? 1 : 2;
  const fBlockOffset = rowIndex >= 5 && index >= 2 ? 15 : 0;
  return periodStarts[rowIndex] + index + fBlockOffset;
}

const elements: PeriodicElement[] = rowData.flatMap((row, rowIndex) => row.map(([col, symbol], index) => ({
  category: categoryFor(col),
  col,
  detail: names[symbol] === "Carbon"
    ? "The basis of organic life and one of the most versatile elements in material culture."
    : `${names[symbol] || `Element ${symbol}`} — a small reference card for exploring the table.`,
  name: names[symbol] || `Element ${symbol}`,
  number: atomicNumberFor(rowIndex, index),
  row: rowIndex + 1,
  state: ["Hg"].includes(symbol) ? "Liquid" : ["He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og"].includes(symbol) ? "Gas" : "Solid",
  symbol,
})));

const fBlock = [
  { label: "57–71", name: "Lanthanides", category: "transition" as const },
  { label: "89–103", name: "Actinides", category: "transition" as const },
];

const filters: Array<[PeriodicCategory | "all", string]> = [
  ["all", "All"], ["alkali", "Alkali"], ["transition", "Transition"], ["metalloid", "Metalloid"],
  ["nonmetal", "Nonmetal"], ["noble", "Noble gas"],
];

export function PeriodicTablePrototype() {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [filter, setFilter] = useState<PeriodicCategory | "all">("all");
  const selected = useMemo(
    () => elements.find((element) => element.number === selectedNumber) || elements[0],
    [selectedNumber],
  );

  return (
    <section className="periodic-prototype" aria-label="Interactive periodic table prototype">
      <div className="periodic-prototype-intro">
        <span>INTERACTIVE SPECIMEN / 01</span>
        <p>Tap an element. The table stays put; the information changes beside it.</p>
      </div>

      <div className="periodic-prototype-stage">
        <div className="periodic-table-pane">
          <div className="periodic-table-heading">
            <strong>Periodic table of elements</strong>
            <span>118 ELEMENTS</span>
          </div>
          <div className="periodic-filter-row" aria-label="Filter elements by category">
            {filters.map(([value, label]) => (
              <button
                aria-pressed={filter === value}
                className={filter === value ? "is-selected" : undefined}
                key={value}
                onClick={() => setFilter(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="periodic-grid" role="grid" aria-label="Periodic table">
            {elements.map((element) => {
              const isDimmed = filter !== "all" && element.category !== filter;
              return (
                <button
                  aria-label={`${element.name}, atomic number ${element.number}`}
                  aria-selected={selected.number === element.number}
                  className={`periodic-element periodic-element--${element.category}${isDimmed ? " is-dimmed" : ""}${selected.number === element.number ? " is-active" : ""}`}
                  key={element.symbol}
                  onClick={() => setSelectedNumber(element.number)}
                  role="gridcell"
                  style={{ gridColumn: element.col, gridRow: element.row }}
                  type="button"
                >
                  <small>{element.number}</small>
                  <b>{element.symbol}</b>
                  <span>{element.name}</span>
                </button>
              );
            })}
            {fBlock.map((block, index) => (
              <div className="periodic-f-block" key={block.label} style={{ gridColumn: 3, gridRow: index + 8 }}>
                <span>{block.label}</span>
                <small>{block.name}</small>
              </div>
            ))}
          </div>
        </div>

        <aside className="periodic-detail-pane" aria-live="polite">
          <div className={`periodic-detail-tile periodic-element--${selected.category}`}>
            <small>{selected.number}</small>
            <b>{selected.symbol}</b>
            <span>{selected.name}</span>
          </div>
          <p className="periodic-detail-category">{selected.category.toUpperCase()}</p>
          <p className="periodic-detail-copy">{selected.detail}</p>
          <dl>
            <div><dt>PERIOD</dt><dd>{selected.row}</dd></div>
            <div><dt>STATE</dt><dd>{selected.state}</dd></div>
            <div><dt>SYMBOL</dt><dd>{selected.symbol}</dd></div>
          </dl>
          <div className="periodic-bohr" aria-label={`Atomic structure of ${selected.name}`}>
            <i /><i /><i />
            <strong>{selected.symbol}</strong>
          </div>
          <span className="periodic-detail-hint">SELECT ANOTHER TILE TO CONTINUE</span>
        </aside>
      </div>
    </section>
  );
}
