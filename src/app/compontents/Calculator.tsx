'use client';

import { useState, useEffect } from 'react';
import Input from './Input';
import { FormState, ResultsState } from '@/Types/types';




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
  const [errors, setErrors] = useState<string[]>([]);


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
      color
    } = form;

    const errorList: string[] = [];

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
    const clr = color ? parseInt(color) : 1;

    if ([qty, pw, ph, pprW, pprH].some((val) => isNaN(val) || val <= 0)) {
      setResults({
        perSheetQty: 0,
        totalSheets: 0,
        totalPackets: 0,
        impressions: 0,
        plateCost: 0,
        printCost: 0,
        totalCost: 0,
      });
      errorList.push('Please enter positive values for all required inputs.');
      setErrors(errorList);
      return;
    }

    setErrors([]);

    const sheetFitWidth = Math.floor(pprW / pw);
    const sheetFitHeight = Math.floor(pprH / ph);
    const perSheetQty = sheetFitWidth * sheetFitHeight;
    const totalSheets = perSheetQty ? Math.ceil(qty / perSheetQty) : 0;
    const totalPackets = spp ? Math.ceil(totalSheets / spp) : 0;
    const impressions = totalSheets * printSide * clr;

    const plateCost = pd + pdd;
    const printCost = ((prd * impressions) / 1000) + ((prdd * impressions) / 1000);
    const totalCost = plateCost + printCost;

    setResults({ perSheetQty, totalSheets, totalPackets, impressions, plateCost, printCost, totalCost });
  }, [form]);
  const printW = parseFloat(form.printWidth);
  const printH = parseFloat(form.printHeight);

  const tableData = [
    {
      title: 'Full Size (Double Demy)',
      width: printW,
      height: printH,
    },
    {
      title: 'Half Size (Demy)',
      width: printW,
      height: printH ? printH / 2 : 0,
    },
    {
      title: 'Quarter Size (Demy)',
      width: printW ? printW / 2 : 0,
      height: printH ? printH / 2 : 0,
    },
    {
      title: 'Small Size (Demy)',
      width: printW ? printW / 2 : 0,
      height: printH ? printH / 4 : 0,
    },
  ].map((row) => {
    const pprW = parseFloat(form.paperWidth);
    const pprH = parseFloat(form.paperHeight);
    const qty = parseFloat(form.printQty);
    const printSide = form.printSide;
    const color = form.color ? parseInt(form.color) : 1;

    const fitW = Math.floor(pprW / row.width);
    const fitH = Math.floor(pprH / row.height);
    const perSheetQty = fitW * fitH;
    const totalSheets = perSheetQty ? Math.ceil(qty / perSheetQty) : 0;
    const impressions = totalSheets * printSide * color;

    return {
      ...row,
      impressions,
    };
  });

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-10 text-gray-100">Offset Printing Calculator</h1>
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Validation Error:</strong>
          <ul className="list-disc list-inside mt-2">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <section className='flex justify-between items-center'>

        <form className="space-y-4 mx-auto w-1/2">
          <Input label="Print Qty." name="printQty" value={form.printQty} onChange={handleChange} />
          <Input label="Print Width (inches)" name="printWidth" value={form.printWidth} onChange={handleChange} />
          <Input label="Print Height (inches)" name="printHeight" value={form.printHeight} onChange={handleChange} />
          <Input label="Paper Width (inches)" name="paperWidth" value={form.paperWidth} onChange={handleChange} />
          <Input label="Paper Height (inches)" name="paperHeight" value={form.paperHeight} onChange={handleChange} />
          <Input label="Per Packet Sheets" name="sheetsPerPacket" value={form.sheetsPerPacket} onChange={handleChange} />
          <Input label="Plate (Demy)" name="plateD" value={form.plateD} onChange={handleChange} />
          <Input label="Plate (Double Demy)" name="plateDD" value={form.plateDD} onChange={handleChange} />
          <Input label="Printing (Per 1000 Demy)" name="printD" value={form.printD} onChange={handleChange} />
          <Input label="Printing (Per 1000 Double Demy)" name="printDD" value={form.printDD} onChange={handleChange} />

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
        </form>
      </section>

      <section className="bg-slate-950 p-10 rounded-lg border mt-6 space-y-4">
        <h2 className="font-bold text-4xl text-green-600">Result Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className='text-xl text-white'><strong>Per Sheet Printing Qty:</strong> {results.perSheetQty}</p>
          <p className='text-xl text-white'><strong>Total Sheets for Printing:</strong> {results.totalSheets}</p>
          <p className='text-xl text-white'><strong>Total Packets Needed:</strong> {results.totalPackets}</p>
          <p className='text-xl text-white'><strong>Total Impressions:</strong> {results.impressions}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-green-700 text-3xl">Estimated Cost Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <p className='text-xl text-white'><strong>Plate Cost:</strong> {results.plateCost.toFixed(2)} ৳</p>
            <p className='text-xl text-white'><strong>Printing Cost:</strong> {results.printCost.toFixed(2)} ৳</p>
            <p className="text-xl font-bold text-blue-700 col-span-2"><strong>Total Estimated Cost:</strong> {results.totalCost.toFixed(2)} ৳</p>
          </div>
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
            {tableData.map((row, i) => (
              <tr key={i}>
                <td className="border p-5">{row.title}</td>
                <td className="border p-5">{row.width ? row.width.toFixed(2) : ''}</td>
                <td className="border p-5">{row.height ? row.height.toFixed(2) : ''}</td>
                <td className="border p-5">{row.impressions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


