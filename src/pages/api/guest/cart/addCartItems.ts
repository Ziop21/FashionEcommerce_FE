import api from "@/pages/api/api";

export interface cartItem {
  stockId: string;
  quantity: number;
}
export interface AddCartItemsProps {
    cartItems: cartItem[]
}

const AddCartItems = async (AddCartItemsProps: AddCartItemsProps) => {
  try {
    // console.log("AddCartItemsProps.cartItems", AddCartItemsProps.cartItems);
    await api.post(`/api/guest/cart/addCartItems`,
      AddCartItemsProps.cartItems
    );
    // console.log("AddCartItemsProps.cartItems", AddCartItemsProps.cartItems);
  } catch (error) {
    throw error;
  }
};

export default AddCartItems;
