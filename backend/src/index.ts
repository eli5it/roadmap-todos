import { app } from "./server";

const PORT = process.env.PORT || 8008;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
