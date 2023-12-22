import axios from "axios";

interface RequestParam {
    search?: string;
    sort?: string;
    currentPage?: number;
    pageSize?: number;
}

interface ParamProps {
    productId: string;
    requestParam: RequestParam;
}

const findAllByProductId = async (params: ParamProps): Promise<CategoryProduct[]> => {
    try {
        const response = await axios.get("http://localhost:8081/api/guest/category/product/" + params.productId, {
            params: params.requestParam
        });
        return response.data;

    } catch (error) {
        console.error("Can not get data API route");
        throw error;
    }
};

export default findAllByProductId;
