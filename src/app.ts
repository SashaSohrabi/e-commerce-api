import '#db';
import express from 'express';
import { errorHandler, notFoundHandler } from '#middleware';
import { userRouter } from '#routers';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use('/users', userRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
