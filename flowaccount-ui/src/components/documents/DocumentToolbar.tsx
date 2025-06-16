import StatusFilter from "./StatusFilter";
import DateFilter from "./DateFilter";
import ExportButton from "./ExportButton";
import NewDocButton from "./NewDocButton";
import SearchInput from "./SearchInput";

interface StatusCounts {
  [key: string]: number;
}

interface DocumentToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  statusCounts?: StatusCounts;
}

export default function DocumentToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  statusCounts,
}: DocumentToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        {/* Search */}
        <SearchInput value={searchValue} onChange={onSearchChange} />
        {/* Filters Group */}
        <div className="flex items-center ml-4">
          <StatusFilter
            value={statusFilter}
            onChange={onStatusChange}
            counts={statusCounts}
          />
          <div className="ml-2">
            <DateFilter value={dateFilter} onChange={onDateChange} />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {/* Export */}
        <ExportButton />
        {/* Create New Doc Button */}
        <NewDocButton />
      </div>
    </div>
  );
}
