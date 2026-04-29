'use client';
import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('../src/views/home'), { ssr: false });
export default HomePage;
