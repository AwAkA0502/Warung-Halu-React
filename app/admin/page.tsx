"use client";
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalMenu: 0, totalOrders: 0, revenue: 0 });

  useEffect(() => {
    async function getStats() {
      const resMenu = await fetch('/api/menu');
      const menus = await resMenu.json();
      const resOrder = await fetch('/api/admin/orders');
      const orders = await resOrder.json();

      const totalRevenue = orders.reduce((acc: number, curr: any) => acc + curr.total, 0);
      setStats({
        totalMenu: menus.length,
        totalOrders: orders.length,
        revenue: totalRevenue
      });
    }
    getStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ringkasan Warung</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 font-bold text-xs uppercase">Total Menu</p>
          <h3 className="text-4xl font-black mt-2 text-blue-600">{stats.totalMenu}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 font-bold text-xs uppercase">Total Transaksi</p>
          <h3 className="text-4xl font-black mt-2 text-[#a52a2a]">{stats.totalOrders}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 font-bold text-xs uppercase">Omset (Bruto)</p>
          <h3 className="text-4xl font-black mt-2 text-green-600">Rp {stats.revenue.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
}