import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColumns";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`);

  console.log(res)

  const { orderDetails, customer } = await res.json();

  console.log(orderDetails.shippingInfo)
  // console.log(customer)

  function addCommasToNumbers(number: number) {
    //convert number to string
    let numString = number.toString();

    //use regex to add commas to the string representation of the number
    numString = numString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return numString;
  }

  return (
    <div className="flex flex-col p-10 gap-5">
      <p className="text-base-bold">
        Order ID: <span className="text-base-medium">{orderDetails._id}</span>
      </p>
      <p className="text-base-bold">
        Customer Name: <span className="text-base-medium">{customer.name}</span>
      </p>
      <p className="text-base-bold">
        Total Paid:{" "}
        <span className="text-base-medium">₦{addCommasToNumbers(orderDetails.totalAmount)}</span>
      </p>
      <div>
        <h1 className="text-base-bold pb-2">Shipping Information</h1>
        <p className="text-base-bold pb-1">Name: <span className="text-base-medium">{orderDetails.shippingInfo.fullName}</span></p>
        <p className="text-base-bold pb-1">Address: <span className="text-base-medium">{orderDetails.shippingInfo.address}</span></p>
        <p className="text-base-bold pb-1">Phone: <span className="text-base-medium">{orderDetails.shippingInfo.phone}</span></p>
        <p className="text-base-bold pb-1">Country: <span className="text-base-medium">{orderDetails.shippingInfo.country}</span></p>
        <p className="text-base-bold pb-1">Delivery mode: <span className="text-base-medium">{orderDetails.shippingInfo.deliveryMode}</span></p>
      </div>
      <DataTable columns={columns} data={orderDetails.items} searchKey="title"/>
    </div>
  );
};

export const dynamic = "force-dynamic"

export default OrderDetails;
