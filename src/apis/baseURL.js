import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "https://safestreets.westeurope.cloudapp.azure.com:3000",
});
