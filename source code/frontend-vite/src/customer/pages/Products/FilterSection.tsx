import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

/* ─── Styles injected once ─── */
const filterStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

  .hk-filter-wrap {
    font-family: 'Inter', sans-serif;
    background: #FDFCF8;
    border: 1px solid rgba(200,162,74,0.18);
    border-radius: 2px;
  }

  .hk-filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px 18px;
    border-bottom: 1px solid rgba(200,162,74,0.15);
  }

  .hk-filter-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #1a1612;
  }

  .hk-clear-btn {
    font-family: 'Inter', sans-serif;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 600;
    color: #C8A24A;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border: 1px solid rgba(200,162,74,0.3);
    border-radius: 1px;
    transition: all 0.25s ease;
  }
  .hk-clear-btn:hover {
    background: rgba(200,162,74,0.08);
    border-color: #C8A24A;
  }

  /* ─── Accordion ─── */
  .hk-accordion-item {
    border-bottom: 1px solid rgba(200,162,74,0.1);
  }
  .hk-accordion-item:last-child {
    border-bottom: none;
  }

  .hk-accordion-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .hk-accordion-trigger:hover {
    background: rgba(200,162,74,0.04);
  }

  .hk-accordion-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.78rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 700;
    color: #C8A24A;
  }

  .hk-accordion-chevron {
    width: 14px;
    height: 14px;
    color: #C8A24A;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }
  .hk-accordion-chevron.open {
    transform: rotate(180deg);
  }

  .hk-accordion-body {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, padding 0.3s ease;
    opacity: 0;
    padding: 0 24px;
  }
  .hk-accordion-body.open {
    max-height: 500px;
    opacity: 1;
    padding: 4px 24px 20px;
  }

  /* ─── Filter Options ─── */
  .hk-filter-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 0;
    cursor: pointer;
    gap: 10px;
  }

  .hk-filter-option-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .hk-option-radio {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1.5px solid rgba(200,162,74,0.4);
    flex-shrink: 0;
    position: relative;
    transition: border-color 0.2s ease;
    background: transparent;
  }
  .hk-option-radio::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: #C8A24A;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .hk-option-radio.selected {
    border-color: #C8A24A;
  }
  .hk-option-radio.selected::after {
    opacity: 1;
  }

  .hk-option-label {
    font-size: 0.8rem;
    color: #4A4A4A;
    letter-spacing: 0.02em;
    transition: color 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .hk-filter-option:hover .hk-option-label {
    color: #C8A24A;
  }
  .hk-option-label.selected {
    color: #C8A24A;
    font-weight: 500;
  }

  .hk-material-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    cursor: pointer;
    gap: 8px;
  }

  .hk-material-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hk-option-check {
    width: 15px;
    height: 15px;
    border: 1.5px solid rgba(200,162,74,0.4);
    border-radius: 2px;
    flex-shrink: 0;
    position: relative;
    transition: all 0.2s ease;
    background: transparent;
  }
  .hk-option-check::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 0px;
    width: 5px;
    height: 9px;
    border: 2px solid #C8A24A;
    border-left: none;
    border-top: none;
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .hk-option-check.selected {
    border-color: #C8A24A;
    background: rgba(200,162,74,0.08);
  }
  .hk-option-check.selected::after {
    opacity: 1;
  }
`;

/* ─── Data ─── */
const PRICE_RANGES = [
  { label: "Under ₹999",          value: "0-999" },
  { label: "₹1,000 – ₹2,499",    value: "1000-2499" },
  { label: "₹2,500 – ₹4,999",    value: "2500-4999" },
  { label: "₹5,000 – ₹9,999",    value: "5000-9999" },
  { label: "₹10,000+",            value: "10000-99999999" },
];

const MATERIALS = [
  "Wood", "Brass", "Marble", "Ceramic",
  "Terracotta", "Metal", "Glass", "Resin",
];

/* ─── Chevron SVG ─── */
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`hk-accordion-chevron${open ? " open" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ─── Main Component ─── */
const FilterSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceOpen, setPriceOpen] = useState(true);
  const [materialOpen, setMaterialOpen] = useState(true);

  const selectedPrice = searchParams.get("price") || "";
  const selectedMaterials: string[] = searchParams.get("material")
    ? searchParams.get("material")!.split(",")
    : [];

  /* ─── Price ─── */
  const handlePriceSelect = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (selectedPrice === value) {
      newParams.delete("price");
    } else {
      newParams.set("price", value);
    }
    setSearchParams(newParams);
  };

  /* ─── Material ─── */
  const handleMaterialToggle = (mat: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const updated = selectedMaterials.includes(mat)
      ? selectedMaterials.filter((m) => m !== mat)
      : [...selectedMaterials, mat];
    if (updated.length === 0) {
      newParams.delete("material");
    } else {
      newParams.set("material", updated.join(","));
    }
    setSearchParams(newParams);
  };

  /* ─── Clear All ─── */
  const clearAll = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("price");
    newParams.delete("material");
    setSearchParams(newParams);
  };

  const hasActiveFilters = !!selectedPrice || selectedMaterials.length > 0;

  return (
    <>
      <style>{filterStyles}</style>
      <div className="hk-filter-wrap">
        {/* Header */}
        <div className="hk-filter-header">
          <span className="hk-filter-title">Filters</span>
          {hasActiveFilters && (
            <button className="hk-clear-btn" onClick={clearAll}>
              Clear All
            </button>
          )}
        </div>

        {/* Price Range Accordion */}
        <div className="hk-accordion-item">
          <button
            className="hk-accordion-trigger"
            onClick={() => setPriceOpen((p) => !p)}
            aria-expanded={priceOpen}
          >
            <span className="hk-accordion-label">Price Range</span>
            <ChevronIcon open={priceOpen} />
          </button>
          <div className={`hk-accordion-body${priceOpen ? " open" : ""}`}>
            {PRICE_RANGES.map((range) => {
              const isSelected = selectedPrice === range.value;
              return (
                <div
                  key={range.value}
                  className="hk-filter-option"
                  onClick={() => handlePriceSelect(range.value)}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="hk-filter-option-left">
                    <div className={`hk-option-radio${isSelected ? " selected" : ""}`} />
                    <span className={`hk-option-label${isSelected ? " selected" : ""}`}>
                      {range.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Material Accordion */}
        <div className="hk-accordion-item">
          <button
            className="hk-accordion-trigger"
            onClick={() => setMaterialOpen((p) => !p)}
            aria-expanded={materialOpen}
          >
            <span className="hk-accordion-label">Material</span>
            <ChevronIcon open={materialOpen} />
          </button>
          <div className={`hk-accordion-body${materialOpen ? " open" : ""}`}>
            {MATERIALS.map((mat) => {
              const isSelected = selectedMaterials.includes(mat);
              return (
                <div
                  key={mat}
                  className="hk-material-option"
                  onClick={() => handleMaterialToggle(mat)}
                  role="checkbox"
                  aria-checked={isSelected}
                >
                  <div className="hk-material-left">
                    <div className={`hk-option-check${isSelected ? " selected" : ""}`} />
                    <span className={`hk-option-label${isSelected ? " selected" : ""}`}>
                      {mat}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSection;
