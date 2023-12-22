
const OrderHeader = () => {

    return (
        <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition text-center text-sm font-semibold">
            <div className="flex-1 ml-4">STT</div>
            <div className="flex-1 ml-4 hidden">id</div>
            <div className="flex-1 ml-4">username</div>
            <div className="flex-1 ml-4">address</div>
            <div className="flex-1 ml-4">phone</div>
            <div className="flex-1 ml-4 hidden">deliveryId</div>
            <div className="flex-1 ml-4">status</div>
            <div className="flex-1 ml-4">is paid before</div>
            <div className="flex-1 ml-4"></div>
        </div>
    );
}

export default OrderHeader;
