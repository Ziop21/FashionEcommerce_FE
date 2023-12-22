import api from "@/pages/api/api";


interface cartItem {
  stockId: string;
  quantity: number;
}
export interface AddCartItemsProps {
    cartItems: cartItem[]
}

const AddCartItems = async (AddCartItemsProps: AddCartItemsProps) => {
  try {
    console.log("AddCartItemsProps.cartItems", AddCartItemsProps.cartItems);
    await api.post(`http://localhost:8081/api/guest/cart/addCartItems`,
      AddCartItemsProps.cartItems
    );
    console.log("AddCartItemsProps.cartItems", AddCartItemsProps.cartItems);
  } catch (error) {
    throw error;
  }
};

export default AddCartItems;
