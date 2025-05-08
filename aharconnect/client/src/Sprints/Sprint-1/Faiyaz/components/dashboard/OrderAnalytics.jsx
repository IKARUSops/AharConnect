import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { OrderAnalytics as OrderAnalyticsType } from '../../lib/types';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrderAnalyticsProps {
  analytics: OrderAnalyticsType;
}

const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({ analytics }) => {
  // Format order hour data for readability
  const formattedOrdersByHour = analytics.ordersByHour.map(item => ({
    ...item,
    hour: `${item.hour}:00`,
  }));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders.toString()}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          }
        />
        <StatCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toFixed(2)}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          }
        />
        <StatCard
          title="Average Order Value"
          value={`$${analytics.averageOrderValue.toFixed(2)}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20"></path>
              <path d="m17 5-5-3-5 3"></path>
              <path d="m17 19-5 3-5-3"></path>
            </svg>
          }
        />
      </div>

      <Tabs defaultValue="hourly" className="w-full">
        <TabsList>
          <TabsTrigger value="hourly">Orders by Hour</TabsTrigger>
          <TabsTrigger value="items">Top Selling Items</TabsTrigger>
        </TabsList>
        <TabsContent value="hourly" className="mt-0">
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    count: {
                      label: 'Number of Orders',
                      color: '#9b87f5',
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedOrdersByHour}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name="Orders" 
                        fill="#9b87f5" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
        </TabsContent>
        <TabsContent value="items" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    quantity: {
                      label: 'Quantity Sold',
                      color: '#9b87f5',
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.topSellingItems}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="itemName" 
                        tick={{ fontSize: 12 }}
                        width={90}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar 
                        dataKey="quantity" 
                        name="Quantity Sold" 
                        fill="#9b87f5"
                        radius={[0, 4, 4, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderAnalytics;
