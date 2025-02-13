'use client';

import React, { useEffect, useState } from 'react';
import { HoverEffect } from './ui/card-container';
import { fetchBlogs } from '@/utils/api'; // Assuming you've created the API fetch function
import Link from 'next/link';

const Write = () => {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true); // Loading state
	const [error, setError] = useState(null); // Error state

	useEffect(() => {
		const loadBlogs = async () => {
			try {
				const data = await fetchBlogs();
				setBlogs(data); // Set the blogs from the API response
				setLoading(false); // Data is loaded, so stop loading
			} catch (err) {
				setError('Error loading blogs'); // Handle any error
				setLoading(false);
			}
		};
		loadBlogs();
	}, []);

	// If loading, show loading message
	if (loading) {
		return <div>Loading blogs...</div>;
	}

	// If there's an error, show error message
	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div id='Projects' className='w-full mx-auto px-8'>
			{blogs.length > 0 ? (
				<HoverEffect
					items={blogs.map(blog => ({
						title: blog.title,
						description: blog.body?.substring(0, 100), // Use body if available, or fallback to an empty string
						link: `/blogs/${blog._id}`, // Blog link based on the ID
						image: blog.coverImageUrl || '/images/default-blog.png', // Fallback image if not available
					}))}
				/>
			) : (
				<p>No blogs available.</p> // Show a message if no blogs exist
			)}
		</div>
	);
};

export default Write;
