import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const OrderShow = ({ order, currentUser }) => {
  const STRIPE_KEY =
    'pk_test_51HwMukGs6EkJCCd4NRtHe6NYuZVvNUyH97f3qr4gFnkNYrnauHUr6xOpY2N64TxGidFI4fWyLgTQbYmCX4wk6XXj00ojb1Li9e';

  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        stripeKey={STRIPE_KEY}
        amount={order.ticket.price * 100}
        currency='EUR'
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderid } = context.query; //comes from [orderid]
  const { data } = await client.get(`/api/orders/${orderid}`);
  return { order: data };
};

export default OrderShow;
