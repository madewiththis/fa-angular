import QuotationTable from "../../../components/documents/quotations/QuotationTable";
import DocumentToolbar from "../../../components/documents/DocumentToolbar";

export default function QuotationPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-4">Quotations</h1>
      <DocumentToolbar />
      <QuotationTable />
    </div>
  );
}
