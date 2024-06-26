export default function InfoBox({title, children = 'w-8 h-8'}) {
    return (
        <div className="flex justify-center items-center mx-auto gap-4">
            <div className={`${children} items-center flex w-fit`}>{title}</div>
            <svg fill="none" stroke="currentColor" strokeLinecap="round"strokeLinejoin="round"strokeWidth={1} viewBox="0 0 24 24" className={`${children} loading text-brown`}>
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M3 14c.83.642 2.077 1.017 3.5 1 1.423.017 2.67-.358 3.5-1 .83-.642 2.077-1.017 3.5-1 1.423-.017 2.67.358 3.5 1M8 3a2.4 2.4 0 00-1 2 2.4 2.4 0 001 2M12 3a2.4 2.4 0 00-1 2 2.4 2.4 0 001 2" />
                <path d="M3 10h14v5a6 6 0 01-6 6H9a6 6 0 01-6-6v-5zM16.746 16.726a3 3 0 10.252-5.555" />
            </svg>
        </div>
    );
}