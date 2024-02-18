import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../api/api';

interface Post {
    id: number;
    title: string;
    body: string;
}

const pageSize = 10;

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const { data: fetchedPosts, isFetching } = useQuery<Post[]>(['posts', page], () => fetchPosts(page, pageSize), {
        onSuccess: (data) => {
            setPosts((prevPosts) => [...prevPosts, ...data]);
        },
    });
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isFetching) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (lastPostElementRef.current) observer.current.observe(lastPostElementRef.current);
    }, [isFetching]);

    useEffect(() => {
        if (fetchedPosts) {
            setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        }
    }, [fetchedPosts]);

    return (
        <div>
            <div className='flex flex-col items-center justify-center mt-10 gap-20'>
                {posts.map((post, index) => (
                    <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null} className='flex flex-col justify-center items-center bg-gray-100 rounded-xl py-10'>
                        <h2 className='text-[24px]'>{post.title}</h2>
                        <div className='flex justify-center items-end'>
                            <p className='w-1/2'>{post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}</p>
                            <Link to={`/post/${post.id}`}>
                                <button className='py-1 px-4 bg-gray-200 rounded-xl hover:bg-gray-400 text-[14px]'>Просмотреть</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {isFetching && (
                <div className='flex items-center justify-center mt-10'>
                    <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-gray-600 rounded-full" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostList;
