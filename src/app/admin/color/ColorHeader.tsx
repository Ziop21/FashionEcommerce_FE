const ColorHeader = () => {

    return (
        <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition text-center text-sm font-semibold">
            <div className="flex-1 ml-4">STT</div>
            <div className="flex-1 ml-4 hidden">id</div>
            <div className="flex-1 ml-4">name</div>
            <div className="flex-1 ml-4">code</div>
            <div className="flex-1 ml-4">color display</div>
            <div className="flex-1 ml-4">created at</div>
            <div className="flex-1 ml-4">updated at</div>
            <div className="flex-1 ml-4 hidden">created by</div>
            <div className="flex-1 ml-4 hidden">updated by</div>
            <div className="flex-1 ml-4">is deleted</div>
            <div className="flex-1 ml-4">is active</div>
            <div className="flex-1 ml-4"></div>
        </div>
    );
}

export default ColorHeader;
