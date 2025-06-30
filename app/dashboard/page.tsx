import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: BarChart3,
    },
    {
      title: 'Products',
      value: '2,340',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '-5.2%',
      trend: 'down',
      icon: ShoppingCart,
    },
    {
      title: 'Customers',
      value: '856',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Smith',
      amount: '$239.99',
      status: 'Completed',
      date: '2024-01-15',
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Johnson',
      amount: '$156.50',
      status: 'Pending',
      date: '2024-01-15',
    },
    {
      id: 'ORD-003',
      customer: 'Mike Wilson',
      amount: '$89.99',
      status: 'Shipped',
      date: '2024-01-14',
    },
    {
      id: 'ORD-004',
      customer: 'Emily Davis',
      amount: '$324.75',
      status: 'Completed',
      date: '2024-01-14',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs">
                  <TrendIcon className={`h-3 w-3 ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Placeholder */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Your revenue performance over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders from your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.id} • {order.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      order.status === 'Completed' ? 'default' :
                      order.status === 'Shipped' ? 'secondary' :
                      'outline'
                    }>
                      {order.status}
                    </Badge>
                    <div className="text-sm font-medium">
                      {order.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}