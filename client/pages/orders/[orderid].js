const OrderShow = ({ orderid }) => {
  return <div>OrderShow: {orderid}</div>;
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderid } = context.query; //comes from [orderid]

  return { orderid };
};

export default OrderShow;
