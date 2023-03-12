import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1Mkd3iCsSVNVVkxr6SNDKodc' },
          { shipping_rate: 'shr_1Mkd4pCsSVNVVkxrPUBWQE2J' },
        ],
        line_items: req.body.map(product => {
          const imageReference = product.image[0].asset._ref;

          // Once you have the image reference, you can use it to get the image url
          const imageUrl = imageReference
            .replace(
              'image-',
              'https://cdn.sanity.io/images/2mq9pdj2/production/'
            )
            .replace('-webp', '.webp');

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                images: [imageUrl],
              },
              unit_amount: Math.round(product.price * 100),
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: product.quantity,
          };
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
