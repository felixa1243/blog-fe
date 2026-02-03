'use client'
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Page() {
    const [categoryName, setCategoryName] = useState('')
    const createCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/categories`, {
            'method': 'POST',
            'credentials': 'include',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'name': categoryName
            })
        })
    }
    return (
        <form className="py-16 px-16 flex flex-col gap-7" onSubmit={createCategory}>
            <h1 className="text-4xl font-bold">Create category</h1>
            <Field>
                <FieldLabel>Category Name</FieldLabel>
                <Input type="text" onChange={(e) => setCategoryName(e.target.value)} value={categoryName} />
            </Field>
            <button type="submit" className="bg-blue-700 text-white px-7 py-3">submit</button>
        </form>
    )
}