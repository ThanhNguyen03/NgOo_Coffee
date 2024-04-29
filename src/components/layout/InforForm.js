export default function InfoForm({infoProps, setInfoProps, editing}) {
    const {phone, streetAddress, postalCode, city,} = infoProps;

    return (
        <>
            <label>Street Address</label>
            <input type="text" disabled={!editing} placeholder="Street Address" value={streetAddress || ''} onChange={e=>setInfoProps('streetAddress', e.target.value)}/>
            <div className="number-input gap-2">
                <div>
                    <label>Postal Code</label>
                    <input type="text" disabled={!editing} placeholder="Postal Code" value={postalCode || ''} onChange={e=>setInfoProps('postalCode', e.target.value)}/>
                </div>
                <div>
                    <label>Phone Number</label>
                    <input type="tel" disabled={!editing} placeholder="Phone Number" value={phone || ''} onChange={e=>setInfoProps('phone', e.target.value)}/>
                </div>
            </div>
            <label>City</label>
            <input type="text" disabled={!editing} placeholder="City" value={city || ''} onChange={e=>setInfoProps('city', e.target.value)}/>
        </>
    );
}