// app/components/properties/investment-calculator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/index';
import { formatCurrency } from '@/lib/utils';

interface InvestmentCalculatorProps {
  property: Property;
}

interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  monthlyRent: number;
  monthlyCashflow: number;
  annualYield: number;
  breakEvenYear: number;
}

export default function InvestmentCalculator({ property }: InvestmentCalculatorProps) {
  const [downPayment, setDownPayment] = useState(20);
  const [loanTerm, setLoanTerm] = useState(25);
  const [interestRate, setInterestRate] = useState(3.5);
  const [monthlyRent, setMonthlyRent] = useState(property.monthly_rent_cold);
  const [monthlyCosts, setMonthlyCosts] = useState((property.house_fee || 0) + 150);
  const [results, setResults] = useState<CalculationResult | null>(null);

  const calculateInvestment = () => {
    const totalPrice = property.total_price;
    const downPaymentAmount = (downPayment / 100) * totalPrice;
    const loanAmount = totalPrice - downPaymentAmount;
    
    // Monthly payment calculation (German annuity loan)
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    // Cashflow calculation
    const monthlyCashflow = monthlyRent - monthlyPayment - monthlyCosts;
    const annualCashflow = monthlyCashflow * 12;
    const annualYield = (annualCashflow / downPaymentAmount) * 100;
    
    // Break-even calculation (when cumulative cashflow becomes positive)
    let cumulativeCashflow = -downPaymentAmount;
    let breakEvenYear = 0;
    
    for (let year = 1; year <= 30; year++) {
      cumulativeCashflow += annualCashflow;
      if (cumulativeCashflow > 0 && breakEvenYear === 0) {
        breakEvenYear = year;
        break;
      }
    }
    
    setResults({
      monthlyPayment,
      totalInterest,
      totalPayment,
      monthlyRent,
      monthlyCashflow,
      annualYield,
      breakEvenYear
    });
  };

  useEffect(() => {
    calculateInvestment();
  }, [downPayment, loanTerm, interestRate, monthlyRent, monthlyCosts]);

  return (
    <div className="space-y-6">
      {/* Input Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium dark:text-white">Finanzierungsparameter</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Eigenkapital: {downPayment}% ({formatCurrency((downPayment / 100) * property.total_price)})
            </label>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={downPayment}
              onChange={(e) => setDownPayment(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Laufzeit: {loanTerm} Jahre
            </label>
            <input
              type="range"
              min="15"
              max="35"
              step="5"
              value={loanTerm}
              onChange={(e) => setLoanTerm(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>15 Jahre</span>
              <span>35 Jahre</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Zinssatz: {interestRate}%
            </label>
            <input
              type="range"
              min="2"
              max="6"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>2.0%</span>
              <span>6.0%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium dark:text-white">Ertragsparameter</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monatliche Kaltmiete
            </label>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monatliche Kosten (Hausgeld, Verwaltung, Instandhaltung)
            </label>
            <input
              type="number"
              value={monthlyCosts}
              onChange={(e) => setMonthlyCosts(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Schnellcheck</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-400">Kaufpreis:</span>
                <span className="font-medium text-blue-900 dark:text-blue-300">
                  {formatCurrency(property.total_price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-400">Darlehen:</span>
                <span className="font-medium text-blue-900 dark:text-blue-300">
                  {formatCurrency(property.total_price * (1 - downPayment / 100))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-medium dark:text-white mb-4">Berechnungsergebnisse</h4>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Monatliche Rate</p>
                <p className="text-xl font-bold dark:text-white">
                  {formatCurrency(results.monthlyPayment)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Monatlicher Cashflow</p>
                <p className={`text-xl font-bold ${
                  results.monthlyCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(results.monthlyCashflow)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Eigenkapitalrendite p.a.</p>
                <p className={`text-xl font-bold ${
                  results.annualYield >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {results.annualYield.toFixed(2)}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Break-Even</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {results.breakEvenYear > 0 ? `${results.breakEvenYear} Jahre` : 'Nie'}
                </p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="font-medium dark:text-white">Finanzierungsdetails</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Darlehenssumme:</span>
                    <span className="font-medium dark:text-white">
                      {formatCurrency(property.total_price * (1 - downPayment / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gesamte Zinsen:</span>
                    <span className="font-medium dark:text-white">
                      {formatCurrency(results.totalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gesamtrückzahlung:</span>
                    <span className="font-medium dark:text-white">
                      {formatCurrency(results.totalPayment)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium dark:text-white">Cashflow-Aufstellung</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">+ Mieteinnahmen:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(results.monthlyRent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">- Darlehensrate:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(results.monthlyPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">- Nebenkosten:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(monthlyCosts)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span className="font-medium text-gray-900 dark:text-white">Netto-Cashflow:</span>
                    <span className={`font-bold ${
                      results.monthlyCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(results.monthlyCashflow)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Analysis */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Investment-Bewertung</h5>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                {results.monthlyCashflow > 0 ? (
                  <p>✅ Positiver Cashflow: Die Immobilie generiert monatlich {formatCurrency(results.monthlyCashflow)} Überschuss.</p>
                ) : (
                  <p>⚠️ Negativer Cashflow: Monatliche Zuzahlung von {formatCurrency(Math.abs(results.monthlyCashflow))} erforderlich.</p>
                )}
                
                {results.annualYield > 5 ? (
                  <p className="mt-1">🎯 Ausgezeichnete Eigenkapitalrendite von {results.annualYield.toFixed(2)}% p.a.</p>
                ) : results.annualYield > 0 ? (
                  <p className="mt-1">👍 Solide Eigenkapitalrendite von {results.annualYield.toFixed(2)}% p.a.</p>
                ) : (
                  <p className="mt-1">📉 Negative Eigenkapitalrendite von {results.annualYield.toFixed(2)}% p.a.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}