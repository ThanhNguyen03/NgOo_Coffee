import InfoBox from "@/components/layout/InfoBox";
import Image from "next/image";
import toast from 'react-hot-toast';

export default function EditableImage({link, setLink , children}) {

    async function handleChangeAvt(e) {
        e.preventDefault();
        const files = e.target.files;
        if (files?.length === 1) {
            const data = new FormData;
            data.set('file', files[0]);

            const uploadPromise = fetch('/api/upload', {
                method: 'POST',
                body: data,
            }).then(response => {
                if (response.ok) {
                    return response.json().then(link => {
                        setLink(link);
                    })
                }
                throw new Error('Something went wrong!');
            });
        
            await toast.promise(uploadPromise, {
                loading: <InfoBox title={'Uploading...'}/>,
                success: 'Successfully Uploaded!',
                error: 'Uploaded error!'
            });
        }
    }

    return (
        <>
            {link && (
                <Image src={link} width={250} height={250} alt="avatar" className="rounded-lg w-full mb-1 border"/>
            )}
            {!link && (
                <div className="bg-gray-300 p-4 rounded-lg text-gray-500 mb-1">No Imgae :( </div>
            )}
            {children && (
                <label>
                    <input type="file" className="hidden" onChange={handleChangeAvt}/>
                    <span className={`block border border-brown rounded-lg text-center cursor-pointer bg-secondary py-2`}>Upload</span>
                </label>
            )}
            
        </>
    );
}