export interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    promotionalPrice: number;
    images: string[];
    rating: number;
    colors?: Color[];
    sizes?: Size[];
    reviews?: Review[];
}

export interface ProductId {
    id: string;
}

interface Color {
    id: string;
    name: string;
    code: string;
}

interface Size {
    id: string;
    name: string;
}

interface Review {
    sizeName: string;
    colorName: string;
    username: string;
    content: string;
    rating: number;
    images: string[];
}
