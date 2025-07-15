'use client';

import { useState, useEffect } from 'react';
import Input from './Input';


type FormState = {
  printQty: string;
  printWidth: string;
  printHeight: string;
  paperWidth: string;
  paperHeight: string;
  color: string;
  printSide: number;
  sheetsPerPacket: string;
  plateD: string;
  plateDD: string;
  printD: string;
  printDD: string;
};

type ResultsState = {
  perSheetQty: number;
  totalSheets: number;
  totalPackets: number;
  impressions: number;
  plateCost: number;
  printCost: number;
  totalCost: number;
};


export default function OffsetCalculator() {
  const [form, setForm] = useState<FormState>({
    printQty: '',
    printWidth: '',
    printHeight: '',
    paperWidth: '',
    paperHeight: '',
    color: '',
    printSide: 1,
    sheetsPerPacket: '',
    plateD: '',
    plateDD: '',
    printD: '',
    printDD: '',
  });

  const [results, setResults] = useState<ResultsState>({
    perSheetQty: 0,
    totalSheets: 0,
    totalPackets: 0,
    impressions: 0,
    plateCost: 0,
    printCost: 0,
    totalCost: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = name === 'color' ? value : value === '' ? '' : parseFloat(value);
    setForm((prev) => ({ ...prev, [name]: numValue }));
  };

  useEffect(() => {
    const {
      printQty,
      printWidth,
      printHeight,
      paperWidth,
      paperHeight,
      printSide,
      sheetsPerPacket,
      plateD,
      plateDD,
      printD,
      printDD,
    } = form;

    if (!printQty || !printWidth || !printHeight || !paperWidth || !paperHeight) {
      setResults({
        perSheetQty: 0,
        totalSheets: 0,
        totalPackets: 0,
        impressions: 0,
        plateCost: 0,
        printCost: 0,
        totalCost: 0,
      });
      return;
    }

    const qty = parseFloat(printQty);
    const pw = parseFloat(printWidth);
    const ph = parseFloat(printHeight);
    const pprW = parseFloat(paperWidth);
    const pprH = parseFloat(paperHeight);
    const spp = sheetsPerPacket ? parseFloat(sheetsPerPacket) : 0;
    const pd = plateD ? parseFloat(plateD) : 0;
    const pdd = plateDD ? parseFloat(plateDD) : 0;
    const prd = printD ? parseFloat(printD) : 0;
    const prdd = printDD ? parseFloat(printDD) : 0;

    const sheetFitWidth = Math.floor(pprW / pw);
    const sheetFitHeight = Math.floor(pprH / ph);
    const perSheetQty = sheetFitWidth * sheetFitHeight;
    const totalSheets = perSheetQty ? Math.ceil(qty / perSheetQty) : 0;
    const totalPackets = spp ? Math.ceil(totalSheets / spp) : 0;
    const impressions = totalSheets * printSide;

    const plateCost = pd + pdd;
    const printCost = ((prd * impressions) / 1000) + ((prdd * impressions) / 1000);
    const totalCost = plateCost + printCost;

    setResults({ perSheetQty, totalSheets, totalPackets, impressions, plateCost, printCost, totalCost });
  }, [form]);

  const tableRows = [
    'Small Size (Demy)',
    'Quarter Size (Demy)',
    'Half Size (Demy)',
    'Full Size (Double Demy)'
  ];

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-10 text-gray-100">Offset Printing Calculator</h1>

      <section className='flex justify-between items-center'>

        <div className="space-y-4 mx-auto w-1/2">
          {[
            { label: 'Print Qty.', name: 'printQty' },
            { label: 'Print Width (inches)', name: 'printWidth' },
            { label: 'Print Height (inches)', name: 'printHeight' },
            { label: 'Paper Width (inches)', name: 'paperWidth' },
            { label: 'Paper Height (inches)', name: 'paperHeight' },
            { label: 'Per Packet Sheets', name: 'sheetsPerPacket' },
            { label: 'Plate (Demy)', name: 'plateD' },
            { label: 'Plate (Double Demy)', name: 'plateDD' },
            { label: 'Printing (Per 1000 Demy)', name: 'printD' },
            { label: 'Printing (Per 1000 Double Demy)', name: 'printDD' },
          ].map(({ label, name }) => (
            <Input key={name} label={label} name={name} value={form[name as keyof FormState]} onChange={handleChange} />
          ))}

          <div className='flex justify-between gap-4 '>
            <div className="flex items-center gap-2 ">
              <label className="text-xl font-medium text-white">Color:</label>
              <select name="color" value={form.color} onChange={handleChange} className="py-4 px-10 border rounded text-white">
                <option className='text-gray-800' value="">Select</option>
                <option className='text-gray-800' value="1c">1 Color</option>
                <option className='text-gray-800' value="2c">2 Color</option>
                <option className='text-gray-800' value="4c">4 Color</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xl font-medium text-white">Print Side:</label>
              <select name="printSide" value={form.printSide} onChange={handleChange} className="p-2 border rounded text-white py-4 px-10" >
                <option className='text-gray-800' value={1}>Single Side</option>
                <option className='text-gray-800' value={2}>Both Side</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 p-10 rounded-lg border mt-6 space-y-4">
        <h2 className="font-bold text-4xl text-green-600">Result Summary</h2>
        <p className='text-2xl text-white'><strong>Per Sheet Printing Qty:</strong> {results.perSheetQty}</p>
        <p className='text-2xl text-white'><strong>Total Sheets for Printing:</strong> {results.totalSheets}</p>
        <p className='text-2xl text-white'><strong>Total Packets Needed:</strong> {results.totalPackets}</p>



        <div className="mt-6">
          <h3 className="font-semibold text-green-700 text-3xl">Estimated Cost Breakdown</h3>
          <p className='text-2xl text-white'><strong>Plate Cost:</strong> {results.plateCost.toFixed(2)} ৳</p>
          <p className='text-2xl text-white'><strong>Printing Cost:</strong> {results.printCost.toFixed(2)} ৳</p>
          <p className="text-xl font-bold text-blue-700"><strong>Total Estimated Cost:</strong> {results.totalCost.toFixed(2)} ৳</p>
        </div>
      </section>
      <div>
        <h3 className="font-bold my-10 text-5xl text-white text-center">Total Qty. of Printing Impressions</h3>
        <table className="w-full border mt-2 text-sm">
          <thead className=''>
            <tr className="bg-blue-600 text-white text-2xl">
              <th className="border-r p-3">Printing Details</th>
              <th className="border-r p-3">Width</th>
              <th className="border-r p-3">Height</th>
              <th className="border-0 p-3">Impressions</th>
            </tr>
          </thead>
          <tbody className='text-xl bg-blue-300 '>
            {tableRows.map((title, i) => (
              <tr key={i}>
                <td className="border p-5">{title}</td>
                <td className="border p-5">{i === 0 ? form.printWidth : ''}</td>
                <td className="border p-5">{i === 0 ? form.printHeight : ''}</td>
                <td className="border p-5">{i === 0 ? results.impressions : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


