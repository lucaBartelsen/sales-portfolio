// app/components/properties/tax-assumptions-tab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/index';
import { formatCurrency } from '@/lib/utils';

interface TaxSettings {
  grossIncome: number;
  maritalStatus: 'single' | 'married';
  churchTax: boolean;
  state: string;
  valueGrowthPercent: number;
  rentIncreasePercent: number;
}

interface TaxAssumptionsTabProps {
  property: Property;
}

const germanStates = [
  'Baden-Württemberg',
  'Bayern', 
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen'
];

// Simplified tax calculation (Vereinfachte Steuerberechnung)
const calculateTaxRate = (grossIncome: number, maritalStatus: 'single' | 'married', churchTax: boolean, state: string) => {
  // Basic tax brackets for 2024 (simplified)
  let taxRate = 0;
  
  const taxableIncome = maritalStatus === 'married' ? grossIncome / 2 : grossIncome;
  
  if (taxableIncome <= 11604) {
    taxRate = 0;
  } else if (taxableIncome <= 17005) {
    taxRate = 14;
  } else if (taxableIncome <= 66760) {
    taxRate = 24;
  } else if (taxableIncome <= 277825) {
    taxRate = 42;
  } else {
    taxRate = 45;
  }
  
  // Add solidarity surcharge (5.5% of income tax)
  const solidarityRate = taxRate * 0.055;
  
  // Add church tax if applicable (8-9% depending on state)
  const churchTaxRate = churchTax ? (state === 'Bayern' || state === 'Baden-Württemberg' ? taxRate * 0.08 : taxRate * 0.09) : 0;
  
  return {
    incomeTax: taxRate,
    solidarityTax: solidarityRate,
    churchTax: churchTaxRate,
    totalTax: taxRate + solidarityRate + churchTaxRate
  };
};

export default function TaxAssumptionsTab({ property }: TaxAssumptionsTabProps) {
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    grossIncome: 80000,
    maritalStatus: 'single',
    churchTax: false,
    state: 'Bayern',
    valueGrowthPercent: property.value_growth_percent || 3.5,
    rentIncreasePercent: property.rent_increase_percent || 2.0
  });

  const [taxCalculation, setTaxCalculation] = useState<any>(null);
  const [investmentProjection, setInvestmentProjection] = useState<any>(null);

  useEffect(() => {
    const taxes = calculateTaxRate(
      taxSettings.grossIncome,
      taxSettings.maritalStatus,
      taxSettings.churchTax,
      taxSettings.state
    );
    setTaxCalculation(taxes);

    // Calculate investment projection with tax implications
    const annualRent = property.monthly_rent_cold * 12;
    const annualCosts = (property.house_fee || 0) * 12 + (property.management_costs || 1500);
    const netRentalIncome = annualRent - annualCosts;
    
    // Tax on rental income
    const taxOnRentalIncome = netRentalIncome * (taxes.totalTax / 100);
    const afterTaxRentalIncome = netRentalIncome - taxOnRentalIncome;
    
    // 10-year projection
    const projection = [];
    let currentValue = property.total_price;
    let currentRent = property.monthly_rent_cold;
    
    for (let year = 1; year <= 10; year++) {
      const yearlyRent = currentRent * 12;
      const yearlyCosts = annualCosts;
      const netIncome = yearlyRent - yearlyCosts;
      const taxOnIncome = netIncome * (taxes.totalTax / 100);
      const afterTaxIncome = netIncome - taxOnIncome;
      
      projection.push({
        year,
        propertyValue: currentValue,
        grossRent: yearlyRent,
        netRent: netIncome,
        taxes: taxOnIncome,
        afterTaxIncome,
        valueAppreciation: currentValue - property.total_price
      });
      
      // Apply growth rates for next year
      currentValue *= (1 + taxSettings.valueGrowthPercent / 100);
      currentRent *= (1 + taxSettings.rentIncreasePercent / 100);
    }
    
    setInvestmentProjection({
      currentYearTax: taxOnRentalIncome,
      currentYearAfterTax: afterTaxRentalIncome,
      projection
    });
  }, [taxSettings, property]);

  const handleSettingsChange = (field: keyof TaxSettings, value: any) => {
    setTaxSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Tax Settings */}
      <div>
        <h3 className="text-lg font-semibold dark:text-white mb-6">Steuerliche Einstellungen</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Zu versteuerndes Bruttoeinkommen (jährlich)
            </label>
            <input
              type="number"
              value={taxSettings.grossIncome}
              onChange={(e) => handleSettingsChange('grossIncome', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="80000"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ihr gesamtes zu versteuerndes Einkommen pro Jahr
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Familienstand
            </label>
            <select
              value={taxSettings.maritalStatus}
              onChange={(e) => handleSettingsChange('maritalStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="single">Alleinstehend</option>
              <option value="married">Verheiratet / Zusammenveranlagung</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bundesland
            </label>
            <select
              value={taxSettings.state}
              onChange={(e) => handleSettingsChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {germanStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={taxSettings.churchTax}
                onChange={(e) => handleSettingsChange('churchTax', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Kirchensteuerpflichtig
              </span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
              {taxSettings.state === 'Bayern' || taxSettings.state === 'Baden-Württemberg' ? '8%' : '9%'} der Einkommensteuer
            </p>
          </div>
        </div>
      </div>

      {/* Investment Assumptions */}
      <div>
        <h3 className="text-lg font-semibold dark:text-white mb-6">Anlageannahmen</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wertsteigerung p.a.: {taxSettings.valueGrowthPercent}%
            </label>
            <input
              type="range"
              min="0"
              max="8"
              step="0.1"
              value={taxSettings.valueGrowthPercent}
              onChange={(e) => handleSettingsChange('valueGrowthPercent', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>8%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mietsteigerung p.a.: {taxSettings.rentIncreasePercent}%
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={taxSettings.rentIncreasePercent}
              onChange={(e) => handleSettingsChange('rentIncreasePercent', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Calculation Results */}
      {taxCalculation && (
        <div>
          <h3 className="text-lg font-semibold dark:text-white mb-6">Steuerberechnung</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Einkommensteuer</p>
              <p className="text-xl font-bold dark:text-white">{taxCalculation.incomeTax.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Solidaritätszuschlag</p>
              <p className="text-xl font-bold dark:text-white">{taxCalculation.solidarityTax.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Kirchensteuer</p>
              <p className="text-xl font-bold dark:text-white">{taxCalculation.churchTax.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400">Gesamtsteuersatz</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{taxCalculation.totalTax.toFixed(1)}%</p>
            </div>
          </div>

          {investmentProjection && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-4">
                  Steuerliche Auswirkungen auf Mieteinnahmen (Jahr 1)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-400">Netto-Mieteinnahmen</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
                      {formatCurrency(property.monthly_rent_cold * 12 - ((property.house_fee || 0) * 12 + 1500))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-400">Steuern auf Mieterträge</p>
                    <p className="text-xl font-bold text-red-600">
                      -{formatCurrency(investmentProjection.currentYearTax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-400">Nach Steuern</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(investmentProjection.currentYearAfterTax)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 10-Year Projection Table */}
              <div>
                <h4 className="font-semibold dark:text-white mb-4">10-Jahres Prognose (nach Steuern)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Jahr</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Immobilienwert</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Brutto-Miete</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Steuern</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Nach Steuern</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Wertsteigerung</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {investmentProjection.projection.slice(0, 10).map((year: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 font-medium dark:text-white">{year.year}</td>
                          <td className="px-4 py-3 dark:text-gray-300">{formatCurrency(year.propertyValue)}</td>
                          <td className="px-4 py-3 dark:text-gray-300">{formatCurrency(year.grossRent)}</td>
                          <td className="px-4 py-3 text-red-600">-{formatCurrency(year.taxes)}</td>
                          <td className="px-4 py-3 text-green-600 font-medium">{formatCurrency(year.afterTaxIncome)}</td>
                          <td className="px-4 py-3 text-blue-600 font-medium">+{formatCurrency(year.valueAppreciation)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <p className="text-sm text-green-600 dark:text-green-400">10-Jahre Cashflow (nach Steuern)</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(investmentProjection.projection.reduce((sum: number, year: any) => sum + year.afterTaxIncome, 0))}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Wertsteigerung (10 Jahre)</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(investmentProjection.projection[9].valueAppreciation)}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <p className="text-sm text-purple-600 dark:text-purple-400">Gesamtsteuern (10 Jahre)</p>
                  <p className="text-xl font-bold text-red-600">
                    -{formatCurrency(investmentProjection.projection.reduce((sum: number, year: any) => sum + year.taxes, 0))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Important Notes */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
          ⚠️ Wichtige Hinweise zur Steuerberechnung
        </h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Diese Berechnung ist vereinfacht und ersetzt keine professionelle Steuerberatung</li>
          <li>• Abschreibungen, Sonderausgaben und weitere Faktoren sind nicht berücksichtigt</li>
          <li>• Steuergesetze können sich ändern</li>
          <li>• Konsultieren Sie einen Steuerberater für eine detaillierte Analyse</li>
        </ul>
      </div>
    </div>
  );
}