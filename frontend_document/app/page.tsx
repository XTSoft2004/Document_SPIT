'use client'
import Image from 'next/image'
import DocumentPage from './document/[[...slug]]/page'
import PageAuth from './(auth)/page';

export default function Home() {
  return <PageAuth></PageAuth>;
}
