'use client';
import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from './ui/sidebar';
import {
	IconArrowLeft,
	IconBrandTabler,
	IconSettings,
	IconUserBolt,
	IconLock,
	IconShieldLock,
	IconX,
	IconFileDescription,
} from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function EditProfile() {
	const links = [
		{
			label: 'Personal Information',
			href: '#',
			icon: (
				<IconUserBolt className='text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
		},
		{
			label: 'Privacy Settings',
			href: '#',
			icon: (
				<IconShieldLock className='text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
		},
		{
			label: 'UserName & Password',
			href: '#',
			icon: (
				<IconLock className='text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
		},
		{
			label: 'Privacy Policy',
			href: '#',
			icon: (
				<IconFileDescription className='text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
		},
		{
			label: 'Logout',
			href: '#',
			icon: (
				<IconArrowLeft className='text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
		},
	];
	const [open, setOpen] = useState(false);
	return (
		<div className='mt-16 fixed inset-0 flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'>
			<Sidebar open={open} setOpen={setOpen} animate={false}>
				<SidebarBody className='justify-between gap-10'>
					<div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
						{/* Add close button for mobile */}
						<div className='mt-16 flex items-center justify-between mb-4'>
							<Logo />
							<button
								onClick={() => setOpen(false)}
								className='md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200'>
								<IconX className='h-6 w-6 text-gray-500 dark:text-gray-400' />
							</button>
						</div>
						<div className='mt-8 flex flex-col gap-2'>
							{links.map((link, idx) => (
								<SidebarLink key={idx} link={link} />
							))}
						</div>
					</div>
					<div>
						<SidebarLink
							link={{
								label: 'Manu Arora',
								href: '#',
								icon: (
									<Image
										src='/avatar.jpg'
										className='h-7 w-7 flex-shrink-0 rounded-full'
										width={50}
										height={50}
										alt='Avatar'
									/>
								),
							}}
						/>
					</div>
				</SidebarBody>
			</Sidebar>
			<Dashboard onClose={() => setOpen(false)} />
		</div>
	);
}
export const Logo = () => {
	return (
		<Link
			href='#'
			className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'>
			<div className='h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0' />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='font-medium text-black dark:text-white whitespace-pre'>
				Acet Labs
			</motion.span>
		</Link>
	);
};
export const LogoIcon = () => {
	return (
		<Link
			href='#'
			className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'>
			<div className='h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0' />
		</Link>
	);
};

// Dummy dashboard component with content
const Dashboard = () => {
	return (
		<div className='flex flex-1'>
			<div className='p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full'>
				<div className='flex gap-2'>
					{[...new Array(4)].map(i => (
						<div
							key={'first' + i}
							className='h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse'></div>
					))}
				</div>
				<div className='flex gap-2 flex-1'>
					{[...new Array(2)].map(i => (
						<div
							key={'second' + i}
							className='h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse'></div>
					))}
				</div>
			</div>
		</div>
	);
};
