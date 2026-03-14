'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function LayoutHeader() {
    const pathname = usePathname();
    
    // 관리자 페이지와 로그인/회원가입 페이지는 각각의 헤더가 있거나 필요 없을 수 있음
    // 하지만 사용자가 "모든 페이지에 똑같은 헤더"를 원하므로 일단 관리자 페이지만 제외해봅니다.
    // 만약 로그인/회원가입에서도 이 헤더가 보이길 원한다면 그대로 두고, 
    // 아니라면 아래 조건에 추가합니다.
    const isAdminPage = pathname.startsWith('/admin');
    
    if (isAdminPage) {
        return null;
    }

    return <Header />;
}
