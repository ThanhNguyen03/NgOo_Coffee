"use client"
import EditableImage from "@/components/layout/EditableImage";
import DeleteButton from "@/components/layout/DeleteButton";
import { useState } from "react";
import { useProfile } from "../useProfile";
import InfoForm from "./InforForm";

export default function UserForm({user, onSave, onDelete}) {
    const [userName, setUserName] = useState(user?.name || '');
    const [image, setImage] = useState(user?.image || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
    const [postalCode, setPostalCode] = useState(user?.postalCode || '');
    const [city, setCity] = useState(user?.city || '');
    const [admin, setAdmin] = useState(user?.admin || false);
    
    const [editing, setEditing] = useState(false);
    const {data:loggedInUserData} = useProfile();

    function handleEditing(e) {
        e.preventDefault();
        setEditing(true);
    }

    function handleInfoChange(propName, value) {
        if (propName === 'city') setCity(value);
        if (propName === 'postalCode') setPostalCode(value);
        if (propName === 'phone') setPhone(value);
        if (propName === 'streetAddress') setStreetAddress(value);
    }

    return (
        <div className="custom-min:flex gap-4">
            <div className="relative items-start max-w-[150px] mt-2 custom-max:mx-auto">
                <EditableImage link={image} setLink={setImage}>{editing}</EditableImage>
            </div>
            <form className="grow" 
                onSubmit={(e) => {
                    onSave(e, {name:userName, image, phone, streetAddress, postalCode, city, admin});
                    setEditing(false);
                }}>
                <label>Your Name</label>
                <input type="text" disabled={!editing} value={userName} placeholder="Your Name" onChange={e => setUserName(e.target.value)}/>
                <label>Your Email</label>
                <input type="email" disabled={true} value={user.email} placeholder={'email'}/>
                <InfoForm infoProps={{phone, streetAddress, postalCode, city,}} setInfoProps={handleInfoChange} editing={editing}/>
                {editing && loggedInUserData.admin && (
                    <label className="p-2 inline-flex items-center gap-2 cursor-pointer select-none" htmlFor="adminCb">
                        <input id="adminCb" type="checkbox" value={'1'} checked={admin} onChange={e => setAdmin(e.target.checked)}/>
                        <span>Admin</span>
                    </label>
                )}
                {editing && (
                    <>
                        <button type="submit" className="bg-third text-white">Save</button>
                        <div className={`max-w-2xl mx-auto mt-4`}>
                            <DeleteButton label="Delete this profile" onDelete={onDelete}/>
                        </div>
                    </>
                )}
                {!editing && (
                    <button type="button" onClick={handleEditing} className="bg-third">
                        <p className="text-white">Edit Profile</p>
                    </button>
                )}
            </form>
        </div>
    );
}