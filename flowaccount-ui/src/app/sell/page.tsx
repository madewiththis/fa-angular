import DummyChart from "../../components/placeholders/DummyChart";
import DummyTable from "../../components/placeholders/DummyTable";

export default function SellPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-4">Sell</h1>
      <DummyChart title="Sales Overview" />
      <DummyTable title="Recent Sales" />
    </div>
  );
}
