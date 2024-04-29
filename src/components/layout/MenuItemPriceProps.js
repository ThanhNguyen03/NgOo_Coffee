import TrashIcon from "@/components/icons/Trash";
import PlusIcon from "@/components/icons/Plus";
import ShevronDown from "@/components/icons/ShevronDown";
import ShevronUp from "@/components/icons/ShevronUp";
import { useState } from "react";

export default function MenuItemPriceProps({name, addLabel, props, setProps, editing}) {
    const [isOpen, setIsOpen] = useState(false);

    function handleOpen(e) {
        e.preventDefault();
        setIsOpen(!isOpen);
    };
    
    function addItemProp() {
        setProps(oldProps => {
            return [...oldProps, {name: '', price: 0}];
        })
        setIsOpen(true);
    };

    function editItemProp(e, index, prop) {
        const newValue = e.target.value;
        setProps(prevProps => {
            const newSizes = [...prevProps];
            newSizes[index][prop] = newValue;

            return newSizes;
        })
    };

    function removeItemProp(removeItemIndex) {
        setProps(prevProps => prevProps.filter((value, index) => index !== removeItemIndex));
    };
    
    return (
        <>
            <div className={`bg-gray-200 p-2 rounded-md mb-2 ${isOpen ? 'overflow-hidden relative' : ' overflow-hidden relative'}`}>
                <div onClick={handleOpen} className="flex gap-2 cursor-pointer">
                    {isOpen ? (<ShevronUp/>) : (<ShevronDown/>)}
                    <span className="text-center text-gray-700 font-semibold ">{name} ({props?.length})</span>
                </div>
                <div className={isOpen ? 'translate-y-0 duration-1000 opacity-100' : '-translate-y-full duration-1000 absolute -z-10 opacity-0'}>
                    {props?.length > 0 && props.map((size, index) => (
                        <div key={index} className="flex gap-2 items-end">
                            <div>
                                <label>Name</label>
                                <input disabled={!editing} type="text" placeholder="Size Name" value={size.name} onChange={e => editItemProp(e, index, 'name')}/>
                            </div>
                            <div>
                                <label>Extra Price</label>
                                <input disabled={!editing} type="text" placeholder="Extra Price" value={size.price} onChange={e => editItemProp(e, index, 'price')}/>
                            </div>
                            {editing && (
                                <div>
                                    <button type="button" onClick={() => removeItemProp(index)} className={`bg-white mb-2 px-2`}>
                                        <TrashIcon>w-6 h-6 text-red-500</TrashIcon>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {editing && (
                <button type="button" onClick={addItemProp} className={`bg-white mb-2 items-center`}>
                    <PlusIcon/>
                    <span>{addLabel}</span>
                </button>
            )}
            
        </>
    );
}