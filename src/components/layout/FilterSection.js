"use client";
import SearchIcon from "@/components/icons/SearchIcon";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function checkValidQuery(queries) {
    return queries.filter((query)=>query !== "").length > 0;
}

export function convertStringtoQueriesObject(searchParams) {
    let selectedQueries = {};
    searchParams.forEach((values, key) => {
        const queries = values.split(",");
        if (selectedQueries[key]) {
            selectedQueries[key].push(...queries);
        } else {
            selectedQueries[key] = queries;
        }
    });
    return selectedQueries;
}

function convertValidStringQueries(queries) {
    let queryString = "";
    for (let [key, value] of Object.entries(queries)) {
        queryString += `${queryString === "" ? "" : "&"}${key}=${value}`;
    }
    return queryString;
}

function CheckboxAndRadioGroup({ children }) {
    return (
        <div className="mt-5">
            <ul>{children}</ul>
        </div>
    );
}

function CheckboxAndRadioItem({ id, label, ...props }) {
    return (
        <li className="mb-2 flex gap-2 items-center">
            <input className="w-5 h-5 appearance-none rounded-full border-2 border-brown inline-block checked:bg-brown checked:border-white checked:outline outline-brown cursor-pointer" {...props} id={id}/>
            <label htmlFor={id} className="flex text-lg text-brown cursor-pointer select-none">
                {label}
            </label>
        </li>
    );
}

export default function FilterSection() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedFilterQueries, setSelectedFilterQueries] = useState({});
    const [categoryNames, setCategoryNames] = useState([]);

    useEffect(() => {
        const paramObj = convertStringtoQueriesObject(searchParams);
        setSelectedFilterQueries(paramObj);
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                if (categories.length > 0) {
                    const categoryNames = categories.map(category => category.name);
                    setCategoryNames(categoryNames);
                }
            })
        });
    }, [searchParams]);

    const filterOptions = [
        {
            id: "categories",
            title: "filter categories",
            options: categoryNames,
            type: "checkbox"
        },
    ];

    function handleSelectFilterOptions(e) {
        const name = e.target.name;
        const value = e.target.value;
        const type = e.target.type;
        let updatedQueries = { ...selectedFilterQueries };

        if (updatedQueries[name]) {
            if (type === 'radio') {
                updatedQueries[name] = [value];
            } else if (updatedQueries[name].includes(value)) {
                updatedQueries[name] = updatedQueries[name].filter((query) => 
                    query !== value
                );
                if (!checkValidQuery(updatedQueries[name])) {
                    delete updatedQueries[name];
                }
            } else {
                updatedQueries[name].push(value);
            }
        } else if (updatedQueries) {
            updatedQueries[name] = [value];
        }

        router.push(`menu/?${convertValidStringQueries(updatedQueries)}`, {
            scroll: false,
        });
    }

    function isChecked(id, option) {
        return (
            Boolean(selectedFilterQueries[id]) && selectedFilterQueries[id].includes(option)
        );
    }

    return (
        <form className="flex justify-center">
            <fieldset className="mb-5 mx-auto w-full">
                <legend className="font-bold text-3xl italic mb-5 text-third uppercase text-center">Filter</legend>
                <div className="custom-min:w-full custom-max:mx-auto w-[70%] flex items-center gap-4 rounded-full border p-2 justify-center border-brown hover:border-2 hover:font-semibold group">
                    <input type="text" className="outline-none placeholder-transparent grow pl-4 text-brown"/>
                    <SearchIcon className="w-6 h-6 text-brown"/>
                </div>
                {filterOptions.map(({id, title, type, options}) => {
                    return (
                        options.map((value, index) => {
                            return (
                                <CheckboxAndRadioGroup key={index}>
                                    <CheckboxAndRadioItem type={type} name={id} id={value} label={value}
                                    value={value} checked={isChecked(id,value)} onChange={handleSelectFilterOptions}>
                                    </CheckboxAndRadioItem>
                                </CheckboxAndRadioGroup>
                            );
                        })
                    );
                })}
            </fieldset>
        </form>
    );
}