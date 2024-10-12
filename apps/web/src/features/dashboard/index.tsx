import CardSalesTransaction from '@/components/Dashboard/CardSalesTransaction';
import ChartCard from '@/components/Dashboard/ChartSalesTransaction';
import ChartCardTransactions from '@/components/Dashboard/ChartTotalTransactions';
import LineChartCard from '@/components/Dashboard/LineChartCard';

const DashboardPage = async () => {
  return (
    <div>
      <div className="p-6">
        <div className="container mx-auto p-6">
          <CardSalesTransaction />

          <div className="mt-8 flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <ChartCard />
            <ChartCardTransactions />
          </div>

          <div className="mt-8">
            <LineChartCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
