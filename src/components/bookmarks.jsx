'use client';
import Image from 'next/image';
import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from './ui/use-outside-click';

export default function BookmarksDropdown({ isOpen, onClose }) {
	const ref = useRef(null);
	const id = useId();

	useOutsideClick(ref, onClose);

	useEffect(() => {
		function onKeyDown(event) {
			if (event.key === 'Escape') {
				onClose();
			}
		}

		if (isOpen) {
			window.addEventListener('keydown', onKeyDown);
		}

		return () => window.removeEventListener('keydown', onKeyDown);
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className='absolute right-0 top-16 w-96 max-h-[100vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
					<ul className='py-2'>
						{cards.map(card => (
							<motion.div
								key={`card-${card.title}-${id}`}
								className='p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer'>
								<div className='flex gap-4 items-center'>
									<Image
										width={48}
										height={48}
										// src={card.src}
										alt={card.title}
										className='h-12 w-12 rounded-lg object-cover object-top'
									/>
									<div>
										<h3 className='font-medium text-neutral-800 dark:text-neutral-200'>
											{card.title}
										</h3>
										<p className='text-sm text-neutral-600 dark:text-neutral-400'>
											{card.description}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</ul>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

const cards = [
	{
		description: 'Lana Del Rey',
		title: 'Summertime Sadness',
		// src: 'https://assets.aceternity.com/demos/lana-del-rey.jpeg',
		content: () => (
			<p>
				Lana Del Rey, an iconic American singer-songwriter, is
				celebrated for her melancholic and cinematic music style. Born
				Elizabeth Woolridge Grant in New York City, she has captivated
				audiences worldwide with her haunting voice and introspective
				lyrics. <br /> <br />
				Her songs often explore themes of tragic romance, glamour, and
				melancholia, drawing inspiration from both contemporary and
				vintage pop culture. With a career that has seen numerous
				critically acclaimed albums, Lana Del Rey has established
				herself as a unique and influential figure in the music
				industry, earning a dedicated fan base and numerous accolades.
			</p>
		),
	},
	{
		description: 'Babbu Maan',
		title: 'Mitran Di Chhatri',
		// src: 'https://assets.aceternity.com/demos/babbu-maan.jpeg',
		content: () => (
			<p>
				Babu Maan, a legendary Punjabi singer, is renowned for his
				soulful voice and profound lyrics that resonate deeply with
				his audience. Born in the village of Khant Maanpur in Punjab,
				India, he has become a cultural icon in the Punjabi music
				industry. <br /> <br />
				His songs often reflect the struggles and triumphs of everyday
				life, capturing the essence of Punjabi culture and traditions.
				With a career spanning over two decades, Babu Maan has
				released numerous hit albums and singles that have garnered
				him a massive fan following both in India and abroad.
			</p>
		),
	},
	{
		description: 'Metallica',
		title: 'For Whom The Bell Tolls',
		// src: 'https://assets.aceternity.com/demos/metallica.jpeg',
		content: () => (
			<p>
				Metallica, an iconic American heavy metal band, is renowned
				for their powerful sound and intense performances that
				resonate deeply with their audience. Formed in Los Angeles,
				California, they have become a cultural icon in the heavy
				metal music industry. <br /> <br />
				Their songs often reflect themes of aggression, social issues,
				and personal struggles, capturing the essence of the heavy
				metal genre. With a career spanning over four decades,
				Metallica has released numerous hit albums and singles that
				have garnered them a massive fan following both in the United
				States and abroad.
			</p>
		),
	},
	{
		description: 'Led Zeppelin',
		title: 'Stairway To Heaven',
		// src: 'https://assets.aceternity.com/demos/led-zeppelin.jpeg',
		content: () => (
			<p>
				Led Zeppelin, a legendary British rock band, is renowned for
				their innovative sound and profound impact on the music
				industry. Formed in London in 1968, they have become a
				cultural icon in the rock music world. <br /> <br />
				Their songs often reflect a blend of blues, hard rock, and
				folk music, capturing the essence of the 1970s rock era. With
				a career spanning over a decade, Led Zeppelin has released
				numerous hit albums and singles that have garnered them a
				massive fan following both in the United Kingdom and abroad.
			</p>
		),
	},
	{
		description: 'Mustafa Zahid',
		title: 'Toh Phir Aao',
		// src: 'https://assets.aceternity.com/demos/toh-phir-aao.jpeg',
		content: () => (
			<p>
				"Aawarapan", a Bollywood movie starring Emraan Hashmi, is
				renowned for its intense storyline and powerful performances.
				Directed by Mohit Suri, the film has become a significant work
				in the Indian film industry. <br /> <br />
				The movie explores themes of love, redemption, and sacrifice,
				capturing the essence of human emotions and relationships.
				With a gripping narrative and memorable music, "Aawarapan" has
				garnered a massive fan following both in India and abroad,
				solidifying Emraan Hashmi's status as a versatile actor.
			</p>
		),
	},
];
