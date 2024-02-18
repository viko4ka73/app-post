import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchOnePost } from '../api/api';

interface Post {
    id: number;
    title: string;
    body: string;
}

const PostDetails: React.FC = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { data: post, isLoading } = useQuery<Post>(['post', postId], () => postId ? fetchOnePost(parseInt(postId)) : Promise.reject('Post ID is undefined'));

    if (isLoading) return <div className='flex items-center justify-center mt-10'> 
     <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-gray-600 rounded-full" aria-label="loading">
        <span className="sr-only">Loading...</span>
    </div></div>;

    return (
        <div className='flex flex-col items-center justify-center gap-20 mt-10'>
            {post && (
                <div className='flex flex-col justify-center items-center bg-gray-100 rounded-xl py-10 '>
                    <h2 className='text-[24px]'>{post.title}</h2>
                    <div className='flex justify-center items-end'>
                        <p className='w-1/2 mr-2'>{post.body}</p>
                        <button className='py-1 px-4 bg-gray-200 rounded-xl hover:bg-gray-400 text-[14px]' onClick={() => navigate(-1)}>Назад</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
