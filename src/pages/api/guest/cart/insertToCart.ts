import api from "@/pages/api/api";

export interface InsertToCartProps {
    stockId: string;
    quantity: number;
}

const InsertToCart = async (insertToCartProps: InsertToCartProps) => {
  try {
    await api.post(`/api/guest/cart/add/${insertToCartProps.stockId}`, {
        quantity: insertToCartProps.quantity,
    });

  } catch (error) {
    throw error;
  }
};

export default InsertToCart;
