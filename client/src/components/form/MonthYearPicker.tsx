import { Label } from '../ui/Field';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const selectClass =
  'w-full rounded-md border border-border bg-[#10131c] px-2 py-2 text-sm text-gray-100 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40';

interface MonthYearPickerProps {
  label: string;
  month: string;
  year: string;
  onMonth: (value: string) => void;
  onYear: (value: string) => void;
  disabled?: boolean;
}

export function MonthYearPicker({
  label,
  month,
  year,
  onMonth,
  onYear,
  disabled,
}: MonthYearPickerProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <select
          value={month}
          onChange={(e) => onMonth(e.target.value)}
          disabled={disabled}
          className={`${selectClass} disabled:opacity-40`}
        >
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          value={year}
          onChange={(e) => onYear(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
          disabled={disabled}
          placeholder="Year"
          inputMode="numeric"
          className={`${selectClass} w-24 disabled:opacity-40`}
        />
      </div>
    </div>
  );
}
