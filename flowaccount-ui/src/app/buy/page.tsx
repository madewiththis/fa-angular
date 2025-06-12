import DummyChart from "../../components/placeholders/DummyChart";
import DummyTable from "../../components/placeholders/DummyTable";

export default function BuyPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-4">Buy</h1>
      <DummyChart title="Purchase Overview" />
      <DummyTable title="Recent Purchases" />
    </div>
  );
}
