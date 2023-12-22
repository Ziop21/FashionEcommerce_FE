import { EOrderStatus, Order } from "./Models";
import { AxiosResponse } from "axios";

import api from "@/pages/api/api";

interface ParamProps {
  search?: string;
  deliveryIds?: string[];
  statuses?: EOrderStatus[];
  isPaidBefore?: boolean;
  fromDate?: Date;
  toDate?: Date;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<Order[]> => {
  try {
    const response: AxiosResponse<Order[]> = await api.get('/api/customer/order', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
