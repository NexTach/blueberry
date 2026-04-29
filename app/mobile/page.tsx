'use client';
import dynamic from 'next/dynamic';

const MobilePage = dynamic(() => import('../../src/views/mobile'), { ssr: false });
export default MobilePage;
