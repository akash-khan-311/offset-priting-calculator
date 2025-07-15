export type FormState = {
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

export type ResultsState = {
  perSheetQty: number;
  totalSheets: number;
  totalPackets: number;
  impressions: number;
  plateCost: number;
  printCost: number;
  totalCost: number;
};

export type InputProps = {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
