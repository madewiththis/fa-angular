//import Image from "next/image";
import DummyChart from "../components/placeholders/DummyChart";
import DummyTable from "../components/placeholders/DummyTable";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-start justify-start h-full w-full pl-[100px]">
      <h1 className="text-3xl font-bold mb-6 mt-2">Dashboard</h1>
      <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
        <DummyChart title="Revenue Overview" />
        <DummyChart title="Expenses Breakdown" />
      </div>
      <DummyTable title="Recent Transactions" />
      <DummyTable title="Top Customers" />
    </div>
  );
}
