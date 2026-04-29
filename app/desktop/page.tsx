'use client';
import dynamic from 'next/dynamic';

const DesktopPage = dynamic(() => import('../../src/views/desktop'), { ssr: false });
export default DesktopPage;
