import { useState, useEffect } from 'react';

export interface CategoryResponseDto {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
    menuCount: number;
}

export interface CategoryListResponseDto {
    categories: CategoryResponseDto[];
    totalCount: number;
}

<<<<<<< HEAD
// ${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories


=======
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
export function useCategories() {
    const [categories, setCategories] = useState<CategoryResponseDto[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
<<<<<<< HEAD
                const response = await fetch(`/api/admin/categories`);
=======
                const response = await fetch('/api/admin/categories');
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return { categories };
}
