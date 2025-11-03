import '#db';
import express from 'express';
import { errorHandler, notFoundHandler } from '#middleware';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
