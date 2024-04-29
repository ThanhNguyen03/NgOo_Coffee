import { useEffect, useState } from "react";
import EditableImage from "@/components/layout/EditableImage";
import InfoBox from "@/components/layout/InfoBox";
import DeleteButton from "@/components/layout/DeleteButton";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";
import toast from 'react-hot-toast';
import { redirect } from "next/navigation";

export default function MenuItemForm({onSubmit, menuItem, isCreate}) {
    const [editing, setEditing] = useState(false);
    const [redirectToItems, setRedirectToItems] = useState(false);

    const [image, setImage] = useState(menuItem?.image || '');
    const [itemName, setItemName] = useState(menuItem?.itemName || '');
    const [description, setDescription] = useState(menuItem?.description || '');
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
    const [sizes, setSizes] = useState(menuItem?.sizes || []);
    const [extraIngredientPrices, setExtraIngredientPrices] = useState(menuItem?.extraIngredientPrices || []);
    const [isOnSale, setIsOnSale] = useState(menuItem?.onSale || false);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(menuItem?.category || '');

    useEffect(() => {
        fetch('/api/categories').then(response => {
            response.json().then(categories => {
                setCategories(categories);
            })
        })
    },[]);

    async function handleDeleteItem(_id) {
        const deletePromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/menu-items?_id=' + _id, {
                method: 'DELETE'
            });
            if (response.ok) resolve();
            else rejects();
        });
        await toast.promise(deletePromise, {
            loading: <InfoBox title={'Deleting item...'}/>,
            success: 'Successfully Deleted',
            error: 'Oops! Something went wrong :(',
        });

        setRedirectToItems(true);
    }

    if (redirectToItems) {
        return redirect('/menu-items');
    }

    return (
        <form className="max-w-2xl mx-auto custom-min:flex gap-4 custom-max:px-8" onSubmit={e => onSubmit(e, {image, itemName, description, basePrice, sizes, extraIngredientPrices, category, onSale:isOnSale})}>
            <div className="relative items-start max-w-[150px] mt-2 custom-max:mx-auto">
                <EditableImage link={image} setLink={setImage}>{editing}</EditableImage>
            </div>
            <div className="grow">
                <label>Item Name</label>
                <input type="text" disabled={!editing} value={itemName} onChange={e => setItemName(e.target.value)}/>
                <label>Description</label>
                <input type="text" disabled={!editing} value={description} onChange={e => setDescription(e.target.value)}/>
                <label>Category</label>
                <select disabled={!editing} value={category} onChange={e => setCategory(e.target.value)}>
                    {categories?.length > 0 && categories.map((item, index) => (
                        <option key={index} value={item._id}>{item.name}</option>
                    ))}
                </select>
                <label>Base Price</label>
                <input type="text" disabled={!editing} value={basePrice} onChange={e => setBasePrice(e.target.value)}/>
                <MenuItemPriceProps name={'Sizes'} props={sizes} setProps={setSizes} addLabel={'Add Item Sizes'} editing={editing}/>
                <MenuItemPriceProps name={'Extra Ingredients'} props={extraIngredientPrices} setProps={setExtraIngredientPrices} addLabel={'Add Ingredient Prices'} editing={editing}/>
                {editing && (
                    <>
                        <label className="p-2 inline-flex items-center gap-2 cursor-pointer select-none" htmlFor="onSale">
                            <input id="onSale" type="checkbox" value={'1'} checked={isOnSale} onClick={e => setIsOnSale(e.target.checked)}/>
                            <span>On Sale</span>
                        </label>
                        <button type="submit" className="bg-third text-white">Save</button>
                        <div className={`max-w-2xl mx-auto mt-4 ${isCreate ? 'hidden' : ''}`}>
                            <DeleteButton label="Delete this Item" onDelete={() => handleDeleteItem(menuItem._id)}/>
                        </div>
                    </>
                )}
                {!editing && (
                    <button type="button" onClick={() => setEditing(true)} className="bg-third">
                        <p className="text-white">Edit Item</p>
                    </button>
                )}
            </div>
        </form>
    );
}