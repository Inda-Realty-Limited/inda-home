import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { RiEditFill } from "react-icons/ri";

type ROIFieldKey =
  | "purchasePrice"
  | "financingRate"
  | "financingTenureYears"
  | "holdingPeriodYears"
  | "yieldLong"
  | "yieldShort"
  | "expensePct"
  | "appreciationLocalNominal"
  | "appreciationLocalReal"
  | "appreciationUsdAdj";

type CalcResult = { profit: number; roiPct: number; annualIncome: number };

type Props = {
  roiValues: any;
  editedFlags: Partial<Record<ROIFieldKey, boolean>>;
  roiFieldInfo: Record<ROIFieldKey, string>;
  openROIInfo: ROIFieldKey | null;
  setOpenROIInfo: (k: ROIFieldKey | null) => void;
  editingROIField: ROIFieldKey | null;
  setEditingROIField: (k: ROIFieldKey | null) => void;
  updateROIValue: (key: ROIFieldKey, raw: string | number) => void;
  formatNaira: (n: number) => string;
  formatPercent: (n: number) => string;
  handleCalculate: () => void;
  isCalculating: boolean;
  calcResult: CalcResult | null;
  aAny: any;
  resultView: "long" | "short";
  setResultView: (v: "long" | "short") => void;
  longTabRef: React.RefObject<HTMLButtonElement | null>;
  shortTabRef: React.RefObject<HTMLButtonElement | null>;
  underlineStyle: { width: number; left: number };
  appreciationTab: "localNominal" | "localReal" | "usdAdj";
  setAppreciationTab: (v: "localNominal" | "localReal" | "usdAdj") => void;
};

const roiContainer = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.05 },
  },
} as const;
const roiItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
} as const;

const ROICalculator: React.FC<Props> = (props) => {
  const {
    roiValues,
    editedFlags,
    roiFieldInfo,
    openROIInfo,
    setOpenROIInfo,
    editingROIField,
    setEditingROIField,
    updateROIValue,
    formatNaira,
    formatPercent,
    handleCalculate,
    isCalculating,
    calcResult,
    aAny,
    resultView,
    setResultView,
    longTabRef,
    shortTabRef,
    underlineStyle,
    appreciationTab,
    setAppreciationTab,
  } = props;

  const appNominal = roiValues.appreciationLocalNominal;
  const appReal = roiValues.appreciationLocalReal || appNominal;
  const appUsd = roiValues.appreciationUsdAdj || appReal;
  const projAny = aAny?.projections || {};
  const yieldsAny = aAny?.yields || {};
  const roiPctFromAnalytics =
    resultView === "long" ? projAny?.roiLongTermPct : projAny?.roiShortTermPct;
  const profitFromAnalytics =
    resultView === "long"
      ? projAny?.projectedTotalProfitLongTerm
      : projAny?.projectedTotalProfitShortTerm;
  const incomeFromAnalytics =
    resultView === "long"
      ? yieldsAny?.annualLongTermIncomeNGN
      : yieldsAny?.annualShortTermIncomeNGN;

  const toggleROIInfo = (key: ROIFieldKey) => {
    setOpenROIInfo(openROIInfo === key ? null : key);
    setEditingROIField(null);
  };
  const startROIEdit = (key: ROIFieldKey) => {
    setEditingROIField(editingROIField === key ? null : key);
    setOpenROIInfo(null);
  };

  return (
    <div className="w-full px-4">
      <motion.div
        className="rounded-lg p-4"
        viewport={{ once: true, amount: 0.2 }}
        variants={roiContainer}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-inda-teal">
          Investment ROI Calculator
        </h3>
        <p className="text-[#101820] text-base lg:text-lg mb-8">
          Estimate your potential returns on investment properties with our
          comprehensive calculator.
        </p>

        <h4 className="font-bold text-xl lg:text-2xl py-4">Property Details</h4>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={roiContainer}
        >
          {/* Purchase Price */}
          <motion.div variants={roiItem}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base lg:text-lg text-[#101820]/90">
                <span className="inline-flex items-center gap-2">
                  <span>Purchase Price</span>
                  {editedFlags.purchasePrice && (
                    <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                      Edited
                    </span>
                  )}
                </span>
              </p>
              <div className="flex items-center gap-2 text-inda-teal">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  animate={{ rotate: openROIInfo === "purchasePrice" ? 15 : 0 }}
                  onClick={() => toggleROIInfo("purchasePrice")}
                  aria-label="Info: Purchase Price"
                >
                  <IoIosInformationCircle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startROIEdit("purchasePrice")}
                  aria-label="Edit: Purchase Price"
                >
                  <RiEditFill className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {openROIInfo === "purchasePrice" && (
                <motion.div
                  key="pp-info"
                  className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.purchasePrice}
                </motion.div>
              )}
              {editingROIField === "purchasePrice" && (
                <motion.div
                  key="pp-edit"
                  className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                    Editing
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="bg-transparent outline-none w-full"
                    value={Number(
                      roiValues.purchasePrice || 0
                    ).toLocaleString()}
                    onChange={(e) =>
                      updateROIValue("purchasePrice", e.target.value)
                    }
                  />
                </motion.div>
              )}
              {!(
                openROIInfo === "purchasePrice" ||
                editingROIField === "purchasePrice"
              ) && (
                <motion.div
                  key="pp-view"
                  className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {formatNaira(roiValues.purchasePrice || 0)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Financing */}
          <motion.div variants={roiItem}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base lg:text-lg text-[#101820]/90">
                <span className="inline-flex items-center gap-2">
                  <span>Financing</span>
                  {editedFlags.financingRate && (
                    <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                      Edited
                    </span>
                  )}
                </span>
              </p>
              <div className="flex items-center gap-2 text-inda-teal">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  animate={{ rotate: openROIInfo === "financingRate" ? 15 : 0 }}
                  onClick={() => toggleROIInfo("financingRate")}
                  aria-label="Info: Financing"
                >
                  <IoIosInformationCircle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startROIEdit("financingRate")}
                  aria-label="Edit: Financing"
                >
                  <RiEditFill className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {openROIInfo === "financingRate" && (
                <motion.div
                  key="fin-info"
                  className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.financingRate}
                </motion.div>
              )}
              {editingROIField === "financingRate" && (
                <motion.div
                  key="fin-edit"
                  className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                    Editing
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="bg-transparent outline-none w-full"
                    value={roiValues.financingRate ?? 0}
                    onChange={(e) =>
                      updateROIValue("financingRate", e.target.value)
                    }
                  />
                  <span className="ml-1">%</span>
                </motion.div>
              )}
              {!(
                openROIInfo === "financingRate" ||
                editingROIField === "financingRate"
              ) && (
                <motion.div
                  key="fin-view"
                  className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {formatPercent(roiValues.financingRate ?? 0)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Financing Tenure */}
          <motion.div variants={roiItem}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base lg:text-lg text-[#101820]/90">
                <span className="inline-flex items-center gap-2">
                  <span>Financing Tenure</span>
                  {editedFlags.financingTenureYears && (
                    <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                      Edited
                    </span>
                  )}
                </span>
              </p>
              <div className="flex items-center gap-2 text-inda-teal">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    rotate: openROIInfo === "financingTenureYears" ? 15 : 0,
                  }}
                  onClick={() => toggleROIInfo("financingTenureYears")}
                  aria-label="Info: Financing Tenure"
                >
                  <IoIosInformationCircle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startROIEdit("financingTenureYears")}
                  aria-label="Edit: Financing Tenure"
                >
                  <RiEditFill className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {openROIInfo === "financingTenureYears" && (
                <motion.div
                  key="tenure-info"
                  className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.financingTenureYears}
                </motion.div>
              )}
              {editingROIField === "financingTenureYears" && (
                <motion.div
                  key="tenure-edit"
                  className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                    Editing
                  </span>
                  <input
                    type="number"
                    step="1"
                    className="bg-transparent outline-none w-full"
                    value={roiValues.financingTenureYears ?? 0}
                    onChange={(e) =>
                      updateROIValue("financingTenureYears", e.target.value)
                    }
                  />
                  <span className="ml-1">years</span>
                </motion.div>
              )}
              {!(
                openROIInfo === "financingTenureYears" ||
                editingROIField === "financingTenureYears"
              ) && (
                <motion.div
                  key="tenure-view"
                  className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {roiValues.financingTenureYears} years
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Holding Period */}
          <motion.div variants={roiItem}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base lg:text-lg text-[#101820]/90">
                <span className="inline-flex items-center gap-2">
                  <span>Holding Period</span>
                  {editedFlags.holdingPeriodYears && (
                    <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                      Edited
                    </span>
                  )}
                </span>
              </p>
              <div className="flex items-center gap-2 text-inda-teal">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    rotate: openROIInfo === "holdingPeriodYears" ? 15 : 0,
                  }}
                  onClick={() => toggleROIInfo("holdingPeriodYears")}
                  aria-label="Info: Holding Period"
                >
                  <IoIosInformationCircle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startROIEdit("holdingPeriodYears")}
                  aria-label="Edit: Holding Period"
                >
                  <RiEditFill className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {openROIInfo === "holdingPeriodYears" && (
                <motion.div
                  key="hold-info"
                  className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.holdingPeriodYears}
                </motion.div>
              )}
              {editingROIField === "holdingPeriodYears" && (
                <motion.div
                  key="hold-edit"
                  className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                    Editing
                  </span>
                  <input
                    type="number"
                    step="1"
                    className="bg-transparent outline-none w-full"
                    value={roiValues.holdingPeriodYears ?? 0}
                    onChange={(e) =>
                      updateROIValue("holdingPeriodYears", e.target.value)
                    }
                  />
                  <span className="ml-1">years</span>
                </motion.div>
              )}
              {!(
                openROIInfo === "holdingPeriodYears" ||
                editingROIField === "holdingPeriodYears"
              ) && (
                <motion.div
                  key="hold-view"
                  className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {roiValues.holdingPeriodYears} years
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Middle grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
          variants={roiContainer}
        >
          {/* Yield Long */}
          <motion.div variants={roiItem}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base lg:text-lg text-[#101820]/90">
                <span className="inline-flex items-center gap-2">
                  <span>Avg. Rental Yield (Long Term)</span>
                  {editedFlags.yieldLong && (
                    <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                      Edited
                    </span>
                  )}
                </span>
              </p>
              <div className="flex items-center gap-2 text-inda-teal">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  animate={{ rotate: openROIInfo === "yieldLong" ? 15 : 0 }}
                  onClick={() =>
                    setOpenROIInfo(
                      openROIInfo === "yieldLong" ? null : "yieldLong"
                    )
                  }
                  aria-label="Info: Yield Long"
                >
                  <IoIosInformationCircle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    setEditingROIField(
                      editingROIField === "yieldLong" ? null : "yieldLong"
                    )
                  }
                  aria-label="Edit: Yield Long"
                >
                  <RiEditFill className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {openROIInfo === "yieldLong" && (
                <motion.div
                  key="yl-info"
                  className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.yieldLong}
                </motion.div>
              )}
              {editingROIField === "yieldLong" && (
                <motion.div
                  key="yl-edit"
                  className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                    Editing
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="bg-transparent outline-none w-full"
                    value={roiValues.yieldLong ?? 0}
                    onChange={(e) =>
                      updateROIValue("yieldLong", e.target.value)
                    }
                  />
                  <span className="ml-1">%</span>
                </motion.div>
              )}
              {!(
                openROIInfo === "yieldLong" || editingROIField === "yieldLong"
              ) && (
                <motion.div
                  key="yl-view"
                  className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {formatPercent(roiValues.yieldLong ?? 0)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Yield Short */}
          <motion.div variants={roiItem}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base lg:text-lg text-[#101820]/90">
                <span className="inline-flex items-center gap-2">
                  <span>Avg. Rental Yield (Short Term)</span>
                  {editedFlags.yieldShort && (
                    <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                      Edited
                    </span>
                  )}
                </span>
              </p>
              <div className="flex items-center gap-2 text-inda-teal">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  animate={{ rotate: openROIInfo === "yieldShort" ? 15 : 0 }}
                  onClick={() =>
                    setOpenROIInfo(
                      openROIInfo === "yieldShort" ? null : "yieldShort"
                    )
                  }
                  aria-label="Info: Yield Short"
                >
                  <IoIosInformationCircle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    setEditingROIField(
                      editingROIField === "yieldShort" ? null : "yieldShort"
                    )
                  }
                  aria-label="Edit: Yield Short"
                >
                  <RiEditFill className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {openROIInfo === "yieldShort" && (
                <motion.div
                  key="ys-info"
                  className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.yieldShort}
                </motion.div>
              )}
              {editingROIField === "yieldShort" && (
                <motion.div
                  key="ys-edit"
                  className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                    Editing
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="bg-transparent outline-none w-full"
                    value={roiValues.yieldShort ?? 0}
                    onChange={(e) =>
                      updateROIValue("yieldShort", e.target.value)
                    }
                  />
                  <span className="ml-1">%</span>
                </motion.div>
              )}
              {!(
                openROIInfo === "yieldShort" || editingROIField === "yieldShort"
              ) && (
                <motion.div
                  key="ys-view"
                  className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {formatPercent(roiValues.yieldShort ?? 0)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Expenses */}
          <motion.div variants={roiItem}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base lg:text-lg text-[#101820]/90">
                <span className="inline-flex items-center gap-2">
                  <span>Total Expense (% of Rent)</span>
                  {editedFlags.expensePct && (
                    <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                      Edited
                    </span>
                  )}
                </span>
              </p>
              <div className="flex items-center gap-2 text-inda-teal">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  animate={{ rotate: openROIInfo === "expensePct" ? 15 : 0 }}
                  onClick={() =>
                    setOpenROIInfo(
                      openROIInfo === "expensePct" ? null : "expensePct"
                    )
                  }
                  aria-label="Info: Expense %"
                >
                  <IoIosInformationCircle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    setEditingROIField(
                      editingROIField === "expensePct" ? null : "expensePct"
                    )
                  }
                  aria-label="Edit: Expense %"
                >
                  <RiEditFill className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {openROIInfo === "expensePct" && (
                <motion.div
                  key="ex-info"
                  className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.expensePct}
                </motion.div>
              )}
              {editingROIField === "expensePct" && (
                <motion.div
                  key="ex-edit"
                  className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                    Editing
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="bg-transparent outline-none w-full"
                    value={roiValues.expensePct ?? 0}
                    onChange={(e) =>
                      updateROIValue("expensePct", e.target.value)
                    }
                  />
                  <span className="ml-1">%</span>
                </motion.div>
              )}
              {!(
                openROIInfo === "expensePct" || editingROIField === "expensePct"
              ) && (
                <motion.div
                  key="ex-view"
                  className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {formatPercent(roiValues.expensePct ?? 0)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-[#4EA8A129] rounded-xl p-4 mb-8"
          variants={roiItem}
        >
          <div className="flex gap-2 mb-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                appreciationTab === "localNominal"
                  ? "bg-[#4EA8A1] text-white"
                  : "bg-transparent text-[#101820]/80 border border-[#4EA8A1]/40 hover:bg-[#4EA8A11A]"
              }`}
              onClick={() => setAppreciationTab("localNominal")}
            >
              ₦ Local Nominal
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                appreciationTab === "localReal"
                  ? "bg-[#4EA8A1] text-white"
                  : "bg-transparent text-[#101820]/80 border border-[#4EA8A1]/40 hover:bg-[#4EA8A11A]"
              }`}
              onClick={() => setAppreciationTab("localReal")}
            >
              ₦ Local Real
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                appreciationTab === "usdAdj"
                  ? "bg-[#4EA8A1] text-white"
                  : "bg-transparent text-[#101820]/80 border border-[#4EA8A1]/40 hover:bg-[#4EA8A11A]"
              }`}
              onClick={() => setAppreciationTab("usdAdj")}
            >
              USD (FX + Inflation Adj)
            </motion.button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-base lg:text-lg font-semibold text-[#101820]">
              {appreciationTab === "localNominal" && (
                <span>Annual Appreciation (₦, Local Nominal)</span>
              )}
              {appreciationTab === "localReal" && (
                <span>Annual Appreciation (₦, Local Real)</span>
              )}
              {appreciationTab === "usdAdj" && (
                <span>Annual Appreciation (USD, FX + Inflation Adjusted)</span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setOpenROIInfo(
                  openROIInfo ===
                    (appreciationTab === "localNominal"
                      ? "appreciationLocalNominal"
                      : appreciationTab === "localReal"
                      ? "appreciationLocalReal"
                      : "appreciationUsdAdj")
                    ? null
                    : appreciationTab === "localNominal"
                    ? "appreciationLocalNominal"
                    : appreciationTab === "localReal"
                    ? "appreciationLocalReal"
                    : "appreciationUsdAdj"
                )
              }
              aria-label="Info: Appreciation"
              className="text-inda-teal"
            >
              <IoIosInformationCircle className="w-5 h-5" />
            </motion.button>
          </div>
          <AnimatePresence mode="wait">
            {openROIInfo === "appreciationLocalNominal" &&
              appreciationTab === "localNominal" && (
                <motion.div
                  key="app-info-nominal"
                  className="mt-3 bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.appreciationLocalNominal}
                </motion.div>
              )}
            {openROIInfo === "appreciationLocalReal" &&
              appreciationTab === "localReal" && (
                <motion.div
                  key="app-info-real"
                  className="mt-3 bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.appreciationLocalReal}
                </motion.div>
              )}
            {openROIInfo === "appreciationUsdAdj" &&
              appreciationTab === "usdAdj" && (
                <motion.div
                  key="app-info-usd"
                  className="mt-3 bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {roiFieldInfo.appreciationUsdAdj}
                </motion.div>
              )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`app-val-${appreciationTab}`}
              className="mt-4 bg-[#4EA8A129] rounded-lg p-4 text-center text-xl font-bold text-[#101820]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {appreciationTab === "localNominal" && formatPercent(appNominal)}
              {appreciationTab === "localReal" && formatPercent(appReal)}
              {appreciationTab === "usdAdj" && formatPercent(appUsd)}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="flex justify-end mb-8">
          <motion.button
            onClick={handleCalculate}
            className={`py-3 px-8 rounded-lg text-base font-semibold transition text-white flex items-center gap-2 bg-[#4EA8A1] hover:bg-[#0A655E]`}
            disabled={false}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -1 }}
          >
            {isCalculating && (
              <svg
                className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isCalculating ? "Calculating…" : "Calculate"}
          </motion.button>
        </div>

        <div className="mb-8">
          <h4 className="text-[#101820] font-bold text-xl mb-4">Results</h4>
          <div className="relative flex items-center gap-4 mb-3">
            <button
              ref={longTabRef}
              onClick={() => setResultView("long")}
              className={`px-6 py-3 rounded-md border text-inda-teal bg-transparent ${
                resultView === "long"
                  ? "border-inda-teal"
                  : "border-inda-teal/70"
              }`}
            >
              Long Term Rental
            </button>
            <button
              ref={shortTabRef}
              onClick={() => setResultView("short")}
              className={`px-6 py-3 rounded-md border text-inda-teal bg-transparent ${
                resultView === "short"
                  ? "border-inda-teal"
                  : "border-inda-teal/70"
              }`}
            >
              Short Term Rental
            </button>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded-full" />
            <div
              className="absolute -bottom-2 h-1 bg-inda-teal rounded-full transition-all duration-300"
              style={{ width: underlineStyle.width, left: underlineStyle.left }}
            />
          </div>
          <div className="mb-6" />
          <div
            className="rounded-2xl p-8 text-white"
            style={{
              background:
                "linear-gradient(90deg, #0A655E 5.77%, #4EA8A1 95.19%)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-lg p-6">
                <p className="text-lg mb-4 opacity-90">
                  Projected Total Profit
                </p>
                <div className="inline-block bg-white text-[#0F5E57] px-6 py-4 rounded-xl font-bold text-xl shadow-sm">
                  {profitFromAnalytics != null
                    ? formatNaira(profitFromAnalytics)
                    : calcResult
                    ? formatNaira(calcResult.profit)
                    : "—"}
                </div>
              </div>
              <div className="rounded-lg p-6">
                <p className="text-lg mb-4 opacity-90">
                  Return on Investment (ROI)
                </p>
                <div className="inline-block bg-white text-[#0F5E57] px-6 py-4 rounded-xl font-bold text-xl shadow-sm">
                  {roiPctFromAnalytics != null
                    ? formatPercent(roiPctFromAnalytics)
                    : calcResult
                    ? formatPercent(calcResult.roiPct)
                    : "—"}
                </div>
              </div>
              <div className="rounded-lg p-6">
                <p className="text-lg mb-4 opacity-90">Annual Rental Income</p>
                <div className="inline-block bg-white text-[#0F5E57] px-6 py-4 rounded-xl font-bold text-xl shadow-sm">
                  {incomeFromAnalytics != null
                    ? formatNaira(incomeFromAnalytics)
                    : calcResult
                    ? formatNaira(calcResult.annualIncome)
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {Array.isArray(aAny?.projections?.monthlyProjection) &&
          aAny.projections.monthlyProjection.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg lg:text-xl font-bold text-inda-teal mb-3">
                Price Projection (12 months)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {aAny.projections.monthlyProjection.map((m: any) => (
                  <div
                    key={m.month}
                    className="bg-[#F8F9FA] rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-[#101820]/60 mb-1">
                      Month {m.month}
                    </div>
                    <div className="text-sm font-semibold">
                      ₦{Math.round(m.priceNGN).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </motion.div>
    </div>
  );
};

export default ROICalculator;
