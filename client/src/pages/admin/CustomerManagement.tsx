import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Users, ShoppingBag, Heart, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
  wishlistCount: number;
}

interface RecentOrder {
  orderId: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface Customer {
  _id: string;
  phone: string;
  name: string;
  email: string;
  dob?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  phoneVerified: boolean;
  notifyUpdates: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  stats: CustomerStats;
  recentOrders: RecentOrder[];
  wishlistItems: WishlistItem[];
}

export default function CustomerManagement() {
  const [location, setLocation] = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [paidUsersOnly, setPaidUsersOnly] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterState, setFilterState] = useState("");
  const [lastActivityDays, setLastActivityDays] = useState("");
  const limit = 50;

  const { data: customersData, isLoading, error } = useQuery<{
    customers: Customer[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>({
    queryKey: ["/api/admin/customers", searchQuery, sortBy, sortOrder, page, limit, paidUsersOnly, filterCity, filterState, lastActivityDays],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      params.set('sort', sortBy);
      params.set('order', sortOrder);
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (paidUsersOnly) params.set('paidUsers', 'true');
      if (filterCity) params.set('city', filterCity);
      if (filterState) params.set('state', filterState);
      if (lastActivityDays && lastActivityDays !== 'all') params.set('lastActivityDays', lastActivityDays);
      
      const url = `/api/admin/customers?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch customers: ${res.statusText}`);
      }
      
      return res.json();
    },
    enabled: !!adminToken,
  });

  const customers = customersData?.customers || [];
  const pagination = customersData?.pagination;

  // Helper function to get unique values case-insensitively
  const getUniqueCaseInsensitive = (values: string[]): string[] => {
    const seenLower = new Map<string, string>();
    values.forEach(value => {
      const lowerValue = value.toLowerCase();
      if (!seenLower.has(lowerValue)) {
        seenLower.set(lowerValue, value);
      }
    });
    return Array.from(seenLower.values()).sort();
  };

  // Extract unique cities and states from customer addresses
  const { uniqueCities, uniqueStates } = useMemo(() => {
    const cities: string[] = [];
    const states: string[] = [];
    
    customers.forEach(customer => {
      if (customer.address?.city) cities.push(customer.address.city);
      if (customer.address?.state) states.push(customer.address.state);
    });
    
    return {
      uniqueCities: getUniqueCaseInsensitive(cities),
      uniqueStates: getUniqueCaseInsensitive(states),
    };
  }, [customers]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "Never";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  const formatFullDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      processing: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      shipped: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      delivered: "bg-green-500/10 text-green-700 dark:text-green-400",
      cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
      paid: "bg-green-500/10 text-green-700 dark:text-green-400",
      failed: "bg-red-500/10 text-red-700 dark:text-red-400",
    };
    return statusColors[status] || "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  };

  if (!adminToken) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Customer Management</h1>
          <p className="text-muted-foreground">View and manage customer information</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-customers">
                {pagination?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-orders">
                {customers.reduce((sum, c) => sum + c.stats.totalOrders, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-revenue">
                {formatCurrency(customers.reduce((sum, c) => sum + c.stats.totalSpent, 0))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlists</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-wishlists">
                {customers.reduce((sum, c) => sum + c.stats.wishlistCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by phone, name, or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8"
                    data-testid="input-search-customers"
                  />
                </div>
              </div>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-[200px]" data-testid="select-sort-by">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Join Date</SelectItem>
                  <SelectItem value="lastLogin">Last Login</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="phone">Phone Number</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger className="w-[150px]" data-testid="select-sort-order">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="text-sm font-medium">Advanced Filters</div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <Select value={filterCity || "all"} onValueChange={(value) => {
                    setFilterCity(value === "all" ? "" : value);
                    setPage(1);
                  }}>
                    <SelectTrigger data-testid="select-filter-city">
                      <SelectValue placeholder="Filter by city..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {uniqueCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[150px]">
                  <Select value={filterState || "all"} onValueChange={(value) => {
                    setFilterState(value === "all" ? "" : value);
                    setPage(1);
                  }}>
                    <SelectTrigger data-testid="select-filter-state">
                      <SelectValue placeholder="Filter by state..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {uniqueStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select value={lastActivityDays} onValueChange={(value) => {
                  setLastActivityDays(value);
                  setPage(1);
                }}>
                  <SelectTrigger className="w-[180px]" data-testid="select-last-activity">
                    <SelectValue placeholder="Last Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7">Active in 7 days</SelectItem>
                    <SelectItem value="30">Active in 30 days</SelectItem>
                    <SelectItem value="90">Active in 90 days</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={paidUsersOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setPaidUsersOnly(!paidUsersOnly);
                    setPage(1);
                  }}
                  data-testid="button-paid-users-filter"
                >
                  {paidUsersOnly ? "✓ Paid Users" : "Paid Users"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customers ({pagination?.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading customers...</div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No customers found</div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phone</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Wishlist</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer._id} data-testid={`row-customer-${customer._id}`}>
                          <TableCell className="font-medium" data-testid={`text-phone-${customer._id}`}>
                            {customer.phone}
                            {customer.phoneVerified && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Verified
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell data-testid={`text-name-${customer._id}`}>
                            {customer.name || <span className="text-muted-foreground italic">Not provided</span>}
                          </TableCell>
                          <TableCell data-testid={`text-email-${customer._id}`}>
                            {customer.email || <span className="text-muted-foreground italic">Not provided</span>}
                          </TableCell>
                          <TableCell data-testid={`text-orders-${customer._id}`}>
                            <Badge variant="outline">{customer.stats.totalOrders}</Badge>
                          </TableCell>
                          <TableCell data-testid={`text-spent-${customer._id}`}>
                            {formatCurrency(customer.stats.totalSpent)}
                          </TableCell>
                          <TableCell data-testid={`text-wishlist-${customer._id}`}>
                            <Badge variant="outline">{customer.stats.wishlistCount}</Badge>
                          </TableCell>
                          <TableCell data-testid={`text-last-login-${customer._id}`}>
                            {formatDate(customer.lastLogin)}
                          </TableCell>
                          <TableCell data-testid={`text-joined-${customer._id}`}>
                            {formatDate(customer.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                              data-testid={`button-view-${customer._id}`}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {error && (
                  <div className="text-center py-4 text-destructive">
                    Error loading customers. Please try again.
                  </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} customers
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page <= 1 || isLoading}
                        data-testid="button-prev-page"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                        disabled={!pagination || page >= pagination.totalPages || isLoading}
                        data-testid="button-next-page"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Phone Number</div>
                      <div className="flex items-center gap-2">
                        <span data-testid="detail-phone">{selectedCustomer.phone}</span>
                        {selectedCustomer.phoneVerified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Name</div>
                      <div data-testid="detail-name">
                        {selectedCustomer.name || <span className="italic text-muted-foreground">Not provided</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Email</div>
                      <div data-testid="detail-email">
                        {selectedCustomer.email || <span className="italic text-muted-foreground">Not provided</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                      <div data-testid="detail-dob">
                        {selectedCustomer.dob 
                          ? new Date(selectedCustomer.dob).toLocaleDateString('en-IN')
                          : <span className="italic text-muted-foreground">Not provided</span>
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                      <div data-testid="detail-last-login">
                        {selectedCustomer.lastLogin 
                          ? formatFullDate(selectedCustomer.lastLogin)
                          : <span className="italic text-muted-foreground">Never</span>
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Member Since</div>
                      <div data-testid="detail-created-at">{formatFullDate(selectedCustomer.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Notifications</div>
                      <Badge variant={selectedCustomer.notifyUpdates ? "default" : "secondary"}>
                        {selectedCustomer.notifyUpdates ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCustomer.address && (selectedCustomer.address.street || selectedCustomer.address.city || selectedCustomer.address.state || selectedCustomer.address.pincode || selectedCustomer.address.landmark) ? (
                      <div className="space-y-2 text-sm">
                        {selectedCustomer.address.street && <div>{selectedCustomer.address.street}</div>}
                        {selectedCustomer.address.landmark && <div>{selectedCustomer.address.landmark}</div>}
                        {(selectedCustomer.address.city || selectedCustomer.address.state) && (
                          <div>
                            {selectedCustomer.address.city}
                            {selectedCustomer.address.city && selectedCustomer.address.state && ', '}
                            {selectedCustomer.address.state}
                          </div>
                        )}
                        {selectedCustomer.address.pincode && <div>PIN: {selectedCustomer.address.pincode}</div>}
                      </div>
                    ) : (
                      <div className="italic text-muted-foreground">No address provided</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCustomer.stats.totalOrders}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(selectedCustomer.stats.totalSpent)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCustomer.stats.completedOrders}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCustomer.stats.pendingOrders}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer.recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.recentOrders.map((order) => (
                        <div key={order.orderId} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="space-y-1">
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatFullDate(order.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(order.total)}</div>
                              <div className="flex gap-1 mt-1">
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                <Badge className={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground italic">No orders yet</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Wishlist ({selectedCustomer.stats.wishlistCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer.wishlistItems && selectedCustomer.wishlistItems.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedCustomer.wishlistItems.map((item) => (
                        <div key={item._id} className="border rounded-md p-3 space-y-2">
                          {item?.images && Array.isArray(item.images) && item.images.length > 0 && item.images[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item?.name || 'Product'}
                              className="w-full h-32 object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-32 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                              No image
                            </div>
                          )}
                          <div className="font-medium text-sm line-clamp-2">{item?.name || 'Unnamed Product'}</div>
                          <div className="text-sm font-bold">{item?.price ? formatCurrency(item.price) : 'Price N/A'}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground italic">Wishlist is empty</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
