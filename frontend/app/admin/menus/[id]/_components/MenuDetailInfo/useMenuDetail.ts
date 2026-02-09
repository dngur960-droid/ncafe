import { useState, useEffect } from 'react';

export interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    categoryName: string;
    price: number;
    isAvailable: boolean;
    createdAt: string;
    description: string;
}

export function useMenuDetail(id: number | string) {

    console.log('useMenuDetail id : ' + id);
    const [menu, setMenu] = useState<MenuDetail | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMenu = async () => {
            console.log('fetchMenu id : ' + id, `http://localhost:8080/admin/menus/${id}`);
            try {
                const response = await fetch(`http://localhost:8080/admin/menus/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu detail');
                }
                console.log('response : ' + response);
                const data = await response.json();
                setMenu(data);

                console.log('menu : ' + data);
            } catch (error) {
                console.error("Error loading menu detail:", error);
            }
        };

        fetchMenu();
    }, [id]);

    return { menu };
}
