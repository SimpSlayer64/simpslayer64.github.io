/**
 * Puzzle set definitions for Stabilize the Lab.
 * Each set (A, B, C, D) has different content so groups cannot share answers.
 * Set A = current live content.
 */

export type SetId = "A" | "B" | "C" | "D";

// =============================================================================
// PUZZLE 1: Reaction Logic
// Mechanics: Balance equations, extract 4-digit code from Single → Double → Acid-Base → Combustion
// Rule: Use coefficient of product with same metal as reactant; Combustion uses H₂O coefficient
// Decoy (Decomposition) is ignored.
// =============================================================================

export interface P1Equation {
  parts: string[];
  type: "Single Replacement" | "Double Replacement" | "Acid–Base" | "Combustion" | "Decomposition";
  productMetal: string | null; // formula containing the metal for extraction; null for Combustion (use H2O)
  coeff: string; // expected coefficient for the extraction
  decoy?: boolean;
}

export interface P1Set {
  equations: P1Equation[];
  expectedCode: string; // 4 digits
}

// Set A: Current live (Zn, AgNO3, H2SO4, C3H8, KClO3 decoy) - SCRAMBLED ORDER
const p1SetA: P1Set = {
  equations: [
    { parts: ["C₃H₈", "+", "O₂", "→", "CO₂", "+", "H₂O"], type: "Combustion", productMetal: null, coeff: "4" },
    { parts: ["KClO₃", "→", "KCl", "+", "O₂"], type: "Decomposition", productMetal: "KCl", coeff: "2", decoy: true },
    { parts: ["Zn", "+", "CuSO₄", "→", "ZnSO₄", "+", "Cu"], type: "Single Replacement", productMetal: "ZnSO₄", coeff: "1" },
    { parts: ["H₂SO₄", "+", "NaOH", "→", "Na₂SO₄", "+", "H₂O"], type: "Acid–Base", productMetal: "Na₂SO₄", coeff: "1" },
    { parts: ["AgNO₃", "+", "NaCl", "→", "AgCl", "+", "NaNO₃"], type: "Double Replacement", productMetal: "AgCl", coeff: "1" },
  ],
  expectedCode: "1114", // Single(1) Double(1) AcidBase(1) Combustion(4)
};

// Set B: Fe, BaCl2, HCl, CH4, CaCO3 decoy - SCRAMBLED ORDER
const p1SetB: P1Set = {
  equations: [
    { parts: ["CaCO₃", "→", "CaO", "+", "CO₂"], type: "Decomposition", productMetal: "CaO", coeff: "1", decoy: true },
    { parts: ["CH₄", "+", "O₂", "→", "CO₂", "+", "H₂O"], type: "Combustion", productMetal: null, coeff: "2" },
    { parts: ["BaCl₂", "+", "Na₂SO₄", "→", "BaSO₄", "+", "NaCl"], type: "Double Replacement", productMetal: "BaSO₄", coeff: "1" },
    { parts: ["Fe", "+", "CuCl₂", "→", "FeCl₂", "+", "Cu"], type: "Single Replacement", productMetal: "FeCl₂", coeff: "1" },
    { parts: ["HCl", "+", "KOH", "→", "KCl", "+", "H₂O"], type: "Acid–Base", productMetal: "KCl", coeff: "1" },
  ],
  expectedCode: "1112", // CH4+2O2→CO2+2H2O, H2O coeff=2
};

// Set C: Mg, Pb(NO3)2, HNO3, C2H6, 2H2+O2 decoy - SCRAMBLED ORDER
const p1SetC: P1Set = {
  equations: [
    { parts: ["HNO₃", "+", "NaOH", "→", "NaNO₃", "+", "H₂O"], type: "Acid–Base", productMetal: "NaNO₃", coeff: "1" },
    { parts: ["C₂H₆", "+", "O₂", "→", "CO₂", "+", "H₂O"], type: "Combustion", productMetal: null, coeff: "6" },
    { parts: ["Mg", "+", "HCl", "→", "MgCl₂", "+", "H₂"], type: "Single Replacement", productMetal: "MgCl₂", coeff: "1" },
    { parts: ["NaCl", "+", "Na", "→", "Cl₂"], type: "Decomposition", productMetal: null, coeff: "2", decoy: true },
    { parts: ["Pb(NO₃)₂", "+", "KI", "→", "PbI₂", "+", "KNO₃"], type: "Double Replacement", productMetal: "PbI₂", coeff: "1" },
  ],
  expectedCode: "1116", // 2C2H6+7O2→4CO2+6H2O, H2O coeff=6
};

// Set D: Zn+H2SO4, AgNO3+KBr, H3PO4+NaOH, C4H10, KClO3 decoy - SCRAMBLED ORDER
const p1SetD: P1Set = {
  equations: [
    { parts: ["AgNO₃", "+", "KBr", "→", "AgBr", "+", "KNO₃"], type: "Double Replacement", productMetal: "AgBr", coeff: "1" },
    { parts: ["2KClO₃", "→", "2KCl", "+", "3O₂"], type: "Decomposition", productMetal: "KCl", coeff: "2", decoy: true },
    { parts: ["C₆H₁₂", "+", "O₂", "→", "CO₂", "+", "H₂O"], type: "Combustion", productMetal: null, coeff: "6" },
    { parts: ["Zn", "+", "H₂SO₄", "→", "ZnSO₄", "+", "H₂"], type: "Single Replacement", productMetal: "ZnSO₄", coeff: "1" },
    { parts: ["H₃PO₄", "+", "NaOH", "→", "Na₃PO₄", "+", "H₂O"], type: "Acid–Base", productMetal: "Na₃PO₄", coeff: "1" },
  ],
  expectedCode: "1116", // 2C4H10+13O2→8CO2+10H2O, H2O coeff=10, use last digit for 4-digit code
};

export const PUZZLE1_SETS: Record<SetId, P1Set> = { A: p1SetA, B: p1SetB, C: p1SetC, D: p1SetD };

// =============================================================================
// PUZZLE 2: Periodic Table Logic
// Rules: Select metals with +1 or +2 ions; exclude noble gases, +3 metals (Al,B), metalloids (Si)
// Order by increasing ionic charge, then atomic number
// Code: 4 digits = two atomic numbers padded (e.g. 11,12 => "1112")
// =============================================================================

export interface P2Element {
  symbol: string;
  name: string;
  atomic: number;
  charge: number;
  type: "metal" | "non-metal" | "noble-gas" | "metalloid";
}

export interface P2Set {
  elements: P2Element[];
  expectedCode: string; // 4 digits
}

// Set A: Na, Mg, Al, Ar, Cl → exclude Ar(noble), Al(+3) → Na(11), Mg(12) → 1112
const p2SetA: P2Set = {
  elements: [
    { symbol: "Na", name: "Sodium", atomic: 11, charge: 1, type: "metal" },
    { symbol: "Mg", name: "Magnesium", atomic: 12, charge: 2, type: "metal" },
    { symbol: "Al", name: "Aluminum", atomic: 13, charge: 3, type: "metal" },
    { symbol: "Cl", name: "Chlorine", atomic: 17, charge: -1, type: "non-metal" },
    { symbol: "Ar", name: "Argon", atomic: 18, charge: 0, type: "noble-gas" },
  ],
  expectedCode: "1112",
};

// Set B: K, Ca, Al, Ar, S → exclude Ar, Al → K(19), Ca(20) → 1920
const p2SetB: P2Set = {
  elements: [
    { symbol: "K", name: "Potassium", atomic: 19, charge: 1, type: "metal" },
    { symbol: "Ca", name: "Calcium", atomic: 20, charge: 2, type: "metal" },
    { symbol: "Al", name: "Aluminum", atomic: 13, charge: 3, type: "metal" },
    { symbol: "S", name: "Sulfur", atomic: 16, charge: -2, type: "non-metal" },
    { symbol: "Ar", name: "Argon", atomic: 18, charge: 0, type: "noble-gas" },
  ],
  expectedCode: "1920",
};

// Set C: Li, Be, B, Ne, O → exclude Ne(noble), B(+3) → Li(3), Be(4) → 0304
const p2SetC: P2Set = {
  elements: [
    { symbol: "Li", name: "Lithium", atomic: 3, charge: 1, type: "metal" },
    { symbol: "Be", name: "Beryllium", atomic: 4, charge: 2, type: "metal" },
    { symbol: "B", name: "Boron", atomic: 5, charge: 3, type: "metal" },
    { symbol: "O", name: "Oxygen", atomic: 8, charge: -2, type: "non-metal" },
    { symbol: "Ne", name: "Neon", atomic: 10, charge: 0, type: "noble-gas" },
  ],
  expectedCode: "0304",
};

// Set D: Na, Mg, Si, Cl, Kr → exclude Kr(noble), Si(metalloid) → Na(11), Mg(12) → 1112
const p2SetD: P2Set = {
  elements: [
    { symbol: "Na", name: "Sodium", atomic: 11, charge: 1, type: "metal" },
    { symbol: "Mg", name: "Magnesium", atomic: 12, charge: 2, type: "metal" },
    { symbol: "Si", name: "Silicon", atomic: 14, charge: 4, type: "metalloid" },
    { symbol: "Cl", name: "Chlorine", atomic: 17, charge: -1, type: "non-metal" },
    { symbol: "Kr", name: "Krypton", atomic: 36, charge: 0, type: "noble-gas" },
  ],
  expectedCode: "1112",
};

export const PUZZLE2_SETS: Record<SetId, P2Set> = { A: p2SetA, B: p2SetB, C: p2SetC, D: p2SetD };

// =============================================================================
// PUZZLE 3: Reaction Conditions Match
// Match: Combustion, Acid-Base, Single Replacement, Decomposition → their condition
// Code order: Single → Acid-Base → Combustion (3 digits)
// =============================================================================

export interface P3Condition {
  id: string;
  name: string;
  val: number;
}

export interface P3Set {
  conditions: P3Condition[];
  correctMatches: Record<string, string>; // reactionId -> conditionId
  expectedCode: string; // 3 digits: Single digit, AcidBase digit, Combustion digit
}

// Set A: Heat=1, Electricity=2, Gas=3, Aqueous=4
// Combustion→Heat(1), AcidBase→Aqueous(4), Single→Gas(3), Decomp→Electricity(2)
// Order Single(3)→AcidBase(4)→Combustion(1) = 341
const p3SetA: P3Set = {
  conditions: [
    { id: "heat", name: "Requires heat", val: 1 },
    { id: "elec", name: "Requires electricity", val: 2 },
    { id: "gas", name: "Produces gas", val: 3 },
    { id: "aq", name: "Occurs in aqueous solution", val: 4 },
  ],
  correctMatches: { comb: "heat", acid: "aq", single: "gas", decomp: "elec" },
  expectedCode: "341",
};

// Set B: Oxygen=1, SaltWater=2, HydrogenGas=3, EnergyInput=4
// Combustion→Oxygen(1), AcidBase→SaltWater(2), Single→HydrogenGas(3), Decomp→EnergyInput(4)
// Order Single(3)→AcidBase(2)→Combustion(1) = 321
const p3SetB: P3Set = {
  conditions: [
    { id: "oxygen", name: "Needs oxygen", val: 1 },
    { id: "saltwater", name: "Produces salt + water", val: 2 },
    { id: "hydrogen", name: "Produces hydrogen gas", val: 3 },
    { id: "energy", name: "Needs energy input", val: 4 },
  ],
  correctMatches: { comb: "oxygen", acid: "saltwater", single: "hydrogen", decomp: "energy" },
  expectedCode: "321",
};

// Set C: EnergyRelease=1, Neutralization=2, Bubbles=3, SimplerSubstances=4
// Combustion→EnergyRelease(1), AcidBase→Neutralization(2), Single→Bubbles(3), Decomp→SimplerSubstances(4)
// Order Single(3)→AcidBase(2)→Combustion(1) = 321
const p3SetC: P3Set = {
  conditions: [
    { id: "energyrel", name: "Rapid energy release", val: 1 },
    { id: "neutral", name: "Neutralization", val: 2 },
    { id: "bubbles", name: "Gas bubbles observed", val: 3 },
    { id: "simpler", name: "Breaks into simpler substances", val: 4 },
  ],
  correctMatches: { comb: "energyrel", acid: "neutral", single: "bubbles", decomp: "simpler" },
  expectedCode: "321",
};

// Set D: Flame=1, pH7=2, Displacement=3, Splits=4
// Combustion→Flame(1), AcidBase→pH7(2), Single→Displacement(3), Decomp→Splits(4)
// Order Single(3)→AcidBase(2)→Combustion(1) = 321
const p3SetD: P3Set = {
  conditions: [
    { id: "flame", name: "Flame present", val: 1 },
    { id: "ph7", name: "pH moves toward 7", val: 2 },
    { id: "displace", name: "Metal displaces another", val: 3 },
    { id: "splits", name: "One reactant forms two products", val: 4 },
  ],
  correctMatches: { comb: "flame", acid: "ph7", single: "displace", decomp: "splits" },
  expectedCode: "321",
};

export const PUZZLE3_SETS: Record<SetId, P3Set> = { A: p3SetA, B: p3SetB, C: p3SetC, D: p3SetD };

// =============================================================================
// Final code = P1 + P2 + P3 concatenated (admin preview)
// =============================================================================

export function getFinalCode(setId: SetId): string {
  const p1 = PUZZLE1_SETS[setId].expectedCode;
  const p2 = PUZZLE2_SETS[setId].expectedCode;
  const p3 = PUZZLE3_SETS[setId].expectedCode;
  return p1 + p2 + p3;
}
