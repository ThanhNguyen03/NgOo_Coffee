import { useState } from "react";

export default function DeleteButton({label, onDelete}) {
    const [showConfirm, setShowConfirm] = useState(false);

    if(showConfirm) {
        return (
            <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center overflow-hidden z-10">
                <div className="bg-white p-6 rounded-lg">
                    <div>Are you sure to delete it?</div>
                    <div className="flex gap-2 mt-1">
                        <button type="button" onClick={() => setShowConfirm(false)}>
                            Cancle
                        </button>
                        <button type="button" onClick={onDelete} className="bg-red-600">
                            <span className="text-white">Yes,&nbsp;delete!</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <button type="button" className="bg-white" onClick={() => setShowConfirm(true)}>
            {label}
        </button>
    );
}