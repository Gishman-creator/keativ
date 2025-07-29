import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, X } from 'lucide-react';

interface BillingData {
  currentPlan: string;
  price: string;
  period: string;
  nextBilling: string;
  features: string[];
  billingHistory: {
    id: string;
    date: string;
    amount: string;
    plan: string;
    status: string;
  }[];
}

interface BillingProps {
  billingData: BillingData;
}

const Billing: React.FC<BillingProps> = ({ billingData }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billings</h2>
        <p className="text-gray-600">Pick a billing plan that suits you</p>
      </div>

      {/* Billing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Plan</h3>
          <p className="text-gray-600 text-sm mb-4">Suitable plan for starter business</p>
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">$99.99</span>
            <span className="text-gray-600 ml-1">/year</span>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
              Customer Segmentations
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
              Google Integrations
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
              Activity Reminder
            </li>
          </ul>
          <Button variant="outline" className="w-full">Choose Plan</Button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Plan</h3>
          <p className="text-gray-600 text-sm mb-4">Best plan for mid-sized businesses</p>
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">$119.99</span>
            <span className="text-gray-600 ml-1">/year</span>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
              Get a Basic Plans
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
              Access All Feature
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
              Get 1TB Cloud Storage
            </li>
          </ul>
          <Button variant="outline" className="w-full">Choose Plan</Button>
        </div>

        {/* Professional Plan - Active */}
        <div className="bg-teal-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Professional Plan</h3>
          <p className="text-teal-100 text-sm mb-4">Suitable plan for starter</p>
          <div className="mb-6">
            <span className="text-3xl font-bold">{billingData.price}</span>
            <span className="text-teal-100 ml-1">/{billingData.period}</span>
          </div>
          <ul className="space-y-3 mb-6">
            {billingData.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-teal-100">
                <Check className="w-4 h-4 mr-3" />
                {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full bg-white text-teal-600 hover:bg-gray-100">Active plan</Button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">No.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Created Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {billingData.billingHistory.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">0{index + 1}</td>
                  <td className="py-4 px-4 font-medium">Invoice#{item.id}</td>
                  <td className="py-4 px-4">{item.date}</td>
                  <td className="py-4 px-4">{item.amount}</td>
                  <td className="py-4 px-4">{item.plan}</td>
                  <td className="py-4 px-4">
                    <Badge className="bg-green-100 text-green-800">{item.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700 w-8 h-8 p-0">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
