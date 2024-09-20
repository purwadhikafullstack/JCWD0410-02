// pages/index.tsx or any other page

import TransactionList from "@/features/dashboard/tenant-transactions/OrderList";


const Home: React.FC = () => {
    return (
        <div>
            <TransactionList />
        </div>
    );
};

export default Home;
