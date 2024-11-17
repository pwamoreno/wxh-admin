import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/action";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { Banknote, CircleUser, ShoppingBag } from "lucide-react";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();

  const graphData = await getSalesPerMonth();

  function addCommasToNumbers(number: number) {
    //convert number to string
    let numString = number.toString();

    //use regex to add commas to the string representation of the number
    numString = numString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return numString;
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="px-8 py-10">
          <p className="text-heading2-bold">Dashboard</p>
          <Separator className="bg-grey-1 my-5" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Total Revenue</CardTitle>
                <Banknote className="max-sm:hidden" />
              </CardHeader>
              <CardContent>
                <p className="text-body-bold">
                  ₦{addCommasToNumbers(totalRevenue)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Total Orders</CardTitle>
                <ShoppingBag className="max-sm:hidden" />
              </CardHeader>
              <CardContent>
                <p className="text-body-bold">{totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Total Customers</CardTitle>
                <CircleUser className="max-sm:hidden" />
              </CardHeader>
              <CardContent>
                <p className="text-body-bold">{totalCustomers}</p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-10">
            <CardHeader>
              <CardTitle>Sales Chart (₦)</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart data={graphData} />
            </CardContent>
          </Card>
        </div>
      </SignedIn>
    </>
  );
}
