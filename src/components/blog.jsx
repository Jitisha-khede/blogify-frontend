'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { NumberTicker } from './ui/number-ticker';
import {
	IconMessage,
	IconThumbUp,
	IconThumbUpFilled,
	IconThumbDown,
	IconThumbDownFilled,
	IconBookmark,
	IconBookmarkFilled,
	IconLink,
} from '@tabler/icons-react';

import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import CommentsSection from './comment-section';
import { fetchBlogById, fetchUserById } from '@/utils/api';
import AuthModal from './ui/auth-modal';
import { voteBlog, removeBlogVote, addToBookmark,removeFromBookmarks, fetchBookmarks } from '@/utils/api';

export default function Blog() {
	const { id } = useParams();
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [author, setAuthor] = useState(null);
	const [isLiked, setIsLiked] = useState(false);
	const [isDisliked, setIsDisliked] = useState(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [showCopyMessage, setShowCopyMessage] = useState(false);
	const [votes, setVotes] = useState({ upvotesCount: 0, downvotesCount: 0 });
	const commentsRef = useRef(null);

	// Check if user is authenticated
	const isAuthenticated = () => {
		return document.cookie.split('; ').some(cookie => cookie.startsWith('token='));
	};

	// Wrapper function for interaction that requires authentication
	const requireAuth = callback => {
		if (isAuthenticated()) {
			return callback();
		} else {
			setIsAuthModalOpen(true);
			return null;
		}
	};

	useEffect(() => {
		const getBlog = async () => {
			const response = await fetchBlogById(id);
			setBlog(response?.data?.blog || null);
			setLoading(false);
		};

		if (blog?.createdBy) {
			console.log('Fetching author details...');
			getAuthorDetails(blog.createdBy);
		}

		getBlog();
	}, [id]);

	useEffect(() => {
		if (blog?.createdBy) {
		  getAuthorDetails(blog.createdBy);
		}
	  }, [blog?.createdBy]);

	useEffect(() => {
		const checkIfBookmarked = async () => {
			try {
				let bookmarks = await fetchBookmarks();
				console.log("Fetched bookmarks:", bookmarks.bookmarks);
				
				bookmarks = bookmarks.bookmarks; 

				if (!Array.isArray(bookmarks)) {
					console.error("Error: bookmarks is not an array", bookmarks);
					return;
				}
	
				const isAlreadyBookmarked = bookmarks.some(
					(bookmark) => bookmark._id === blog?._id
				);
	
				console.log(`Is blog bookmarked? ${isAlreadyBookmarked}`);
				setIsBookmarked(isAlreadyBookmarked);
			} catch (error) {
				console.error("Error fetching bookmarks:", error);
			}
		};
	
		if (blog?._id) {
			checkIfBookmarked();
		}
	
	}, [blog?._id]);

	useEffect(() => {
		const checkIfVoted = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) return; // Exit if not logged in
	
				const response = await fetchBlogById(id); 
				const blogData = response?.data?.blog;
	
				if (!blogData) return;
	
				const userId = localStorage.getItem("userId"); // Fetch user ID from storage
	
				const hasUpvoted = blogData.upvotes.includes(userId);
				const hasDownvoted = blogData.downvotes.includes(userId);
	
				setIsLiked(hasUpvoted);
				setIsDisliked(hasDownvoted);
	
				setVotes({
					upvotesCount: blogData.upvotes.length,
					downvotesCount: blogData.downvotes.length
				});
	
			} catch (error) {
				console.error("Error fetching votes:", error);
			}
		};
	
		if (blog?._id) {
			checkIfVoted();
		}
	}, [blog?._id]);	

	const getAuthorDetails = async authorId => {
		try {
			const response = await fetchUserById(authorId);
			// console.log('Author API Response:', response);
			setAuthor(response.data.user || null);
		} catch (error) {
			console.error('Error fetching author:', error);
		}
	};

	if (loading) {
		return <div>Loading blog...</div>;
	}
	if (!blog) {
		return <div>Blog not found</div>;
	}
	// console.log(blog)
	// console.log(blog.createdBy);
	// console.log(author);
	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(window.location.href)
			.then(() => {
				setShowCopyMessage(true);
				setTimeout(() => {
					setShowCopyMessage(false);
				}, 1000); // Hide after 1 seconds
			})
			.catch(err => console.error('Failed to copy:', err));
	};

	const getTokenFromCookies = () => {
		const cookies = document.cookie.split("; ");
		const tokenCookie = cookies.find(cookie => cookie.startsWith("token="));
		return tokenCookie ? tokenCookie.split("=")[1] : null;
	};

	const handleVote = async (blogId, voteType) => {
		requireAuth(async () => {
			try {
				const token = getTokenFromCookies();
	
				// Remove vote if the user clicks on the same vote type again
				if ((voteType === "upvote" && isLiked) || (voteType === "downvote" && isDisliked)) {
					await removeBlogVote(blogId, token);
					setIsLiked(false);
					setIsDisliked(false);
					setVotes(prevVotes => ({
						upvotesCount: voteType === "upvote" ? prevVotes.upvotesCount - 1 : prevVotes.upvotesCount,
						downvotesCount: voteType === "downvote" ? prevVotes.downvotesCount - 1 : prevVotes.downvotesCount,
					}));
					return;
				}
	
				// Otherwise, proceed with voting
				const updatedVotes = await voteBlog(blogId, voteType, token);
	
				// Update frontend state immediately
				if (voteType === "upvote") {
					setIsLiked(true);
					setIsDisliked(false);
				} else if (voteType === "downvote") {
					setIsLiked(false);
					setIsDisliked(true);
				}
	
				setVotes(updatedVotes.data);
	
			} catch (error) {
				alert("Error voting blog: " + error.message);
			}
		});
	};
	

	const handleBookmarkClick = async (id) => {
		requireAuth(async () => {
			try {
				if (isBookmarked) {
					await removeFromBookmarks(id );
					setIsBookmarked(false);
				} else {
					await addToBookmark(id);
					setIsBookmarked(true);
				}
		
			} catch (error) {
				console.error("Error handling bookmark:", error);
			}
		})
	};

	// const handleBookmarkClick = async () => {
	// 	const response = await fetcBoookmarks();
		
	// 	requireAuth(() => {
	// 		setIsBookmarked(!isBookmarked);
	// 	});
	// };

	const scrollToComments = () => {
		// If user isn't authenticated, show login modal instead of scrolling
		if (!isAuthenticated()) {
			setIsAuthModalOpen(true);
		} else {
			commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const imageUrl =
		'https://images.unsplash.com/photo-1663765970236-f2acfde22237?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

	return (
		<div className='relative min-h-screen w-full px-4 sm:px-6 lg:px-8 py-4 items-center justify-center bg-slate-100 dark:bg-gray-900 font-thin tracking-wide [word-spacing:0.1em]'>
			{/* Copy notification message */}
			{showCopyMessage && (
				<div
					className='fixed top-20 right-4 bg-gray-800 text-white py-2.5 px-5 rounded-lg shadow-lg z-50
                    flex items-center gap-2 border border-gray-700
                    animate-[fadeInOut_3s_ease-in-out]'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 text-green-400'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 13l4 4L19 7'
						/>
					</svg>
					<span className='font-medium'>
						Link copied to clipboard!
					</span>
				</div>
			)}

			{/* Auth modal */}
			<AuthModal
				isOpen={isAuthModalOpen}
				onClose={() => setIsAuthModalOpen(false)}
			/>

			<div
				// key={`content-${index}`}
				className='mb-10 max-w-5xl mx-auto'>
				<div className='text-base sm:text-sm lg:text-lg prose prose-sm dark:prose-invert w-full max-w-[85vw] mb-10 justify-items-center mx-auto '>
					{/* Image Section*/}
					<div className='relative mb-4'>
						<p
							className={twMerge(
								'text-2xl sm:text-3xl lg:text-4xl w-full font-bold flex justify-self-center gap-4 mt-2 mb-10'
							)}>
							{blog.title}
						</p>
						{blog?.coverImageUrl && (
							<>
								<Image
									src={blog.coverImageUrl}
									alt='blog thumbnail'
									height='1000'
									width='1000'
									className='w-full max-w-[80vw] h-[200px] sm:h-[500px] lg:h-[700px] rounded-lg object-cover mx-auto'
								/>

								{/* Below image content */}
								<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2 mb-4'>
									{/* Interaction buttons */}
									<div className='flex flex-wrap items-center gap-2 w-full min-w-80 md:w-auto mt-1'>
										<button
											onClick={() => handleVote(blog._id, "upvote")}
											className={`flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all p-1 sm:px-2 
										      ${isLiked ? 'text-red-400' : ''}`}>
											{isLiked ? (
												<IconThumbUpFilled className='h-5 w-auto' />
											) : (
												<IconThumbUp className='h-5 w-auto' />
											)}
											<span className='ml-1'>
												<NumberTicker
													value={votes.upvotesCount}
													className='whitespace-pre-wrap font-medium tracking-tighter'
												/>
											</span>
										</button>

										<button
											onClick={() => handleVote(blog._id, "downvote")}
											className={`flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all p-1 sm:px-2
										      ${isDisliked ? 'text-blue-400' : ''}`}>
											{isDisliked ? (
												<IconThumbDownFilled className='h-5 w-auto' />
											) : (
												<IconThumbDown className='h-5 w-auto' />
											)}
											<NumberTicker
												value={votes.downvotesCount}
												className='whitespace-pre-wrap font-medium tracking-tighter'
											/>
										</button>

										<button
											onClick={scrollToComments}
											className='flex items-center dark:hover:bg-gray-700 hover:bg-gray-200 rounded-full transition-all p-1 sm:px-2'>
											<IconMessage className='h-5 w-auto' />
											{/* <NumberTicker
												value={blog.stats.comment}
												className='whitespace-pre-wrap font-medium tracking-tighter'
											/> */}
										</button>

										<button
											className={`flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all p-1 sm:px-2
												${isBookmarked ? 'text-red-400' : ''}`}
											onClick={async () => {
												if (blog?._id) {
													await handleBookmarkClick(blog._id);
												} else {
													console.error("Blog ID is undefined");
												}
											}}>
											{isBookmarked ? (
												<IconBookmarkFilled className='h-5 w-auto' />
											) : (
												<IconBookmark className='h-5 w-auto' />
											)}
										</button>


										<button
											onClick={copyToClipboard}
											className='flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all p-1 sm:px-2'>
											<IconLink className='h-6 w-auto text-black dark:text-white' />
										</button>
									</div>
									{/* Tags */}
									<div className='flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end'>
										{blog.tags.map((tag, index) => (
											<h2
												key={index}
												className='bg-red-600 dark:bg-red text-gray-900 dark:text-white rounded-full text-xs sm:text-sm w-fit px-3 py-1 backdrop-blur-3xl bg-opacity-70'>
												{tag}
											</h2>
										))}
									</div>
								</div>
							</>
						)}
					</div>

					{/* Content */}
					{blog.body}

					{/*About Author Section */}
					{author && (
						<div className='max-w-5xl justify-center items-center flex gap-8 mx-auto mt-20'>
							<Image
								src={author.profileImage}
								alt={blog.createdBy}
								width={32}
								height={32}
								className='h-32 w-32 rounded-full'
							/>
							<div className='flex flex-col'>
								<p className='font-medium text-base'>
									{author.fullName}
								</p>
							</div>
						</div>
					)}
				</div>
				<div ref={commentsRef}>
					{isAuthenticated() ? (
						<CommentsSection blogId={blog._id} />
					) : (
						<div className='p-4 text-center'>
							<p>Please log in to view and post comments</p>
							<button
								onClick={() => setIsAuthModalOpen(true)}
								className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
								Log in
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
