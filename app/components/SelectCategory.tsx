"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Category {
    id: string | number;
    name: string;
}

interface SelectCategoryProps {
    onCategoryChange: (value: string) => void;
}

export default function SelectCategory({ onCategoryChange }: SelectCategoryProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(Array.isArray(data) ? data : data.categories || []);
                }
            } catch (error) {
                console.error("Network error fetching categories:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchCategories();
    }, []);

    return (
        <Select onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Loading..." : "Select Category"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}