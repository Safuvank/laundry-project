"use client";

interface ReportDateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
}

export default function ReportDateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: ReportDateFilterProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-950">
          Report Period
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Filter revenue and payment statistics by date.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Start Date */}

        <div className="w-full md:max-w-xs">
          <label
            htmlFor="report-start-date"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Start Date
          </label>

          <input
            id="report-start-date"
            type="date"
            value={startDate}
            onChange={(event) =>
              onStartDateChange(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* End Date */}

        <div className="w-full md:max-w-xs">
          <label
            htmlFor="report-end-date"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            End Date
          </label>

          <input
            id="report-end-date"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) =>
              onEndDateChange(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Clear */}

        <button
          type="button"
          onClick={onClear}
          disabled={!startDate && !endDate}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}