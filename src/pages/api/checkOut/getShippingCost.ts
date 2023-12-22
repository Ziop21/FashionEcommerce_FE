import api from "@/pages/api/api";

interface GetShippingCostProps {
    des?: string,
    num: number
}

const getShippingCost = async (getShippingCostProps : GetShippingCostProps)  => {
  try {
    const origin = "01, Vo Van Ngan, Linh Chieu, Thu Duc, Ho Chi Minh"
    const apiKey = "eLd6OE7tZ1PIPdithNTgUGZQaJcKJSTe53hNscsk"
    const encodedAddress = encodeURIComponent(getShippingCostProps.des ?? '');
    const encodedDestination = encodeURIComponent(origin);
    const responseDestination= await api.get(`https://rsapi.goong.io/geocode?address=${encodedDestination}&api_key=${apiKey}`);
    const responseAddress = await api.get(`https://rsapi.goong.io/geocode?address=${encodedAddress}&api_key=${apiKey}`);
    const resLat = responseAddress.data.results[0].geometry.location.lat;
    const resLng = responseAddress.data.results[0].geometry.location.lng;
    const orgLat = responseDestination.data.results[0].geometry.location.lat;
    const orgLng = responseDestination.data.results[0].geometry.location.lng;
    const response = await api.get(`https://rsapi.goong.io/DistanceMatrix?origins=${resLat},${resLng}&destinations=${orgLat},${orgLng}&vehicle=car&api_key=${apiKey}`);
    let shipCost = [0,0,0];

    if (response.data.rows[0].elements[0].distance.value < 1500000 ) {
      if (response.data.rows[0].elements[0].distance.value < 200000) {  
          if (response.data.rows[0].elements[0].distance.value < 5000){
              if (response.data.rows[0].elements[0].distance.value < 2000)
              shipCost = [0,0,0]
          }
          else shipCost = [38000,22000+2500*getShippingCostProps.num,16500+2500*getShippingCostProps.num]
      }  
      else shipCost = [127000,30000+3000*getShippingCostProps.num,30000+3000*getShippingCostProps.num];
    }
    else shipCost = [190000,49000+2500*getShippingCostProps.num,32000+2500*getShippingCostProps.num]
    
        
    return shipCost;
  } catch (error) {
    console.error("Không thể lấy dữ liệu từ API route");
    throw error;  
  }
};

export default getShippingCost;