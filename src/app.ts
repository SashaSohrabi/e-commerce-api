import '#db';
import express from 'express';
import { errorHandler, notFoundHandler } from '#middleware';
import { userRouter, categoryRouter, productRouter, orderRouter } from '#routers';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
