interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function Input({ label, name, value, onChange }: InputProps) {
  return (
    <div className="flex items-center gap-2 mx-auto " >
      <label className="text-xl font-medium text-white whitespace-nowrap">{label} :</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="p-2 border rounded w-full text-xl text-white"
      />
    </div>
  );
} 
