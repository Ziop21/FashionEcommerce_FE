"use client"
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { FaStar } from "react-icons/fa";
import { Image, Link } from "@nextui-org/react";
import { Color } from "@/pages/api/guest/color/Models";
import { Product } from "@/pages/api/guest/products/Models";
import { Size } from "@/pages/api/guest/size/Models";
import { Review, Stock } from "@/pages/api/guest/stock/Models";
import findStockById from "@/pages/api/guest/stock/findById";
import findColorById from "@/pages/api/guest/color/findById";
import findProductById from "@/pages/api/guest/products/findById";
import findSizeById from "@/pages/api/guest/size/findById";
import { Slider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Input from "@/app/components/inputs/Input";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { storage } from "@/config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import TextArea from "@/app/components/inputs/TextArea";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import Button from "@/app/components/Button";
import addReview from "@/pages/api/customer/stock/addReview";
import { useRouter } from "next/navigation";

interface RatingFormProps {
    stockId: string;
    orderId: string;
    afterSubmit: (isOpen: boolean) => void;
}

interface FormData {
    orderId: string,
    rating: number,
    content: string | null,
    images: File[],
}

const schema: ZodType<FormData> = z.object({
    orderId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    content: z.string().nullable(),
    images: z.array(z.any()),
});

const RatingForm: React.FC<RatingFormProps> = ({
    stockId,
    orderId,
    afterSubmit
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [foundStock, setFoundStock] = useState<Stock>()
    const [foundProduct, setFoundProduct] = useState<Product>()
    const [foundSize, setFoundSize] = useState<Size>()
    const [foundColor, setFoundColor] = useState<Color>()

    const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
        useForm<FieldValues>({
            resolver: zodResolver(schema),
            defaultValues: {
                orderId: null,
                rating: 5,
                content: null,
                images: null,
            }
        })

    const { fields: imageFields, append: imageAppend, remove: imageRemove } = useFieldArray({
        control,
        name: 'images',
    });

    const router = useRouter();

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        toast.loading("please wait...", { duration: 2000 });
        setIsLoading(true);
        let files: File[] = data.images;
        let fileNames: string[] = [];
        let uploadFiles: File[] = [];
        if (files) {
            fileNames = files.map((file) => {
                let fileName: any = file;
                if (file.name) {
                    const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
                    const fileExtension = file.name.split('.').pop();
                    fileName = `${fileNameWithoutExtension}_${v4().replace(/-/g, '_')}.${fileExtension}`;
                    const updatedNameFile: File = new File([file.slice()], fileName, { type: file.type });
                    uploadFiles.push(updatedNameFile);
                }
                return fileName;
            })
        }
        try {
            const review: Review = {
                orderId: data.orderId,
                rating: data.rating,
                content: data.content,
                images: fileNames,
            };
            // console.log("data: ", data)
            // console.log("review: ", review)
            await addReview(stockId, review);
            if (uploadFiles) {
                await Promise.all(uploadFiles.map(async (file) => {
                    const imageRef = ref(storage, `images/review/${file.name}`);
                    await uploadBytes(imageRef, file);
                }));
            }
            toast.success('Successfully, thank you for rating...');
        } catch (error) {
            toast.error("Something wrong !!!");
            console.error("Error when call API", error);
        } finally {
            setIsLoading(false);
            afterSubmit(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setValue('orderId', orderId);
            const foundStock: Stock = await findStockById(stockId);
            setFoundStock(foundStock);
            const foundProduct: Product = await findProductById(foundStock.productId);
            setFoundProduct(foundProduct);
            const foundSize: Size = await findSizeById(foundStock.sizeId);
            setFoundSize(foundSize);
            const foundColor: Color = await findColorById(foundStock.colorId);
            setFoundColor(foundColor);
        }
        fetchData();


    }, [stockId])


    const [imageUrl, setImageUrl] = useState<string | undefined>();
    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await getDownloadURL(ref(storage, `images/product/${foundProduct?.images[0]}`));
                setImageUrl(url);
            } catch (error) {
                console.error('Error fetching image URL:', error);
            }
        };
        fetchImageUrl();
    }, [foundProduct?.images]);

    return (
        <div className="w-[640px] p-2 ">
            <div className="text-xl">
                <div className="flex flex-row">
                    <div className="w-2/3">
                        <Link href={`/product/${foundProduct?.id}`} rel="noopener noreferrer" target="_blank">
                            <div className="cursor-pointer text-xl text-blue-500">{`Product: ${foundProduct?.name}`}</div>
                        </Link>
                        <div>{`Size: ${foundSize?.name}`}</div>
                        <div>{`Color: ${foundColor?.name}`}</div>
                    </div>
                    <Link href={imageUrl} rel="noopener noreferrer" target="_blank">
                        <Image
                            width={150}
                            isZoomed
                            alt={foundProduct?.name}
                            src={imageUrl}
                            className="cursor-pointer"
                        />
                    </Link>

                </div>
            </div>
            <div className="flex flex-col mt-4 space-y-8">
                <Slider
                    label="Point: "
                    step={1}
                    size="md"
                    color="warning"
                    showSteps={true}
                    minValue={1}
                    maxValue={5}
                    defaultValue={5}
                    onChange={(value) => setValue('rating', value)}
                    renderThumb={(props) => (
                        <div
                            {...props}
                            className="group p-1 top-1/2 bg-background bg-slate-600  dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                        >
                            <FaStar
                                color="yellow"
                                className="transition-transform shadow-small from-secondary-100 to-secondary-500 w-5 h-5 block group-data-[dragging=true]:scale-80"
                            />
                        </div>
                    )}
                />
                <div className="mt-2">
                    <TextArea
                        id="content"
                        label="write some words"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className="w-full flex">
                    <ImagesContainer
                        id='images'
                        label="images (maximum 3 photo)"
                        maximumImages={3}
                        itemLabel="image"
                        storagePath="images/review/"
                        disabled={false}
                        custom="w-full"
                        register={register}
                        getValues={getValues}
                        setValue={setValue}
                        errors={errors}
                        fields={imageFields}
                        append={imageAppend}
                        remove={imageRemove}
                    />
                </div>
                <Button
                    outline={true}
                    custom="bg-green-300"
                    label={isLoading ? "Loading" : "Submit"}
                    onClick={handleSubmit(onSubmit)} />
            </div>
        </div>
    );
}

export default RatingForm;
