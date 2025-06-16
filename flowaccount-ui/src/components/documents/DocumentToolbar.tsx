import StatusFilter from "./StatusFilter";
import DateFilter from "./DateFilter";
import ExportButton from "./ExportButton";
import NewDocButton from "./NewDocButton";
import SearchInput from "./SearchInput";

export default function DocumentToolbar() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        {/* Search */}
        <SearchInput />
        {/* Filters Group */}
        <div className="flex items-center ml-4">
          <StatusFilter />
          <div className="ml-2">
            <DateFilter />
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
