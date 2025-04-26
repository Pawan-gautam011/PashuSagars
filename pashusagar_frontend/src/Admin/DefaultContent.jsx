import { useState, useEffect } from "react";
import axios from "axios";
import { FileCheck } from "lucide-react";
import { toast } from "react-toastify";

const DefaultContent = ({ setActiveTab }) => {
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    total_products: 0,
    total_appointments: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    completed_orders: 0,
    failed_orders: 0,
    refunded_orders: 0,
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/dashboard-stats/"
        );
        setDashboardStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
      }
    };

    fetchDashboardStats();
  }, []);

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/generate-report/"
      );
      setDashboardStats(response.data);
      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: dashboardStats.total_users,
      bg: "from-[#004d40] to-[#00695c]",
    },
    {
      title: "Total Products",
      value: dashboardStats.total_products,
      bg: "from-[#004d40] to-[#00695c]",
    },
    {
      title: "Total Appointments",
      value: dashboardStats.total_appointments,
      bg: "from-[#004d40] to-[#00695c]",
    },
    {
      title: "Total Orders",
      value: dashboardStats.total_orders,
      bg: "from-[#004d40] to-[#00695c]",
      onClick: () => setActiveTab("orderManagement")
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardStats.total_revenue || 0}`,
      bg: "from-[#004d40] to-[#00695c]",
    },
    {
      title: "Pending Orders",
      value: dashboardStats.pending_orders,
      bg: "from-[#FFAA00] to-[#CC8800]",
      onClick: () => setActiveTab("orderManagement")
    },
    {
      title: "Completed Orders",
      value: dashboardStats.completed_orders,
      bg: "from-[#00AA55] to-[#008844]",
    },
    {
      title: "Failed Orders",
      value: dashboardStats.failed_orders,
      bg: "from-[#FF4444] to-[#CC2222]",
    },
    {
      title: "Refunded Orders",
      value: dashboardStats.refunded_orders,
      bg: "from-[#5566FF] to-[#3344DD]",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.bg} p-6 rounded-lg text-white ${stat.onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
            onClick={stat.onClick}
          >
            <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={generateReport}
          disabled={isGeneratingReport}
          className="px-6 py-3 bg-[#55DD4A] text-white font-semibold rounded-lg hover:bg-[#44BB3A] transition-colors disabled:opacity-50"
        >
          <FileCheck className="inline-block mr-2" />
          {isGeneratingReport ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </div>
  );
};

export default DefaultContent;