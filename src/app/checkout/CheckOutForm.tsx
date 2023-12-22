'use client'

import { useEffect, useState } from "react";
import CheckoutInput from "../components/inputs/CheckoutInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import DropdownCheckout from "../components/inputs/DropdownCheckout";
import { NextUIProvider } from "@nextui-org/system";
import { Button, RadioGroup } from "@nextui-org/react";
import { MdArrowBack } from "react-icons/md";
import ItemContent from "./ItemContent";
import { formatPrice } from "../../utils/formatPrice";
import { CustomList } from "../components/inputs/tranInput";
import getShippingCost from "@/pages/api/checkOut/getShippingCost";
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation";
import CheckOut from "@/pages/api/checkOut/checkOut";
import GetStockId from "@/pages/api/stock/getStock";
import Cookies from "js-cookie";
import { JWT_CART } from "@/config/ApplicationConfig";
import AddCartItems from "@/pages/api/guest/cart/addCartItems";

const Horizontal = () => {
  return <hr className="w-[30%] my-2" />
}

interface CheckOutReq {
  username: string;
  address: string;
  phone: string;
  shippingFee: number;
  deliveryId: string;
  isPaidBefore: boolean
}

const CheckOutForm = () => {
  const router = useRouter();
  const { cartProducts, handleClearCart, cartTotalAmount } = useCart()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [code, setCode] = useState({
    city: 0,
    districts: 0,
    ward: 0
  });
  const [detailAddress, setDetailAddress] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<number | undefined>();;
  const [shippingCostNew, setShippingCostNew] = useState<number | undefined>();;
  const [selectedOption, setSelectedOption] = useState('');
  const [checkoutReq, setCheckoutReq] = useState<CheckOutReq>({
    username: '',
    address: '',
    phone: '',
    shippingFee: 0,
    deliveryId: '',
    isPaidBefore: false,
  });

  useEffect(() => {
    const address = `${detailAddress}, ${ward}, ${district}, ${city}`;
    setAddress(address);
    setCheckoutReq((prevReq) => ({
      ...prevReq,
      address: address,
    }));
    const shippingAddress = `${ward}, ${district}, ${city}`;
    const fetchData = async () => {
      try {
        let totalQuantity = 0;
        for (let i = 0; i < cartProducts?.length; i++) {
          totalQuantity += cartProducts[i].quantity;
        }
        console.log(totalQuantity)
        const result = await getShippingCost({ des: shippingAddress, num: totalQuantity });
        setShippingCost(result);
        setShippingCostNew(result[2]);
      } catch (error) {
        console.error('Error fetching shipping cost data:', error);
      }
    };
    fetchData();
  }, [ward]);


  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    if (shippingCost !== undefined) {
      let cost = shippingCost[1];
      if (value === '655b76299fca802eadab1825') {
        cost = shippingCost[0];
      } else if (value === '657b2186265d31183b317851') {
        cost = shippingCost[2];
      }
      setShippingCostNew(cost);

      setCheckoutReq((prevReq) => ({
        ...prevReq,
        shippingFee: cost || 0,
        deliveryId: value
      }));
    } else {
      console.error('Shipping cost is undefined.');
    }
  };

  const handleOptionPayChange = (value: string) => {
    setSelectedOption(value);
    if (value === '655b76299fca802eadab1825') {
      setCheckoutReq((prevReq) => ({
        ...prevReq,
        isPaidBefore: false
      }));
    }
    else
      setCheckoutReq((prevReq) => ({
        ...prevReq,
        isPaidBefore: false
      }))
  };
  const { register, handleSubmit, formState: { errors } } =
    useForm<FieldValues>({
      defaultValues: {
      }
    })

  const handleCityChange = (selectedKey: number, name: string) => {
    setCode((prevCode) => ({
      ...prevCode,
      city: selectedKey,
    }));
    setCity(name);
  };

  const handleDistrictChange = (selectedKey: number, name: string) => {
    setCode((prevCode) => ({
      ...prevCode,
      districts: selectedKey,
    }));
    setDistrict(name);
  };

  const handleWardChange = (selectedKey: number, name: string) => {
    setCode((prevCode) => ({
      ...prevCode,
      ward: selectedKey,
    }));
    setWard(name);
  };
  const handlePhoneChange = (value: string) => {
    setCheckoutReq((prevReq) => ({
      ...prevReq,
      phone: value
    }))
  };
  const handleDetailAddressChange = (value: string) => {
    setDetailAddress(value);
  };
  const handleUsernameChange = (value: string) => {
    setCheckoutReq((prevReq) => ({
      ...prevReq,
      username: value
    }))
  };

  const onCheckOut: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const cartItems = await Promise.all(
        cartProducts.map(async (item) => {
          console.log(item)
          const response2 = await GetStockId(item.productId, item.selectedColor.id, item.selectedSize.id);
          console.log(response2)
          return { stockId: response2.data.id, quantity: item.quantity };
        })
      )

      // console.log('cartItems', cartItems);
      await AddCartItems({ cartItems: cartItems })
      const response = await CheckOut(checkoutReq);

      if (response.status === 200) {
        const result = response.data;
        console.log(result);
        if (result === 'Success') {
          toast.success('Order completed !!!');
          console.log('Order placed successfully');
          Cookies.remove(JWT_CART);
          handleClearCart();
          router.push('/');
        } else {
          toast.error('Error placing 1');
          console.error('Error placing order:', result.message);
        }
      } else {
        toast.error('Error placing 2');
        console.error('Error placing order:', response.statusText);
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <NextUIProvider>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 h-auto">
          <div className="bg-gray-300 p-2 ">
            <div className="flex text-bold font-semibold text-xl text-slate-700 h-14 text-left items-center justify-left p-2">Thông tin cá nhân</div>
            <CheckoutInput
              id="username"
              label="name"
              disabled={isLoading}
              onChange={handleUsernameChange}
              register={register}
              errors={errors}
              required
            />
            <CheckoutInput
              id="phone"
              label="Phone Number"
              disabled={isLoading}
              register={register}
              onChange={handlePhoneChange}
              errors={errors}
              required
            />
            <CheckoutInput
              id="detailAddress"
              label="detail address"
              disabled={isLoading}
              register={register}
              errors={errors}
              onChange={handleDetailAddressChange}
              required
            />
            <DropdownCheckout placeholder="Province"
              type="province"
              code={code}
              onChange={handleCityChange}
            />
            <DropdownCheckout placeholder="District" type="district" code={code}
              onChange={handleDistrictChange}
            />
            <DropdownCheckout placeholder="Ward" type="ward" code={code}
              onChange={handleWardChange}
            />
            {/* <div className="w-[90%] m-2">
                            <TextArea
                              id="description"
                              label="Description"
                              disabled={isLoading}
                              register={register}
                              errors={errors}
                              required
                            /></div>
    */}
          </div>
          <div className=" p-2 ">
            <div className="flex text-bold font-semibold text-xl text-slate-700 h-12 text-left items-center justify-left p-2">Vận chuyển</div>
            <Horizontal />
            {(code.city != 0 && code.districts != 0 && code.ward != 0) && (
              <div className="">
                <RadioGroup onChange={(e) => handleOptionChange(e.target.value)} defaultValue="657b2186265d31183b317851"> 
                  <CustomList description="In 1-2 days" value="657b216c265d31183b317850">
                    Fast delivery
                  </CustomList>
                  <CustomList description="In 2-4 days" value="657b2186265d31183b317851">
                    Nomal delivery
                  </CustomList>
                  <CustomList description="In day" value="655b76299fca802eadab1825">
                    Expedited Shipping
                  </CustomList>
                </RadioGroup>
              </div>
            )}
            <div className="flex text-bold font-semibold text-xl text-slate-700 h-12 text-left items-center justify-left p-2">Thanh toán</div>
            <Horizontal />
            <RadioGroup onChange={(e) => handleOptionPayChange(e.target.value)} defaultValue="655b76299fca802eadab1825">
              {/* <CustomList
                            description=""
                            value="3"
                          >
                          E-payment with MoMo
                          </CustomList>
                          <CustomList description="" value="1">
                          E-payment with VNPay
                          </CustomList> */}
              <CustomList description="" value="655b76299fca802eadab1825">
                Cash on delivery - COD
              </CustomList>
            </RadioGroup>
          </div>
          <div className=" text-sm border-2 border-slate-400 p-2">
            <div className="flex text-bold font-semibold text-xl h-12 text-left items-center justify-left p-2">
              Cart ( {cartProducts?.length} products )
            </div>
            <Horizontal />
            <div className="">
              <div>
                {cartProducts && cartProducts.map((item) => {
                  return <ItemContent key={item.productId} item={item} />;
                })}
              </div>
            </div>
            <Horizontal />
            {/* <div className="flex gap-2">
                        <DiscountCodeInput />
                    </div> */}
            {/* <Horizontal/> */}
            <div className="flex ml-2 p-1">
              <div className="flex-grow">Subtotal :</div>
              <div className="ml-auto mr-5">{formatPrice(cartTotalAmount)}</div>
            </div>
            <div className="flex ml-2 p-1">
              <div className="flex-grow">Shipping fee :</div>
              <div className="ml-auto mr-5">{formatPrice(shippingCostNew)}</div>
            </div>
            <div className="flex ml-2 p-1">
              <div className="flex-grow">Tax ( consumption tax 10% ):</div>
              <div className="ml-auto mr-5">{formatPrice(cartTotalAmount * 10 / 100)}</div>
            </div>
            <Horizontal />
            <div className="flex ml-2 p-1">
              <div className="flex-grow">Total :</div>
              <div className="ml-auto mr-5">{formatPrice(cartTotalAmount * 110 / 100)}</div>
            </div>
            <Horizontal />
            <div className="flex mb-2 mt-auto">
              <Link href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                <MdArrowBack />
                <span>Continue Shopping</span>
              </Link>
              <Button color="primary" size="sm" className="ml-auto mr-5 w-[120px]" onClick={onCheckOut}>
                Order
              </Button>
            </div>
          </div>
        </div>
      </NextUIProvider>
    </>
  );
}

export default CheckOutForm;