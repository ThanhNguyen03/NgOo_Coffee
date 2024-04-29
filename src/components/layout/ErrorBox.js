export default function ErrorBox({title, children = 'w-8 h-8'}) {
    return (
        <div className="flex justify-center items-center gap-8">
            <div className={`${children} text-xl font-extrabold text-red-500 items-center flex`}>{title}</div>
            <svg fill="none" stroke="#f00" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} viewBox="0 0 24 24" className={`${children}`}>
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M3 14c.83.642 2.077 1.017 3.5 1 1.423.017 2.67-.358 3.5-1 .73-.565 1.783-.923 2.994-.99M8 3c-.194.14-.364.305-.506.49M12 3a2.4 2.4 0 00-1 2 2.4 2.4 0 001 2" />
                <path d="M14 10h3v3m-.257 3.743A6.003 6.003 0 0111 21H9a6 6 0 01-6-6v-5h7M20.116 16.124a3 3 0 00-3.118-4.953M3 3l18 18" />
            </svg>
        </div>
    );
}