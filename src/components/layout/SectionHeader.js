export default function SectionHeaders({subHeader, mainHeader}) {
    return (
        <>
            <h3 className="uppercase text-gray-600 font-semibold leading-4">
                {subHeader}
            </h3>
            <h2 className="text-orange-600 text-4xl font-bold italic">
                {mainHeader}
            </h2>
        </>
    );
}