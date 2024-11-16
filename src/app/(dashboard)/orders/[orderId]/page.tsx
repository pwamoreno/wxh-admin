import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColumns";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(`http://localhost:3000/api/orders/${params.orderId}`);

  // console.log(res)

  const { orderDetails, customer } = await res.json();

  // console.log(orderDetails)

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
      <DataTable columns={columns} data={orderDetails.items} searchKey="title"/>
    </div>
  );
};

export const dynamic = "force-dynamic"

export default OrderDetails;
