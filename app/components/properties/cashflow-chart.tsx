// app/components/properties/cashflow-chart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Property } from '@/types/index';
import { formatCurrency } from '@/lib/utils';

interface CashflowChartProps {
  property: Property;
}

export default function CashflowChart({ property }: CashflowChartProps) {
  // Generate 10-year cashflow projection
  const generateCashflowData = () => {
    const data: Array<{
      year: string;
      yearNumber: number;
      monthlyRent: number;
      annualRent: number;
      annualCosts: number;
      netCashflow: number;
      cumulativeCashflow: number;
      propertyValue: number;
      totalReturn: number;
    }> = [];
    let currentRent = property.monthly_rent_cold;
    let currentValue = property.total_price;
    const rentIncrease = (property.rent_increase_percent || 2) / 100;
    const valueGrowth = (property.value_growth_percent || 3) / 100;
    const annualCosts = (property.house_fee || 0) * 12 + (property.management_costs || 500);

    for (let year = 1; year <= 10; year++) {
      const annualRent = currentRent * 12;
      const netCashflow = annualRent - annualCosts;
      const cumulativeCashflow: number = year === 1 ? netCashflow : data[year - 2].cumulativeCashflow + netCashflow;
      
      data.push({
        year: `Jahr ${year}`,
        yearNumber: year,
        monthlyRent: Math.round(currentRent),
        annualRent: Math.round(annualRent),
        annualCosts: Math.round(annualCosts),
        netCashflow: Math.round(netCashflow),
        cumulativeCashflow: Math.round(cumulativeCashflow),
        propertyValue: Math.round(currentValue),
        totalReturn: Math.round(cumulativeCashflow + (currentValue - property.total_price))
      });

      // Increase rent and value for next year
      currentRent *= (1 + rentIncrease);
      currentValue *= (1 + valueGrowth);
    }

    return data;
  };

  const cashflowData = generateCashflowData();

  return (
    <div className="space-y-6">
      {/* Annual Cashflow Chart */}
      <div>
        <h4 className="font-medium dark:text-white mb-4">Jährlicher Cashflow</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="year" 
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'annualRent' ? 'Mieteinnahmen' :
                  name === 'annualCosts' ? 'Jährliche Kosten' :
                  'Netto Cashflow'
                ]}
              />
              <Legend 
                formatter={(value) => 
                  value === 'annualRent' ? 'Mieteinnahmen' :
                  value === 'annualCosts' ? 'Jährliche Kosten' :
                  'Netto Cashflow'
                }
              />
              <Bar 
                dataKey="annualRent" 
                fill="#10b981" 
                name="annualRent"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="annualCosts" 
                fill="#ef4444" 
                name="annualCosts"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="netCashflow" 
                fill="#3b82f6" 
                name="netCashflow"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Return Chart */}
      <div>
        <h4 className="font-medium dark:text-white mb-4">Kumulative Rendite</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="year" 
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'cumulativeCashflow' ? 'Kumulativer Cashflow' :
                  name === 'propertyValue' ? 'Immobilienwert' :
                  'Gesamtrendite'
                ]}
              />
              <Legend 
                formatter={(value) => 
                  value === 'cumulativeCashflow' ? 'Kumulativer Cashflow' :
                  value === 'propertyValue' ? 'Immobilienwert' :
                  'Gesamtrendite'
                }
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeCashflow" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="cumulativeCashflow"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="propertyValue" 
                stroke="#10b981" 
                strokeWidth={3}
                name="propertyValue"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="totalReturn" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="totalReturn"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">10-Jahres Cashflow</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(cashflowData[9].cumulativeCashflow)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Wertsteigerung</p>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(cashflowData[9].propertyValue - property.total_price)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Gesamtrendite</p>
          <p className="text-xl font-bold text-purple-600">
            {formatCurrency(cashflowData[9].totalReturn)}
          </p>
        </div>
      </div>
    </div>
  );
}