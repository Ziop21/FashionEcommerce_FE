
const UserHeader = () => {

    return (
        <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition text-center text-sm font-semibold">
            <div className="flex-1 ml-4">STT</div>
            <div className="flex-1 ml-4 hidden">id</div>
            <div className="flex-1 ml-4">role</div>
            <div className="flex-1 ml-4">firstName</div>
            <div className="flex-1 ml-4">lastName</div>
            <div className="flex-1 ml-4">isEmailActive</div>
            <div className="flex-1 ml-4">isPhoneActive</div>
            <div className="flex-1 ml-4">point</div>
            <div className="flex-1 ml-4">userLevel</div>
            <div className="flex-1 ml-4">created at</div>
            <div className="flex-1 ml-4">updated at</div>
            <div className="flex-1 ml-4">updated by</div>
            <div className="flex-1 ml-4">is deleted</div>
            <div className="flex-1 ml-4">is active</div>
            <div className="flex-1 ml-4"></div>
        </div>
    );
}

export default UserHeader;
